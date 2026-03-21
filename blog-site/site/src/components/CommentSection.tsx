import Giscus from "@giscus/react";
import "@/styles/giscus-theme.css";

interface CommentSectionProps {
  title: string;
  slug: string;
}

export function CommentSection({ title }: CommentSectionProps) {
  return (
    <div className="mt-24 pt-16 border-t border-zinc-800">
      <h2 className="text-2xl font-bold mb-8 text-zinc-50">thoughts?</h2>
      <Giscus
        id="comments"
        repo="ad6190/nxaditi-blog"
        repoId="R_kgDOKz0pOw"
        category="Blog Comments"
        categoryId="DIC_kwDOKz0pO84CfkN1"
        mapping="og:title"
        term={title}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="top"
        theme="dark"
        lang="en"
        loading="lazy"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="top"
        data-theme="dark"
      />
    </div>
  );
}
