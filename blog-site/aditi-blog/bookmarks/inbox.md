---
title: Inbox
---

# Inbox

Links to read. **Add new links** by creating a note in `bookmarks/links/` (use the Template). Set `consumed: true` in a link's frontmatter when done — it will **automatically move** to the Archive table below.

Requires the **Dataview** plugin (Obsidian Settings → Community plugins → Dataview).

```dataview
TABLE
  link(url, title) as "Title",
  date as "Date",
  tag as "Tag",
  summary as "Summary",
  consumed as "✓"
FROM "bookmarks/links"
WHERE consumed != true AND file.name != "Template"
SORT date DESC
```
