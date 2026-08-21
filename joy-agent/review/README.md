# Human review — the quality filter

This folder is the **"Does the opportunity pass our quality filter? (human
in the loop reviewer)"** diamond from the Project Joy flowchart.

## How to review (Fisayo / Hebron)

Each daily run writes one digest to `pending/<date>.md`. Every opportunity
block ends with a verdict line:

```
**Verdict:** PENDING
```

Edit that line — right in the GitHub web UI is fine (open the file on branch
`claude/joy-agent-visa-jobs-y06ee0`, click the pencil, commit to the same
branch):

- Approve → `**Verdict:** APPROVE`
- Reject → `**Verdict:** REJECT — followed by your reason`

The reason after REJECT matters: it is written verbatim into the Human
Feedback Database (`../feedback/feedback-log.jsonl`) and is what the Joy
Agent learns from. "REJECT — this is a sales quota role dressed up as a
graduate scheme" teaches; a bare "REJECT" doesn't.

You can also just tell Claude in any session ("approve JOY-2026-08-21-003,
reject 005 because …") and it will apply the edits for you.

The next daily run ingests your verdicts automatically:

- **APPROVE** → the full record is appended to
  `../approved/universe-queue.jsonl`, the validated hand-off the Universe
  Agent publishes to fisayo.org/opportunities.
- **REJECT** → logged to the feedback database with your reason; recurring
  patterns get distilled into `../feedback/lessons.md`, which the finder
  reads before every search.
- Files with no PENDING items left move to `processed/`.

## Digest block format (written by the run, one per listing)

```
### JOY-2026-08-21-001 — Mastercard: Software Engineer I, New Grad
- Level: Entry-level · Function: Technology & Engineering
- Audience: University graduates, Masters graduates
- Location: Toronto, Canada
- Visa: Not Mentioned
- Apply: https://… (Company Website)
- Listing: https://…
- Posted: 2026-08-14 · Deadline: — · Found via: careers-page
- Checker: pass — live, entry-level confirmed, knowledge-work
- Warnings: none

**Verdict:** PENDING
```

Listings are ordered: visa-sponsorship "Yes" first, then "Not Mentioned"
(most recent first), explicit "No – Right to Work Required" last (kept
because part of our audience already holds work rights — reject them if you
want them gone, and say so, and Joy will learn).
