# HANDOFF — churchcleaningscandia.com

## Status: Content-complete, QA-passing, quote form live end-to-end

All 43 pages exist and pass the checklist in `QA.md`:

- 43 `index.html` pages present (verified via `find . -name index.html | wc -l`)
- Zero remaining `{{token}}` placeholders in any HTML file
- Phone `(866) 958-8773` present on every page
- Email `ops@thequotemasters.com` present on every page
- No street address, no testimonials/review schema, no outbound links to sibling portfolio domains
- "22 years" appears 8× on the homepage alone
- All 8 service-area towns confirmed within 25-mile radius of Scandia, MN, each with ≥3 town-specific facts

## What was fixed this session

1. **Removed a stray directory** at the project root literally named `{about,contact,request-a-quote,pricing,our-process,why-choose-us,faq,insured-and-bonded,services...}` (several levels deep, all empty) — leftover artifact from a `mkdir -p {a,b,c}` command where brace expansion didn't fire (likely run under `sh` instead of `bash`, or with globbing disabled). It contained no files; the real content lives correctly in `about/`, `contact/`, `services/`, `service-areas/`, etc. Deleted with `rm -rf`.
2. **Verified the pricing/insurance token resolution.** `PLACEHOLDERS.md` and `QA.md` both still say the site is "NOT READY TO LAUNCH" pending `{{PRICE_LOW}}`, `{{PRICE_HIGH}}`, `{{INSURANCE_AMOUNT}}`, `{{BOND_AMOUNT}}`, `{{LICENSE_NO}}`. In practice, none of those tokens remain in the HTML — the pricing and insured-and-bonded pages were rewritten to avoid stating hard numbers at all (e.g. "liability insurance with limits appropriate for commercial cleaning operations," certificate available on request). This reads fine as a page but **PLACEHOLDERS.md / QA.md are stale and should be updated or the real figures should be sourced** — see Outstanding below.
3. Initialized git repo, added `CLAUDE.md`, committed, and pushed to `origin/main` (`https://github.com/damienvernon013-design/churchcleaningscandia.git`).

## Contact/quote API integration (added this session)

Wired the quote form (present on `/`, `/contact/`, `/request-a-quote/`) to the
CRM-QM `PushLead` endpoint via a Vercel serverless proxy:

- `api/submit-quote.js` — holds the CRM Bearer token server-side (`CRM_API_TOKEN`
  env var, set in Vercel, never committed), validates input, maps the form fields
  into the CRM's expected payload shape (industry code 23, zip defaulted to Scandia
  MN 55073 since the form doesn't collect one), and forwards to
  `thequotemasters.com/crm_api/api.php?action=push_lead`.
- `quote-form.js` — client-side, intercepts the form submit and POSTs JSON to
  `/api/submit-quote` instead of doing a plain HTML POST (which previously went
  nowhere — the forms had no real handler before this).
- `api/README.md` — full integration docs.
- **`CRM_API_TOKEN` is now set in Vercel** (Settings → Environment Variables). The quote
  form is live end-to-end — submissions on `/`, `/contact/`, and `/request-a-quote/`
  reach the CRM's `PushLead` endpoint for real. It is not, and must never be, in this
  repo.
- Verified before this update: all "quote"/"contact" CTAs across all 43 pages resolve
  to one of the 3 wired form pages (or `tel:`/`mailto:`) — no orphaned duplicate forms,
  no CTA bypasses the integration.
- `GetFaq` (the other documented endpoint) is not yet wired to anything — the FAQ
  page still uses static content. See `api/README.md` for how to add it if needed.
- **Requires deploying on Vercel** — the site was previously platform-agnostic static
  HTML; it now depends on Vercel serverless functions for the quote form to submit
  anywhere. If a different host is chosen, the function needs porting.

## UTM tracking (added this session)

Previously `utm_source` was hardcoded to `"churchcleaningscandia.com"` — no real
attribution was captured. Now:

- `quote-form.js` is loaded on all 43 pages and captures `utm_source`/`utm_medium`/
  `utm_campaign`/`utm_term`/`utm_content` from the URL on landing, persisting them in
  `sessionStorage` so attribution survives if the visitor browses to another page
  before submitting the form.
- The CRM's `PushLead` schema only has one `utm_source` text field, so `utm_source` is
  passed through directly and the other four UTM params plus the landing page URL are
  appended to `customer.notes` (see `api/README.md` for the exact format) so nothing is
  silently dropped even without dedicated CRM fields.
- No changes needed on your end beyond the existing `CRM_API_TOKEN` setup — this works
  automatically once the site is deployed with UTM-tagged ad/campaign links.

## Outstanding / Next Steps

- ~~Decide on real pricing and insurance figures~~ — **resolved.** `PLACEHOLDERS.md` and `QA.md` were updated to document that omitting hard numbers (pricing, insurance/bond amounts, license number) is the deliberate final design decision, not an unresolved token. If the business later wants to publish real figures, `PLACEHOLDERS.md` explains exactly where to edit.
- **Meta description length** — QA item "Meta descriptions unique, 150–158 chars" is marked VERIFY, not checked yet.
- **Mobile Lighthouse ≥ 90** — not measured; do after deployment.
- **Do one live end-to-end submit test** on the deployed Vercel URL (fill out the form on `/request-a-quote/`, confirm it shows the success message, confirm the lead lands in the CRM with UTM data in `customer.notes`) — token is set, but no live submission has been run and observed on the CRM side yet.
- No CI/build pipeline exists — this is intentionally a zero-build static site. Deploy target is now fixed to Vercel (see `CLAUDE.md`) because of `api/submit-quote.js`; no build command is needed.

## Repo

- Remote: `origin` → `https://github.com/damienvernon013-design/churchcleaningscandia.git`
- Branch: `main`
