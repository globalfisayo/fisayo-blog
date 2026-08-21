// Deterministic ingest of human verdicts from the Joy Review Queue.
//
// The queue lives at joy-agent/review/queue/*.json — one file per candidate
// opportunity, edited by the team in Pages CMS (verdict: pending | approve |
// reject, plus a rejectReason). This script is the "publish or learn" half of
// the human-in-the-loop quality filter from the Project Joy flowchart:
//
//   approve            → write src/data/opportunities/joy-<slug>.json
//                        (goes live on the next deploy) + ledger entry in
//                        joy-agent/approved/universe-queue.jsonl
//   reject + reason    → append the reason verbatim to
//                        joy-agent/feedback/feedback-log.jsonl (the Human
//                        Feedback Database the Joy Agent learns from)
//   reject, NO reason  → left in the queue untouched — the reason is what
//                        trains the agent, so it is required
//   pending            → left in the queue untouched
//
// Processed files move to joy-agent/review/processed/<YYYY-MM>/. The script
// is idempotent and safe to run any time: no queue files with actionable
// verdicts → no changes. It never overwrites an existing opportunity file
// (human edits to published cards always win).
//
// Run by .github/workflows/joy-review-ingest.yml on every push that touches
// the queue, and also by the Joy Agent's daily run as a belt-and-braces pass.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const QUEUE_DIR = path.join(ROOT, 'joy-agent/review/queue');
const PROCESSED_DIR = path.join(ROOT, 'joy-agent/review/processed');
const OPPS_DIR = path.join(ROOT, 'src/data/opportunities');
const LEDGER = path.join(ROOT, 'joy-agent/approved/universe-queue.jsonl');
const FEEDBACK_LOG = path.join(ROOT, 'joy-agent/feedback/feedback-log.jsonl');

const today = new Date().toISOString().slice(0, 10);

const slugify = (s) =>
  (s || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

const typesForLevel = (level) => {
  const types = ['Job'];
  if (/internship/i.test(level || '')) types.unshift('Internship');
  else if (/graduate scheme/i.test(level || '')) types.unshift('Graduate Program');
  return [...new Set(types)];
};

const describe = (q) => {
  const bits = [];
  if (q.level) bits.push(q.level);
  if (q.function) bits.push(q.function.toLowerCase());
  let s = bits.length ? `${bits.join(' ')} role` : 'Early-career role';
  if (q.audience) s += ` for ${q.audience.toLowerCase()}`;
  return `${s}.`.replace(/\s+/g, ' ');
};

if (!fs.existsSync(QUEUE_DIR)) {
  console.log('no queue directory — nothing to ingest');
  process.exit(0);
}

const summary = { published: 0, alreadyPublished: 0, rejected: 0, awaitingReason: 0, pending: 0, malformed: 0 };

for (const file of fs.readdirSync(QUEUE_DIR).filter((f) => f.endsWith('.json'))) {
  const full = path.join(QUEUE_DIR, file);
  let q;
  try {
    q = JSON.parse(fs.readFileSync(full, 'utf-8'));
  } catch {
    console.warn(`malformed queue file skipped: ${file}`);
    summary.malformed += 1;
    continue;
  }

  const verdict = String(q.verdict || 'pending').toLowerCase();

  if (verdict === 'approve') {
    const slug = `joy-${slugify(`${q.company}-${q.title}`)}`;
    const target = path.join(OPPS_DIR, `${slug}.json`);
    if (fs.existsSync(target)) {
      summary.alreadyPublished += 1;
    } else {
      const opp = {
        title: q.title,
        slug,
        applyUrl: q.applyUrl || q.listingUrl || null,
        types: typesForLevel(q.level),
        status: 'open',
        dateAdded: today,
        deadline: q.deadline || null,
        deadlineNote: q.deadline ? null : 'Check link for deadline',
        description: describe(q),
        coverImage: null,
        coverImageUrl: null,
        sponsors: ['Novola Charity Foundation', 'Fisayo.org'],
        company: q.company || null,
        location: q.location || null,
        visaSponsorship: q.visaSponsorship || 'Not Mentioned',
        source: 'joy-agent',
        sourceRef: q.joyId || null,
      };
      fs.mkdirSync(OPPS_DIR, { recursive: true });
      fs.writeFileSync(target, `${JSON.stringify(opp, null, 2)}\n`);
      summary.published += 1;
    }
    fs.appendFileSync(
      LEDGER,
      `${JSON.stringify({ ...q, humanVerdict: 'approved', humanReviewedOn: today, publishedOn: today })}\n`,
    );
    archive(full, file);
  } else if (verdict === 'reject') {
    const reason = String(q.rejectReason || '').trim();
    if (!reason) {
      // The reason IS the training data — without it the rejection cannot
      // teach the agent, so the item stays in the queue until one is added.
      summary.awaitingReason += 1;
      continue;
    }
    fs.appendFileSync(
      FEEDBACK_LOG,
      `${JSON.stringify({ date: today, id: q.joyId || null, company: q.company || null, title: q.title, reason, source: 'human' })}\n`,
    );
    summary.rejected += 1;
    archive(full, file);
  } else {
    summary.pending += 1;
  }
}

function archive(full, file) {
  const dir = path.join(PROCESSED_DIR, today.slice(0, 7));
  fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(full, path.join(dir, file));
}

console.log(JSON.stringify(summary));
// Signal to the workflow whether a deploy is needed.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `published=${summary.published}\n`);
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `changed=${summary.published + summary.alreadyPublished + summary.rejected}\n`,
  );
}
