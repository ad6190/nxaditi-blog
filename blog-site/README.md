# nxaditi blog

Minimal React blog that reads from an **Obsidian vault**. Notion-like design, with sections that map to your folder structure.

## Vault structure (`aditi-blog/`)

The site mirrors this structure. Create these folders and add `.md` files; the build step scans the vault and builds the site.

| Section                | Purpose                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`about.md`**         | Single About page (root of vault).                                                                                                                        |
| **`writing/`**         | Essays and longform. Subfolders: `work`, `life`. Each can be one page or many.                                                                            |
| **`projects/`**        | **`products/`** — things you’ve built (card layout; use frontmatter `url`, `image`, `description`). **`builds/`** — articles, hands-on, photography, etc. |
| **`recommendations/`** | Curated from notes/summaries. Subfolders: `videos`, `articles`, or any name.                                                                              |
| **`notes/`**           | Ever-growing notes. Use any folder structure; the site lists them all (paginated).                                                                        |
| **`bookmarks/`**       | Ever-growing links. One `.md` per bookmark with frontmatter so the site can filter.                                                                       |

### Frontmatter

- **Any note:** `title`, `date` (optional).
- **Products/builds:** `type: product` or `type: build`, `url`, `image`, `description` for card layout.
- **Bookmarks:** `url`, `title`, `read` (true/false), `recommended` (true/false), `date`. The site shows filters: All, Unread, Recommended.

Example bookmark (`bookmarks/some-link.md`):

```yaml
---
title: "Article title"
url: "https://..."
read: false
recommended: false
date: 2025-03-14
---
```

## Develop locally

```bash
cd blog-site/site
npm install
npm run dev
```

`npm run dev` rebuilds content from the vault and starts the dev server. Edit markdown in `aditi-blog` and reload to see changes.

## Build for production / GitHub Pages

```bash
cd blog-site/site
npm run build
```

Output is in `site/dist`. The repo includes `.github/workflows/deploy.yml` that builds and deploys to GitHub Pages on push to `main`. Enable Pages in repo settings (Actions → Pages source).

If the site is served from a subpath (e.g. `https://username.github.io/nxaditi-blog/`), set `base: '/nxaditi-blog/'` in `site/vite.config.ts`.

## Design

- Sidebar: Home, About, Writing (Work, Life), Projects (Products, Builds), Recommendations, Notes, Bookmarks.
- Writing / Recommendations: tabs for subfolders; paginated lists.
- Projects: card grid for products and builds (image, title, description, date).
- Bookmarks: filter by All / Unread / Recommended; paginated.
- Notes: single paginated list that scales with vault size.
