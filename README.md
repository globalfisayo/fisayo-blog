# Fisayo.org Blog

The blog at **https://fisayo.org/blog/** — a static React app deployed into the
`/blog/` directory of the fisayo.org WordPress site on Hostinger. WordPress
serves every other page on the domain; this repo owns everything under `/blog/`.

Built from the same architecture as the [Novola](https://github.com/globalfisayo/novola)
site: one JSON file per post, edited visually with Pages CMS, deployed
automatically on every commit.

## Editing posts

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the **fisayo-blog** repo → **Blog Posts**.
3. Write, edit, upload images — saving commits to `main`, which triggers a
   deploy. The live blog updates in about a minute.

Teammates without GitHub accounts can be invited by email from Pages CMS
settings.

## How deployment works

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci && npm run build` (Vite, base `/blog/`)
2. The `dist/` output is tarred and copied to Hostinger over SSH
   (key in the `HOSTINGER_SSH_KEY` repo secret)
3. On the server it is unpacked to `blog.new/` and swapped into place, so
   visitors never see a half-deployed site

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
