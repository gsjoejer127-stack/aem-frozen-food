/**
 * Pure inventory logic - no SpreadsheetApp calls, so it can be unit tested in
 * Node (see test/logic.test.js). All quantities are integers in the product's
 * base unit (pkt / pck / unit ...). Dates are 'yyyy-MM-dd' strings, which sort
 * correctly as plain strings.
 */

/** Parse a user-entered quantity. Must be a positive whole number. */
function parseQty(value) {
  var n = Number(value);
  if (!isFinite(n) || n <= 0 || Math.floor(n) !== n) {
    throw new Error('数量必须是正整数 Quantity must be a positive whole number');
  }
  return n;
}

/** Convert a quantity entered in cartons or base units into base units. */
function toBaseQty(qty, unit, unitsPerCarton) {
  var n = parseQty(qty);
  if (unit !== 'ctn') return n;
  var per = Number(unitsPerCarton);
  if (!per || per <= 0) {
    throw new Error('该产品没有设置每箱数量 This product has no units-per-carton set');
  }
  return n * per;
}

/** 45 with 20 per carton -> "2箱 + 5"; no carton size -> "45". */
function formatCartons(qty, unitsPerCarton) {
  var per = Number(unitsPerCarton);
  if (!per || per <= 0 || qty < per) return String(qty);
  var ctn = Math.floor(qty / per);
  var rest = qty % per;
  return ctn + '箱' + (rest ? ' + ' + rest : '');
}

/** True if a date string is set and is strictly before today. */
function isExpired(expiry, today) {
  return !!expiry && expiry < today;
}

/** Add whole days to a 'yyyy-MM-dd' string (UTC, so no DST surprises). */
function addDays(dateStr, days) {
  var d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * First-expiry-first-out allocation for a stock-out.
 * Expired batches are never allocated - expired frozen food must not ship.
 * Batches without an expiry date go last; ties break on oldest received.
 * Returns [{batchId, qty}]. Throws if usable stock is insufficient.
 */
function allocateFEFO(batches, qty, today) {
  var need = parseQty(qty);
  var usable = batches
    .filter(function (b) { return b.remaining > 0 && !isExpired(b.expiry, today); })
    .slice()
    .sort(function (a, b) {
      var ea = a.expiry || '9999-12-31';
      var eb = b.expiry || '9999-12-31';
      if (ea !== eb) return ea < eb ? -1 : 1;
      var ra = a.receivedAt || '';
      var rb = b.receivedAt || '';
      return ra < rb ? -1 : ra > rb ? 1 : 0;
    });

  var available = usable.reduce(function (s, b) { return s + b.remaining; }, 0);
  if (available < need) {
    throw new Error('可用库存不足 Not enough usable stock: 需要 ' + need + '，可用 ' + available +
      '（已排除过期批次 expired batches excluded）');
  }

  var result = [];
  for (var i = 0; i < usable.length && need > 0; i++) {
    var take = Math.min(usable[i].remaining, need);
    result.push({ batchId: usable[i].batchId, qty: take });
    need -= take;
  }
  return result;
}

/**
 * Per-product stock summary used by the dashboard.
 * - usable:    non-expired stock (what can actually be sold)
 * - expiring:  usable stock that expires within warnDays
 * - expired:   stock past its expiry, still sitting in the freezer
 * - low:       usable stock at or below the product's reorder level
 */
function summarizeStock(products, batches, today, warnDays) {
  var warnUntil = addDays(today, warnDays);
  var bySku = {};
  products.forEach(function (p) {
    bySku[p.sku] = {
      sku: p.sku, name: p.name, nameZh: p.nameZh, category: p.category,
      barcode: p.barcode, unit: p.unit, packSize: p.packSize,
      unitsPerCarton: p.unitsPerCarton, reorderLevel: p.reorderLevel,
      usable: 0, expiring: 0, expired: 0, nearestExpiry: '', batchCount: 0, low: false
    };
  });

  batches.forEach(function (b) {
    var s = bySku[b.sku];
    if (!s || b.remaining <= 0) return;
    s.batchCount++;
    if (isExpired(b.expiry, today)) {
      s.expired += b.remaining;
      return;
    }
    s.usable += b.remaining;
    if (b.expiry && b.expiry <= warnUntil) s.expiring += b.remaining;
    if (b.expiry && (!s.nearestExpiry || b.expiry < s.nearestExpiry)) s.nearestExpiry = b.expiry;
  });

  return Object.keys(bySku).map(function (k) {
    var s = bySku[k];
    s.low = s.reorderLevel > 0 && s.usable <= s.reorderLevel;
    s.usableText = formatCartons(s.usable, s.unitsPerCarton);
    return s;
  });
}

/** Difference to log when a stocktake finds a different count than the system. */
function stocktakeDelta(systemQty, countedQty) {
  // Number('') is 0 - a blank field must never silently zero out a batch.
  var blank = countedQty === null || countedQty === undefined || String(countedQty).trim() === '';
  var counted = Number(countedQty);
  if (blank || !isFinite(counted) || counted < 0 || Math.floor(counted) !== counted) {
    throw new Error('盘点数量必须是 0 或正整数 Counted quantity must be 0 or a positive whole number');
  }
  return counted - systemQty;
}

// ---------- Jotform Production Packing Log -> stock-in ----------

/** Lowercase, drop brackets/punctuation, collapse spaces: "Sate  Ayam (Mala)" -> "sate ayam mala". */
function normName(s) {
  return String(s || '').toLowerCase()
    .replace(/[()（）\[\]【】,，.。、\/\\_\-–—:：;；'"]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/**
 * Name -> SKU lookup built from the Products sheet. Each product answers to its
 * SKU, Name, 中文名 and every alias (separated by | , ， or ;). A name claimed by
 * two different SKUs is ambiguous and never matches - better a pending row than
 * stock booked to the wrong product.
 */
function buildProductIndex(products) {
  var index = {};
  products.forEach(function (p) {
    var names = [p.sku, p.name, p.nameZh].concat(String(p.aliases || '').split(/[|,，;；]/));
    names.forEach(function (n) {
      var k = normName(n);
      if (!k) return;
      if (index[k] && index[k] !== p.sku) index[k] = '?';
      else index[k] = p.sku;
    });
  });
  return index;
}

/** Returns {sku} or {reason}. */
function matchProduct(index, raw) {
  var k = normName(raw);
  if (!k) return { reason: '产品名为空' };
  var sku = index[k];
  if (sku === '?') return { reason: '产品名对应多个 SKU，请改别名: ' + raw };
  if (!sku) return { reason: '产品对不上，请在 Products 的别名栏加上: ' + raw };
  return { sku: sku };
}

function pad2_(n) { return (n < 10 ? '0' : '') + n; }

/** 'yyyy-MM-dd' if y/m/d is a real calendar date, else ''. */
function ymd_(y, m, d) {
  y = Number(y); m = Number(m); d = Number(d);
  if (y < 100) y += 2000;
  var dt = new Date(Date.UTC(y, m - 1, d));
  if (!y || dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return '';
  return y + '-' + pad2_(m) + '-' + pad2_(d);
}

/**
 * Jotform date answer -> 'yyyy-MM-dd' ('' if unreadable).
 * Date fields arrive as {year, month, day}; text fields as typed by staff,
 * which in Malaysia is day/month/year ("6/10/26").
 */
function parseJotformDate(v) {
  if (v && typeof v === 'object') {
    if (v.year && v.month && v.day) return ymd_(v.year, v.month, v.day);
    if (v.datetime) return parseJotformDate(String(v.datetime));
    return '';
  }
  var s = String(v || '').trim();
  var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return ymd_(m[1], m[2], m[3]);
  m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2}|\d{4})$/);
  if (m) return ymd_(m[3], m[2], m[1]);
  return '';
}

/** Same day n years later; 29 Feb falls back to 28 Feb. */
function addYears(dateStr, n) {
  var y = Number(dateStr.slice(0, 4)) + n, m = Number(dateStr.slice(5, 7)), d = Number(dateStr.slice(8, 10));
  return ymd_(y, m, d) || ymd_(y, m, d - 1);
}

function daysBetween_(a, b) {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

/**
 * Pull the fields we need out of a Jotform API submission. Questions are found
 * by label, so reordering or renumbering the form doesn't break the sync.
 */
var PACKING_FIELDS = {
  product: '产品名称', spec: '克数选择', batch: '批次号', packs: '成品入库数量',
  date: '入库日期', location: '存储位置', operator: '操作员', kg: '原材料数量'
};

function extractPacking(sub) {
  var rec = { id: String(sub.id), createdAt: String(sub.created_at || '') };
  var answers = sub.answers || {};
  Object.keys(PACKING_FIELDS).forEach(function (field) {
    rec[field] = '';
    Object.keys(answers).forEach(function (qid) {
      var a = answers[qid];
      if (String(a.text || '').indexOf(PACKING_FIELDS[field]) === -1) return;
      var v = a.answer;
      if (field === 'date') { rec.date = v; return; }
      if (v && typeof v === 'object') v = a.prettyFormat || Object.keys(v).map(function (k) { return v[k]; }).join(' ');
      rec[field] = String(v === undefined || v === null ? '' : v).trim();
    });
  });
  return rec;
}

/**
 * One packing record -> stock-in form, or {reason} when it needs a human.
 * Expiry = production date + 1 year. A production date more than maxGapDays
 * away from the submission date is held back: it is usually day/month typed
 * the wrong way round, which would put a wrong expiry on the batch.
 */
function packingToStockIn(rec, index, maxGapDays) {
  var match = matchProduct(index, rec.product);
  if (match.reason) return { reason: match.reason };

  var packs = Number(rec.packs);
  if (!isFinite(packs) || packs <= 0 || Math.floor(packs) !== packs) {
    return { reason: '包数必须是正整数: ' + rec.packs };
  }

  var prod = parseJotformDate(rec.date);
  if (!prod) return { reason: '日期看不懂: ' + JSON.stringify(rec.date) };
  var submitted = String(rec.createdAt).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(submitted)) {
    var gap = daysBetween_(prod, submitted);
    if (gap < -1 || gap > maxGapDays) {
      return { reason: '日期 ' + prod + ' 和提交日 ' + submitted + ' 相差 ' + gap + ' 天，请核对' };
    }
  }

  var note = ['Jotform 生产', prod, rec.spec, rec.product].filter(String).join(' · ');
  return {
    form: {
      sku: match.sku, qty: packs, unit: 'base', expiry: addYears(prod, 1),
      lotNo: rec.batch, location: rec.location, supplier: '',
      ref: 'JF:' + rec.id, note: note
    }
  };
}

// Node test hook; ignored by Apps Script where `module` is undefined.
if (typeof module !== 'undefined') {
  module.exports = {
    parseQty: parseQty, toBaseQty: toBaseQty, formatCartons: formatCartons,
    isExpired: isExpired, addDays: addDays, allocateFEFO: allocateFEFO,
    summarizeStock: summarizeStock, stocktakeDelta: stocktakeDelta,
    normName: normName, buildProductIndex: buildProductIndex, matchProduct: matchProduct,
    parseJotformDate: parseJotformDate, addYears: addYears, extractPacking: extractPacking,
    packingToStockIn: packingToStockIn
  };
}
