import path from 'node:path';
import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Build config for the Opportunity Universe app, served from fisayo.org/joy/.
// Mirrors vite.config.js (the blog): same repo, same design system, second
// static app. Build with:  npm run build:joy   → output in dist-joy/
const OPPS_DIR = path.resolve(__dirname, 'src/data/opportunities');
const VIRTUAL_ID = 'virtual:opportunities-index';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;
const SITE_JOY_URL = 'https://fisayo.org/joy/';

// One JSON file per opportunity in src/data/opportunities/ — written by
// Pages CMS (humans) and by the Joy Agent pipeline (see joy-agent/RUNBOOK.md).
// The whole list ships as a build-time index: cards are small (no article
// bodies), so unlike blog posts there is nothing to lazy-load per item.
function buildIndex() {
  if (!fs.existsSync(OPPS_DIR)) return [];
  return fs
    .readdirSync(OPPS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      let raw;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(OPPS_DIR, file), 'utf-8'));
      } catch (err) {
        // One malformed file (e.g. a bad CMS save) must not take down the
        // whole Opportunity Universe. Warn with the filename and skip it.
        console.warn(
          `\n[fisayo-opps-index] Skipping "${file}" — it is not valid JSON ` +
            `and was left out of the page. Fix it and re-save. (${err.message})\n`,
        );
        return null;
      }
      const base = file.replace(/\.json$/, '');
      const slug = raw.slug || base;
      // Keep the index lean: cap description length (cards clamp to 2 lines).
      const description =
        typeof raw.description === 'string' ? raw.description.slice(0, 260) : '';
      return { ...raw, description, slug, id: slug };
    })
    .filter(Boolean);
}

function oppsIndexPlugin() {
  return {
    name: 'fisayo-opps-index',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        return `export default ${JSON.stringify(buildIndex())};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(OPPS_DIR) && file.endsWith('.json')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }
    },
    // After every build, also emit opportunities-index.json — machine-readable
    // feed of the whole universe (same pattern as the blog's posts-index.json,
    // which WordPress reads). Lets WordPress, partners, or future tooling
    // consume the universe without parsing the app bundle.
    writeBundle() {
      const outDir = path.resolve(__dirname, 'dist-joy');
      // The entry is joy.html at the repo root (so it can live beside the
      // blog's index.html); the deployed directory must serve it as
      // index.html.
      const built = path.join(outDir, 'joy.html');
      if (fs.existsSync(built)) fs.renameSync(built, path.join(outDir, 'index.html'));
      // public/.htaccess is the BLOG's SPA fallback (RewriteBase /blog/) and
      // gets copied into this build too — replace it with the /joy/ version
      // so stray deep links land back on this page, not on the blog.
      fs.writeFileSync(
        path.join(outDir, '.htaccess'),
        [
          '# Single-page app at /joy/: any path under it serves index.html.',
          'RewriteEngine On',
          'RewriteBase /joy/',
          'RewriteRule ^index\\.html$ - [L]',
          'RewriteCond %{REQUEST_FILENAME} !-f',
          'RewriteCond %{REQUEST_FILENAME} !-d',
          'RewriteRule . index.html [L]',
          '',
        ].join('\n'),
      );
      const index = buildIndex().sort(
        (a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0),
      );
      fs.writeFileSync(path.join(outDir, 'opportunities-index.json'), JSON.stringify(index));
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_JOY_URL}</loc></url></urlset>`,
      );
    },
  };
}

export default defineConfig({
  base: process.env.VITE_JOY_BASE || '/joy/',
  plugins: [react(), oppsIndexPlugin()],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-joy',
    rollupOptions: {
      input: path.resolve(__dirname, 'joy.html'),
    },
  },
  server: {
    port: 3001,
  },
});
