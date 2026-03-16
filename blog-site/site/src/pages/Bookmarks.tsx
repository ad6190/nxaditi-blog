import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Star } from "lucide-react";
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

export default function Bookmarks() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<QuickFilterKey[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getManifest().then((all) => {
      setEntries(sortByDate(filterBySection(all, "bookmarks")));
    });
  }, []);

  const inbox = useMemo(
    () => entries.filter((e) => e.consumed === false),
    [entries],
  );
  const archive = useMemo(
    () => entries.filter((e) => e.consumed === true),
    [entries],
  );

  const filterEntries = (list: ContentEntry[]) => {
    return list.filter((e) => {
      const tags = getTagsArray(e.tags).map((t) => t.toLowerCase());

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
            links i've collected. inbox is unread, archive is consumed.
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
            <Input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs mb-6"
            />

            <Tabs defaultValue="inbox">
              <TabsList>
                <TabsTrigger value="inbox">Inbox ({inbox.length})</TabsTrigger>
                <TabsTrigger value="archive">
                  Archive ({archive.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inbox">
                <BookmarkTable
                  entries={filterEntries(inbox)}
                  onOpenNote={(slug) => navigate(`/bookmarks/${slug}`)}
                />
              </TabsContent>
              <TabsContent value="archive">
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
