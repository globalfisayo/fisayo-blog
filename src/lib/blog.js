// Blog posts live as JSON files in src/data/posts/ — one file per post.
// Edit them visually with Pages CMS (see .pages.yml in the repo root) or by hand.
//
// Two access paths keep the site fast as posts pile up:
//  - `postsIndex` is a lightweight metadata list (NO article body) used by
//    listing pages, the header dropdown, and related-post cards.
//  - `postLoaders` lazy-loads a single post's full JSON (including the body)
//    only when someone opens that post. Each post is its own code-split chunk.
import postsIndex from 'virtual:posts-index';

// Import each post as raw text (not build-parsed JSON) so a single malformed
// file can't fail the whole build — it's parsed at runtime inside a try/catch.
const postLoaders = import.meta.glob('../data/posts/*.json', {
  query: '?raw',
  import: 'default',
});

// Map each post's file basename to its lazy loader so we can fetch one post.
const loaderByFile = Object.fromEntries(
  Object.entries(postLoaders).map(([filePath, loader]) => [
    filePath.split('/').pop().replace(/\.json$/, ''),
    loader,
  ]),
);

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1200&auto=format&fit=crop';

// Root-relative paths (e.g. "/uploads/photo.jpg" written by the CMS) need the
// Vite base prefix so they resolve when the site is served from a subpath.
// External URLs (https://...) and empty values pass through untouched.
const withBase = (p) =>
  p && p.startsWith('/') ? `${import.meta.env.BASE_URL}${p.slice(1)}` : p;

const resolveContentPaths = (html) =>
  html
    ? html.replaceAll(/(src|href)="\/uploads\//g, `$1="${import.meta.env.BASE_URL}uploads/`)
    : html;

// Allowlist link schemes: only http(s), mailto, and site-relative ("/...")
// links pass. A pasted `javascript:` or `data:` URL fails the required prefix
// and is rejected, so it can never run as script in an href/src. An allowlist
// (not a blocklist) means scheme obfuscation can't sneak past it.
const safeUrl = (u) => {
  if (!u) return '';
  const cleaned = String(u).trim();
  return /^(https?:\/\/|mailto:|\/)/i.test(cleaned) ? cleaned : '';
};

// Parse date-only strings ("2026-05-15") as local midnight — a bare ISO date
// is treated as UTC and would display one day early west of UTC.
const parsePostDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

const byDateDesc = (a, b) =>
  parsePostDate(b.publication_date) - parsePostDate(a.publication_date);

export function formatPostDate(dateStr, options = { month: 'long', day: 'numeric', year: 'numeric' }) {
  if (!dateStr) return '';
  return parsePostDate(dateStr).toLocaleDateString('en-US', options);
}

export function getAllCategories() {
  return ['All', ...new Set(getAllPosts().map((post) => post.category).filter(Boolean))];
}

export function getAllPosts(category) {
  const posts = category && category !== 'All'
    ? postsIndex.filter((post) => post.category === category)
    : [...postsIndex];
  return posts.sort(byDateDesc);
}

export function getRecentPosts(count = 5) {
  return getAllPosts().slice(0, count);
}

// Related posts are picked automatically from the metadata index: same category
// first (newest first), padded with the newest posts overall.
function getRelatedPosts(slug, category) {
  const others = getAllPosts().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === category);
  const rest = others.filter((p) => p.category !== category);
  return [...sameCategory, ...rest].slice(0, 3);
}

// Loads a single post's full content on demand. Returns null only when the slug
// doesn't exist. If the post's chunk fails to load (e.g. a stale cache after a
// redeploy, or a network blip), we fall back to the metadata so the page still
// renders — the body area shows an "unavailable" message instead of hanging.
export async function loadPost(slug) {
  const meta = postsIndex.find((p) => p.slug === slug);
  if (!meta) return null;

  let data = meta;
  const loader = loaderByFile[meta.__file];
  if (loader) {
    try {
      data = JSON.parse(await loader());
    } catch {
      data = meta;
    }
  }

  return {
    ...data,
    slug,
    id: slug,
    content: resolveContentPaths(data.content),
    pdf_url: withBase(data.pdf_url),
    relatedPosts: getRelatedPosts(slug, meta.category),
  };
}

export function getPostImageUrl(post) {
  // An externally-hosted image link takes priority, then an uploaded image,
  // then the default fallback. Each candidate is scheme-checked.
  return (
    safeUrl(post?.featured_image_url) ||
    safeUrl(withBase(post?.featured_image)) ||
    FALLBACK_IMAGE
  );
}

// The best downloadable file link for a post: an uploaded file if present,
// otherwise an externally-hosted link the editor pasted in. Both are
// scheme-checked so a malicious pasted URL can't run as script.
export function getPostAttachmentUrl(post) {
  return safeUrl(post?.pdf_url) || safeUrl(post?.attachment_url) || '';
}
