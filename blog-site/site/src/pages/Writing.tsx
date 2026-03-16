import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
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
} from "@/lib/content";

export default function Writing() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getManifest().then((all) => {
      setEntries(sortByDate(filterBySection(all, "writing")));
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        (entry.description || "").toLowerCase().includes(q) ||
        (entry.category || "").toLowerCase().includes(q),
    );
  }, [entries, search]);

  const workEntries = filtered.filter(
    (entry) =>
      entry.category?.toLowerCase() === "work" ||
      entry.filePath.includes("work"),
  );
  const lifeEntries = filtered.filter(
    (entry) =>
      entry.category?.toLowerCase() === "life" ||
      entry.filePath.includes("life"),
  );

  return (
    <PageTransition>
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] py-16 md:py-24">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">writing</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            musings at the intersection of technology, craft, and culture.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Input
              placeholder="search writing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="mt-8">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                <TabsTrigger value="work">Work ({workEntries.length})</TabsTrigger>
                <TabsTrigger value="life">Life ({lifeEntries.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <WritingTable entries={filtered} />
              </TabsContent>
              <TabsContent value="work">
                <WritingTable entries={workEntries} />
              </TabsContent>
              <TabsContent value="life">
                <WritingTable entries={lifeEntries} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function WritingTable({ entries }: { entries: ContentEntry[] }) {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">No entries yet.</p>
    );
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Tags</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow
            key={entry.slug}
            onClick={() => navigate(`/writing/${entry.slug}`)}
            className="cursor-pointer"
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-medium">{entry.title}</span>
              </div>
              {entry.description && (
                <p className="mt-0.5 text-sm text-muted-foreground truncate max-w-sm">
                  {entry.description}
                </p>
              )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant="outline" className="text-xs">
                {(entry.category || "writing").toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground text-sm">
              {formatDateShort(entry.date)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
