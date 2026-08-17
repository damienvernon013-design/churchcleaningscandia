# Contact / Quote API

The site is static HTML with one exception: `api/submit-quote.js`, a Vercel serverless
function that proxies the quote form to the CRM-QM `PushLead` endpoint.

## Why a proxy exists

`PushLead` requires a Bearer token. This site has no server, and anything shipped in
client-side JS is visible via view-source — so the token cannot live in the browser or
in this repo. The serverless function holds the token as a server-side environment
variable and is the only thing that ever calls the CRM directly.

## Flow

1. `quote-form.js` (loaded on `/`, `/contact/`, `/request-a-quote/`) intercepts the
   quote form submit, and POSTs `{ name, org, phone, sqft, notes }` as JSON to
   `/api/submit-quote`.
2. `api/submit-quote.js` validates the payload, maps it into the CRM's expected
   `PushLead` shape (industry code 23 = church/faith facility cleaning, zip defaulted
   to Scandia, MN 55073 since the form doesn't collect one), and forwards it to
   `https://thequotemasters.com/crm_api/api.php?action=push_lead` with the
   `Authorization: Bearer <token>` header attached server-side.
3. The function returns `{ success: true }` or an error; the form shows an inline
   status message.

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
