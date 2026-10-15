// Run: node --test inventory/test/
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const L = require(path.join(__dirname, '..', 'Logic.gs'));

const TODAY = '2026-10-13';

test('FEFO takes the earliest expiry first and spans batches', () => {
  const batches = [
    { batchId: 'late', expiry: '2027-03-01', receivedAt: '2026-09-01', remaining: 50 },
    { batchId: 'early', expiry: '2026-11-01', receivedAt: '2026-10-01', remaining: 10 },
    { batchId: 'mid', expiry: '2027-01-01', receivedAt: '2026-08-01', remaining: 5 },
  ];
  assert.deepEqual(L.allocateFEFO(batches, 12, TODAY), [
    { batchId: 'early', qty: 10 },
    { batchId: 'mid', qty: 2 },
  ]);
});

test('FEFO never ships expired stock and reports usable quantity', () => {
  const batches = [
    { batchId: 'old', expiry: '2026-10-12', remaining: 100 },
    { batchId: 'ok', expiry: '2026-12-01', remaining: 3 },
  ];
  assert.deepEqual(L.allocateFEFO(batches, 3, TODAY), [{ batchId: 'ok', qty: 3 }]);
  assert.throws(() => L.allocateFEFO(batches, 4, TODAY), /可用 3/);
});

test('expiry on today is still usable', () => {
  assert.equal(L.isExpired('2026-10-13', TODAY), false);
  assert.equal(L.isExpired('2026-10-12', TODAY), true);
  assert.equal(L.isExpired('', TODAY), false);
});

test('batches without expiry go last, ties broken by oldest received', () => {
  const batches = [
    { batchId: 'none', expiry: '', receivedAt: '2026-01-01', remaining: 5 },
    { batchId: 'b2', expiry: '2027-01-01', receivedAt: '2026-10-02', remaining: 5 },
    { batchId: 'b1', expiry: '2027-01-01', receivedAt: '2026-10-01', remaining: 5 },
  ];
  assert.deepEqual(L.allocateFEFO(batches, 12, TODAY).map(a => a.batchId), ['b1', 'b2', 'none']);
});

test('quantities must be positive whole numbers; cartons convert', () => {
  assert.throws(() => L.parseQty(0));
  assert.throws(() => L.parseQty(-1));
  assert.throws(() => L.parseQty(1.5));
  assert.throws(() => L.parseQty('abc'));
  assert.equal(L.toBaseQty('3', 'ctn', 20), 60);
  assert.equal(L.toBaseQty('3', 'base', 20), 3);
  assert.throws(() => L.toBaseQty(1, 'ctn', 0), /每箱数量/);
});

test('formatCartons', () => {
  assert.equal(L.formatCartons(45, 20), '2箱 + 5');
  assert.equal(L.formatCartons(40, 20), '2箱');
  assert.equal(L.formatCartons(7, 20), '7');
  assert.equal(L.formatCartons(45, 0), '45');
});

test('summarizeStock splits usable / expiring / expired and flags low stock', () => {
  const products = [
    { sku: 'A', name: 'A', nameZh: 'A', unitsPerCarton: 20, reorderLevel: 40 },
    { sku: 'B', name: 'B', nameZh: 'B', unitsPerCarton: 0, reorderLevel: 0 },
  ];
  const batches = [
    { sku: 'A', expiry: '2026-10-20', remaining: 10 }, // expiring within 30d
    { sku: 'A', expiry: '2027-06-01', remaining: 25 },
    { sku: 'A', expiry: '2026-09-01', remaining: 8 },  // expired
    { sku: 'A', expiry: '2027-06-01', remaining: 0 },  // empty, ignored
    { sku: 'B', expiry: '', remaining: 3 },
    { sku: 'ghost', expiry: '', remaining: 9 },        // unknown SKU, ignored
  ];
  const [a, b] = L.summarizeStock(products, batches, TODAY, 30);
  assert.equal(a.usable, 35);
  assert.equal(a.expiring, 10);
  assert.equal(a.expired, 8);
  assert.equal(a.nearestExpiry, '2026-10-20');
  assert.equal(a.batchCount, 3);
  assert.equal(a.low, true);
  assert.equal(a.usableText, '1箱 + 15');
  assert.equal(b.usable, 3);
  assert.equal(b.low, false); // reorder level 0 = no alert
});

test('stocktakeDelta', () => {
  assert.equal(L.stocktakeDelta(10, 7), -3);
  assert.equal(L.stocktakeDelta(10, '0'), -10);
  assert.throws(() => L.stocktakeDelta(10, -1));
  assert.throws(() => L.stocktakeDelta(10, ''), /盘点/);
});

test('addDays crosses month and year boundaries', () => {
  assert.equal(L.addDays('2026-12-20', 30), '2027-01-19');
});

// ---------- Jotform Production Packing Log ----------

const fs = require('node:fs');
const vm = require('node:vm');
const seed = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'Seed.gs'), 'utf8') +
  '\nthis.P = SEED_PRODUCTS; this.A = SEED_ALIASES;', seed);
const PRODUCTS = seed.P.map((r) => ({ sku: r[0], name: r[1], nameZh: r[2], aliases: seed.A[r[0]] || '' }));
const INDEX = L.buildProductIndex(PRODUCTS);

test('product names match on name, 中文名 or alias, ignoring case and spacing', () => {
  assert.deepEqual(L.matchProduct(INDEX, 'Sate ayam'), { sku: 'sate-ayam-classic' });
  assert.deepEqual(L.matchProduct(INDEX, '  SATE   Daging  mala '), { sku: 'sate-daging-mala' });
  assert.deepEqual(L.matchProduct(INDEX, '麻辣羊肉串'), { sku: 'sate-kambing-mala' });
  assert.deepEqual(L.matchProduct(INDEX, 'Kuih pulut goreng'), { sku: 'snack-kuih-pulut-gula-merah' });
  assert.match(L.matchProduct(INDEX, 'Sate Ayam Kepak').reason, /别名/);
  assert.match(L.matchProduct(INDEX, '').reason, /为空/);
});

test('a name claimed by two SKUs never matches', () => {
  const idx = L.buildProductIndex([
    { sku: 'a', name: 'Claypot', nameZh: '', aliases: '' },
    { sku: 'b', name: 'Other', nameZh: '', aliases: 'claypot' },
  ]);
  assert.match(L.matchProduct(idx, 'Claypot').reason, /多个 SKU/);
});

test('Jotform dates: date-field objects, ISO, and day/month/year text', () => {
  assert.equal(L.parseJotformDate({ year: '2026', month: '10', day: '6' }), '2026-10-06');
  assert.equal(L.parseJotformDate({ datetime: '2026-10-06 00:00:00' }), '2026-10-06');
  assert.equal(L.parseJotformDate('6/10/26'), '2026-10-06');
  assert.equal(L.parseJotformDate('06-10-2026'), '2026-10-06');
  assert.equal(L.parseJotformDate('31/2/26'), '');
  assert.equal(L.parseJotformDate('next week'), '');
});

test('expiry is one year after production; 29 Feb rolls to 28 Feb', () => {
  assert.equal(L.addYears('2026-10-06', 1), '2027-10-06');
  assert.equal(L.addYears('2028-02-29', 1), '2029-02-28');
});

const sub = (answers, extra = {}) => ({
  id: '6012345678901234567', created_at: '2026-10-05 23:25:10', status: 'ACTIVE',
  answers: Object.fromEntries(Object.entries(answers).map(([k, v], i) => [String(i + 3), { text: k, answer: v }])),
  ...extra,
});

test('extractPacking finds fields by label and packingToStockIn builds the stock-in', () => {
  const rec = L.extractPacking(sub({
    '产品名称 / Nama Produk:': 'Sate ayam',
    '克数选择 / Pilihan Berat': '400gm',
    '批次号 / Kod Batch': 'SA051026',
    '成品入库数量 (包) / Kuantiti Produk Masuk Gudang (Bungkusan)': '49',
    '入库日期 / Tarikh Stok Masuk': { year: '2026', month: '10', day: '06' },
    '存储位置 / Lokasi Simpanan': 'Freezer A',
    '操作员姓名 / Nama Operator': 'Jenn',
    '原材料数量 (kg) / Kuantiti Bahan Mentah (kg)': '20',
  }));
  assert.equal(rec.product, 'Sate ayam');
  assert.equal(rec.operator, 'Jenn');
  assert.deepEqual(L.packingToStockIn(rec, INDEX, 10).form, {
    sku: 'sate-ayam-classic', qty: 49, unit: 'base', expiry: '2027-10-06', lotNo: 'SA051026',
    location: 'Freezer A', supplier: '', ref: 'JF:6012345678901234567',
    note: 'Jotform 生产 · 2026-10-06 · 400gm · Sate ayam',
  });
});

test('packing records that need a human are held back with a reason', () => {
  const base = { id: '1', createdAt: '2026-10-05 23:25:10', product: 'Sate Ayam', packs: '49', date: '6/10/26' };
  assert.ok(L.packingToStockIn(base, INDEX, 10).form);
  assert.match(L.packingToStockIn({ ...base, packs: '4.5' }, INDEX, 10).reason, /正整数/);
  assert.match(L.packingToStockIn({ ...base, packs: '' }, INDEX, 10).reason, /正整数/);
  assert.match(L.packingToStockIn({ ...base, date: '' }, INDEX, 10).reason, /日期看不懂/);
  // 10/6/26 typed month-first reads as 10 June: four months off, so held.
  assert.match(L.packingToStockIn({ ...base, date: '10/6/26' }, INDEX, 10).reason, /相差/);
  assert.match(L.packingToStockIn({ ...base, date: '9/10/26' }, INDEX, 10).reason, /相差 -4/);
});

test('real week of packing logs: every record books or gets a reason', () => {
  const week = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'tools', 'sample_week.json'), 'utf8'));
  const out = week.packing.map((r, i) => L.packingToStockIn(
    { id: String(i), createdAt: r.time, product: r.product, packs: r.packs, date: r.prod_date }, INDEX, 10));
  const held = out.filter((o) => o.reason).map((o) => o.reason);
  assert.equal(out.length, 25);
  assert.ok(held.every((r) => /Kepak|Pedal|Marinated|diperap/i.test(r)), held.join('\n'));
});
