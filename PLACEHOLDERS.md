# PLACEHOLDERS.md — churchcleaningscandia.com

This file lists every token used in the site. A site is NOT READY TO LAUNCH while any {{token}} remains.

## Tokens in Use

| Token | Pages Using It | Value Needed |
|---|---|---|
| {{PRICE_LOW}} | /pricing/, /services/sanctuary-cleaning/, /services/fellowship-hall-cleaning/, /services/nursery-classroom-cleaning/, all 16 town×service pages, /resources/church-cleaning-cost/ | Low end of per-visit price range for this market (e.g. $95) |
| {{PRICE_HIGH}} | same as above | High end of per-visit price range for this market (e.g. $285) |
| {{INSURANCE_AMOUNT}} | /insured-and-bonded/ | General liability coverage amount (e.g. $1,000,000 per occurrence / $2,000,000 aggregate) |
| {{BOND_AMOUNT}} | /insured-and-bonded/ | Janitorial bond amount (e.g. $10,000) |
| {{LICENSE_NO}} | /insured-and-bonded/ | Insurance policy number or business licence number |

## Status

NOT READY TO LAUNCH — all tokens above must be replaced with real values before go-live.

## How to Replace

Search the entire site directory for `{{{{` and replace each instance with the correct value.
After replacement, run the QA checklist to confirm no tokens remain.
