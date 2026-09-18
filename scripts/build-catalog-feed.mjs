/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Generates WhatsApp Business / Meta Commerce Manager catalog files from src/data.ts.
 *
 * Outputs (into ./catalog):
 *   - whatsapp-catalog-feed.csv  Meta Commerce Manager bulk upload (one row per variant)
 *   - whatsapp-manual-entry.csv  Simplified sheet for typing into the WhatsApp Business app
 *   - catalog-data-report.md     Data-quality issues that block or degrade the catalog
 *
 * Usage: npm run catalog   (plain Node, no dependencies required)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { register } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'catalog');

const SITE_URL = 'https://alekhlasfood.com';
const PRODUCT_LINK = `${SITE_URL}/#catalog`;
const BRAND = 'AEM Frozen Food';
const CURRENCY = 'MYR';

/** Load src/data.ts directly; Node strips the TS types, the hook stubs asset imports. */
async function loadData() {
  register('./asset-stub-hook.mjs', import.meta.url);
  return import(pathToFileURL(resolve(ROOT, 'src/data.ts')).href);
}

const isEan13 = (s) => /^\d{13}$/.test(s);

const ean13ChecksumOk = (s) => {
  const d = s.split('').map(Number);
  const sum = d.slice(0, 12).reduce((acc, v, i) => acc + v * (i % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === d[12];
};

/** WhatsApp truncates long text in the item sheet; keep descriptions readable there. */
const clamp = (s, max) => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`);

const csvCell = (value) => {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCsv = (columns, rows) =>
  [columns, ...rows.map((row) => columns.map((c) => row[c]))]
    .map((cells) => cells.map(csvCell).join(','))
    .join('\r\n') + '\r\n';

const PACK_LABEL = {
  pkt: 'Packet / 包',
  ctn: 'Carton / 箱',
  box: 'Box / 盒',
  pck: 'Pack / 包',
  unit: 'Unit / 个'
};

function buildRows(products, categories) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const gtinSeen = new Set();
  const issues = [];
  const feedRows = [];
  const manualRows = [];

  for (const product of products) {
    const category = categoryById.get(product.category);
    const productType = category ? `${category.name} / ${category.nameZh}` : product.category;

    if (!isEan13(product.barcode)) {
      issues.push({
        code: 'barcode-not-ean13',
        blocking: false,
        title: 'Barcode is not a 13-digit EAN — exported as `mpn` instead of `gtin`',
        item: `\`${product.id}\` (\`${product.barcode}\`)`
      });
    } else if (!ean13ChecksumOk(product.barcode)) {
      issues.push({
        code: 'barcode-bad-checksum',
        blocking: false,
        title: 'Barcode fails the EAN-13 check digit — it will not scan at a retailer, and is exported as `mpn`',
        item: `\`${product.id}\` (\`${product.barcode}\`)`
      });
    }

    if (/^https?:\/\/images\.unsplash\.com\//.test(product.image)) {
      issues.push({
        code: 'stock-photo',
        blocking: true,
        title:
          'Image is an Unsplash stock photo, not the real product. Meta rejects catalog items whose image is not the item being sold, and B2B buyers spot it immediately',
        item: `\`${product.id}\``
      });
    }

    // A GTIN must be unique across the whole catalog, and src/data.ts carries one
    // barcode per product rather than per pack size. Attach it to the base variant
    // only; every other variant falls back to a derived mpn.
    let gtinAvailable = isEan13(product.barcode) && ean13ChecksumOk(product.barcode);
    if (gtinAvailable && gtinSeen.has(product.barcode)) {
      issues.push({
        code: 'duplicate-gtin',
        blocking: true,
        title:
          'Barcode is already used by another product. Duplicate GTINs are rejected by Meta, so the later product is exported as `mpn`',
        item: `\`${product.id}\` (\`${product.barcode}\`)`
      });
      gtinAvailable = false;
    }
    if (gtinAvailable) gtinSeen.add(product.barcode);

    for (const variant of product.variants) {
      const usableGtin = gtinAvailable;
      gtinAvailable = false;

      feedRows.push({
        id: `${product.id}__${variant.id}`,
        title: clamp(`${product.name} ${product.nameZh} (${variant.size})`, 150),
        description: clamp(`${product.description} ${product.descriptionZh}`, 300),
        availability: 'in stock',
        condition: 'new',
        price: `${variant.price.toFixed(2)} ${CURRENCY}`,
        link: PRODUCT_LINK,
        image_link: product.image,
        brand: BRAND,
        item_group_id: product.id,
        product_type: productType,
        gtin: usableGtin ? product.barcode : '',
        mpn: usableGtin ? '' : `${product.barcode}-${variant.id}`
      });
    }

    // The WhatsApp Business app has no variant concept, so the manual sheet lists the
    // smallest pack as the sellable item and names the bulk tiers in the description.
    const [base, ...rest] = [...product.variants].sort((a, b) => a.price - b.price);
    const tiers = rest.map((v) => `${v.size} RM${v.price.toFixed(2)}`).join(' · ');
    manualRows.push({
      'Product name (名称)': clamp(`${product.name} ${product.nameZh}`, 60),
      'Price (RM)': base.price.toFixed(2),
      'Pack (规格)': `${base.size} — ${PACK_LABEL[base.type] ?? base.type}`,
      'Description (描述)': clamp(
        `${product.descriptionZh} ${product.description}${tiers ? ` | 批发规格 Bulk: ${tiers}` : ''}`,
        300
      ),
      'Product code (货号)': product.barcode,
      'Link (链接)': PRODUCT_LINK,
      'Category (分类)': productType,
      'Image to shoot (待拍照片)': product.image
    });
  }

  return { feedRows, manualRows, issues };
}

const FEED_COLUMNS = [
  'id',
  'title',
  'description',
  'availability',
  'condition',
  'price',
  'link',
  'image_link',
  'brand',
  'item_group_id',
  'product_type',
  'gtin',
  'mpn'
];

const MANUAL_COLUMNS = [
  'Product name (名称)',
  'Price (RM)',
  'Pack (规格)',
  'Description (描述)',
  'Product code (货号)',
  'Link (链接)',
  'Category (分类)',
  'Image to shoot (待拍照片)'
];

function groupIssues(issues) {
  const groups = new Map();
  for (const issue of issues) {
    const group = groups.get(issue.code) ?? { ...issue, items: [] };
    if (!group.items.includes(issue.item)) group.items.push(issue.item);
    groups.set(issue.code, group);
  }
  return [...groups.values()];
}

const renderGroups = (groups) =>
  groups.length
    ? groups
        .map((g) => `### ${g.title}\n\n**${g.items.length} product(s):** ${g.items.join(', ')}`)
        .join('\n\n')
    : '_None._';

function buildReport({ products, feedRows, manualRows, issues }) {
  const groups = groupIssues(issues);
  const blocking = groups.filter((g) => g.blocking);
  const warnings = groups.filter((g) => !g.blocking);

  return `# Catalog data report

Generated from \`src/data.ts\` by \`scripts/build-catalog-feed.mjs\`. Do not edit by hand —
fix the product data and re-run \`npm run catalog\`.

- Products: **${products.length}**
- Catalog items in the feed (one per pack size): **${feedRows.length}**
- Items in the manual-entry sheet (one per product): **${manualRows.length}**

## Blocking — fix before uploading

${renderGroups(blocking)}

## Warnings

${renderGroups(warnings)}
`;
}

const data = await loadData();
const { feedRows, manualRows, issues } = buildRows(data.PRODUCTS, data.CATEGORIES);

await mkdir(OUT_DIR, { recursive: true });
await writeFile(resolve(OUT_DIR, 'whatsapp-catalog-feed.csv'), toCsv(FEED_COLUMNS, feedRows), 'utf8');
await writeFile(resolve(OUT_DIR, 'whatsapp-manual-entry.csv'), toCsv(MANUAL_COLUMNS, manualRows), 'utf8');
await writeFile(
  resolve(OUT_DIR, 'catalog-data-report.md'),
  buildReport({ products: data.PRODUCTS, feedRows, manualRows, issues }),
  'utf8'
);

console.log(`Wrote ${feedRows.length} feed items and ${manualRows.length} manual rows to catalog/`);
