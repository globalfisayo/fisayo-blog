# Universe hand-off — validated opportunities

`universe-queue.jsonl` is the output of the whole grey box in the Project
Joy flowchart, and the fulfilment of Hebron's KR1: *"Joy Agent 1.0 sends
validated relevant visa sponsored jobs to Universe Agent who uploads the
opportunities to our site."*

Every line is one opportunity that has passed all three gates:

1. **Joy finder** — found live on the company's careers page or LinkedIn
2. **Checker Agent** — link verified live, level/country/prestige filters
   re-checked against the actual page, visa flag audited against page text
3. **Human reviewer** — explicitly approved in `../review/`

The Universe Agent is now a step of this same pipeline (RUNBOOK Step 1b):
each daily run converts unpublished lines into site files at
`src/data/opportunities/joy-<slug>.json` — which is what fisayo.org/joy
renders — and stamps the line with `"publishedOn": "YYYY-MM-DD"`. Lines are
never deleted; this file is the permanent ledger of everything the grey box
has shipped.

## Record schema (one JSON object per line)

```json
{
  "joyId": "JOY-2026-08-21-001",
  "company": "Mastercard",
  "companyHqCountry": "United States",
  "companyForbesRank": 212,
  "industry": "Financial Services",
  "title": "Software Engineer I, New Grad",
  "level": "Entry-level",
  "function": "Technology & Engineering",
  "audienceFit": ["University graduates", "Masters graduates"],
  "location": { "city": "Toronto", "country": "Canada" },
  "listingUrl": "https://…",
  "applicationUrl": "https://…",
  "applicationSource": "Company Website",
  "visaSponsorshipMentioned": "Not Mentioned",
  "visaEvidence": null,
  "postedDate": "2026-08-14",
  "deadline": null,
  "foundVia": "careers-page",
  "foundOn": "2026-08-21",
  "checkerWarnings": [],
  "humanVerdict": "approved",
  "humanReviewedOn": "2026-08-22"
}
```

`visaSponsorshipMentioned` is one of `"Yes"` (with verbatim `visaEvidence`
quote), `"No – Right to Work Required"`, or `"Not Mentioned"`. Nothing
reaches this file with an unverified "Yes".
