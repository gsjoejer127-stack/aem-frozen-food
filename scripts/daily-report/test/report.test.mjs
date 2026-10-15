import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, formatMessage, localDate } from '../report.mjs';
import { extractRows, fetchAll } from '../biztory.mjs';

const now = new Date('2026-10-15T10:00:00Z'); // 18:00 in Kuala Lumpur

test('localDate uses Malaysia time', () => {
  assert.equal(localDate(new Date('2026-10-15T17:00:00Z')), '2026-10-16');
  assert.equal(localDate('2026-10-15'), '2026-10-15');
});

test('buildReport aggregates sales, payments, pending and credit notes', () => {
  const r = buildReport({
    invoices: [
      { date: '2026-10-15', grand_total: '1,200.50', balance_due: 1200.5, customer_name: 'Kedai A' },
      { date: '2026-10-15', grand_total: 300, balance_due: 0, customer_name: 'Kedai B' },
      { date: '2026-10-14', grand_total: 1000, balance_due: 0, customer_name: 'Kedai B' },
      { date: '2026-08-01', due_date: '2026-08-31', grand_total: 500, balance_due: 500, customer: { name: 'Kedai C' } },
      { date: '2026-10-15', grand_total: 999, balance_due: 999, status: 'Void' },
    ],
    payments: [{ payment_date: '2026-10-15', amount: 300 }, { payment_date: '2026-10-02', amount: 1000 }],
    creditNotes: [{ date: '2026-10-15', total: 50 }],
  }, now);

  assert.equal(r.sales.today, 1500.5);
  assert.equal(r.sales.count, 2);
  assert.equal(r.sales.yesterday, 1000);
  assert.equal(r.sales.mtd, 2500.5);
  assert.equal(r.received.today, 300);
  assert.equal(r.received.mtd, 1300);
  assert.equal(r.pending.total, 1700.5);
  assert.equal(r.pending.overdue30, 500);
  assert.deepEqual(r.pending.topDebtors[0], ['Kedai A', 1200.5]);
  assert.equal(r.pending.topDebtors[1][0], 'Kedai C');
  assert.equal(r.creditNotes.today, 50);

  const msg = formatMessage(r);
  assert.match(msg, /RM 1,500\.50/);
  assert.match(msg, /▲50% vs 昨天/);
});

test('extractRows handles common response envelopes', () => {
  assert.deepEqual(extractRows([1]), [1]);
  assert.deepEqual(extractRows({ data: [1] }), [1]);
  assert.deepEqual(extractRows({ data: { data: [1] } }), [1]);
});

test('fetchAll follows Laravel-style pagination', async () => {
  const pages = { 1: { data: [1, 2], meta: { last_page: 2 } }, 2: { data: [3], meta: { last_page: 2 } } };
  const fakeFetch = async (url) => ({ ok: true, json: async () => pages[url.searchParams.get('page')] });
  assert.deepEqual(await fetchAll('/invoices', 't', fakeFetch), [1, 2, 3]);
});
