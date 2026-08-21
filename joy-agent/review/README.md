# Human review — the quality filter, in Pages CMS

This folder is the **"Does the opportunity pass our quality filter? (human
in the loop reviewer)"** diamond from the Project Joy flowchart. The review
itself happens in **Pages CMS** — no git, no markdown, no code.

## How to review (Fisayo / Hebron / teammates)

1. Go to **app.pagescms.org → fisayo-blog → Joy Review Queue**. Every card
   the Joy Agent found and the Checker Agent verified is an entry here,
   newest first.
2. Open an entry. You'll see everything you need: level, function,
   location, visa flag, the Checker's verification notes, and the apply
   link (click it — your browser is the final liveness check).
3. Set **YOUR VERDICT**:
   - **approve** → save. Within ~2 minutes it is LIVE on
     [fisayo.org/joy](https://fisayo.org/joy/). Any field you corrected
     before approving (a location, a title) is published with your
     correction.
   - **reject** → fill in **Why rejected?** and save. The entry leaves the
     queue and your reason goes verbatim into the Human Feedback Database
     (`../feedback/feedback-log.jsonl`) — the Joy Agent reads the distilled
     lessons before every search, so *"this is a sales quota role dressed
     up as a graduate scheme"* genuinely trains it. A rejection without a
     reason stays in the queue: the reason is the training data.
   - leave **pending** to decide later.

You can also just tell Claude in any session ("approve JOY-2026-08-21-004,
reject 007 because …") and it applies the verdicts for you.

## What happens under the hood

- Each queue entry is a JSON file in `queue/`. Saving in the CMS commits to
  `main`, which triggers `.github/workflows/joy-review-ingest.yml`.
- The workflow runs `scripts/joy-ingest-verdicts.mjs` (deterministic, no
  AI): approvals become `src/data/opportunities/joy-<slug>.json` + a line
  in `../approved/universe-queue.jsonl` (the permanent ledger), rejections
  append to the feedback log. Processed entries move to `processed/`.
- Approvals trigger a site deploy immediately; the Joy Agent's daily run
  also re-runs the same script as a safety net, then distills any new
  rejection reasons into `../feedback/lessons.md` — the learning loop.

Queue ordering note: the Joy Agent files listings visa-sponsorship-first;
explicit "No – Right to Work Required" listings are still queued (part of
our audience already holds work rights) — reject them with a reason if you
want Joy to stop bringing them.
