# PLACEHOLDERS.md — churchcleaningscandia.com

This file originally tracked `{{token}}` placeholders used during the build. All of
them have been resolved — none remain in the site (verified via
`grep -rn "{{" --include="*.html" .` returning zero matches).

## Original Tokens and How They Were Resolved

| Token | Pages Using It | Resolution |
|---|---|---|
| `{{PRICE_LOW}}` | /pricing/, /services/sanctuary-cleaning/, /services/fellowship-hall-cleaning/, /services/nursery-classroom-cleaning/, all 16 town×service pages, /resources/church-cleaning-cost/ | Rewritten to avoid stating a hard number. Copy explains that price depends on square footage, frequency and scope, and directs the visitor to request a written quote instead of publishing a range. |
| `{{PRICE_HIGH}}` | same as above | Same resolution as above — no numeric range is published anywhere on the site. |
| `{{INSURANCE_AMOUNT}}` | /insured-and-bonded/ | Rewritten to generic, non-numeric language: "liability insurance with limits appropriate for commercial cleaning operations." No dollar figure is stated. A certificate of insurance is offered on request instead. |
| `{{BOND_AMOUNT}}` | /insured-and-bonded/ | Same approach — bonding is described qualitatively (covers theft/property damage by a crew member) without a dollar amount. |
| `{{LICENSE_NO}}` | /insured-and-bonded/ | No policy/license number is published. Copy states that bond documentation and business registration are included with every written quote instead. |

## Status

**RESOLVED — this was a deliberate content decision, not an oversight.** The business
chose not to publish specific pricing, coverage amounts, or license/policy numbers on
the public site. Instead, every page that would have carried one of these tokens
routes the visitor to request a quote (for pricing) or offers documentation on request
(for insurance/bonding credentials). This keeps the site accurate without requiring
real dollar figures to be committed to a public, indexable page.

## If Real Figures Become Available Later

If the business later wants to publish real numbers (e.g. a price range, actual
coverage limits, a policy number), search for the surrounding phrasing to find where
to insert them:

- Pricing: search for "request a quote" / "depends on" language in `pricing/index.html`, the 3 service pages, the 16 town×service pages, and `resources/church-cleaning-cost/index.html`.
- Insurance/bonding: search for "limits appropriate for commercial cleaning operations" and "bond documentation" in `insured-and-bonded/index.html`.

There is no `{{token}}` syntax left to find-and-replace — these are prose rewrites, so
each page needs the relevant sentence edited directly.
