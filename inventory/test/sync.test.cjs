// End-to-end run of the Jotform sync against in-memory fakes of the Google
// services it uses. Run: node --test inventory/test/sync.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const DIR = path.join(__dirname, '..');
const WEEK = JSON.parse(fs.readFileSync(path.join(DIR, '..', 'tools', 'sample_week.json'), 'utf8'));

// ---------- Fake Sheets ----------
function fakeSheet(name) {
  const data = []; // data[r][c], 0-based
  const cell = (r, c) => (data[r] && data[r][c] !== undefined ? data[r][c] : '');
  const sh = {
    name, data,
    getLastRow: () => data.length,
    getLastColumn: () => data.reduce((m, r) => Math.max(m, r.length), 0),
    getRange(r, c, nr = 1, nc = 1) {
      if (typeof r === 'string') return { setNumberFormat() { return this; } };
      const rng = {
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => cell(r - 1 + i, c - 1 + j))),
        getDisplayValues: () => rng.getValues().map((row) => row.map((v) => String(v))),
        setValues(vals) {
          vals.forEach((row, i) => row.forEach((v, j) => {
            data[r - 1 + i] = data[r - 1 + i] || [];
            data[r - 1 + i][c - 1 + j] = v;
          }));
          return rng;
        },
        setValue: (v) => rng.setValues([[v]]),
        setFontWeight: () => rng,
        setNumberFormat: () => rng,
      };
      return rng;
    },
    appendRow(row) { data.push(row.slice()); },
    setFrozenRows() {},
  };
  return sh;
}

function makeEnv(responses) {
  const sheets = {};
  const props = {};
  const ss = {
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => (sheets[n] = fakeSheet(n)),
    getSheets: () => Object.values(sheets),
    deleteSheet: (s) => delete sheets[s.name],
    getSpreadsheetTimeZone: () => 'Asia/Kuala_Lumpur',
  };
  const fetched = [];
  const ctx = {
    console,
    SpreadsheetApp: { getActive: () => ss, flush() {} },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    Session: { getActiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    Logger: { log() {} },
    Utilities: {
      formatDate(d, tz, fmt) {
        const p = (n) => String(n).padStart(2, '0');
        const m = { yyyy: d.getFullYear(), yy: p(d.getFullYear() % 100), MM: p(d.getMonth() + 1), dd: p(d.getDate()),
          HH: p(d.getHours()), mm: p(d.getMinutes()), ss: p(d.getSeconds()) };
        return fmt.replace(/yyyy|yy|MM|dd|HH|mm|ss/g, (k) => m[k]);
      },
    },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = v; } }) },
    UrlFetchApp: {
      fetch(url, opts) {
        fetched.push({ url, opts });
        const formId = /\/form\/(\d+)\//.exec(url)[1];
        const content = responses[formId] || [];
        return { getResponseCode: () => 200,
          getContentText: () => JSON.stringify({ responseCode: 200, content }) };
      },
    },
  };
  vm.createContext(ctx);
  for (const f of ['Logic', 'Seed', 'Code', 'JotformSync']) {
    vm.runInContext(fs.readFileSync(path.join(DIR, f + '.gs'), 'utf8'), ctx, { filename: f + '.gs' });
  }
  ctx.setup();
  return { ctx, sheets, props, fetched };
}

// ---------- Turn the sample week into Jotform API submissions ----------
let seq = 0;
function sub(createdAt, answers) {
  seq++;
  return {
    id: String(6000000000000000000n + BigInt(seq)), created_at: createdAt + ':00', status: 'ACTIVE',
    answers: Object.fromEntries(Object.entries(answers).map(([text, answer], i) => [String(i + 2), { text, answer }])),
  };
}
const dmy = (s) => { const [d, m, y] = s.split('/'); return { day: d, month: m, year: String(Number(y) < 100 ? 2000 + Number(y) : Number(y)) }; };
const packing = WEEK.packing.map((r) => sub(r.time, {
  '产品名称 / Nama Produk:': r.product, '克数选择 / Pilihan Berat': r.spec, '批次号 / Kod Batch': r.batch,
  '成品入库数量 (包) / Kuantiti Produk Masuk Gudang (Bungkusan)': String(r.packs),
  '入库日期 / Tarikh Stok Masuk': dmy(r.prod_date), '操作员姓名 / Nama Operator': r.operator,
}));
const intake = WEEK.intake.map((r) => sub(r.time, {
  '收货日期 / Date Received / Tarikh Terima': { year: r.time.slice(0, 4), month: r.time.slice(5, 7), day: r.time.slice(8, 10) },
  '原材料名称 / Raw Material Name / Nama Bahan Mentah': r.material,
  '原材料数量 (kg) / Raw Material Quantity (kg) / Kuantiti Bahan Mentah (kg)': String(r.kg),
  '接收员工姓名 / Receiver Name / Nama Operator': r.receiver, '供应商名称 / Supplier Name / Nama Pembekal': r.supplier,
  '备注 / Remarks / Catatan': r.remark,
}));
const issue = WEEK.issue.map((r) => sub(r.time, {
  'Issue Date / 领用日期 / Tarikh Ambil': { year: r.time.slice(0, 4), month: r.time.slice(5, 7), day: r.time.slice(8, 10) },
  'Batch Number / 批次号 / Kod Batch': r.batch, 'Raw Material Name / 原材料名称 / Nama Bahan Mentah': r.material,
  'Quantity Taken (kg) / 领用数量 (kg) / Kuantiti Diambil (kg)': String(r.kg),
  'Usage Purpose / 领用用途/ Tujuan Penggunaan': r.purpose, 'Employee Name / 领用员工姓名 / Nama Operator': r.requester,
}));
const RESPONSES = { '261763466729066': packing, '262207520844049': intake, '262208014416043': issue };

function configure(env) {
  env.props.JOTFORM_API_KEY = 'test-key';
  const settings = env.sheets.Settings;
  settings.data.forEach((row) => {
    if (row[0] === 'jotformSyncFrom' || row[0] === 'rawSyncFrom') row[1] = '2026-10-05';
  });
}

const rows = (sh) => sh.data.slice(1);
const sum = (xs) => Math.round(xs.reduce((a, b) => a + b, 0) * 1000) / 1000;

test('tracking starts 2026-10-01 by default; a blank start date turns a form off', () => {
  const env = makeEnv(RESPONSES);
  env.props.JOTFORM_API_KEY = 'k';
  const from = Object.fromEntries(env.sheets.Settings.data.map((r) => [r[0], r[1]]));
  assert.equal(from.jotformSyncFrom, '2026-10-01');
  assert.equal(from.rawSyncFrom, '2026-10-01');
  env.sheets.Settings.data.forEach((r) => { if (/SyncFrom$/.test(r[0])) r[1] = ''; });
  const r = env.ctx.syncJotform();
  assert.match(r.packing, /未开启/);
  assert.equal(env.fetched.length, 0);
});

test('a real week syncs all three forms; problems go to pending, not into stock', () => {
  const env = makeEnv(RESPONSES);
  configure(env);
  const r = env.ctx.syncJotform();

  // Production: every record books.
  assert.deepEqual(JSON.parse(JSON.stringify(r.packing)), { booked: 25, pending: 0, retried: 0, skipped: 0 });
  const batches = rows(env.sheets.Batches);
  assert.equal(batches.length, 25);
  assert.equal(batches.filter((b) => b[1] === 'sate-ayam-kepak').length, 2);
  assert.equal(batches.filter((b) => b[1] === 'sate-pedal-ayam').length, 1);
  const beef = batches.filter((b) => b[1] === 'diperap-daging');
  assert.equal(beef.length, 3, 'marinated beef now maps to diperap-daging');
  const sa = batches.find((b) => b[2] === 'SA051026');
  assert.deepEqual([sa[1], sa[3], sa[4]], ['sate-ayam-classic', '2027-10-06', 49]);

  // Raw materials: every intake and issue line books; balance = in - out.
  assert.equal(r.intake.booked, WEEK.intake.length);
  assert.equal(r.issue.booked, WEEK.issue.length);
  const moves = rows(env.sheets.RawMoves);
  assert.equal(moves.length, WEEK.intake.length + WEEK.issue.length);
  assert.equal(sum(moves.map((m) => m[3])), sum(WEEK.intake.map((x) => x.kg)) - sum(WEEK.issue.map((x) => x.kg)));
  assert.ok(moves.every((m) => /^JF:\d{19}$/.test(m[4])));
  assert.ok(moves.every((m) => /^Jotform\//.test(m[6])));
  const bal = Object.fromEntries(rows(env.sheets.RawMaterials).map((m) => [m[0], m[5]]));
  assert.equal(bal['soup-mala'], 500 + sum(WEEK.intake.filter((x) => /mala/i.test(x.material)).map((x) => x.kg)) - 500);
  assert.equal(bal['mutton'], -sum(WEEK.issue.filter((x) => /kab|kambing/i.test(x.material)).map((x) => x.kg)));

  // API key never in the URL.
  assert.ok(env.fetched.every((f) => !/test-key/.test(f.url) && f.opts.headers.APIKEY === 'test-key'));
});

test('running again books nothing twice; fixing an alias books the held rows', () => {
  const env = makeEnv(RESPONSES);
  configure(env);
  // Hide two products so their records are held, as an unknown product would be.
  const products = env.sheets.Products.data;
  const kepak = products.find((r) => r[0] === 'sate-ayam-kepak');
  products.filter((r) => r[0] === 'sate-ayam-kepak' || r[0] === 'sate-pedal-ayam').forEach((r) => { r[9] = false; });
  env.ctx.syncJotform();
  const again = env.ctx.syncJotform();
  assert.equal(again.packing.booked, 0);
  assert.equal(again.packing.skipped, 25);
  assert.equal(again.intake.booked + again.issue.booked, 0);
  assert.equal(rows(env.sheets.Batches).length, 22);
  assert.equal(rows(env.sheets['Jotform待处理']).length, 3);

  // Turn one back on, as the owner would in the sheet.
  kepak[9] = true;
  const fixed = env.ctx.syncJotform();
  assert.equal(fixed.packing.retried, 2);
  assert.equal(rows(env.sheets.Batches).length, 24);
  const status = rows(env.sheets['Jotform待处理']).map((p) => [p[2], p[10]]);
  assert.equal(status.filter(([, s]) => /^已入库 B/.test(s)).length, 2);
  assert.deepEqual(status.find(([n]) => n === 'Sate Pedal Ayam')[1], '待处理');
});

test('large issues and unknown materials are held; stocktake sets the balance', () => {
  seq = 1000;
  const env = makeEnv({
    '262208014416043': [
      sub('2026-10-06 08:00', { '原材料名称': 'Kambing', '领用数量': '600', '领用员工姓名': 'Saad' }),
      sub('2026-10-06 08:01', { '原材料名称': 'Mystery powder', '领用数量': '2', '领用员工姓名': 'Saad' }),
      sub('2026-10-06 08:02', { '原材料名称': 'Kambing', '领用数量': '12.5', '领用员工姓名': 'Saad' }),
    ],
  });
  configure(env);
  const r = env.ctx.syncJotform();
  assert.equal(r.issue.booked, 1);
  assert.equal(r.issue.pending, 2);
  const reasons = rows(env.sheets['原料待处理']).map((p) => p[10]);
  assert.match(reasons[0], /超过 500 kg/);
  assert.match(reasons[1], /RawMaterials 的别名/);

  const before = env.ctx.apiRawSummary().find((m) => m.code === 'mutton');
  assert.equal(before.balance, -12.5);
  assert.equal(before.negative, true);
  assert.equal(env.ctx.apiRawCount({ code: 'mutton', counted: '40', note: '期初' }).delta, 52.5);
  assert.equal(env.ctx.apiRawSummary().find((m) => m.code === 'mutton').balance, 40);
  assert.throws(() => env.ctx.apiRawCount({ code: 'mutton', counted: '' }), /0 或正数/);
});
