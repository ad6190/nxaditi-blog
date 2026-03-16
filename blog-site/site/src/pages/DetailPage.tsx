import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  type ContentEntry,
  getManifest,
  getMarkdown,
  formatDate,
} from "@/lib/content";

interface DetailPageProps {
  section: string;
  backPath: string;
  backLabel: string;
}

export default function DetailPage({
  section,
  backPath,
  backLabel,
}: DetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    getManifest().then((all) => {
      const found = all.find((e) => e.slug === slug && e.section === section);
      if (found) {
        setEntry(found);
        getMarkdown(found.filePath).then(setContent);
      }
    });
  }, [slug, section]);

  if (!entry) {
    return (
      <PageTransition>
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-16 md:py-24">
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Link>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-16 md:py-24">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>

          <article>
            <header className="mb-10">
              <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                {entry.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {entry.date && <time>{formatDate(entry.date)}</time>}
                {entry.author && <span>by {entry.author}</span>}
                {entry.creator && <span>by {entry.creator}</span>}
                {entry.type && (
                  <span className="rounded-md border px-2 py-0.5 text-xs">
                    {entry.type}
                  </span>
                )}
              </div>
              {entry.description && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {entry.description}
                </p>
              )}
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-4 hover:opacity-60"
                >
                  Visit &rarr;
                </a>
              )}
            </header>

            <MarkdownRenderer content={content} />
          </article>
        </div>
      </div>
    </PageTransition>
  );
}
