# Contact / Quote API

The site is static HTML with one exception: `api/submit-quote.js`, a Vercel serverless
function that proxies the quote form to the CRM-QM `PushLead` endpoint.

## Why a proxy exists

`PushLead` requires a Bearer token. This site has no server, and anything shipped in
client-side JS is visible via view-source — so the token cannot live in the browser or
in this repo. The serverless function holds the token as a server-side environment
variable and is the only thing that ever calls the CRM directly.

## Flow

1. `quote-form.js` is loaded on **every page** (not just the pages with a form) so it
   can capture `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` from
   the URL on first landing and persist them in `sessionStorage` — a visitor may land
   on a service-area or resource page from an ad and only submit the form later, on a
   different page, so capture can't be limited to the form pages.
2. On submit, it intercepts the quote form and POSTs
   `{ name, org, phone, sqft, notes, utm, page_url }` as JSON to `/api/submit-quote`,
   where `utm` is whatever was captured in step 1 and `page_url` is the page the form
   was submitted from.
3. `api/submit-quote.js` validates the payload, maps it into the CRM's expected
   `PushLead` shape (industry code 23 = church/faith facility cleaning, zip defaulted
   to Scandia, MN 55073 since the form doesn't collect one), and forwards it to
   `https://thequotemasters.com/crm_api/api.php?action=push_lead` with the
   `Authorization: Bearer <token>` header attached server-side.
4. The function returns `{ success: true }` or an error; the form shows an inline
   status message.

## UTM handling

The CRM's `PushLead` payload only has a single `utm_source` text(255) field — there's
no schema support for medium/campaign/term/content. To avoid silently dropping that
data:

- `utm_source` is passed through directly to the CRM's `utm_source` field (falls back
  to `"churchcleaningscandia.com"` if the visit had no UTM params at all).
- `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, and the landing page URL are
  appended to `customer.notes` as `UTM: utm_medium=... utm_campaign=...` and
  `Landing page: https://...` so a human reviewing the lead in the CRM can still see
  full attribution, even though there's no dedicated field for it.
- If the CRM's schema is later extended with more UTM fields, update
  `api/submit-quote.js` to map them directly instead of folding into notes.

## Required environment variable

| Name | Where | Value |
|---|---|---|
| `CRM_API_TOKEN` | Vercel project → Settings → Environment Variables (Production + Preview) | The Bearer token from CRM-QM API Documentation. **Never commit this value.** |

Set it via the Vercel dashboard or CLI:

```bash
vercel env add CRM_API_TOKEN
```

`.env` / `.env.local` are gitignored if you want a local copy for `vercel dev`.

## GetFaq endpoint

`GET https://thequotemasters.com/crm_api/api.php?action=get_lead_faq` is documented
alongside `PushLead` but nothing on this site consumes it yet. If the FAQ page should
pull live content from the CRM instead of the static copy in `faq/index.html`, add a
second proxy function (`api/get-faq.js`) following the same pattern — do not call it
directly from client JS with the token attached.

## Local testing

```bash
npm i -g vercel
vercel dev
```

This serves the static files and the `/api/*` functions together on localhost, reading
`CRM_API_TOKEN` from `.env.local`.

## Deployment

Deploy this directory to Vercel as-is (`vercel --prod` or connect the GitHub repo in
the Vercel dashboard). `vercel.json` sets clean URLs and trailing slashes to match the
existing `/directory/index.html` routing structure. No build command is needed — the
static files are served directly and `api/submit-quote.js` is auto-detected as a
serverless function.
