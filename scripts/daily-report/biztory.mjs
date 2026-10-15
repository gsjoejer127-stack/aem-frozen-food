import { BIZTORY } from './config.mjs';

export async function fetchJson(path, params, token, fetchImpl = fetch) {
  const url = new URL(BIZTORY.baseUrl.replace(/\/$/, '') + path);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  const res = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Biztory ${path} -> HTTP ${res.status}`);
  return res.json();
}

export function extractRows(body) {
  if (Array.isArray(body)) return body;
  for (const key of ['data', 'items', 'results', 'records']) {
    if (Array.isArray(body?.[key])) return body[key];
    if (Array.isArray(body?.[key]?.data)) return body[key].data;
  }
  return [];
}

function hasNextPage(body, page, rowCount) {
  const meta = body?.meta || body?.data || body || {};
  if (meta.last_page != null) return page < meta.last_page;
  if (body?.links?.next !== undefined) return Boolean(body.links.next);
  if (meta.next_page_url !== undefined) return Boolean(meta.next_page_url);
  return rowCount >= BIZTORY.pageSize;
}

export async function fetchAll(path, token, fetchImpl = fetch) {
  const rows = [];
  for (let page = 1; page <= BIZTORY.maxPages; page++) {
    const body = await fetchJson(path, { page, per_page: BIZTORY.pageSize }, token, fetchImpl);
    const batch = extractRows(body);
    rows.push(...batch);
    if (!batch.length || !hasNextPage(body, page, batch.length)) return rows;
  }
  throw new Error(`Biztory ${path}: more than ${BIZTORY.maxPages} pages, raise maxPages`);
}
