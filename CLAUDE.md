# churchcleaningscandia.com

Static HTML microsite for a church-cleaning service business serving Scandia, MN and eight surrounding towns within a 25-mile radius. No build step, no framework, no dependencies — plain HTML/CSS deployed as static files.

## Stack

- Plain HTML5 (43 pages, one `index.html` per route/directory)
- Single shared stylesheet: `styles.css` (navy/gold palette, Georgia serif body — "Theme B: Warm & Local")
- No JS framework, no build tooling, no package.json
- `sitemap.xml` and `robots.txt` at root

## Structure

Content is organized by feature area, one directory per route:

```
/                              → index.html (homepage)
about/
contact/
faq/
our-process/
pricing/
request-a-quote/
why-choose-us/
insured-and-bonded/
services/                      → 3 core services
  sanctuary-cleaning/
  fellowship-hall-cleaning/
  nursery-classroom-cleaning/
service-areas/                 → 8 towns × index + 2 service combos
  <town>/index.html
  <town>/sanctuary-cleaning/
  <town>/fellowship-hall-cleaning/
resources/                     → 5 educational/SEO articles
```

Every route is a directory with an `index.html` (clean URLs, no `.html` extension in links).

## Business Constraints (hard rules — do not violate)

These are enforced by `QA.md` and must hold across every page:

- **No street address anywhere** — service-area business only, no physical location disclosed.
- **No testimonials, star ratings, or Review/AggregateRating schema.**
- **No Google Business Profile references or map embeds.**
- **No outbound links to other portfolio/sibling domains** (e.g. `thequotemasters.com`) except the `ops@thequotemasters.com` contact email.
- **Phone (866) 958-8773 and email ops@thequotemasters.com must appear on every page.**
- **"22 years" (in business) must appear in header, footer, and homepage.**
- **LocalBusiness schema only** — no address field in schema.
- All 8 service-area towns must be within a 25-mile radius of Scandia, MN; each town page needs ≥3 town-specific facts.
- No invented reviews, credentials, or history.

## Working on this site

- When editing copy, grep for the phone number and "22 years" after changes to confirm you haven't dropped them from a page.
- When adding a new page, follow the existing directory-per-route pattern and copy header/footer/schema structure from a sibling page — don't hand-roll a new layout.
- Before considering the site launch-ready, re-run the checklist in `QA.md`.
- See `PLACEHOLDERS.md` for the history of templated tokens (`{{PRICE_LOW}}`, `{{INSURANCE_AMOUNT}}`, etc.) — these were resolved by rewording pricing/insurance copy to avoid hardcoded figures rather than inserting real numbers. If real pricing/insurance figures become available, search for the surrounding phrasing (e.g. "limits appropriate for commercial cleaning operations") to find where numbers could be inserted.

## Deployment

Static files — deploy by serving the directory root as-is (e.g. Netlify, GitHub Pages, Cloudflare Pages, S3+CDN). No build command needed.
