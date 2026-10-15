// Prints only HTTP status and JSON *shape* (keys and value types, never values)
// for candidate Biztory endpoints, so it is safe to run in public Actions logs.
import { BIZTORY } from './config.mjs';

const token = process.env.BIZTORY_TOKEN;
if (!token) throw new Error('Missing env BIZTORY_TOKEN');

const bases = [BIZTORY.baseUrl, 'https://api.biztoryapp.com/api', 'https://api.biztoryapp.com/api/v1', 'https://app.biztoryapp.com/api', 'https://biztoryapp.com/api'];
const paths = [...new Set([...Object.values(BIZTORY.paths), '/user', '/invoices', '/sales-invoices', '/payments', '/receive-payments', '/receipts', '/credit-notes', '/sales-credit-notes'])];

function shape(value, depth = 0) {
  if (Array.isArray(value)) return value.length ? [shape(value[0], depth + 1)] : [];
  if (value && typeof value === 'object') {
    if (depth > 3) return '{…}';
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v, depth + 1)]));
  }
  return value === null ? 'null' : typeof value;
}

for (const base of [...new Set(bases)]) {
  for (const path of paths) {
    const url = base.replace(/\/$/, '') + path;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      const type = res.headers.get('content-type') || '';
      let detail = '';
      if (res.ok && type.includes('json')) detail = JSON.stringify(shape(await res.json()));
      console.log(`${res.status} ${url} ${type.split(';')[0]} ${detail}`);
    } catch (err) {
      console.log(`ERR ${url} ${err.cause?.code || err.message}`);
    }
  }
}
