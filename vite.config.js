import path from 'node:path';
import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const POSTS_DIR = path.resolve(__dirname, 'src/data/posts');
const VIRTUAL_ID = 'virtual:posts-index';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;
const SITE_BLOG_URL = 'https://fisayo.org/blog/';

// Builds a lightweight index of every blog post WITHOUT the heavy `content`
// field, exposed as `virtual:posts-index`. Listing pages, the header dropdown,
// and related-post cards read this small index, while full post bodies are
// lazy-loaded one at a time on the post page. This keeps the bundle flat as the
// number of posts grows (50, 200, more) instead of shipping every article on
// every page.
function buildIndex() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      let raw;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8'));
      } catch (err) {
        // One malformed post must not take down the whole site build. Warn
        // with the offending filename and skip it; the other posts still ship.
        console.warn(
          `\n[fisayo-posts-index] Skipping "${file}" — it is not valid JSON ` +
            `and was left out of the blog. Fix it and re-save. (${err.message})\n`,
        );
        return null;
      }
      const base = file.replace(/\.json$/, '');
      const slug = raw.slug || base;
      // Drop `content` — the one large field — from the index.
      const { content, ...meta } = raw;
      return { ...meta, slug, id: slug, __file: base };
    })
    .filter(Boolean);
}

function postsIndexPlugin() {
  return {
    name: 'fisayo-posts-index',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        return `export default ${JSON.stringify(buildIndex())};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(POSTS_DIR) && file.endsWith('.json')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }
    },
    // After every build, also emit:
    //  - posts-index.json — read by WordPress (mu-plugin) to render the
    //    "Latest Insights" dropdown in the main-site navigation.
    //  - sitemap.xml — so search engines can find the blog pages, which are
    //    otherwise invisible to the WordPress sitemap.
    writeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const index = buildIndex().sort(
        (a, b) => new Date(b.publication_date) - new Date(a.publication_date),
      );
      fs.writeFileSync(path.join(outDir, 'posts-index.json'), JSON.stringify(index));

      const urls = ['', ...index.map((p) => `${p.slug}`)]
        .map((u) => `<url><loc>${SITE_BLOG_URL}${u}</loc></url>`)
        .join('');
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
      );
    },
  };
}

// The blog is served from fisayo.org/blog/, so assets live under that base.
// Override with VITE_BASE only for unusual setups.
export default defineConfig({
  base: process.env.VITE_BASE || '/blog/',
  plugins: [react(), postsIndexPlugin()],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
