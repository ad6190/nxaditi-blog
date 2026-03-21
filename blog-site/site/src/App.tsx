import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Writing = lazy(() => import("@/pages/Writing"));
const Projects = lazy(() => import("@/pages/Projects"));
const Bookmarks = lazy(() => import("@/pages/Bookmarks"));
const Recommendations = lazy(() => import("@/pages/Recommendations"));
const Tools = lazy(() => import("@/pages/Tools"));
const DetailPage = lazy(() => import("@/pages/DetailPage"));

function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="writing" element={<Writing />} />
              <Route
                path="writing/:slug"
                element={
                  <DetailPage
                    section="writing"
                    backPath="/writing"
                    backLabel="Back to Writing"
                  />
                }
              />
              <Route path="projects" element={<Projects />} />
              <Route
                path="projects/:slug"
                element={
                  <DetailPage
                    section="projects"
                    backPath="/projects"
                    backLabel="Back to Projects"
                  />
                }
              />
              <Route path="tools" element={<Tools />} />
              <Route
                path="tools/:slug"
                element={
                  <DetailPage
                    section="tools"
                    backPath="/tools"
                    backLabel="Back to Tools"
                  />
                }
              />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route
                path="bookmarks/:slug"
                element={
                  <DetailPage
                    section="bookmarks"
                    backPath="/bookmarks"
                    backLabel="Back to Bookmarks"
                  />
                }
              />
              <Route path="recommendations" element={<Recommendations />} />
              <Route
                path="recommendations/:slug"
                element={
                  <DetailPage
                    section="recommendations"
                    backPath="/recommendations"
                    backLabel="Back to Recommendations"
                  />
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  );
}
