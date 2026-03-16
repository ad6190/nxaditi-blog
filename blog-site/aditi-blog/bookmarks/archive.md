---
title: Archive
---

# Archive

Links you've consumed. These appear on the blog (Bookmarks section). Toggle `consumed: true` in any link note in `bookmarks/links/` — it will **automatically appear** here.

```dataview
TABLE
  link(url, title) as "Title",
  date as "Date",
  tag as "Tag",
  summary as "Summary",
  note as "Note",
  recommended as "Rec"
FROM "bookmarks/links"
WHERE consumed = true AND file.name != "Template"
SORT date DESC
```
