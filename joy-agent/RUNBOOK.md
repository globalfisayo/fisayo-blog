# Joy Agent — Daily Run RUNBOOK

You are running the daily Project Joy pipeline for fisayo.org. This file is
the complete procedure; follow it top to bottom. Everything lives under
`joy-agent/` in the `fisayo-blog` repo. Paths below are relative to
`joy-agent/`.

**The picture of success:** by the end of the run you have (1) processed any
human review verdicts left since the last run, (2) researched the next batch
of companies from the pilot list, (3) checker-verified every finding,
(4) queued the survivors for human review, (5) updated state, and
(6) committed and pushed everything. Validated + human-approved listings
accumulate in `approved/universe-queue.jsonl` for the Universe Agent to
publish to fisayo.org/opportunities.

## Step 0 — Setup

1. Work on branch **`claude/joy-agent-visa-jobs-y06ee0`** (the Joy Agent
   working branch):
   - `git fetch origin claude/joy-agent-visa-jobs-y06ee0` — if it exists,
     check it out and `git pull origin claude/joy-agent-visa-jobs-y06ee0`.
   - If it no longer exists on origin (e.g. deleted after a merge),
     recreate it from the default branch: `git checkout -B
     claude/joy-agent-visa-jobs-y06ee0 origin/main`.
   - If `joy-agent/` is missing on the checked-out branch, stop and report —
     do not improvise.
2. Read `config.json` (batch size, caps) and `data/state.json` (cursor).
3. Today's date in YYYY-MM-DD is `runDate` throughout.
4. **Network mode check:** WebFetch one well-known URL (e.g.
   `https://example.com`). If it comes back EGRESS_BLOCKED / proxy 403, the
   environment blocks outbound browsing: finders and checkers will operate
   in restricted-network mode (their prompts explain it — search-only,
   `descriptionRead: false`, no "Yes" visa flags). Say so in the run report
   and the final summary; the pipeline still runs.

## Step 1 — Ingest human verdicts (the human-in-the-loop quality filter)

For every file in `review/pending/*.md`:

1. Scan each opportunity block (headed `### JOY-…`) for its
   `**Verdict:** …` line.
2. **`APPROVE`** → find the listing's full record in that run's
   `runs/<date>/checked-findings.json` (match by the JOY id) and append it
   as one line to `approved/universe-queue.jsonl`, adding
   `"humanVerdict": "approved"` and `"humanReviewedOn": "<runDate>"`.
   Update its entry in `data/seen-listings.json` to `"status": "approved"`.
3. **`REJECT — <reason>`** → append to `feedback/feedback-log.jsonl`:
   `{"date": runDate, "id": "<JOY id>", "company": …, "title": …,
   "reason": "<the human's reason verbatim>", "source": "human"}`.
   Update seen-listings status to `"rejected"`.
4. **`PENDING`** → leave in place. If the file is older than 14 days, note
   the backlog in today's run report.
5. When a file has no PENDING verdicts left, `git mv` it to
   `review/processed/`.

Then **update the lessons** (the "Joy Agent Learns from Database" loop):
re-read `feedback/feedback-log.jsonl`. If new human rejections reveal a
pattern (two or more rejections with a common cause, or one rejection
stating a general rule), add or sharpen a bullet in the *Learned rules*
section of `feedback/lessons.md`, quoting the feedback that produced it.
Never edit the *Core rules* section. Be conservative — one idiosyncratic
rejection is data, not yet a rule.

## Step 2 — Select today's batch

1. From `data/state.json` take `cursor`; from `config.json` take
   `batchSize`.
2. Today's batch = the next `batchSize` companies from
   `data/companies-v1.json` by `listOrder`, starting at `cursor + 1`. Wrap
   to `listOrder` 1 after the end of the list and increment `cycle`.
3. A company whose previous visit errored out entirely (see Step 3) is
   simply picked up again when the rotation returns to it — do not build
   special retry queues.

## Step 3 — Joy finder (JOY Agent Finds Relevant Opportunities)

For each company in the batch, dispatch one research subagent
(`general-purpose`), **all in parallel in a single message**. Each agent's
prompt: instruct it to read `joy-agent/prompts/joy-finder.md` and execute
the section between PROMPT BEGINS/ENDS with that company's inputs
(`name`, `linkedinUrl`, `careersPageUrl` from `data/companies-v1.json`),
`runDate`, and the current `feedback/lessons.md` as `{{lessons}}`. If
`state.json` has a previous visit note for the company
(`companiesVisited[id].note` — cycle timing, where they post, sponsorship
posture), include it as extra context. The agent's final message must be
only the output JSON.

- Parse each agent's JSON (strip any stray prose around it). If an agent
  returns unparseable output, retry it once; if it fails again, record the
  company as `"error"` in the run data and move on.
- Save each company's result as `runs/<runDate>/raw/<company-id>.json`,
  plus `runs/<runDate>/batch.json`: `{"runDate": …, "batch": [company
  ids], "errors": [{company, note}]}`.

## Step 4 — Checker (Checker Agent REVIEWS Relevant Opportunities)

For each company **with at least one listing**, dispatch one checker
subagent (`general-purpose`), all in parallel in a single message. Each
checker's prompt: instruct it to read `joy-agent/prompts/checker.md` and
execute the PROMPT section with `{{findingsJson}}` = the contents of
`runs/<runDate>/raw/<company-id>.json` (tell the checker to Read that file
rather than pasting it), and `{{seenListings}}` = that company's entries
from `data/seen-listings.json` (each as `{url, title, location}`; `[]` if
none — paste these inline, they are small).

- Parse each checker's JSON; same retry-once rule. Save it as
  `runs/<runDate>/checked/<company-id>.json`.
- Assign each **passed** listing a stable id: `JOY-<runDate>-NNN` (NNN =
  001, 002, … in priority order across the whole run: visa "Yes" first,
  then "Not Mentioned" by most recent posting, "No – Right to Work
  Required" last).
- `runs/<runDate>/checked-findings.json` = the index: per-company
  `{passed, failed, file}` counts plus a `joyIds` map (`joyId → {company,
  title, listingUrl, file, queued}`) — verdict ingestion (Step 1) resolves
  a JOY id through this map to the listing's full record in the
  per-company checked file (match by title + listingUrl).

## Step 5 — Route the results

1. **Checker failures** → append each to `feedback/feedback-log.jsonl` as
   `{"date": runDate, "company": …, "title": …, "reason": failReason + ": "
   + failDetail, "source": "checker"}`. (Duplicates: skip logging — they are
   working-as-intended, not lessons.)
2. **Passed listings** → these go to human review:
   - Cap the day's queue at `config.reviewQueueCap` in the same priority
     order as Step 4. Anything over the cap stays in checked-findings
     (it is not lost) and is counted as overflow in the run report.
   - Write `review/pending/<runDate>.md` in the format defined in
     `review/README.md`, one block per listing, each ending
     `**Verdict:** PENDING`.
   - If zero listings passed, write no review file — note it in the report.
3. **Register every surfaced listing** (passed AND failed) in
   `data/seen-listings.json`, keyed by normalized listing URL (lowercase
   host, strip tracking params/fragments), as `{company, title, location,
   joyId (if passed), firstSeen: runDate, status:
   "pending"|"checker-failed"}`.
4. **Update `data/state.json`**: `cursor` = listOrder of the last company
   in today's batch, `lastRunDate` = runDate, `cycle` if wrapped, and for
   each batch company `companiesVisited[id] = {lastVisit: runDate,
   listingsSurfaced: n, note}`.
5. Write `runs/<runDate>/run-report.md`: batch covered, per-company method
   outcomes (from `methodsAttempted` — this is how we notice e.g. LinkedIn
   being consistently walled), counts (found → passed checker → queued →
   overflow), checker corrections worth reading, verdicts ingested in
   Step 1, review backlog age, and any errors.

## Step 6 — Commit and push

1. `git add joy-agent/` only. Never touch files outside `joy-agent/`.
2. Commit message: `Joy run <runDate>: <batch first>–<batch last>, N
   surfaced, M to review` (+ a second line for verdicts ingested, if any).
3. `git push -u origin claude/joy-agent-visa-jobs-y06ee0`. On network
   failure retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).
4. Do NOT open a pull request.

## Step 7 — Report

End with a short summary (it becomes the run notification): companies
covered, listings surfaced / passed / queued for review, verdicts ingested,
where to review (`joy-agent/review/pending/<runDate>.md` on the working
branch), and anything needing Fisayo/Hebron's attention.

## Hard rules

- Never fabricate a listing, a URL, or visa language. An empty day is a
  valid day.
- Never let an unverified "Yes" visa flag through — that is the one claim
  our audience will act on most.
- Stay inside `joy-agent/`; never modify the blog site, never push to
  `main`, never force-push.
- If the repo state contradicts this runbook (missing files, malformed
  JSON), fix forward only what today's run needs, note it in the run
  report, and continue — or stop and report if the damage is beyond that.
