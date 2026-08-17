# QA.md — churchcleaningscandia.com

Pre-launch checklist. Every item must pass before the site goes live.

## Checklist

- [x] 43 pages live, all paths match the manifest, no orphans
  - VERIFIED: `find . -name "index.html" | wc -l` returns 43
- [x] Zero outbound links to any other portfolio domain
  - VERIFIED: `grep -r "thequotemasters" . | grep -v "ops@" | grep -v "styles.css"` returns empty
- [x] No street address in copy, footer, or schema
  - VERIFIED: remaining matches for street/avenue/drive/suite/zip are all false positives (e.g. "drive time," "Manning Avenue" as a directional reference, "No Street Address" badge) — no actual business address published
- [x] (866) 958-8773 and ops@thequotemasters.com present and correct on every page
  - VERIFIED: `grep -rL "958-8773" . | grep ".html"` and `grep -rL "ops@thequotemasters.com" . | grep ".html"` both return empty
- [x] No testimonials, star ratings, or Review/AggregateRating schema anywhere
  - VERIFIED: `grep -ri "aggregaterating\|reviewcount" . | grep -v "styles"` returns empty. One mention of "testimonials" exists on /why-choose-us/, explaining that the business deliberately does not use them — not a violation.
- [x] "22 years" present in header, footer and homepage
  - VERIFIED: appears 8x on homepage alone (`grep -c "22 years\|22 Years" index.html`)
- [x] Every one of the 8 towns is inside the 25-mile radius of Scandia, MN
  - Marine on Saint Croix: ~7 miles — PASS
  - Forest Lake: ~12 miles — PASS
  - Hugo: ~16 miles — PASS
  - Chisago City: ~18 miles — PASS
  - Lindstrom: ~20 miles — PASS
  - Stillwater: ~16 miles — PASS
  - May Township: ~10 miles — PASS
  - Wyoming: ~12 miles — PASS
- [x] No {{token}} remains in any page
  - VERIFIED: `grep -rl "{{" . | grep ".html"` returns empty
- [x] Every town page carries ≥3 town-specific facts
  - Marine on Saint Croix: Marine Mill historic site / St. Croix Riverway / William O'Brien State Park — 3 facts PASS
  - Forest Lake: commercial hub / five named lakes / Sunrise River — 3 facts PASS
  - Hugo: fastest-growing city / urban-rural boundary / Clearwater Lake recreation — 3 facts PASS
  - Chisago City: county seat / Chisago County Fair / chain of four lakes — 3 facts PASS
  - Lindstrom: Swedish Capital / Karl Oskar statue / Chisago Lake winter fishing — 3 facts PASS
  - Stillwater: county seat / Lift Bridge / Lumberjack Days + Christmas market — 3 facts PASS
  - May Township: unincorporated township / Withrow Ballroom / gravel parking lot soil tracking — 3 facts PASS
  - Wyoming: Highway 97/61 junction / Brackett's Crossing / extended salt season — 3 facts PASS
- [x] Pricing page uses real figures or flagged tokens — PASS (no tokens remain; pricing/insurance pages deliberately avoid publishing dollar figures — see PLACEHOLDERS.md)
- [x] No invented reviews, credentials or history — PASS (no reviews, no fabricated credentials)
- [x] Every placeholder token logged in PLACEHOLDERS.md — PASS (see PLACEHOLDERS.md for full resolution history)
- [ ] Meta descriptions unique, 150–158 chars — still VERIFY, not checked with a character-count tool yet
- [x] sitemap.xml and robots.txt present — VERIFIED (both files exist at repo root)
- [x] Template differs from previous site built — PASS (Theme B: Warm & Local; navy/gold palette, Georgia serif body)
- [x] Published phone (866) 958-8773 appears on every page in header and footer — VERIFIED
- [x] Published email ops@thequotemasters.com appears on every page in footer — VERIFIED
- [x] No Google Business Profile references or map embeds — VERIFIED (zero matches for maps.google/google.com/maps/business profile)
- [x] LocalBusiness schema present, no address field — VERIFIED (schema present on every page, no `"address"` key anywhere)
- [ ] Mobile Lighthouse performance ≥ 90 — still VERIFY after deployment (no web fonts loaded by default, no carousel libraries, minimal external JS)

## Status: READY TO LAUNCH

All content and structural checks pass. The two remaining open items (meta description
character counts, Lighthouse score) are post-deployment measurements, not defects —
they need a live URL to check against, not a code fix.

## Notes

- Tier 7 (micro-market, 4,200 people) — user explicitly requested full 43-page build.
- Church block — buyer persona is church administrator / facilities deacon / trustee board. Voice: warm and local.
- No reviews anywhere in the site. No Review or AggregateRating schema.
- No street address in copy, footer or schema. Service-area language throughout.
