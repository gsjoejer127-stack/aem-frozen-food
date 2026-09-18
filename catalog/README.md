# WhatsApp Business catalog

Generated from the price list in `src/data.ts` — the site and the WhatsApp catalog
stay in sync because they come from the same source.

```bash
npm run catalog   # plain Node, no dependencies needed
```

| File | What it is |
| --- | --- |
| `whatsapp-catalog-feed.csv` | Bulk upload for Meta Commerce Manager. **94 items** — one per pack size, with packet and carton grouped under the same product via `item_group_id`. |
| `whatsapp-manual-entry.csv` | **51 rows**, one per product, for typing into the WhatsApp Business app by hand. Packet price is the listed price; carton tiers are named in the description. |
| `catalog-data-report.md` | Data problems that block or degrade the catalog. Read this before uploading. |

## Uploading (bulk — recommended)

The WhatsApp Business app can only add items one at a time. For 51 products, go
through Meta Commerce Manager instead; the catalog it manages is the same one
WhatsApp shows.

1. Open [Meta Commerce Manager](https://business.facebook.com/commerce) and select
   the catalog linked to the WhatsApp Business account (`+6014-941 3545`).
2. **Catalog → Data sources → Add items → Upload from file**.
3. Upload `whatsapp-catalog-feed.csv`. The column names are already Meta's field
   names, so no manual mapping is needed.
4. Review the errors Meta reports, fix them in `src/data.ts`, re-run
   `npm run catalog`, and re-upload.
5. In the WhatsApp Business app: **Settings → Business tools → Catalog** to confirm
   the items appear.

Set the upload to run on a schedule (Commerce Manager can fetch a URL hourly or
daily) once this file is published to the site — then a price change in
`src/data.ts` reaches WhatsApp without anyone re-uploading anything.

## Field choices

- **Currency** — prices are exported as `MYR`, matching `src/data.ts`.
- **Titles** — `English 中文 (pack size)`, so a buyer searching either language finds it.
- **`item_group_id`** — set to the product id, so `400g * Pkt` and `400g * 20Pkt * Ctn`
  show as one product with two options rather than two unrelated items.
- **`gtin` vs `mpn`** — `src/data.ts` holds one barcode per product, but a GTIN must be
  unique per catalog item. The barcode goes on the base pack as `gtin`; every other
  pack gets a derived `mpn`. Invalid and duplicate barcodes fall back to `mpn` too.
- **`link`** — every item points at `https://alekhlasfood.com/#catalog`. The site has no
  per-product URL yet; adding one would let Meta attribute traffic per product.

## Before you upload

`catalog-data-report.md` currently flags **50 of 51 products using Unsplash stock
photos**. Meta's commerce policy requires the image to be the product being sold, so
these will be rejected on review — and a wholesale buyer comparing your listing to a
competitor's real factory photos draws the obvious conclusion. Real photos are the
one thing that has to happen outside this repo.
