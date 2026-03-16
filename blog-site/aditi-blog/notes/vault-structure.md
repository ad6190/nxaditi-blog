---
title: Vault structure
date: 2025-03-14
---

# Vault structure

How this Obsidian vault maps to the blog.

## Sections

- **about** – Single page at the root
- **writing** – Work and Life (and more as needed)
- **projects** – Products (card layout) and Builds
- **recommendations** – Curated from notes (videos, articles, etc.)
- **notes** – Ever-growing; any folder structure
- **bookmarks** – One note per link; frontmatter for read/recommended

## Build

Run `npm run build` in `blog-site/site`. The script scans the vault, copies markdown to `public/content`, and writes a manifest. The site reads that at runtime.
