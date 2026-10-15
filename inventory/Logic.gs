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
 * Name -> key lookup. Each entry answers to its names plus every alias
 * (separated by | , ， ; or ；). An alias written /like this/ is a regular
 * expression tested against the normalised name, for spellings that vary
 * (barcodes stuck on, typos). A name claimed by two different keys is
 * ambiguous and never matches - better a pending row than stock booked to the
 * wrong item.
 */
function buildNameIndex(entries) {
  var index = { exact: {}, regex: [] };
  entries.forEach(function (e) {
    var names = e.names.concat(String(e.aliases || '').split(/[|,，;；]/));
    names.forEach(function (n) {
      var raw = String(n || '').trim();
      var re = /^\/(.+)\/$/.exec(raw);
      if (re) { index.regex.push({ re: new RegExp(re[1], 'i'), key: e.key }); return; }
      var k = normName(raw);
      if (!k) return;
      if (index.exact[k] && index.exact[k] !== e.key) index.exact[k] = '?';
      else index.exact[k] = e.key;
    });
  });
  return index;
}

/** Returns {key} or {reason}. Exact names win over patterns. */
function matchName(index, raw, sheetName) {
  var k = normName(raw);
  if (!k) return { reason: '名称为空' };
  var key = index.exact[k];
  if (!key) {
    var hits = {};
    index.regex.forEach(function (r) { if (r.re.test(k)) hits[r.key] = true; });
    var keys = Object.keys(hits);
    key = keys.length > 1 ? '?' : keys[0];
  }
  if (key === '?') return { reason: '名称对应多个项目，请改别名: ' + raw };
  if (!key) return { reason: '对不上，请在 ' + sheetName + ' 的别名栏加上: ' + raw };
  return { key: key };
}

function buildProductIndex(products) {
  return buildNameIndex(products.map(function (p) {
    return { key: p.sku, names: [p.sku, p.name, p.nameZh], aliases: p.aliases };
  }));
}

/** Returns {sku} or {reason}. */
function matchProduct(index, raw) {
  var m = matchName(index, raw, 'Products');
  return m.reason ? { reason: m.reason.replace('名称', '产品名') } : { sku: m.key };
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
function extractFields(sub, fields) {
  var rec = { id: String(sub.id), createdAt: String(sub.created_at || '') };
  var answers = sub.answers || {};
  Object.keys(fields).forEach(function (field) {
    rec[field] = '';
    Object.keys(answers).forEach(function (qid) {
      var a = answers[qid];
      if (String(a.text || '').indexOf(fields[field]) === -1) return;
      var v = a.answer;
      if (field === 'date') { rec.date = v; return; }
      if (v && typeof v === 'object') v = a.prettyFormat || Object.keys(v).map(function (k) { return v[k]; }).join(' ');
      rec[field] = String(v === undefined || v === null ? '' : v).trim();
    });
  });
  return rec;
}

var PACKING_FIELDS = {
  product: '产品名称', spec: '克数选择', batch: '批次号', packs: '成品入库数量',
  date: '入库日期', location: '存储位置', operator: '操作员', kg: '原材料数量'
};

function extractPacking(sub) { return extractFields(sub, PACKING_FIELDS); }

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

// ---------- Raw materials: kg balance only ----------

var INTAKE_FIELDS = {
  date: '收货日期', batch: '批次号', material: '原材料名称', kg: '原材料数量',
  operator: '接收员工姓名', remark: '备注', party: '供应商名称', location: '存储位置'
};
var ISSUE_FIELDS = {
  date: '领用日期', batch: '批次号', material: '原材料名称', kg: '领用数量',
  operator: '领用员工姓名', remark: '备注', party: '领用用途'
};

/** Positive kg, rounded to grams; NaN when it isn't one. */
function parseKg(v) {
  var n = Number(String(v === undefined || v === null ? '' : v).replace(/kg$/i, '').trim());
  if (String(v).trim() === '' || !isFinite(n) || n <= 0) return NaN;
  return Math.round(n * 1000) / 1000;
}

function buildMaterialIndex(materials) {
  return buildNameIndex(materials.map(function (m) {
    return { key: m.code, names: [m.code, m.name], aliases: m.aliases };
  }));
}

/**
 * One intake (rec.kind 'IN') or issue ('OUT') submission -> a RawMoves row
 * {date, type, code, kg (signed), ref, party, note}, or {reason}.
 * An issue above maxOutKg is held: past ones were typos (500 for 50).
 */
function rawToMove(rec, index, maxOutKg) {
  var m = matchName(index, rec.material, 'RawMaterials');
  if (m.reason) return { reason: m.reason };
  var kg = parseKg(rec.kg);
  if (isNaN(kg)) return { reason: 'kg 必须是正数: ' + rec.kg };
  if (rec.kind === 'OUT' && maxOutKg && kg > maxOutKg) {
    return { reason: '单笔领用 ' + kg + ' kg 超过 ' + maxOutKg + ' kg，请核对' };
  }
  var date = parseJotformDate(rec.date) || String(rec.createdAt).slice(0, 10);
  return {
    move: {
      date: date, type: rec.kind, code: m.key, kg: rec.kind === 'OUT' ? -kg : kg,
      ref: 'JF:' + rec.id, party: rec.party || '',
      note: [rec.material, rec.batch ? '批号 ' + rec.batch : '', rec.remark].filter(String).join(' · ')
    }
  };
}

/** {code: kg} from signed moves, rounded to grams. */
function rawBalances(moves) {
  var out = {};
  moves.forEach(function (mv) {
    out[mv.code] = Math.round(((out[mv.code] || 0) + Number(mv.kg || 0)) * 1000) / 1000;
  });
  return out;
}

/** kg to log so the balance becomes what was counted. Blank never means 0. */
function rawCountDelta(balance, counted) {
  var s = String(counted === undefined || counted === null ? '' : counted).trim();
  var n = Number(s);
  if (s === '' || !isFinite(n) || n < 0) throw new Error('盘点 kg 必须是 0 或正数 Counted kg must be 0 or more');
  return Math.round((n - balance) * 1000) / 1000;
}

// Node test hook; ignored by Apps Script where `module` is undefined.
if (typeof module !== 'undefined') {
  module.exports = {
    parseQty: parseQty, toBaseQty: toBaseQty, formatCartons: formatCartons,
    isExpired: isExpired, addDays: addDays, allocateFEFO: allocateFEFO,
    summarizeStock: summarizeStock, stocktakeDelta: stocktakeDelta,
    normName: normName, buildNameIndex: buildNameIndex, matchName: matchName,
    buildProductIndex: buildProductIndex, matchProduct: matchProduct, extractFields: extractFields,
    parseJotformDate: parseJotformDate, addYears: addYears, extractPacking: extractPacking,
    packingToStockIn: packingToStockIn, INTAKE_FIELDS: INTAKE_FIELDS, ISSUE_FIELDS: ISSUE_FIELDS,
    parseKg: parseKg, buildMaterialIndex: buildMaterialIndex, rawToMove: rawToMove,
    rawBalances: rawBalances, rawCountDelta: rawCountDelta
  };
}
