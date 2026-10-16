import Link from "next/link";
import { Sparkles, Search, Calendar, AlertTriangle, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { getOpportunities } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Node Operator Opportunities & Testnet Directory",
  description: "Verified tracking for incentivized testnets, validator programs, and community node operator campaigns.",
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; reward?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.q || "";
  const status = resolvedParams.status;
  const reward = resolvedParams.reward;
  const page = parseInt(resolvedParams.page || "1", 10);

  const data = await getOpportunities({
    search,
    status,
    rewardStatus: reward,
    page,
    limit: 9,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INDEPENDENT VERIFICATION DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Node Operator Opportunities
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Track public validator programs, developer testnets, and infrastructure opportunities.
          Every record links directly to official sources and clearly displays verified reward status.
        </p>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl border border-status-warning/30 bg-status-warning/10 text-xs text-status-warning flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Transparency & Anti-Scam Notice:</strong> NodeDrops never promises airdrops, financial returns, or token listings. Inclusion in this directory does not constitute an endorsement. Always verify official URLs directly.
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/opportunities">
              <Button variant={!status ? "primary" : "secondary"} size="sm" className="text-xs">
                All Campaigns
              </Button>
            </Link>
            <Link href="/opportunities?status=ACTIVE">
              <Button variant={status === "ACTIVE" ? "primary" : "secondary"} size="sm" className="text-xs">
                Active
              </Button>
            </Link>
            <Link href="/opportunities?status=UPCOMING">
              <Button variant={status === "UPCOMING" ? "primary" : "secondary"} size="sm" className="text-xs">
                Upcoming
              </Button>
            </Link>
            <Link href="/opportunities?status=ENDED">
              <Button variant={status === "ENDED" ? "primary" : "secondary"} size="sm" className="text-xs">
                Ended / Archived
              </Button>
            </Link>
          </div>

          <form method="GET" action="/opportunities" className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search campaigns..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple"
            />
          </form>
        </div>
      </div>

      {/* Directory Grid */}
      {data.items.length === 0 ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/50">
          <Sparkles className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No campaigns found</h3>
          <p className="text-xs text-text-muted mt-1">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((opp) => (
            <Card key={opp.id} className="hover:border-border-glow transition-all flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={opp.campaignStatus.toLowerCase() as "active" | "upcoming" | "ended"}>
                    {opp.campaignStatus}
                  </Badge>
                  <span className="text-[11px] font-mono text-brand-cyan">
                    {opp.campaignType}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  <Link href={`/opportunities/${opp.slug}`} className="hover:text-brand-purple-light transition-colors">
                    {opp.projectName}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {opp.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-auto space-y-4">
                <div className="space-y-1.5 p-3 rounded-lg bg-background-secondary/80 border border-border/40 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-text-secondary">
                    <span className="text-text-muted">Reward Status:</span>
                    <span
                      className={`font-semibold ${
                        opp.rewardStatus === "CONFIRMED"
                          ? "text-status-success"
                          : opp.rewardStatus === "POTENTIAL"
                          ? "text-amber-400"
                          : "text-text-muted"
                      }`}
                    >
                      {opp.rewardStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary">
                    <span className="text-text-muted">Verification:</span>
                    <span className="text-brand-cyan">{opp.verificationStatus}</span>
                  </div>
                  {opp.endsAt && (
                    <div className="flex justify-between items-center text-text-secondary">
                      <span className="text-text-muted">Ends:</span>
                      <span className={opp.campaignStatus === "ENDED" ? "text-status-error" : "text-white"}>
                        {new Date(opp.endsAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <span className="text-text-muted">
                    Checked {new Date(opp.lastCheckedAt).toLocaleDateString()}
                  </span>
                  <Link href={`/opportunities/${opp.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
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
              href={`/opportunities?page=${i + 1}${status ? `&status=${status}` : ""}${search ? `&q=${search}` : ""}`}
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
