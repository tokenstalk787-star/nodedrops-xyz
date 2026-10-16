import Link from "next/link";
import { Search, BookOpen, Layers, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { searchAll } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Search NodeDrops.xyz",
  description: "Universal search across node guides, blockchain networks, opportunities, and troubleshooting solutions.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const results = query ? await searchAll(query) : null;

  const totalFound = results
    ? results.guides.length +
      results.networks.length +
      results.opportunities.length +
      results.troubleshooting.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Search Header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Search Directory</h1>
        <form method="GET" action="/search" className="relative w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search guides, networks, clients, commands, errors..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background-secondary text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple shadow-glow transition-all"
          />
        </form>
        {query && (
          <p className="text-xs text-text-muted font-mono">
            Found {totalFound} results matching &quot;<span className="text-white">{query}</span>&quot;
          </p>
        )}
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/40">
          <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Start typing to search</h3>
          <p className="text-xs text-text-muted mt-1">
            Search across testnets, guides, hardware profiles, and diagnostic runbooks.
          </p>
        </div>
      ) : totalFound === 0 ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/40">
          <h3 className="text-base font-semibold text-white">No results found</h3>
          <p className="text-xs text-text-muted mt-1">
            Try searching for broader terms like &quot;Sepolia&quot;, &quot;Docker&quot;, &quot;Peers&quot;, or &quot;Geth&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Guides Results */}
          {results && results.guides.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-purple-light font-mono flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Node Guides ({results.guides.length})</span>
              </h2>
              <div className="space-y-2">
                {results.guides.map((g) => (
                  <Link key={g.id} href={`/guides/${g.slug}`} className="block">
                    <Card className="hover:border-brand-purple/60 transition-all p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-white">{g.title}</h3>
                          <p className="text-xs text-text-secondary line-clamp-1">{g.excerpt}</p>
                        </div>
                        <Badge variant={g.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}>
                          {g.difficulty}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Networks Results */}
          {results && results.networks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-light font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Networks ({results.networks.length})</span>
              </h2>
              <div className="space-y-2">
                {results.networks.map((n) => (
                  <Link key={n.id} href={`/networks/${n.slug}`} className="block">
                    <Card className="hover:border-brand-blue/60 transition-all p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-white">{n.name}</h3>
                          <p className="text-xs text-text-secondary line-clamp-1">{n.description}</p>
                        </div>
                        <Badge variant={n.networkType === "MAINNET" ? "mainnet" : "testnet"}>
                          {n.networkType}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities Results */}
          {results && results.opportunities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cyan font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Opportunities ({results.opportunities.length})</span>
              </h2>
              <div className="space-y-2">
                {results.opportunities.map((o) => (
                  <Link key={o.id} href={`/opportunities/${o.slug}`} className="block">
                    <Card className="hover:border-brand-cyan/60 transition-all p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-white">{o.projectName}</h3>
                          <p className="text-xs text-text-secondary line-clamp-1">{o.description}</p>
                        </div>
                        <Badge variant={o.campaignStatus.toLowerCase() as "active" | "upcoming" | "ended"}>
                          {o.campaignStatus}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Troubleshooting Results */}
          {results && results.troubleshooting.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Troubleshooting ({results.troubleshooting.length})</span>
              </h2>
              <div className="space-y-2">
                {results.troubleshooting.map((t) => (
                  <Link key={t.id} href="/troubleshooting" className="block">
                    <Card className="hover:border-amber-400/60 transition-all p-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                        <p className="text-xs text-text-secondary line-clamp-1">{t.symptoms}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
