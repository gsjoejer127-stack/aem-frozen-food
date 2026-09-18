# Catalog data report

Generated from `src/data.ts` by `scripts/build-catalog-feed.mjs`. Do not edit by hand —
fix the product data and re-run `npm run catalog`.

- Products: **51**
- Catalog items in the feed (one per pack size): **94**
- Items in the manual-entry sheet (one per product): **51**

## Blocking — fix before uploading

### Image is an Unsplash stock photo, not the real product. Meta rejects catalog items whose image is not the item being sold, and B2B buyers spot it immediately

**50 product(s):** `sate-daging-mala`, `sate-kambing-mala`, `sate-ayam-mala`, `sate-daging-classic`, `sate-kambing-classic`, `sate-ayam-classic`, `soup-pir-gula-batu`, `soup-pir-gula-batu-bucket`, `soup-kelapa-laut-longan`, `soup-nanas-longan`, `soup-kacang-manis`, `snack-ayam-goreng-krispi`, `snack-kuih-labu`, `snack-ice-cream-goreng`, `snack-susu-goreng`, `dumpling-ayam-cendawan`, `dumpling-ayam-kubis`, `dumpling-beef-leek`, `dumpling-kambing-lobak`, `rte-daging-masam-emas`, `rte-daging-masak-merah`, `rte-claypot-kambing`, `rte-claypot-ayam`, `rte-ayam-masam-manis`, `rte-ayam-cincang-terung`, `rte-ayam-cendawan`, `rte-ayam-kuning`, `sauce-kolagen-ayam`, `sauce-jeruk-sayur`, `sauce-tomato`, `sauce-ayam-masam-pedas`, `sauce-mala-pedas`, `sauce-minyak-cili`, `sauce-sos-bawang-putih`, `diperap-isi-ikan`, `diperap-daging`, `diperap-kambing`, `tea-ba-bao`, `tea-wolfberry`, `tea-roselle`, `tea-bunga-kekwa`, `herbal-sup-kelapa`, `herbal-sup-susu-harimau`, `herbal-sup-tianma`, `herbal-sup-bajitian`, `herbal-sup-cordyceps`, `herbal-sup-goji-kekwa`, `seasoning-lanzhou`, `seasoning-bbq`, `seasoning-mala-bbq`

### Barcode is already used by another product. Duplicate GTINs are rejected by Meta, so the later product is exported as `mpn`

**1 product(s):** `soup-pir-gula-batu-bucket` (`9553183093709`)

## Warnings

### Barcode fails the EAN-13 check digit — it will not scan at a retailer, and is exported as `mpn`

**1 product(s):** `dumpling-kambing-lobak` (`9555414941347`)

### Barcode is not a 13-digit EAN — exported as `mpn` instead of `gtin`

**1 product(s):** `seasoning-mala-bbq` (`AEM-ML-BBQ`)
