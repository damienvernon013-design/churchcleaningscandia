# QA.md — churchcleaningscandia.com

Pre-launch checklist. Every item must pass before the site goes live.

## Checklist

- [ ] 43 pages live, all paths match the manifest, no orphans
  - VERIFY: Run `find . -name "index.html" | wc -l` should return 43
- [ ] Zero outbound links to any other portfolio domain
  - VERIFY: `grep -r "thequotemasters" . | grep -v "ops@" | grep -v "styles.css"` should be empty
- [ ] No street address in copy, footer, or schema
  - VERIFY: `grep -ri "street\|avenue\|drive\|suite\|zip\|\b[0-9]\{5\}\b" . | grep -v "styles\|sitemap\|robots"` — review results
- [ ] (866) 958-8773 and ops@thequotemasters.com present and correct on every page
  - VERIFY: `grep -rL "958-8773" . | grep ".html"` should be empty
- [ ] No testimonials, star ratings, or Review/AggregateRating schema anywhere
  - VERIFY: `grep -ri "aggregaterating\|reviewcount\|testimonial" . | grep -v "styles"` should be empty
- [ ] "22 years" present in header, footer and homepage
  - VERIFY: `grep -c "22 years\|22 Years" index.html` should be >= 3
- [ ] Every one of the 8 towns is inside the 25-mile radius of Scandia, MN
  - Marine on Saint Croix: ~7 miles — PASS
  - Forest Lake: ~12 miles — PASS
  - Hugo: ~16 miles — PASS
  - Chisago City: ~18 miles — PASS
  - Lindstrom: ~20 miles — PASS
  - Stillwater: ~16 miles — PASS
  - May Township: ~10 miles — PASS
  - Wyoming: ~12 miles — PASS
- [ ] No {{token}} remains in any page (or this item is marked FAIL and site is NOT READY TO LAUNCH)
  - VERIFY: `grep -rl "{{" . | grep ".html"` — should be empty after token replacement
- [ ] Every town page carries ≥3 town-specific facts
  - Marine on Saint Croix: Marine Mill historic site / St. Croix Riverway / William O'Brien State Park — 3 facts PASS
  - Forest Lake: commercial hub / five named lakes / Sunrise River — 3 facts PASS
  - Hugo: fastest-growing city / urban-rural boundary / Clearwater Lake recreation — 3 facts PASS
  - Chisago City: county seat / Chisago County Fair / chain of four lakes — 3 facts PASS
  - Lindstrom: Swedish Capital / Karl Oskar statue / Chisago Lake winter fishing — 3 facts PASS
  - Stillwater: county seat / Lift Bridge / Lumberjack Days + Christmas market — 3 facts PASS
  - May Township: unincorporated township / Withrow Ballroom / gravel parking lot soil tracking — 3 facts PASS
  - Wyoming: Highway 97/61 junction / Brackett's Crossing / extended salt season — 3 facts PASS
- [ ] Pricing page uses real figures or flagged tokens — TOKENS PRESENT — NOT READY TO LAUNCH
- [ ] No invented reviews, credentials or history — PASS (no reviews, no fabricated credentials)
- [ ] Every placeholder token logged in PLACEHOLDERS.md — PASS
- [ ] Meta descriptions unique, 150–158 chars — VERIFY with character count tool on each page
- [ ] sitemap.xml and robots.txt present — PASS (generated)
- [ ] Template differs from previous site built — PASS (Theme B: Warm & Local; navy/gold palette, Georgia serif body)
- [ ] Published phone (866) 958-8773 appears on every page in header and footer — VERIFY
- [ ] Published email ops@thequotemasters.com appears on every page in footer — VERIFY
- [ ] No Google Business Profile references or map embeds — PASS
- [ ] LocalBusiness schema present, no address field — PASS
- [ ] Mobile Lighthouse performance ≥ 90 — VERIFY after deployment (no web fonts loaded by default, no carousel libraries, minimal external JS)

## Known Failures at Build Time

1. **PRICE_LOW, PRICE_HIGH, INSURANCE_AMOUNT, BOND_AMOUNT, LICENSE_NO** — all five tokens present throughout the site. Site is marked NOT READY TO LAUNCH until these are replaced.

## Notes

- Tier 7 (micro-market, 4,200 people) — user explicitly requested full 43-page build.
- Church block — buyer persona is church administrator / facilities deacon / trustee board. Voice: warm and local.
- No reviews anywhere in the site. No Review or AggregateRating schema.
- No street address in copy, footer or schema. Service-area language throughout.
