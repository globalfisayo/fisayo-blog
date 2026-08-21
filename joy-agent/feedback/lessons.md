# Joy Agent — accumulated judgment

This file is the distilled output of the **Human Feedback Database**
(`feedback/feedback-log.jsonl`). The Joy finder reads it at the start of
every run — this is the "Joy Agent Learns from Database" loop in the Project
Joy flowchart. The daily run updates the *Learned rules* section whenever new
human rejections reveal a pattern; the core rules only change when Fisayo or
Hebron says so.

## Core rules (from the Joy Agent spec — stable)

1. **Audience:** African immigrants at four stages — undergraduates
   (internships/placement years), fresh graduates (first role/graduate
   schemes), masters graduates (associate/rotational programmes), and young
   professionals with 1–3 years of experience. A role requiring 3+ years is
   out.
2. **Prestige bar:** knowledge-work roles only. The test: *would it appear on
   a graduate recruitment fair brochure at a top university?* Warehouse,
   retail floor, food service, security, delivery, and call-centre work never
   pass, whatever the employer's brand.
3. **Geography:** United States, United Kingdom, Canada, Australia,
   New Zealand, Ireland, South Africa — or truly location-less remote roles
   ("Remote – Unspecified").
4. **Visa discipline:** the sponsorship flag is evidence-based. "Yes" needs a
   verbatim quote from the listing. Never guess; "Not Mentioned" is the
   honest default. Explicit no-sponsorship listings are still surfaced (some
   of our audience already holds work rights) but flagged and ranked last.
5. **Source discipline:** company careers pages and LinkedIn only. Never an
   aggregator URL. Prefer the company's own application page. Never fabricate
   a listing — every record comes from a page actually fetched.
6. **Freshness:** live listings only. Anything with a passed deadline or that
   404s is dead weight and erodes trust in the site.

## Learned rules (from human feedback — grows over time)

*None yet. Rules appear here as the human reviewer approves/rejects queued
opportunities and patterns emerge from `feedback-log.jsonl`.*

## Operational learnings (from Checker rejections — the finder should apply these too)

- **2026-08-21 — analyst-band titles can hide senior requirements.** A
  Mastercard "FIU Analyst" role labelled Junior by the finder actually
  required 3–5 years of AML/CFT experience (even the "FIU Associate
  Analyst" tier below it asks 2–5). In compliance, risk, and finance
  functions, never infer "Junior/Entry" from the title alone — find the
  years-of-experience line, and if it can't be found, say so in `notes`
  instead of guessing the level.
- **2026-08-21 — careers-site index presence ≠ live.** Two Mastercard 2027
  Launch consulting-track reqs were still in the company's careers search
  index 3.5 months after a mirror feed recorded them removed (window
  2026-03-20 → 2026-05-01). Prefer recency signals (repost bumps,
  actively-hiring flags in currently-ingested feeds) over bare index
  presence, and note the strongest liveness evidence per listing.
