# Joy run report — 2026-08-21 (pilot)

First-ever run, executed in the build session (the daily 06:00 UTC Routine
takes over from tomorrow, 2026-08-22).

## Numbers

| Stage | Count |
|---|---|
| Companies researched (v1 list order 1–5) | 5 — Booking Holdings, AirBnB, Mastercard, PepsiCo, Visa |
| Listings surfaced by the Joy finder | 31 |
| Passed the Checker Agent | 28 |
| Failed the Checker Agent | 3 (1 too-senior, 2 dead-link) |
| Queued for human review (`review/pending/2026-08-21.md`) | 25 (cap) |
| Overflow (checked, not queued) | 3 |
| Approved → universe queue | 0 (awaiting first human review) |

## Network mode: RESTRICTED (the run's defining fact)

The environment's egress proxy 403s every outbound page fetch (LinkedIn,
company careers sites, ATS boards, even a Wikipedia control). Web search
works. Both agents pivoted to search-index research per the prompts'
restricted-mode rules; all liveness verdicts are corroboration-based, no job
description was read, `descriptionRead: false` everywhere, and no visa flag
could rise to "Yes".

**Decision for Fisayo/Hebron:** to let Joy read job pages (real liveness
checks + on-page visa-sponsorship language — the heart of KR1), relax the
network policy for this Claude Code environment (claude.ai/code → this
environment's settings → network/domain policy), or move the Routine to an
environment with open egress. Until then the pipeline runs honestly in
snippet mode and the human reviewer's own browser is the final liveness
check.

## Per-company method outcomes

- **All five:** Method A (LinkedIn direct) blocked at the proxy; numeric
  company IDs still unknown for every company. Method C mostly surfaced
  stale LinkedIn postings; its main value was corroboration + two OpenTable
  URLs of record.
- **Booking Holdings** (9 surfaced / 9 passed): all roles live with brands —
  OpenTable Toronto internship cluster (Greenhouse), KAYAK associates
  (Ashby), Priceline Toronto (Workday). Checker repaired the AI Automation
  Intern from a LinkedIn fallback URL to its canonical Greenhouse page.
- **AirBnB** (3 / 3): evergreen US new-grad SWE reqs + one ML role;
  aggregator mirrors suggest US new-grad roles are no-sponsorship
  (OPT-accepted) — unverified, so flags stayed "Not Mentioned".
- **Mastercard** (9 / 6): 2027 Launch cycle live in ANZ, first US Summer
  2027 intern posting just opened. Checker killed 3: FIU Analyst
  (too-senior — 3–5 yrs AML required despite the junior-sounding title) and
  both consulting-track Launch reqs (closed 2026-05-01 per mirror feeds
  while the careers-site index still listed them).
- **PepsiCo** (10 / 10, of 22 total matching): Canada dominates (Fall 2026
  co-op wave + 2026/2027 New Grad programmes); first two US Summer 2027 MBA
  intern postings; one UK R&D associate (seniority unverified). US intern
  full wave expected to open ~Aug 25 — early September visits will be rich.
- **Visa** (0): between cycles — every indexed early-career REF belongs to
  the closed 2025–26 cycle; the finder correctly returned zero rather than
  stale listings. 2027 cycle opens Aug–Sep; the rotation brings Visa back
  ~mid-September, which fits perfectly.

## Feedback loop activity

- 3 checker rejections appended to `feedback/feedback-log.jsonl` (first
  entries in the Human Feedback Database).
- 2 operational lessons distilled into `feedback/lessons.md`: (1) analyst-
  band titles in compliance/finance can hide 3–5-year requirements — never
  infer level from title; (2) careers-site index presence is not liveness —
  weigh recently-ingested mirror feeds. The checker prompt also gained the
  index-staleness caution permanently.
- Human verdicts ingested: none yet (first run; digest just published).

## Priority actions for the next runs

1. **Ingest human verdicts** from `review/pending/2026-08-21.md` (Step 1 of
   the runbook) — first approvals will seed `approved/universe-queue.jsonl`.
2. If egress opens: re-verify this run's 25 queued items (liveness +
   on-page visa language; specific debts: PepsiCo US MBA interns' probable
   right-to-work line, Leicester R&D seniority, Mastercard R-278974
   experience bar, OpenTable term dates + the general SWE internship's
   canonical Greenhouse URL).
3. Tomorrow's batch: companies 6–13 (PayPal, Otis Worldwide, Dell
   Technologies, Philip Morris International, Diageo, Reckitt Benckiser
   Group, Atlas Copco, Apple).
4. Mid-September: Visa + PepsiCo + Mastercard cycles all open — expect heavy
   weeks; `state.json` notes carry the exact timing intel per company.
