import { useEffect, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getManifest, getMarkdown, type ContentEntry } from "@/lib/content";

export default function About() {
  const [content, setContent] = useState("");

  useEffect(() => {
    getManifest().then((entries) => {
      const about = entries.find((e: ContentEntry) => e.section === "about");
      if (about) {
        getMarkdown(about.filePath).then(setContent);
      }
    });
  }, []);

  return (
    <PageTransition>
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-16 md:py-24">
          <div className="mt-2">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
