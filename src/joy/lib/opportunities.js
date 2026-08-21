// Opportunities live as JSON files in src/data/opportunities/ — one file per
// opportunity. Humans edit them visually with Pages CMS (see .pages.yml);
// the Joy Agent pipeline writes them automatically (see joy-agent/RUNBOOK.md).
// This module mirrors src/lib/blog.js so both apps read data the same way.
import oppsIndex from 'virtual:opportunities-index';

// Allowlist link schemes — a pasted `javascript:` or `data:` URL can never
// end up in an href. Same rule as the blog.
const safeUrl = (u) => {
  if (!u) return '';
  const cleaned = String(u).trim();
  return /^(https?:\/\/|mailto:|\/)/i.test(cleaned) ? cleaned : '';
};

// Root-relative upload paths (e.g. "/uploads/x.jpg" written by the CMS) are
// served by the BLOG app's directory — uploads deploy once, under /blog/.
const withUploadsBase = (p) =>
  p && p.startsWith('/') ? `https://fisayo.org/blog${p}` : p;

// Parse date-only strings as local midnight (a bare ISO date is treated as
// UTC otherwise and displays one day early west of UTC).
const parseDate = (dateStr) => (dateStr ? new Date(`${dateStr}T00:00:00`) : null);

export function formatDate(dateStr, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const d = parseDate(dateStr);
  return d ? d.toLocaleDateString('en-US', options) : '';
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// An opportunity is effectively closed when a human marked it closed OR its
// deadline has passed — nobody should click Apply into a dead page. (The
// deadline day itself still counts as open.)
export function effectiveStatus(opp) {
  if (opp.status === 'closed') return 'closed';
  const deadline = parseDate(opp.deadline);
  if (deadline && deadline < startOfToday()) return 'closed';
  return 'open';
}

export function daysUntilDeadline(opp) {
  const deadline = parseDate(opp.deadline);
  if (!deadline) return null;
  return Math.round((deadline - startOfToday()) / 86400000);
}

const byNewestAdded = (a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);

export function getAllOpportunities() {
  return [...oppsIndex]
    .map((opp) => ({
      ...opp,
      applyUrl: safeUrl(opp.applyUrl),
      coverSrc:
        safeUrl(opp.coverImageUrl) || safeUrl(withUploadsBase(opp.coverImage)) || '',
      effectiveStatus: effectiveStatus(opp),
    }))
    .sort(byNewestAdded);
}

export function getAllTypes(opps) {
  const counts = new Map();
  for (const opp of opps) {
    for (const t of opp.types || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  // Most-used types first so the filter row leads with what matters.
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function filterOpportunities(opps, { type, status, query }) {
  const q = (query || '').trim().toLowerCase();
  return opps.filter((opp) => {
    if (type && type !== 'All' && !(opp.types || []).includes(type)) return false;
    if (status && status !== 'all' && opp.effectiveStatus !== status) return false;
    if (q) {
      const haystack = `${opp.title} ${(opp.types || []).join(' ')} ${opp.company || ''} ${
        opp.location || ''
      } ${opp.description || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
