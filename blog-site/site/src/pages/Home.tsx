import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { VisitorCounter } from "@/components/VisitorCounter";

export default function Home() {
  return (
    <PageTransition>
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] py-24 md:py-32 lg:py-40">
          {/* Two-column: hero left, description right */}
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24 items-start">
            {/* Left — name + tagline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
              >
                aditi bhatnagar
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
              >
                director of engineering. building ai-native products. writing
                about technology, craft, and the things that matter.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  read more about me <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            {/* Right — how this place works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="lg:pt-4"
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
                how this place works
              </h2>
              <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  curious what i'm reading or consuming right now?{" "}
                  <Link
                    to="/bookmarks"
                    className="text-foreground underline underline-offset-4 hover:opacity-60"
                  >
                    bookmarks
                  </Link>{" "}
                  is updated weekly (articles, papers, books, and an
                  embarrassing number of youtube videos about ai). the best
                  ones each week are featured. new stuff sits in the inbox;
                  once i've read it and made notes, it moves to the archive.
                </p>
                <p>
                  <Link
                    to="/recommendations"
                    className="text-foreground underline underline-offset-4 hover:opacity-60"
                  >
                    recommendations
                  </Link>{" "}
                  is where i keep the things that hold up over time - books,
                  films, and blogs i come back to.
                </p>
                <p>
                  most of my{" "}
                  <Link
                    to="/writing"
                    className="text-foreground underline underline-offset-4 hover:opacity-60"
                  >
                    writing
                  </Link>{" "}
                  grows out of that reading. pieces usually link back to the
                  sources that sparked them.
                </p>
                <p>
                  <Link
                    to="/projects"
                    className="text-foreground underline underline-offset-4 hover:opacity-60"
                  >
                    projects
                  </Link>{" "}
                  is where i track what i'm building. products, open source,
                  side experiments.
                </p>
                <p>
                  <Link
                    to="/tools"
                    className="text-foreground underline underline-offset-4 hover:opacity-60"
                  >
                    tools
                  </Link>{" "}
                  is a catalog of things i've found that actually work - for
                  ai, engineering, and building in general.
                </p>
                <p className="text-xs text-muted-foreground/50 pt-2 flex items-center gap-2">
                  <span>runs on obsidian. deploys itself.</span>
                  <span className="text-muted-foreground/30">•</span>
                  <VisitorCounter pageId="site-home" />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
