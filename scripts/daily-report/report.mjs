import { BIZTORY, TIMEZONE } from './config.mjs';

function pick(record, names) {
  for (const name of names) {
    const value = name.split('.').reduce((o, k) => (o == null ? undefined : o[k]), record);
    if (value !== undefined && value !== null && value !== '' && typeof value !== 'object') return value;
  }
  return undefined;
}

const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

// Calendar date (YYYY-MM-DD) in Malaysia time, for a Date or a date string.
export function localDate(value, tz = TIMEZONE) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function normalize(record) {
  const f = BIZTORY.fields;
  return {
    date: localDate(pick(record, f.date)),
    dueDate: localDate(pick(record, f.dueDate)),
    total: num(pick(record, f.total)),
    outstanding: num(pick(record, f.outstanding)),
    customer: String(pick(record, f.customer) ?? '-'),
    status: String(pick(record, f.status) ?? '').toLowerCase(),
    number: String(pick(record, f.number) ?? ''),
  };
}

const isLive = (r) => !BIZTORY.voidStatuses.includes(r.status);
const sum = (rows, key = 'total') => rows.reduce((s, r) => s + r[key], 0);

function daysBetween(from, to) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86400000);
}

export function buildReport({ invoices, payments, creditNotes }, now = new Date()) {
  const today = localDate(now);
  const yesterday = localDate(new Date(Date.parse(today) - 86400000));
  const monthPrefix = today.slice(0, 7);

  const inv = invoices.map(normalize).filter(isLive);
  const pay = payments.map(normalize).filter(isLive);
  const cn = creditNotes.map(normalize).filter(isLive);

  const on = (rows, day) => rows.filter((r) => r.date === day);
  const mtd = (rows) => rows.filter((r) => r.date?.startsWith(monthPrefix) && r.date <= today);

  const unpaid = inv.filter((r) => r.outstanding > 0.005);
  const overdue30 = unpaid.filter((r) => daysBetween(r.dueDate || r.date, today) > 30);

  const byCustomer = new Map();
  for (const r of unpaid) byCustomer.set(r.customer, (byCustomer.get(r.customer) || 0) + r.outstanding);
  const topDebtors = [...byCustomer.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return {
    today,
    sales: { today: sum(on(inv, today)), count: on(inv, today).length, yesterday: sum(on(inv, yesterday)), mtd: sum(mtd(inv)) },
    received: { today: sum(on(pay, today)), count: on(pay, today).length, mtd: sum(mtd(pay)) },
    pending: { total: sum(unpaid, 'outstanding'), count: unpaid.length, overdue30: sum(overdue30, 'outstanding'), overdue30Count: overdue30.length, topDebtors },
    creditNotes: { today: sum(on(cn, today)), count: on(cn, today).length, mtd: sum(mtd(cn)) },
  };
}

const rm = (n) => 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function change(todayValue, yesterdayValue) {
  if (!yesterdayValue) return '';
  const pct = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
  return ` (${pct >= 0 ? '▲' : '▼'}${Math.abs(pct).toFixed(0)}% vs 昨天)`;
}

export function formatMessage(r) {
  const lines = [
    `📊 *AEM 每日报告* ${r.today}`,
    '',
    `💰 *今日销售* ${rm(r.sales.today)}（${r.sales.count} 张单）${change(r.sales.today, r.sales.yesterday)}`,
    `   本月累计 ${rm(r.sales.mtd)}`,
    '',
    `✅ *今日收款* ${rm(r.received.today)}（${r.received.count} 笔）`,
    `   本月累计 ${rm(r.received.mtd)}`,
    '',
    `⏳ *未收款* ${rm(r.pending.total)}（${r.pending.count} 张单）`,
    `   逾期 30 天+ ${rm(r.pending.overdue30)}（${r.pending.overdue30Count} 张）`,
  ];
  r.pending.topDebtors.forEach(([name, amt], i) => lines.push(`   ${i + 1}. ${name} ${rm(amt)}`));
  lines.push(
    '',
    `↩️ *今日退货 CN* ${rm(r.creditNotes.today)}（${r.creditNotes.count} 张）`,
    `   本月累计 ${rm(r.creditNotes.mtd)}`,
  );
  return lines.join('\n');
}
