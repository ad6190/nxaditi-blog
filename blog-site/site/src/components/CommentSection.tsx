import Giscus from "@giscus/react";
import "@/styles/giscus-theme.css";

export function CommentSection() {
  return (
    <div className="mt-24 pt-16 border-t border-zinc-800">
      <h2 className="text-2xl font-bold mb-8 text-zinc-50">thoughts?</h2>
      <Giscus
        id="comments"
        repo="ad6190/aditibhatnagar"
        repoId="R_kgDORmrhTg"
        category="General"
        categoryId="DIC_kwDORmrhTs4C466g"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
