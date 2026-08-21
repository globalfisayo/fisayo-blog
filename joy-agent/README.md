# Project Joy — the Joy Agent & Checker Agent

**Joy** — from AYO in fis**AYO**.org — brings our clients JOY: **J**uicy
**O**pportunities **Y**earound. This directory is the working implementation
of the grey box in the *Process Flow for Project Joy* flowchart (owned by
Hebron): an autonomous daily pipeline that finds, verifies, and queues
career-transforming early-career jobs at Forbes Global 2000 companies for
African immigrants — with a human quality gate and a feedback loop that
makes the agent's judgment sharper every week.

```
                        ┌─────────────────────────────────────────── the grey box ──┐
                        │                                                           │
  companies-v1.json ──▶ │  JOY FINDER ──▶ CHECKER AGENT ──▶ human review (quality   │ ──▶ approved/
  (200 pilot            │  finds live      re-verifies        filter, in review/)   │     universe-queue.jsonl
   companies,           │  early-career    every link,           │ NO               │         │
   8/day rotation)      │  listings        level, country,       ▼                  │         ▼ UNIVERSE step
                        │      ▲           prestige, visa    feedback-log.jsonl     │  src/data/opportunities/
                        │      │           evidence          (Human Feedback DB)    │  joy-<slug>.json → deploy
                        │      └── reads lessons.md ◀── distilled from ──┘          │  → LIVE at fisayo.org/joy
                        │        ("Joy Agent Learns from Database")                 │  (humans fix anything via
                        └───────────────────────────────────────────────────────────┘   Pages CMS)
```

## How it runs

A **daily scheduled Routine** (06:00 UTC) starts a fresh Claude session that
checks out this branch and follows [`RUNBOOK.md`](RUNBOOK.md):

1. **Ingest verdicts** you left in `review/pending/*.md` → approvals go to
   the universe queue, rejections (with your reasons, verbatim) go to the
   Human Feedback Database, and recurring patterns are distilled into
   `feedback/lessons.md`.
2. **Select the next batch** — 8 companies per day from the 200-company
   pilot list (`data/companies-v1.json`, from the "For v1" sheet of the
   Forbes 2000 Globality workbook), full cycle every 25 days.
3. **Joy finder** (`prompts/joy-finder.md`) — one research agent per
   company, in parallel: LinkedIn direct, company careers page, and
   search-to-LinkedIn, then level / prestige / country filters and
   evidence-based visa-sponsorship flagging.
4. **Checker Agent** (`prompts/checker.md`) — adversarial re-verification
   of every finding: dead links, seniority creep, wrong countries,
   non-prestige roles, unsupported visa claims, duplicates against
   everything ever surfaced (`data/seen-listings.json`).
5. **Queue for review** — survivors land in `review/pending/<date>.md`
   ending in `**Verdict:** PENDING`, capped at 25/day, sponsorship-first.
6. **Commit + push** to this branch — the site only deploys from `main`,
   so the pipeline never touches the live blog.

## Directory map

| Path | What it is (flowchart element) |
|---|---|
| `RUNBOOK.md` | The daily procedure the scheduled session follows |
| `config.json` | Batch size, review cap, staleness threshold |
| `prompts/joy-finder.md` | JOY Agent Finds Relevant Opportunities |
| `prompts/checker.md` | Checker Agent REVIEWS Relevant Opportunities |
| `data/companies-v1.json` | Pilot list — 200 companies, curated order |
| `data/companies-full.json` | Expansion pool — all 452 enriched companies |
| `data/source/` | Original Forbes 2000 Globality workbook (provenance) |
| `data/state.json` | Rotation cursor + per-company visit history |
| `data/seen-listings.json` | Everything ever surfaced (dedupe registry) |
| `review/` | Human-in-the-loop quality filter (see its README) |
| `feedback/feedback-log.jsonl` | Human Feedback Database — why things didn't pass |
| `feedback/lessons.md` | Distilled judgment the finder reads every run |
| `approved/universe-queue.jsonl` | Validated hand-off to the Universe Agent (KR1) |
| `runs/<date>/` | Per-run artifacts: raw + checked findings, run report |

## Operating it

- **Review the day's finds:** open `review/pending/<date>.md` on this
  branch, flip `PENDING` → `APPROVE` or `REJECT — reason`. That's the whole
  human workflow. (Details in `review/README.md`.)
- **Change the pace:** edit `batchSize` / `reviewQueueCap` in
  `config.json` — takes effect next run.
- **Expand the universe:** `data/companies-full.json` holds 252 more
  companies. Promote rows into `companies-v1.json` (verify any
  UNVERIFIED-flagged URLs first), or hand Claude a new list to import
  alongside `data/source/`.
- **Pause it:** disable the "Joy Agent — daily opportunity run" Routine in
  claude.ai/code (or ask Claude to). Delete nothing.
- **The live site (O2):** approved opportunities are published by the
  pipeline itself as JSON files in `src/data/opportunities/` and rendered
  at **fisayo.org/joy** (see `vite.joy.config.js` and `src/joy/`). Humans
  edit any card — fix an image, correct a deadline, close an entry — in
  Pages CMS (app.pagescms.org → Opportunities); saving commits and
  redeploys automatically. The pipeline never overwrites a file that
  already exists, so human edits always win.
