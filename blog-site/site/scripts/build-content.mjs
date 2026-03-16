import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_DIR = path.resolve(__dirname, "../../aditi-blog");
const OUTPUT_DIR = path.resolve(__dirname, "../public/content");
const POSTS_DIR = path.join(OUTPUT_DIR, "posts");
const MEDIA_DIR = path.join(OUTPUT_DIR, "media");

const MEDIA_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".mp4",
  ".mov",
  ".webm",
  ".m4v",
]);

const SKIP_FILES = new Set([
  "Template.md",
  "index.md",
  "inbox.md",
  "archive.md",
  "quick-capture.md",
  "vault-structure.md",
  "Untitled.md",
  "Welcome.md",
]);
const SKIP_DIRS = new Set(["archive", "node_modules", ".obsidian", ".git"]);

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function deriveSection(relativePath) {
  const parts = relativePath.split(path.sep);
  if (parts[0] === "about.md") return { section: "about", subsection: null };
  if (parts[0] === "writing")
    return { section: "writing", subsection: parts.length > 1 ? null : null };
  if (parts[0] === "projects") {
    const sub = parts.length > 1 ? parts[1] : null;
    return { section: "projects", subsection: sub === "links" ? null : sub };
  }
  if (parts[0] === "bookmarks")
    return { section: "bookmarks", subsection: null };
  if (parts[0] === "recommendations") {
    const sub = parts.length > 1 ? parts[1] : null;
    return { section: "recommendations", subsection: sub };
  }
  if (parts[0] === "notes") return { section: "notes", subsection: null };
  return { section: parts[0], subsection: null };
}

function scanVault(dir, baseDir = VAULT_DIR) {
  const entries = [];

  for (const item of fs.readdirSync(dir)) {
    if (item.startsWith(".")) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(item)) continue;
      entries.push(...scanVault(fullPath, baseDir));
    } else if (item.endsWith(".md")) {
      if (SKIP_FILES.has(item)) continue;
      const relativePath = path.relative(baseDir, fullPath);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data: frontmatter, content } = matter(raw);

      const { section, subsection } = deriveSection(relativePath);
      const baseName = path.basename(item, ".md");
      const slug = slugify(frontmatter.title || baseName);

      entries.push({
        slug,
        title: frontmatter.title || baseName,
        section,
        subsection,
        date: frontmatter.date
          ? new Date(frontmatter.date).toISOString().split("T")[0]
          : null,
        description: frontmatter.description || frontmatter.summary || null,
        type: frontmatter.type || null,
        category: frontmatter.category || null,
        author: frontmatter.author || null,
        creator: frontmatter.creator || null,
        tags: frontmatter.tags || frontmatter.tag || null,
        url: frontmatter.url || null,
        image: frontmatter.image || null,
        year: frontmatter.year || null,
        format: frontmatter.format || null,
        kind: frontmatter.kind || null,
        source: frontmatter.source || null,
        consumed:
          typeof frontmatter.consumed === "boolean"
            ? frontmatter.consumed
            : null,
        recommended:
          typeof frontmatter.recommended === "boolean"
            ? frontmatter.recommended
            : null,
        filePath: relativePath.replace(/\\/g, "/"),
        hasContent: content.trim().length > 0,
      });
    }
  }

  return entries;
}

function copyMediaFiles(dir, baseDir = VAULT_DIR) {
  for (const item of fs.readdirSync(dir)) {
    if (item.startsWith(".")) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(item)) continue;
      copyMediaFiles(fullPath, baseDir);
      continue;
    }

    const ext = path.extname(item).toLowerCase();
    if (!MEDIA_EXTENSIONS.has(ext)) continue;

    const relativePath = path.relative(baseDir, fullPath);
    const dest = path.join(MEDIA_DIR, relativePath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(fullPath, dest);
  }
}

// Clean output
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });

console.log(`Scanning vault: ${VAULT_DIR}`);
const entries = scanVault(VAULT_DIR);

// Copy markdown files
for (const entry of entries) {
  const src = path.join(VAULT_DIR, entry.filePath);
  const dest = path.join(POSTS_DIR, entry.filePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Copy image/media files used by markdown content
copyMediaFiles(VAULT_DIR);

// Write manifest
const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2));

console.log(`Built manifest with ${entries.length} entries → ${manifestPath}`);
