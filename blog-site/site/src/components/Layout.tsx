import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8 px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] flex justify-between items-center text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} aditi.</span>
          <span className="text-xs">obsidian + react</span>
        </div>
      </footer>
    </div>
  );
}
