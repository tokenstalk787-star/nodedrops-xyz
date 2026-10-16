import Link from "next/link";
import { BookOpen, Search, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { getGuides } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Node Setup & Operational Guides",
  description: "Tested step-by-step technical guides for running Ethereum, Celestia, Berachain, and Cosmos nodes.",
};

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.q || "";
  const difficulty = resolvedParams.difficulty;
  const page = parseInt(resolvedParams.page || "1", 10);

  const data = await getGuides({
    search,
    difficulty,
    page,
    limit: 10,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PRODUCTION-TESTED DOCUMENTATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Node Setup Guides
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          Comprehensive, reproducible technical tutorials covering system preparation, consensus & execution
          client pairing, firewall rules, and verification checklists.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/guides">
              <Button variant={!difficulty ? "primary" : "secondary"} size="sm" className="text-xs">
                All Difficulties
              </Button>
            </Link>
            <Link href="/guides?difficulty=BEGINNER">
              <Button variant={difficulty === "BEGINNER" ? "primary" : "secondary"} size="sm" className="text-xs">
                Beginner
              </Button>
            </Link>
            <Link href="/guides?difficulty=INTERMEDIATE">
              <Button variant={difficulty === "INTERMEDIATE" ? "primary" : "secondary"} size="sm" className="text-xs">
                Intermediate
              </Button>
            </Link>
            <Link href="/guides?difficulty=ADVANCED">
              <Button variant={difficulty === "ADVANCED" ? "primary" : "secondary"} size="sm" className="text-xs">
                Advanced
              </Button>
            </Link>
          </div>

          <form method="GET" action="/guides" className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search guides..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple"
            />
          </form>
        </div>
      </div>

      {/* Guide Listing */}
      {data.items.length === 0 ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/50">
          <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No guides found</h3>
          <p className="text-xs text-text-muted mt-1">
            Try adjusting your search criteria or difficulty filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((guide) => (
            <Card key={guide.id} className="hover:border-border-glow transition-all">
              <div className="p-6 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={guide.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}>
                      {guide.difficulty}
                    </Badge>
                    <span className="text-xs text-brand-cyan font-mono">{guide.category}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.estimatedMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white hover:text-brand-purple-light transition-colors">
                    <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {guide.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-background-secondary text-[11px] text-text-muted border border-border/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between self-stretch shrink-0 gap-3 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                  <div className="text-xs text-text-muted md:text-right">
                    <div>Author: <span className="text-white">{guide.authorName}</span></div>
                    {guide.reviewerName && (
                      <div className="text-status-success flex items-center md:justify-end gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified by {guide.reviewerName}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/guides/${guide.slug}`}>
                    <Button variant="primary" size="sm" className="w-full md:w-auto text-xs gap-1.5">
                      <span>Start Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/guides?page=${i + 1}${difficulty ? `&difficulty=${difficulty}` : ""}${search ? `&q=${search}` : ""}`}
            >
              <Button
                variant={data.page === i + 1 ? "primary" : "secondary"}
                size="sm"
                className="w-8 h-8 p-0 text-xs"
              >
                {i + 1}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
