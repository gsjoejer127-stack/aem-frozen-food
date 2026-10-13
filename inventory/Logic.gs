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

// Node test hook; ignored by Apps Script where `module` is undefined.
if (typeof module !== 'undefined') {
  module.exports = {
    parseQty: parseQty, toBaseQty: toBaseQty, formatCartons: formatCartons,
    isExpired: isExpired, addDays: addDays, allocateFEFO: allocateFEFO,
    summarizeStock: summarizeStock, stocktakeDelta: stocktakeDelta
  };
}
