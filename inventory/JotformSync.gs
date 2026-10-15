/**
 * Jotform "Production Packing Log 生产入库登记" -> stock-in batches.
 *
 * Runs from a daily time trigger as the Sheet owner. Every submission is
 * booked at most once: its stock-in carries Ref "JF:<submission id>", and
 * anything that can't be booked safely (unknown product, odd date, bad
 * quantity) goes to the "Jotform待处理" sheet instead of into stock.
 * Fix the cause (usually: add the spelling to Products > Aliases) and the
 * next run books it. Set Status to "忽略" to drop a row for good.
 *
 * Script Properties (Project Settings > Script Properties):
 *   JOTFORM_API_KEY          required - Jotform > Settings > API, read-only key is enough
 *   JOTFORM_PACKING_FORM_ID  optional, default 261763466729066
 *   JOTFORM_API_BASE         optional, https://eu-api.jotform.com for EU accounts
 */

var PENDING_SHEET = 'Jotform待处理';
var PENDING_HEADERS = ['Submission ID', 'Submitted 提交时间', 'Product 产品(原文)', 'Spec 规格', 'Batch 批号',
  'Packs 包数', 'Date 日期', 'Location 位置', 'Operator 操作员', 'Reason 原因', 'Status 状态'];
var PACKING_FORM_ID = '261763466729066';
var MAX_DATE_GAP_DAYS = 10;
var WATERMARK_OVERLAP_DAYS = 3;

function installJotformTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncJotformPacking') ScriptApp.deleteTrigger(t);
  });
  // 06:00 MYT: after the night shift's packing entries, before the day starts.
  ScriptApp.newTrigger('syncJotformPacking').timeBased().everyDays(1).atHour(6)
    .inTimezone(tz_()).create();
}

function syncJotformPacking() {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('JOTFORM_API_KEY');
  if (!key) throw new Error('缺少 Script Property JOTFORM_API_KEY');
  var from = dateStr_(readSettings_().jotformSyncFrom);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    throw new Error('请先在 Settings 填 jotformSyncFrom (yyyy-MM-dd)');
  }

  // Re-read a few days before the last submission seen, so late edits and
  // clock/timezone differences can't slip through; duplicates are skipped below.
  var mark = props.getProperty('JOTFORM_PACKING_WATERMARK') || '';
  var since = from + ' 00:00:00';
  if (mark) {
    var back = addDays(mark.slice(0, 10), -WATERMARK_OVERLAP_DAYS) + ' 00:00:00';
    if (back > since) since = back;
  }
  var subs = fetchSubmissions_(props, key, since);

  var result = withLock_(function () {
    var index = buildProductIndex(readProducts_());
    var booked = bookedSubmissionIds_();
    var pend = pendingSheet_();
    var pending = readPending_(pend);
    var stats = { booked: 0, pending: 0, retried: 0, skipped: 0 };

    // 1. Retry rows waiting in the pending sheet.
    pending.forEach(function (p) {
      if (p.status === '忽略' || /^已入库/.test(p.status)) return;
      if (booked[p.rec.id]) { pend.getRange(p.row, 11).setValue('已入库'); return; }
      var out = book_(p.rec, index);
      if (out.batchId) {
        booked[p.rec.id] = true;
        pend.getRange(p.row, 10, 1, 2).setValues([['', '已入库 ' + out.batchId]]);
        stats.retried++;
      } else {
        pend.getRange(p.row, 10).setValue(out.reason);
      }
    });

    // 2. New submissions.
    var inPending = {};
    pending.forEach(function (p) { inPending[p.rec.id] = true; });
    var newPending = [];
    subs.forEach(function (sub) {
      var rec = extractPacking(sub);
      if (booked[rec.id] || inPending[rec.id]) { stats.skipped++; return; }
      var out = book_(rec, index);
      if (out.batchId) { booked[rec.id] = true; stats.booked++; return; }
      newPending.push([rec.id, rec.createdAt, rec.product, rec.spec, rec.batch, rec.packs,
        typeof rec.date === 'object' ? JSON.stringify(rec.date) : String(rec.date || ''),
        rec.location, rec.operator, out.reason, '待处理']);
      stats.pending++;
    });
    if (newPending.length) {
      pend.getRange(pend.getLastRow() + 1, 1, newPending.length, PENDING_HEADERS.length).setValues(newPending);
    }
    return stats;
  });

  var newest = subs.reduce(function (m, s) { return s.created_at > m ? s.created_at : m; }, mark);
  if (newest) props.setProperty('JOTFORM_PACKING_WATERMARK', newest);
  Logger.log('Jotform sync: %s', JSON.stringify(result));
  return result;
}

/** {batchId} or {reason}. Caller holds the lock. */
function book_(rec, index) {
  var r = packingToStockIn(rec, index, MAX_DATE_GAP_DAYS);
  if (r.reason) return r;
  try {
    return { batchId: stockIn_(r.form, 'Jotform/' + (rec.operator || '?')).batchId };
  } catch (e) {
    return { reason: e.message };
  }
}

function fetchSubmissions_(props, key, since) {
  var base = props.getProperty('JOTFORM_API_BASE') || 'https://api.jotform.com';
  var formId = props.getProperty('JOTFORM_PACKING_FORM_ID') || PACKING_FORM_ID;
  var filter = encodeURIComponent(JSON.stringify({ 'created_at:gt': since }));
  var out = [], limit = 1000;
  for (var offset = 0; ; offset += limit) {
    var url = base + '/form/' + formId + '/submissions?limit=' + limit + '&offset=' + offset + '&filter=' + filter;
    // Key goes in a header, not the URL, so it never shows up in logs.
    var res = UrlFetchApp.fetch(url, { headers: { APIKEY: key }, muteHttpExceptions: true });
    var body = JSON.parse(res.getContentText() || '{}');
    if (res.getResponseCode() !== 200 || body.responseCode !== 200) {
      throw new Error('Jotform API ' + res.getResponseCode() + ': ' + (body.message || res.getContentText()).toString().slice(0, 200));
    }
    var page = body.content || [];
    out = out.concat(page);
    if (page.length < limit) break;
  }
  return out
    .filter(function (s) { return s.status === 'ACTIVE'; })
    .sort(function (a, b) { return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0; });
}

/** Submission IDs already booked, from Movements Ref "JF:<id>". */
function bookedSubmissionIds_() {
  var sh = sheet_(SHEET.MOVES);
  var out = {};
  if (sh.getLastRow() < 2) return out;
  sh.getRange(2, 6, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function (r) {
    var m = /^JF:(\d+)/.exec(r[0]);
    if (m) out[m[1]] = true;
  });
  return out;
}

function pendingSheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(PENDING_SHEET);
  if (!sh) {
    sh = ss.insertSheet(PENDING_SHEET);
    sh.getRange(1, 1, 1, PENDING_HEADERS.length).setValues([PENDING_HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // Submission IDs are 19 digits - as numbers Sheets would round them.
    sh.getRange('A:B').setNumberFormat('@');
    sh.getRange('G:G').setNumberFormat('@');
  }
  return sh;
}

function readPending_(sh) {
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, PENDING_HEADERS.length).getDisplayValues()
    .map(function (r, i) {
      var date = r[6];
      try { if (date.charAt(0) === '{') date = JSON.parse(date); } catch (e) { /* keep text */ }
      return {
        row: i + 2, status: String(r[10]).trim(),
        rec: { id: r[0], createdAt: r[1], product: r[2], spec: r[3], batch: r[4], packs: r[5],
          date: date, location: r[7], operator: r[8] }
      };
    })
    .filter(function (p) { return p.rec.id; });
}
