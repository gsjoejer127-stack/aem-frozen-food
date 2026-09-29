# OEM / ODM contract pack — how to use it

Prepared for **AL-EKHLAS MANUFACTURING SDN. BHD.** (AEM Frozen Food / 真心食品).
Drafted from the **manufacturer's side**: every discretion sits with the Company, every
label/claim/recall exposure sits with the brand owner. Same house style as `src/legal.ts`.

**Not legal advice. Not reviewed by a Malaysian advocate & solicitor.** See *Before first use* below.

## Which document for which customer

| Situation 情况 | Use 使用 |
|---|---|
| First order, small trial run, customer brings its own recipe and packaging, no exclusivity | `oem-order-confirmation-short-form.md` — 2 sheets double-sided, signed on the spot |
| Repeat customer, we developed the formulation (ODM), private label programme, any exclusivity or annual volume talk, any chain/supermarket/export customer | `oem-odm-agreement.md` — master agreement + Annexes A–G |
| Customer only wants samples and hasn't committed | Do **not** send a full agreement yet. Send Annex E (development order) + a mutual NDA, and take the development fee up front. Most formula leakage happens at this stage, not after signing. |

The short form is written so that nothing in it contradicts the master agreement — if a short-form
customer later signs the master, the master simply supersedes it.

## Never sign away these five things

1. **Clause 5 (formulation ownership).** The single clause that decides whether this business has
   an asset. Customers will send their own template saying "all IP in the Products vests in the
   Customer". That sentence hands over the recipe library. If a customer insists, price it as an
   outright formula buy-out (a one-off fee in the tens of thousands, plus a carve-out that keeps
   our base pastes and process), never as part of a normal supply deal.
2. **Clause 8 (label responsibility).** The label is where the fines and the recalls come from.
   Annex D — signed artwork approval — is what moves that risk. No signed Annex D, no printing.
3. **Clause 15.3 / short-form clause 1 (no late-delivery penalty).** Supermarket and platform
   vendor agreements are full of service-level fines, back-order charges and chargebacks. Accepting
   one of those on frozen production is how a margin disappears.
4. **Clause 17.4 (their product liability insurance).** Ask for the certificate before the first
   run and at every renewal. If the brand owner is uninsured, we are the deepest pocket in any
   consumer claim.
5. **Clause 21.1 (no exclusivity by default).** Exclusivity is a product we sell for a paid,
   measured minimum volume — never something given away to win a first order.

## Things to fill in before sending

- Clause 6.3 and Annex C — the liquidated damages figure (suggested: 12 months' invoice value, or
  RM 50,000–200,000 depending on how much formulation work we put in).
- Annex A — one sheet per SKU, plus a signed Golden Sample. This is the document that wins
  quality arguments; a missing Golden Sample loses them.
- Annex B — **fill this in even when it is empty.** Ticking "the Customer supplied no recipe" is
  what makes clause 5 enforceable later.
- Annex C — price, payment, delivery term, MOQ, storage fee, insurance.

## Before first use — get these checked by a Malaysian solicitor

- **Liquidated damages (clauses 6.3, 21.4).** Contracts Act 1950 s.75: a court awards reasonable
  compensation and may strike down a figure it reads as a penalty. Keep the figure defensible and
  tie it to real development cost.
- **Retention of title and the right to enter premises (clause 14.5).** Enforceable in principle,
  but the wording and any need to register a charge should be confirmed.
- **Exclusion of implied terms (clause 19.3).** Sale of Goods Act 1957 allows contracting out
  between businesses; confirm the drafting. The Consumer Protection Act 1999 does not apply B2B,
  but does apply to the end consumer — which is exactly why clauses 8, 17 and 18 matter.
- **Arbitration vs courts (clause 23.2).** AIAC arbitration is confidential (good for protecting
  formulation evidence) but costs more than the courts for a small debt claim. Consider: courts for
  money claims, arbitration for IP and confidentiality disputes.
- **Non-circumvention period (clause 6.1).** 18 months is commercially normal; enforceability of
  post-termination restraints in Malaysia is fact-sensitive (s.28 Contracts Act concerns trade
  restraint of *trade or profession*, so frame it as trade-secret protection, which is how it is
  drafted here).
- **Halal representations (clause 9).** Trade Descriptions (Certification and Marking of Halal)
  Order 2011 — only JAKIM/the state authority may certify. Confirm the exact wording we may use
  about our own certification scope, and that clause 9.2 matches what our certificate permits.

## Regulatory references used in the drafting

Food Act 1983 · Food Regulations 1985 (labelling, nutrition, claims) · Weights and Measures Act 1972
· Trade Descriptions Act 2011 and the Halal Certification and Marking Order 2011 · Contracts Act 1950
· Sale of Goods Act 1957 · Consumer Protection Act 1999 (consumer-facing only) · Trademarks Act 2019
· Copyright Act 1987 · PDPA 2010 · MAQIS Act 2011 and import permits for imported ingredients.

## Thai-food-specific points already built in

- Fish sauce, shrimp paste (kapi), oyster sauce, cooking alcohol and mirin are named as
  ingredients the Company may reject on halal grounds (clause 9.3) — these are the usual failure
  points in a Thai recipe brought to a halal plant.
- Crustacean and fish allergens are declared explicitly (clause 10.1), because Thai recipes carry
  them even when the label headline says "chicken".
- Origin: "product of Thailand" / "Thai Select" style claims are blocked, and Malaysia must appear
  as country of origin (clauses 8.5, 8.6).
- Chilli heat, galangal, kaffir lime, lemongrass, coconut-milk solids and palm sugar are named as
  seasonally variable, so a "not spicy enough / not the same as last batch" complaint is answered
  by clause 3.2 and the Golden Sample.

## Files

- `oem-odm-agreement.md` — master agreement, bilingual EN/中文, Annexes A–G
- `oem-order-confirmation-short-form.md` — order confirmation with standard terms on the back (2 sheets, double-sided)
- `build-pdf.sh` — renders both to signable A4 PDFs into `pdf/`
