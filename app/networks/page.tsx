import Link from "next/link";
import { Layers, Search, Server, Cpu, HardDrive, ArrowRight, ExternalLink } from "lucide-react";
import { getNetworks } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Blockchain Network Directory",
  description: "Browse testnet and mainnet blockchain networks, hardware requirements, and supported node clients.",
};

export default async function NetworksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: "MAINNET" | "TESTNET"; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.q || "";
  const type = resolvedParams.type;
  const page = parseInt(resolvedParams.page || "1", 10);

  const data = await getNetworks({
    search,
    type,
    page,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>BLOCKCHAIN INFRASTRUCTURE DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Blockchain Networks
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          Discover verified hardware requirements, consensus details, and client configurations
          for Layer 1, Layer 2, and modular networks.
        </p>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {/* Type filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/networks">
              <Button
                variant={!type ? "primary" : "secondary"}
                size="sm"
                className="text-xs"
              >
                All Networks
              </Button>
            </Link>
            <Link href="/networks?type=MAINNET">
              <Button
                variant={type === "MAINNET" ? "primary" : "secondary"}
                size="sm"
                className="text-xs"
              >
                Mainnets
              </Button>
            </Link>
            <Link href="/networks?type=TESTNET">
              <Button
                variant={type === "TESTNET" ? "primary" : "secondary"}
                size="sm"
                className="text-xs"
              >
                Testnets
              </Button>
            </Link>
          </div>

          {/* Search bar */}
          <form method="GET" action="/networks" className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search networks..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple"
            />
          </form>
        </div>
      </div>

      {/* Network Grid */}
      {data.items.length === 0 ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/50">
          <Layers className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No networks found</h3>
          <p className="text-xs text-text-muted mt-1">
            Try adjusting your search query or network type filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((net) => (
            <Card key={net.id} className="hover:border-border-glow transition-all flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={net.networkType === "MAINNET" ? "mainnet" : "testnet"}>
                    {net.networkType}
                  </Badge>
                  {net.chainId && (
                    <span className="text-[11px] font-mono text-text-muted">
                      Chain ID: {net.chainId}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">
                  <Link href={`/networks/${net.slug}`} className="hover:text-brand-purple-light transition-colors">
                    {net.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {net.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="space-y-1.5 p-3 rounded-lg bg-background-secondary/80 border border-border/40 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-text-secondary">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Cpu className="w-3.5 h-3.5 text-brand-purple-light" />
                      Min CPU:
                    </span>
                    <span className="text-white font-medium">{net.hardwareRequirements.min.cpuCores} Cores</span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Server className="w-3.5 h-3.5 text-brand-blue-light" />
                      Min RAM:
                    </span>
                    <span className="text-white font-medium">{net.hardwareRequirements.min.ramGb} GB</span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <HardDrive className="w-3.5 h-3.5 text-brand-cyan" />
                      Min Storage:
                    </span>
                    <span className="text-white font-medium">{net.hardwareRequirements.min.ssdGb} GB NVMe</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <span className="text-text-muted">Node: {net.nodeTypes.split(",")[0]}</span>
                  <Link href={`/networks/${net.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <span>Specifications</span>
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
              href={`/networks?page=${i + 1}${type ? `&type=${type}` : ""}${search ? `&q=${search}` : ""}`}
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
