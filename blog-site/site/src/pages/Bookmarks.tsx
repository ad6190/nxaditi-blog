import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Star, FileText, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ContentEntry,
  getManifest,
  filterBySection,
  sortByDate,
  formatDateShort,
  getTagsArray,
} from "@/lib/content";

const QUICK_FILTERS = [
  { key: "ai", label: "ai", matchTerms: ["ai"] },
  { key: "startups", label: "startups", matchTerms: ["startups"] },
  {
    key: "software-engineering",
    label: "software engineering",
    matchTerms: ["software-engineering", "engineering"],
  },
  { key: "research", label: "research", matchTerms: ["research"] },
] as const;

type QuickFilterKey = (typeof QUICK_FILTERS)[number]["key"];

function getISOWeek(dateStr: string): { week: number; year: number } {
  const d = new Date(dateStr + "T00:00:00");
  const temp = new Date(d.getTime());
  temp.setUTCDate(temp.getUTCDate() + 4 - (temp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { week, year: temp.getUTCFullYear() };
}

function getCurrentWeek(): { week: number; year: number } {
  const now = new Date();
  return getISOWeek(now.toISOString().split("T")[0]);
}

function weekLabel(w: { week: number; year: number }, current: { week: number; year: number }): string {
  const label = `week ${w.week}, ${w.year}`;
  return w.week === current.week && w.year === current.year
    ? `${label} (current)`
    : label;
}

export default function Bookmarks() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<QuickFilterKey[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    getManifest().then((all) => {
      setEntries(sortByDate(filterBySection(all, "bookmarks")));
    });
  }, []);

  const featured = useMemo(
    () => entries.filter((e) => e.featured === true),
    [entries],
  );
  const inbox = useMemo(
    () => entries.filter((e) => e.consumed === false && e.featured !== true),
    [entries],
  );
  const archive = useMemo(
    () => entries.filter((e) => e.consumed === true && e.featured !== true),
    [entries],
  );

  const currentWeek = useMemo(() => getCurrentWeek(), []);

  const getWeekOptions = (list: ContentEntry[]) => {
    const seen = new Map<string, { week: number; year: number }>();
    for (const e of list) {
      if (!e.date) continue;
      const w = getISOWeek(e.date);
      // only include past + current weeks
      if (w.year > currentWeek.year || (w.year === currentWeek.year && w.week > currentWeek.week)) continue;
      const key = `${w.year}-${w.week}`;
      if (!seen.has(key)) seen.set(key, w);
    }
    return Array.from(seen.values()).sort(
      (a, b) => b.year - a.year || b.week - a.week,
    );
  };

  const filterEntries = (list: ContentEntry[]) => {
    return list.filter((e) => {
      const tags = getTagsArray(e.tags).map((t) => t.toLowerCase());

      // week filter
      if (selectedWeek !== "all" && e.date) {
        const w = getISOWeek(e.date);
        if (`${w.year}-${w.week}` !== selectedWeek) return false;
      } else if (selectedWeek !== "all" && !e.date) {
        return false;
      }

      const passesQuickFilters =
        activeFilters.length === 0 ||
        activeFilters.some((activeKey) => {
          const config = QUICK_FILTERS.find((f) => f.key === activeKey);
          if (!config) return false;
          return tags.some((tag) =>
            config.matchTerms.some((term) => tag.includes(term)),
          );
        });

      if (!passesQuickFilters) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.source && e.source.toLowerCase().includes(q)) ||
        tags.some((t) => t.includes(q))
      );
    });
  };

  const toggleFilter = (key: QuickFilterKey) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <PageTransition>
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] py-16 md:py-24">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
            bookmarks
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            links i've collected. the best ones each week are featured. inbox is
            unread, archive is consumed.
          </p>

          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {QUICK_FILTERS.map((filter) => {
                const active = activeFilters.includes(filter.key);
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => toggleFilter(filter.key)}
                  >
                    <Badge variant={active ? "default" : "outline"}>
                      {filter.label}
                    </Badge>
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilters([])}
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Input
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <Tabs defaultValue="featured">
              <TabsList>
                <TabsTrigger value="featured">
                  Featured ({featured.length})
                </TabsTrigger>
                <TabsTrigger value="inbox">
                  Inbox ({inbox.length})
                </TabsTrigger>
                <TabsTrigger value="archive">
                  Archive ({archive.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="featured">
                <WeekDropdown
                  entries={featured}
                  selectedWeek={selectedWeek}
                  onSelect={setSelectedWeek}
                  getWeekOptions={getWeekOptions}
                  currentWeek={currentWeek}
                />
                <BookmarkTable
                  entries={filterEntries(featured)}
                  onOpenNote={(slug) => navigate(`/bookmarks/${slug}`)}
                />
              </TabsContent>
              <TabsContent value="inbox">
                <WeekDropdown
                  entries={inbox}
                  selectedWeek={selectedWeek}
                  onSelect={setSelectedWeek}
                  getWeekOptions={getWeekOptions}
                  currentWeek={currentWeek}
                />
                <BookmarkTable
                  entries={filterEntries(inbox)}
                  onOpenNote={(slug) => navigate(`/bookmarks/${slug}`)}
                />
              </TabsContent>
              <TabsContent value="archive">
                <WeekDropdown
                  entries={archive}
                  selectedWeek={selectedWeek}
                  onSelect={setSelectedWeek}
                  getWeekOptions={getWeekOptions}
                  currentWeek={currentWeek}
                />
                <BookmarkTable
                  entries={filterEntries(archive)}
                  onOpenNote={(slug) => navigate(`/bookmarks/${slug}`)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function WeekDropdown({
  entries,
  selectedWeek,
  onSelect,
  getWeekOptions,
  currentWeek,
}: {
  entries: ContentEntry[];
  selectedWeek: string;
  onSelect: (value: string) => void;
  getWeekOptions: (list: ContentEntry[]) => { week: number; year: number }[];
  currentWeek: { week: number; year: number };
}) {
  const weeks = useMemo(() => getWeekOptions(entries), [entries, getWeekOptions]);

  if (weeks.length === 0) return null;

  return (
    <div className="mt-3 mb-2">
      <select
        value={selectedWeek}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">all weeks</option>
        {weeks.map((w) => (
          <option key={`${w.year}-${w.week}`} value={`${w.year}-${w.week}`}>
            {weekLabel(w, currentWeek)}
          </option>
        ))}
      </select>
    </div>
  );
}

function BookmarkTable({
  entries,
  onOpenNote,
}: {
  entries: ContentEntry[];
  onOpenNote: (slug: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No bookmarks here.
      </p>
    );
  }

  return (
    <StaggerContainer>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden lg:table-cell">Summary</TableHead>
            <TableHead className="hidden md:table-cell">Tags</TableHead>
            <TableHead className="hidden sm:table-cell">Source</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <StaggerItem key={entry.slug} className="contents">
              <TableRow
                onClick={() => {
                  if (entry.hasContent) {
                    onOpenNote(entry.slug);
                    return;
                  }
                  if (entry.url) {
                    window.open(entry.url, "_blank", "noopener,noreferrer");
                  }
                }}
                className={
                  entry.hasContent || entry.url ? "cursor-pointer" : undefined
                }
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {entry.recommended && (
                      <Star className="h-3.5 w-3.5 fill-foreground text-foreground shrink-0" />
                    )}
                    <span className="font-medium">{entry.title}</span>
                    {entry.notes === "ready" && (
                      <FileText className="h-3.5 w-3.5 text-foreground shrink-0" aria-label="Notes ready" />
                    )}
                    {entry.notes === "todo" && (
                      <CircleDot className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-label="Notes to prepare" />
                    )}
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Open ${entry.title}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm max-w-xs truncate">
                  {entry.description || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getTagsArray(entry.tags).map((tag) => (
                    <Badge key={tag} variant="outline" className="mr-1 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {entry.source && (
                    <Badge variant="secondary" className="text-xs">
                      {entry.source}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground text-sm">
                  {formatDateShort(entry.date)}
                </TableCell>
              </TableRow>
            </StaggerItem>
          ))}
        </TableBody>
      </Table>
    </StaggerContainer>
  );
}
