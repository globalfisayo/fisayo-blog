# Fisayo.org Blog + Opportunity Universe

Two static React apps deployed into directories of the fisayo.org WordPress
site on Hostinger — WordPress serves every other page on the domain:

- **https://fisayo.org/blog/** — the blog (`src/`, entry `index.html`)
- **https://fisayo.org/joy/** — the **Opportunity Universe**: live jobs,
  scholarships, fellowships and programmes on filterable branded cards
  (`src/joy/`, entry `joy.html`, config `vite.joy.config.js`)

Both follow the same architecture as the
[Novola](https://github.com/globalfisayo/novola) site: one JSON file per
item, edited visually with Pages CMS, deployed automatically on every
commit. The Opportunity Universe is additionally fed by the **Joy Agent**
(`joy-agent/`) — an autonomous daily pipeline that finds, verifies, and
(after human approval) publishes early-career jobs; see `joy-agent/README.md`.

## Editing posts and opportunities

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the **fisayo-blog** repo → **Blog Posts** or **Opportunities**.
3. Write, edit, upload images — saving commits to `main`, which triggers a
   deploy. The live site updates in about a minute.

Opportunities data lives in `src/data/opportunities/` — one JSON per card
(name, apply link, types, status, dates, deadline, cover image). Cards
without an uploaded cover get an automatic branded cover with the
Novola × Fisayo.org lockup. Anything with a passed deadline shows as closed
automatically.

Teammates without GitHub accounts can be invited by email from Pages CMS
settings.

## How deployment works

`.github/workflows/deploy.yml` runs on pushes to `main` that touch site
files (`src/`, `public/`, entries, build configs — commits that only touch
`joy-agent/` operational data are skipped):

1. `npm ci && npm run build && npm run build:joy` (Vite: blog with base
   `/blog/`, opportunity universe with base `/joy/`)
2. `dist/` and `dist-joy/` are tarred and copied to Hostinger over SSH
   (key in the `HOSTINGER_SSH_KEY` repo secret)
3. On the server each is unpacked to a staging dir (`blog.new/`, `joy.new/`)
   and swapped into place, so visitors never see a half-deployed site

The build also emits:

- `posts-index.json` — read by a WordPress mu-plugin to render the
  "Latest Insights" dropdown in the main site navigation
- `sitemap.xml` — the blog's sitemap for search engines

## Posts

One JSON file per post in `src/data/posts/`. Fields: `title`, `slug`,
`excerpt`, `content` (HTML), `author`, `publication_date`, `category`
(Investing / Career / Opportunities), `is_featured`, and optional
`featured_image` / `featured_image_url` / `pdf_url` / `attachment_url`.

A malformed JSON file is skipped with a warning instead of failing the build.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000/blog/
npm run build      # production build into dist/
npm run preview    # serve the production build
```
