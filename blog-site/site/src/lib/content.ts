export interface ContentEntry {
  slug: string;
  title: string;
  section: string;
  subsection: string | null;
  date: string | null;
  description: string | null;
  type: string | null;
  category: string | null;
  author: string | null;
  creator: string | null;
  tags: string | string[] | null;
  url: string | null;
  image: string | null;
  year: number | null;
  format: string | null;
  kind: string | null;
  source: string | null;
  consumed: boolean | null;
  recommended: boolean | null;
  filePath: string;
  hasContent: boolean;
}

const BASE = import.meta.env.BASE_URL;

let manifestCache: ContentEntry[] | null = null;

export async function getManifest(): Promise<ContentEntry[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}content/manifest.json`);
  manifestCache = await res.json();
  return manifestCache!;
}

export async function getMarkdown(filePath: string): Promise<string> {
  const res = await fetch(`${BASE}content/posts/${filePath}`);
  const raw = await res.text();
  // Strip frontmatter
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
  const content = match ? match[1] : raw;
  return transformObsidianEmbeds(content);
}

function encodePath(pathValue: string): string {
  return pathValue
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function transformObsidianEmbeds(markdown: string): string {
  const imageExtensions = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".avif",
  ]);
  const videoExtensions = new Set([".mp4", ".mov", ".webm", ".m4v"]);

  // Convert Obsidian embeds like ![[Image (27).jpeg]] into markdown/HTML media.
  return markdown.replace(/!\[\[([^\]]+)\]\]/g, (_full, inner: string) => {
    const [rawTarget] = inner.split("|");
    const target = rawTarget.trim();
    if (!target) return _full;

    const mediaPath = target.includes("/") ? target : target;
    const encoded = encodePath(mediaPath);
    const mediaUrl = `${BASE}content/media/${encoded}`;
    const extension = mediaPath.includes(".")
      ? `.${mediaPath.split(".").pop()?.toLowerCase()}`
      : "";

    if (videoExtensions.has(extension)) {
      return `<video controls preload="metadata" class="trip-video" src="${mediaUrl}"></video>`;
    }

    if (imageExtensions.has(extension)) {
      return `![](${mediaUrl})`;
    }

    return _full;
  });
}

export function filterBySection(
  entries: ContentEntry[],
  section: string,
): ContentEntry[] {
  return entries.filter((e) => e.section === section);
}

export function filterBySubsection(
  entries: ContentEntry[],
  section: string,
  subsection: string,
): ContentEntry[] {
  return entries.filter(
    (e) => e.section === section && e.subsection === subsection,
  );
}

export function sortByDate(
  entries: ContentEntry[],
  direction: "asc" | "desc" = "desc",
): ContentEntry[] {
  return [...entries].sort((a, b) => {
    const da = a.date || "0000-00-00";
    const db = b.date || "0000-00-00";
    return direction === "desc" ? db.localeCompare(da) : da.localeCompare(db);
  });
}

export function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: string | null): string {
  if (!date) return "";
  return date.replace(/-/g, ".");
}

export function getTagsArray(tags: string | string[] | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
