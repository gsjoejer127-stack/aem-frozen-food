/**
 * AEM Frozen Food - Inventory (库存管理)
 *
 * Bound to a Google Sheet. The Sheet is the database:
 *   Products   - one row per SKU (edit freely: reorder level, carton size...)
 *   Batches    - one row per received batch, with expiry and remaining qty
 *   Movements  - append-only log of every IN / OUT / ADJUST
 *   Settings   - key/value settings
 *   RawMaterials / RawMoves - raw materials as a kg balance (no batches);
 *                the balance is the sum of RawMoves, cached in RawMaterials
 *
 * Access control = Sheet sharing. The web app runs as the user opening it,
 * so only people the Sheet is shared with (as Editor) can use it.
 */

var SHEET = { PRODUCTS: 'Products', BATCHES: 'Batches', MOVES: 'Movements', SETTINGS: 'Settings',
  RAW: 'RawMaterials', RAW_MOVES: 'RawMoves' };

var HEADERS = {
  Products: ['SKU', 'Name', '中文名', 'Category 类别', 'Barcode 条码', 'Unit 单位', 'Pack size 规格',
    'Units per carton 每箱数量', 'Reorder level 安全库存', 'Active 启用', 'Aliases 别名'],
  Batches: ['Batch ID', 'SKU', 'Lot no 批号', 'Expiry 有效期', 'Qty in 入库数量', 'Remaining 剩余',
    'Location 位置', 'Received 入库时间', 'Supplier 供应商'],
  Movements: ['Time 时间', 'Type 类型', 'SKU', 'Batch ID', 'Qty 数量', 'Ref 单据/客户', 'User 操作人', 'Note 备注'],
  Settings: ['Key', 'Value', 'Description 说明'],
  RawMaterials: ['Code 编码', 'Name 名称', 'Aliases 别名', 'Reorder kg 安全库存', 'Active 启用', 'Balance kg 结余'],
  RawMoves: ['Date 日期', 'Type 类型', 'Code 编码', 'Kg', 'Ref 单据', 'Party 供应商/用途', 'User 操作人', 'Note 备注',
    'Booked 记账时间']
};

var DEFAULT_SETTINGS = [
  ['expiryWarnDays', 30, '提前多少天提醒即将过期 Days before expiry to warn'],
  ['locations', 'Freezer A, Freezer B, Chiller', '仓位列表，逗号分隔 Comma-separated storage locations'],
  ['jotformSyncFrom', '', 'Jotform 生产入库从哪天开始同步 (yyyy-MM-dd)，填期初盘点之后那天；空着就不同步'],
  ['rawSyncFrom', '', 'Jotform 原材料入库/领用从哪天开始同步 (yyyy-MM-dd)，填原料期初盘点之后那天；空着就不同步'],
  ['rawMaxIssueKg', 500, '单笔领用超过多少 kg 先放待处理核对 Hold issues above this many kg']
];

// ---------- Web app ----------

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('AEM 库存 Inventory')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('库存 Inventory')
    .addItem('初始化 / 修复表格 Setup', 'setup')
    .addSeparator()
    .addItem('立即同步 Jotform Sync now', 'syncJotform')
    .addItem('开启每日自动同步 Install daily sync', 'installJotformTrigger')
    .addToUi();
}

// ---------- Setup ----------

/** Creates missing sheets and headers; seeds products only if Products is empty. Safe to re-run. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(HEADERS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]).setFontWeight('bold');
      sh.setFrozenRows(1);
    } else if (sh.getLastColumn() < HEADERS[name].length) {
      // Sheet made by an older version: add the new header cells, keep the data.
      var from = sh.getLastColumn() + 1;
      sh.getRange(1, from, 1, HEADERS[name].length - from + 1)
        .setValues([HEADERS[name].slice(from - 1)]).setFontWeight('bold');
    }
  });

  // Keep IDs, barcodes and dates as plain text so Sheets doesn't reformat them.
  ss.getSheetByName(SHEET.PRODUCTS).getRange('A:A').setNumberFormat('@');
  ss.getSheetByName(SHEET.PRODUCTS).getRange('E:E').setNumberFormat('@');
  ss.getSheetByName(SHEET.BATCHES).getRange('A:D').setNumberFormat('@');
  ss.getSheetByName(SHEET.MOVES).getRange('C:D').setNumberFormat('@');
  ss.getSheetByName(SHEET.RAW_MOVES).getRange('A:A').setNumberFormat('@');
  ss.getSheetByName(SHEET.RAW_MOVES).getRange('E:E').setNumberFormat('@');

  var products = ss.getSheetByName(SHEET.PRODUCTS);
  if (products.getLastRow() === 1 && typeof SEED_PRODUCTS !== 'undefined') {
    var rows = SEED_PRODUCTS.map(function (r) { return r.concat([true, '']); });
    products.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
  seedAliases_(products);
  pendingSheet_();

  var raw = ss.getSheetByName(SHEET.RAW);
  if (raw.getLastRow() === 1 && typeof SEED_RAW_MATERIALS !== 'undefined') {
    var rawRows = SEED_RAW_MATERIALS.map(function (r) { return r.concat([true, 0]); });
    raw.getRange(2, 1, rawRows.length, rawRows[0].length).setValues(rawRows);
  }
  rawPendingSheet_();

  var settings = ss.getSheetByName(SHEET.SETTINGS);
  var existing = readSettings_();
  var missing = DEFAULT_SETTINGS.filter(function (d) { return !(d[0] in existing); });
  if (missing.length) {
    settings.getRange(settings.getLastRow() + 1, 1, missing.length, 3).setValues(missing);
  }

  var sheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('工作表1');
  if (sheet1 && sheet1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);
}

/** Fill empty Aliases cells from SEED_ALIASES. Never overwrites what's in the sheet. */
function seedAliases_(products) {
  if (typeof SEED_ALIASES === 'undefined' || products.getLastRow() < 2) return;
  var col = HEADERS.Products.indexOf('Aliases 别名') + 1;
  var n = products.getLastRow() - 1;
  var skus = products.getRange(2, 1, n, 1).getValues();
  var cells = products.getRange(2, col, n, 1);
  var vals = cells.getValues();
  var changed = false;
  skus.forEach(function (r, i) {
    var a = SEED_ALIASES[String(r[0]).trim()];
    if (a && !String(vals[i][0]).trim()) { vals[i][0] = a; changed = true; }
  });
  if (changed) cells.setValues(vals);
}

// ---------- API (called from Index.html via google.script.run) ----------

function apiBootstrap() {
  var settings = readSettings_();
  var today = today_();
  var products = readProducts_();
  var batches = readBatches_();
  var summary = summarizeStock(products, batches, today, Number(settings.expiryWarnDays) || 30);
  return {
    user: Session.getActiveUser().getEmail(),
    today: today,
    warnDays: Number(settings.expiryWarnDays) || 30,
    locations: String(settings.locations || '').split(',').map(function (s) { return s.trim(); }).filter(String),
    summary: summary
  };
}

function apiBatches(sku) {
  return readBatches_()
    .filter(function (b) { return b.sku === sku && b.remaining > 0; })
    .sort(function (a, b) { return (a.expiry || '9999') < (b.expiry || '9999') ? -1 : 1; })
    .map(function (b) { return stripRow_(b); });
}

/** Batches expiring soon or already expired, across all products. */
function apiExpiryList() {
  var settings = readSettings_();
  var today = today_();
  var warnUntil = addDays(today, Number(settings.expiryWarnDays) || 30);
  var names = {};
  readProducts_().forEach(function (p) { names[p.sku] = p; });
  return readBatches_()
    .filter(function (b) { return b.remaining > 0 && b.expiry && b.expiry <= warnUntil; })
    .sort(function (a, b) { return a.expiry < b.expiry ? -1 : 1; })
    .map(function (b) {
      var p = names[b.sku] || {};
      var r = stripRow_(b);
      r.nameZh = p.nameZh || ''; r.name = p.name || '';
      r.remainingText = formatCartons(b.remaining, p.unitsPerCarton);
      r.expired = isExpired(b.expiry, today);
      return r;
    });
}

function apiMovements(sku, limit) {
  var sh = sheet_(SHEET.MOVES);
  var last = sh.getLastRow();
  if (last < 2) return [];
  // Only the tail is needed; avoids reading years of history on every call.
  var scan = Math.min(last - 1, sku ? 3000 : (limit || 100));
  var rows = sh.getRange(last - scan + 1, 1, scan, HEADERS.Movements.length).getDisplayValues();
  var out = [];
  for (var i = rows.length - 1; i >= 0 && out.length < (limit || 100); i--) {
    var r = rows[i];
    if (sku && r[2] !== sku) continue;
    out.push({ time: r[0], type: r[1], sku: r[2], batchId: r[3], qty: r[4], ref: r[5], user: r[6], note: r[7] });
  }
  return out;
}

/** form: {sku, qty, unit, expiry, lotNo, location, supplier, ref, note} */
function apiStockIn(form) {
  return withLock_(function () { return stockIn_(form, user_()); });
}

/** Caller must hold the lock. `who` goes into the Movements log. */
function stockIn_(form, who) {
  var p = product_(form.sku);
  var qty = toBaseQty(form.qty, form.unit, p.unitsPerCarton);
  var expiry = String(form.expiry || '').trim();
  if (expiry && !/^\d{4}-\d{2}-\d{2}$/.test(expiry)) throw new Error('有效期格式错误 Expiry must be yyyy-MM-dd');
  if (expiry && isExpired(expiry, today_())) throw new Error('有效期已过，不能入库 Expiry date is in the past');

  var batchId = newBatchId_();
  var now = now_();
  sheet_(SHEET.BATCHES).appendRow([batchId, p.sku, form.lotNo || '', expiry, qty, qty,
    form.location || '', now, form.supplier || '']);
  logMoves_([[now, 'IN', p.sku, batchId, qty, form.ref || '', who, form.note || '']]);
  return { batchId: batchId, qty: qty, text: formatCartons(qty, p.unitsPerCarton) };
}

// A sync can create many batches within one second; never hand out the same ID twice.
var issuedBatchIds_ = {};
function newBatchId_() {
  var id;
  do {
    id = 'B' + Utilities.formatDate(new Date(), tz_(), 'yyMMddHHmmss') + Math.floor(Math.random() * 900 + 100);
  } while (issuedBatchIds_[id]);
  issuedBatchIds_[id] = true;
  return id;
}

/** form: {sku, qty, unit, ref, note}. Allocates first-expiry-first-out. */
function apiStockOut(form) {
  return withLock_(function () {
    var p = product_(form.sku);
    var qty = toBaseQty(form.qty, form.unit, p.unitsPerCarton);
    var batches = readBatches_().filter(function (b) { return b.sku === p.sku; });
    var alloc = allocateFEFO(batches, qty, today_());

    var byId = {};
    batches.forEach(function (b) { byId[b.batchId] = b; });
    var sh = sheet_(SHEET.BATCHES);
    var now = now_();
    var moves = alloc.map(function (a) {
      var b = byId[a.batchId];
      sh.getRange(b.row, 6).setValue(b.remaining - a.qty);
      return [now, 'OUT', p.sku, a.batchId, -a.qty, form.ref || '', user_(), form.note || ''];
    });
    logMoves_(moves);
    return {
      qty: qty,
      text: formatCartons(qty, p.unitsPerCarton),
      allocations: alloc.map(function (a) {
        var b = byId[a.batchId];
        return { batchId: a.batchId, qty: a.qty, expiry: b.expiry, lotNo: b.lotNo, location: b.location };
      })
    };
  });
}

/** Stocktake / write-off for one batch. form: {batchId, counted, reason, note} */
function apiAdjust(form) {
  return withLock_(function () {
    var b = readBatches_().filter(function (x) { return x.batchId === form.batchId; })[0];
    if (!b) throw new Error('找不到批次 Batch not found: ' + form.batchId);
    var delta = stocktakeDelta(b.remaining, form.counted);
    if (delta === 0) return { delta: 0 };
    sheet_(SHEET.BATCHES).getRange(b.row, 6).setValue(b.remaining + delta);
    var note = [form.reason, form.note].filter(String).join(' - ');
    logMoves_([[now_(), 'ADJUST', b.sku, b.batchId, delta, '', user_(), note]]);
    return { delta: delta };
  });
}

// ---------- Raw materials (kg balance) ----------

function apiRawSummary() {
  var bal = rawBalances(readRawMoves_());
  var last = {};
  readRawMoves_().forEach(function (m) { if (!last[m.code] || m.date > last[m.code]) last[m.code] = m.date; });
  return readRawMaterials_().map(function (m) {
    var b = bal[m.code] || 0;
    return { code: m.code, name: m.name, balance: b, reorderKg: m.reorderKg, lastMove: last[m.code] || '',
      low: m.reorderKg > 0 && b <= m.reorderKg, negative: b < 0 };
  });
}

/** Stocktake for one raw material. form: {code, counted, note} */
function apiRawCount(form) {
  return withLock_(function () {
    var m = readRawMaterials_().filter(function (x) { return x.code === form.code; })[0];
    if (!m) throw new Error('找不到原料 Raw material not found: ' + form.code);
    var delta = rawCountDelta(rawBalances(readRawMoves_())[m.code] || 0, form.counted);
    if (delta !== 0) {
      appendRawMoves_([{ date: today_(), type: 'ADJUST', code: m.code, kg: delta, ref: '', party: '',
        note: ['盘点', form.note].filter(String).join(' - ') }], user_());
    }
    refreshRawBalances_();
    return { delta: delta };
  });
}

function readRawMaterials_() {
  return dataRows_(SHEET.RAW)
    .filter(function (r) { return r[0] && r[4] !== false && String(r[4]).toUpperCase() !== 'FALSE'; })
    .map(function (r) {
      return { code: String(r[0]).trim(), name: String(r[1]), aliases: String(r[2] || ''), reorderKg: Number(r[3]) || 0 };
    });
}

function readRawMoves_() {
  return dataRows_(SHEET.RAW_MOVES).map(function (r) {
    return { date: dateStr_(r[0]), type: String(r[1]), code: String(r[2]).trim(), kg: Number(r[3]) || 0, ref: String(r[4]) };
  }).filter(function (m) { return m.code; });
}

/** moves: [{date, type, code, kg, ref, party, note}]. Caller holds the lock. */
function appendRawMoves_(moves, who) {
  if (!moves.length) return;
  var sh = sheet_(SHEET.RAW_MOVES), now = now_();
  var rows = moves.map(function (m) { return [m.date, m.type, m.code, m.kg, m.ref, m.party, who, m.note, now]; });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

/** Write each material's balance into RawMaterials so the sheet itself shows it. */
function refreshRawBalances_() {
  var sh = sheet_(SHEET.RAW);
  if (sh.getLastRow() < 2) return;
  var bal = rawBalances(readRawMoves_());
  var codes = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  sh.getRange(2, 6, codes.length, 1).setValues(codes.map(function (r) { return [bal[String(r[0]).trim()] || 0]; }));
}

// ---------- Sheet access ----------

function readProducts_() {
  var rows = dataRows_(SHEET.PRODUCTS);
  return rows
    .filter(function (r) { return r[0] && r[9] !== false && String(r[9]).toUpperCase() !== 'FALSE'; })
    .map(function (r) {
      return {
        sku: String(r[0]).trim(), name: String(r[1]), nameZh: String(r[2]), category: String(r[3]),
        barcode: String(r[4]), unit: String(r[5] || 'unit'), packSize: String(r[6]),
        unitsPerCarton: Number(r[7]) || 0, reorderLevel: Number(r[8]) || 0,
        aliases: String(r[10] || '')
      };
    });
}

function readBatches_() {
  return dataRows_(SHEET.BATCHES).map(function (r, i) {
    return {
      row: i + 2, batchId: String(r[0]), sku: String(r[1]).trim(), lotNo: String(r[2]),
      expiry: dateStr_(r[3]), qtyIn: Number(r[4]) || 0, remaining: Number(r[5]) || 0,
      location: String(r[6]), receivedAt: r[7] instanceof Date ? Utilities.formatDate(r[7], tz_(), 'yyyy-MM-dd HH:mm') : String(r[7]),
      supplier: String(r[8])
    };
  }).filter(function (b) { return b.batchId; });
}

function readSettings_() {
  var out = {};
  dataRows_(SHEET.SETTINGS).forEach(function (r) { if (r[0]) out[String(r[0])] = r[1]; });
  return out;
}

function product_(sku) {
  var p = readProducts_().filter(function (x) { return x.sku === sku; })[0];
  if (!p) throw new Error('找不到产品 Product not found: ' + sku);
  return p;
}

function logMoves_(rows) {
  if (!rows.length) return;
  var sh = sheet_(SHEET.MOVES);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function dataRows_(name) {
  var sh = sheet_(name);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, HEADERS[name].length).getValues();
}

function sheet_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('缺少工作表 Missing sheet "' + name + '" - 请先运行 Setup');
  return sh;
}

/** Serialise all writes so two people shipping the same batch can't oversell it. */
function withLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('系统忙，请重试 System busy, please retry');
  try {
    var result = fn();
    SpreadsheetApp.flush();
    return result;
  } finally {
    lock.releaseLock();
  }
}

function stripRow_(b) {
  return { batchId: b.batchId, sku: b.sku, lotNo: b.lotNo, expiry: b.expiry, qtyIn: b.qtyIn,
    remaining: b.remaining, location: b.location, receivedAt: b.receivedAt, supplier: b.supplier };
}

function dateStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, tz_(), 'yyyy-MM-dd');
  return String(v || '').trim();
}

function tz_() { return SpreadsheetApp.getActive().getSpreadsheetTimeZone() || 'Asia/Kuala_Lumpur'; }
function today_() { return Utilities.formatDate(new Date(), tz_(), 'yyyy-MM-dd'); }
function now_() { return Utilities.formatDate(new Date(), tz_(), 'yyyy-MM-dd HH:mm:ss'); }
function user_() { return Session.getActiveUser().getEmail() || 'unknown'; }
