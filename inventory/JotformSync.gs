/**
 * Jotform -> inventory, every 5 minutes (plus a full daily pass).
 *
 *   Production Packing Log 生产入库登记  -> finished-goods stock-in batches
 *   Raw Material Intake 原材料入库登记   -> RawMoves IN  (+kg)
 *   原材料领用登记 Raw Material Issue     -> RawMoves OUT (-kg)
 *
 * Runs from time triggers as the Sheet owner. Every submission is
 * booked at most once: its row carries Ref "JF:<submission id>". Anything that
 * can't be booked safely (unknown name, odd date, bad quantity) goes to a
 * pending sheet instead - "Jotform待处理" for packing, "原料待处理" for raw
 * materials. Fix the cause (usually: add the spelling to the Aliases column)
 * and the next run books it. Set Status to "忽略" to drop a row for good.
 *
 * Script Properties (Project Settings > Script Properties):
 *   JOTFORM_API_KEY          required - Jotform > Settings > API, read-only key is enough
 *   JOTFORM_API_BASE         optional, https://eu-api.jotform.com for EU accounts
 *   JOTFORM_PACKING_FORM_ID / JOTFORM_INTAKE_FORM_ID / JOTFORM_ISSUE_FORM_ID
 *                            optional, override the form IDs below
 */

var PENDING_SHEET = 'Jotform待处理';
var PENDING_HEADERS = ['Submission ID', 'Submitted 提交时间', 'Product 产品(原文)', 'Spec 规格', 'Batch 批号',
  'Packs 包数', 'Date 日期', 'Location 位置', 'Operator 操作员', 'Reason 原因', 'Status 状态'];
var RAW_PENDING_SHEET = '原料待处理';
var RAW_PENDING_HEADERS = ['Submission ID', 'Form 表', 'Submitted 提交时间', 'Material 物料(原文)', 'Kg',
  'Party 供应商/用途', 'Batch 批号', 'Date 日期', 'Operator 操作员', 'Remark 备注', 'Reason 原因', 'Status 状态'];

var JOTFORM_FORMS = {
  packing: { prop: 'JOTFORM_PACKING_FORM_ID', id: '261763466729066', from: 'jotformSyncFrom' },
  intake: { prop: 'JOTFORM_INTAKE_FORM_ID', id: '262207520844049', from: 'rawSyncFrom' },
  issue: { prop: 'JOTFORM_ISSUE_FORM_ID', id: '262208014416043', from: 'rawSyncFrom' }
};
var RAW_KIND = { intake: 'IN', issue: 'OUT' };
var RAW_KIND_LABEL = { IN: '入库', OUT: '领用' };
var MAX_DATE_GAP_DAYS = 10;
var WATERMARK_OVERLAP_DAYS = 3;

function installJotformTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (/^syncJotform/.test(fn)) ScriptApp.deleteTrigger(t);
  });
  // Every 5 minutes: one API call for all three forms, so a submission shows
  // up in stock within minutes (~290 Jotform API calls a day).
  ScriptApp.newTrigger('syncJotformQuick').timeBased().everyMinutes(5).create();
  // 06:00 MYT: full per-form sync as a safety net (e.g. forms shared from a
  // team, which the account-wide submissions call may not include).
  ScriptApp.newTrigger('syncJotform').timeBased().everyDays(1).atHour(6).inTimezone(tz_()).create();
}

/** Full sync: one API call per form. Menu "Sync now" and the daily trigger. */
function syncJotform() {
  return runSync_(function (name, since, props, key) {
    var cfg = JOTFORM_FORMS[name];
    return fetchSubmissions_(props, key, '/form/' + (props.getProperty(cfg.prop) || cfg.id) + '/submissions', since);
  });
}

/** Quick sync every 5 minutes: one account-wide call, split by form. */
function syncJotformQuick() {
  var all = null, allSince = null;
  return runSync_(function (name, since, props, key) {
    if (!all) {
      // Fetch once from the earliest point any form needs.
      allSince = earliestSince_(props);
      all = fetchSubmissions_(props, key, '/user/submissions', allSince);
    }
    var cfg = JOTFORM_FORMS[name];
    var id = String(props.getProperty(cfg.prop) || cfg.id);
    return all.filter(function (s) { return String(s.form_id) === id && s.created_at > since; });
  });
}

/** Kept so a trigger installed by the first version still runs. */
function syncJotformPacking() { return syncJotform(); }

/** Runs every form whose start date is set. One form failing doesn't stop the others. */
function runSync_(fetch) {
  var settings = readSettings_();
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('JOTFORM_API_KEY');
  if (!key) throw new Error('缺少 Script Property JOTFORM_API_KEY');
  var results = {}, errors = [];
  Object.keys(JOTFORM_FORMS).forEach(function (name) {
    var since = sinceFor_(name, settings, props);
    if (!since) { results[name] = '未开启 (Settings ' + JOTFORM_FORMS[name].from + ')'; return; }
    try {
      results[name] = syncForm_(name, fetch(name, since, props, key), settings, props);
    } catch (e) {
      results[name] = 'ERROR ' + e.message;
      errors.push(name + ': ' + e.message);
    }
  });
  Logger.log('Jotform sync: %s', JSON.stringify(results));
  // Throwing makes Google email the trigger owner, so failures don't go unnoticed.
  if (errors.length) throw new Error('Jotform 同步失败 ' + errors.join(' | '));
  return results;
}

function markProp_(name) { return 'JOTFORM_WATERMARK_' + name.toUpperCase(); }

/**
 * Where to start reading for one form, or '' when its start date isn't set.
 * Re-reads a few days before the last submission seen, so late entries and
 * timezone differences can't slip through; duplicates are skipped by Ref.
 */
function sinceFor_(name, settings, props) {
  var from = dateStr_(settings[JOTFORM_FORMS[name].from]);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return '';
  var since = from + ' 00:00:00';
  var mark = props.getProperty(markProp_(name)) || '';
  if (mark) {
    var back = addDays(mark.slice(0, 10), -WATERMARK_OVERLAP_DAYS) + ' 00:00:00';
    if (back > since) since = back;
  }
  return since;
}

function earliestSince_(props) {
  var settings = readSettings_();
  return Object.keys(JOTFORM_FORMS).map(function (n) { return sinceFor_(n, settings, props); })
    .filter(String).sort()[0] || '';
}

function syncForm_(name, subs, settings, props) {
  var stats = withLock_(function () {
    return name === 'packing' ? syncPacking_(subs)
      : syncRaw_(RAW_KIND[name], subs, name === 'intake' ? INTAKE_FIELDS : ISSUE_FIELDS,
        Number(settings.rawMaxIssueKg) || 0);
  });
  var mark = props.getProperty(markProp_(name)) || '';
  var newest = subs.reduce(function (m, s) { return s.created_at > m ? s.created_at : m; }, mark);
  if (newest !== mark) props.setProperty(markProp_(name), newest);
  return stats;
}

// ---------- Production packing -> stock-in ----------

function syncPacking_(subs) {
  var index = buildProductIndex(readProducts_());
  var booked = bookedIds_(SHEET.MOVES, 6);
  var pend = pendingSheet_();
  var pending = readPending_(pend);
  var stats = { booked: 0, pending: 0, retried: 0, skipped: 0 };

  pending.forEach(function (p) {
    if (p.status === '忽略' || /^已入库/.test(p.status)) return;
    if (booked[p.rec.id]) { pend.getRange(p.row, 11).setValue('已入库'); return; }
    var out = bookPacking_(p.rec, index);
    if (out.batchId) {
      booked[p.rec.id] = true;
      pend.getRange(p.row, 10, 1, 2).setValues([['', '已入库 ' + out.batchId]]);
      stats.retried++;
    } else if (out.reason !== p.reason) {
      pend.getRange(p.row, 10).setValue(out.reason);
    }
  });

  var inPending = {};
  pending.forEach(function (p) { inPending[p.rec.id] = true; });
  var rows = [];
  subs.forEach(function (sub) {
    var rec = extractPacking(sub);
    if (booked[rec.id] || inPending[rec.id]) { stats.skipped++; return; }
    var out = bookPacking_(rec, index);
    if (out.batchId) { booked[rec.id] = true; stats.booked++; return; }
    rows.push([rec.id, rec.createdAt, rec.product, rec.spec, rec.batch, rec.packs, dateText_(rec.date),
      rec.location, rec.operator, out.reason, '待处理']);
    stats.pending++;
  });
  appendRows_(pend, rows);
  return stats;
}

/** {batchId} or {reason}. Caller holds the lock. */
function bookPacking_(rec, index) {
  var r = packingToStockIn(rec, index, MAX_DATE_GAP_DAYS);
  if (r.reason) return r;
  try {
    return { batchId: stockIn_(r.form, 'Jotform/' + (rec.operator || '?')).batchId };
  } catch (e) {
    return { reason: e.message };
  }
}

function pendingSheet_() {
  return ensureSheet_(PENDING_SHEET, PENDING_HEADERS, ['A:B', 'G:G']);
}

function readPending_(sh) {
  return pendingRows_(sh, PENDING_HEADERS.length).map(function (r, i) {
    return {
      row: i + 2, status: String(r[10]).trim(), reason: r[9],
      rec: { id: r[0], createdAt: r[1], product: r[2], spec: r[3], batch: r[4], packs: r[5],
        date: parseDateText_(r[6]), location: r[7], operator: r[8] }
    };
  }).filter(function (p) { return p.rec.id; });
}

// ---------- Raw material intake / issue -> RawMoves ----------

function syncRaw_(kind, subs, fields, maxOutKg) {
  var index = buildMaterialIndex(readRawMaterials_());
  var booked = bookedIds_(SHEET.RAW_MOVES, 5);
  var pend = rawPendingSheet_();
  var pending = readRawPending_(pend).filter(function (p) { return p.rec.kind === kind; });
  var stats = { booked: 0, pending: 0, retried: 0, skipped: 0 };
  var moves = [], whos = [];

  pending.forEach(function (p) {
    if (p.status === '忽略' || /^已记账/.test(p.status)) return;
    if (booked[p.rec.id]) { pend.getRange(p.row, 12).setValue('已记账'); return; }
    var r = rawToMove(p.rec, index, maxOutKg);
    if (r.move) {
      booked[p.rec.id] = true;
      moves.push(r.move); whos.push(p.rec.operator);
      pend.getRange(p.row, 11, 1, 2).setValues([['', '已记账']]);
      stats.retried++;
    } else if (r.reason !== p.reason) {
      pend.getRange(p.row, 11).setValue(r.reason);
    }
  });

  var inPending = {};
  pending.forEach(function (p) { inPending[p.rec.id] = true; });
  var rows = [];
  subs.forEach(function (sub) {
    var rec = extractFields(sub, fields);
    rec.kind = kind;
    if (booked[rec.id] || inPending[rec.id]) { stats.skipped++; return; }
    var r = rawToMove(rec, index, maxOutKg);
    if (r.move) { booked[rec.id] = true; moves.push(r.move); whos.push(rec.operator); stats.booked++; return; }
    rows.push([rec.id, RAW_KIND_LABEL[kind], rec.createdAt, rec.material, rec.kg, rec.party, rec.batch,
      dateText_(rec.date), rec.operator, rec.remark, r.reason, '待处理']);
    stats.pending++;
  });

  // Each row names the employee who filled in the form.
  moves.forEach(function (m, i) { appendRawMoves_([m], 'Jotform/' + (whos[i] || '?')); });
  appendRows_(pend, rows);
  // Runs every 5 minutes: only touch the sheet when something was booked.
  if (moves.length) refreshRawBalances_();
  return stats;
}

function rawPendingSheet_() {
  return ensureSheet_(RAW_PENDING_SHEET, RAW_PENDING_HEADERS, ['A:C', 'H:H']);
}

function readRawPending_(sh) {
  var kindOf = { '入库': 'IN', '领用': 'OUT' };
  return pendingRows_(sh, RAW_PENDING_HEADERS.length).map(function (r, i) {
    return {
      row: i + 2, status: String(r[11]).trim(), reason: r[10],
      rec: { id: r[0], kind: kindOf[r[1]] || r[1], createdAt: r[2], material: r[3], kg: r[4], party: r[5],
        batch: r[6], date: parseDateText_(r[7]), operator: r[8], remark: r[9] }
    };
  }).filter(function (p) { return p.rec.id; });
}

// ---------- Shared ----------

function fetchSubmissions_(props, key, path, since) {
  var base = props.getProperty('JOTFORM_API_BASE') || 'https://api.jotform.com';
  var filter = encodeURIComponent(JSON.stringify({ 'created_at:gt': since }));
  var out = [], limit = 1000;
  for (var offset = 0; ; offset += limit) {
    var url = base + path + '?limit=' + limit + '&offset=' + offset + '&filter=' + filter;
    // Key goes in a header, not the URL, so it never shows up in logs.
    var res = UrlFetchApp.fetch(url, { headers: { APIKEY: key }, muteHttpExceptions: true });
    var text = res.getContentText() || '{}';
    var body;
    try { body = JSON.parse(text); } catch (e) { body = {}; }
    if (res.getResponseCode() !== 200 || body.responseCode !== 200) {
      throw new Error('Jotform API ' + res.getResponseCode() + ' (' + path + '): ' +
        String(body.message || text).slice(0, 200));
    }
    var page = body.content || [];
    out = out.concat(page);
    if (page.length < limit) break;
  }
  return out
    .filter(function (s) { return s.status === 'ACTIVE'; })
    .sort(function (a, b) { return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0; });
}

/** Submission IDs already booked, from a Ref column holding "JF:<id>". */
function bookedIds_(sheetName, col) {
  var sh = sheet_(sheetName);
  var out = {};
  if (sh.getLastRow() < 2) return out;
  sh.getRange(2, col, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function (r) {
    var m = /^JF:(\d+)/.exec(r[0]);
    if (m) out[m[1]] = true;
  });
  return out;
}

function ensureSheet_(name, headers, textCols) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // Submission IDs are 19 digits - as numbers Sheets would round them.
    textCols.forEach(function (a1) { sh.getRange(a1).setNumberFormat('@'); });
  }
  return sh;
}

function pendingRows_(sh, width) {
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, width).getDisplayValues();
}

function appendRows_(sh, rows) {
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

/** Date-field answers are objects; keep them as JSON so a retry reads the same value. */
function dateText_(v) { return v && typeof v === 'object' ? JSON.stringify(v) : String(v || ''); }
function parseDateText_(s) {
  if (String(s).charAt(0) !== '{') return s;
  try { return JSON.parse(s); } catch (e) { return s; }
}
