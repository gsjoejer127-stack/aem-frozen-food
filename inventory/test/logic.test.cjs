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
