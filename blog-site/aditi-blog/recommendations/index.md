---
title: Recommendations
---

# Recommendations

Things I recommend and return to: books, online reads (magazines, blogs), and media (movies, documentaries, talks, videos). Each item lives in its own note under `recommendations/books/links/`, `recommendations/other-reads/links/`, or `recommendations/media/links/`.

**Type** = kind of thing (book, magazine, company blog, personal blog, movie, documentary, talk, video).  
**Tags** = focus areas (leadership, AI, philosophy, engineering management, classics, craft, etc.). Use these to filter or scan by subject.

Unlike `notes`, which are my own writing for thinking and connecting dots, recommendations are things I am learning from.

## All recommendations

```dataview
TABLE
  link(file.link, title) as "Title",
  type as "Type",
  tags as "Tags",
  (author or creator) as "Author/Creator",
  summary as "Summary",
  date as "Date"
FROM "recommendations"
WHERE contains(file.folder, "links") AND file.name != "Template"
SORT date DESC
```

To see only one type, duplicate the block above and add a filter, e.g. `WHERE contains(file.folder, "links") AND file.name != "Template" AND type = "book"`.
