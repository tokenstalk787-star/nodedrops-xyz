import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  ExternalLink,
  Cpu,
  Server,
  HardDrive,
  Wifi,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { getNetworkBySlug, getGuides } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const net = await getNetworkBySlug(slug);
  if (!net) return { title: "Network Not Found" };
  return {
    title: `${net.name} Node Infrastructure & Hardware Specs`,
    description: `Complete hardware requirements, supported clients, and documentation for running a ${net.name} node.`,
  };
}

export default async function NetworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const net = await getNetworkBySlug(slug);
  if (!net) {
    notFound();
  }

  const relatedGuidesRes = await getGuides({ networkSlug: net.slug, limit: 3 });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/networks" className="hover:text-text-primary">Networks</Link>
        <span>/</span>
        <span className="text-brand-cyan">{net.name}</span>
      </nav>

      {/* Header Profile */}
      <div className="rounded-2xl border border-border bg-background-card p-6 sm:p-8 relative overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{net.name}</h1>
              <Badge variant={net.networkType === "MAINNET" ? "mainnet" : "testnet"}>
                {net.networkType}
              </Badge>
              <Badge variant="active">{net.status}</Badge>
            </div>
            <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
              {net.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted pt-1">
              {net.chainId && (
                <span className="px-2.5 py-1 rounded bg-background-secondary border border-border">
                  Chain ID: <strong className="text-white">{net.chainId}</strong>
                </span>
              )}
              <span className="px-2.5 py-1 rounded bg-background-secondary border border-border">
                Node Types: <strong className="text-white">{net.nodeTypes}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-status-success" />
                Verified: {new Date(net.lastVerifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <a href={net.officialUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
            <a href={net.documentationUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="w-full gap-2 text-xs">
                <span>Official Docs</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
              </Button>
            </a>
            <Link href={`/tools/hardware-checker?network=${net.slug}`}>
              <Button variant="cyan" size="sm" className="w-full gap-2 text-xs">
                <Wrench className="w-3.5 h-3.5" />
                <span>Test Hardware</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hardware Requirements Matrix */}
      <div className="space-y-6 mb-12">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-brand-purple-light" />
          <span>Hardware Requirements Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Requirements */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-text-secondary">Minimum Specifications</CardTitle>
                <Badge variant="caution">Baseline / Light Traffic</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <Cpu className="w-4 h-4 text-brand-purple-light" /> CPU Cores:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.min.cpuCores} Cores</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <Server className="w-4 h-4 text-brand-blue-light" /> System Memory:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.min.ramGb} GB RAM</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <HardDrive className="w-4 h-4 text-brand-cyan" /> SSD Storage:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.min.ssdGb} GB NVMe</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-text-muted">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Uplink Bandwidth:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.min.bandwidthMbps} Mbps</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Requirements */}
          <Card className="border-brand-purple/40 bg-background-card/90">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-brand-purple-light">Recommended Specifications</CardTitle>
                <Badge variant="safe">Production & Validation</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <Cpu className="w-4 h-4 text-brand-purple-light" /> CPU Cores:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.recommended.cpuCores} Cores</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <Server className="w-4 h-4 text-brand-blue-light" /> System Memory:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.recommended.ramGb} GB RAM</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="flex items-center gap-2 text-text-muted">
                  <HardDrive className="w-4 h-4 text-brand-cyan" /> SSD Storage:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.recommended.ssdGb} GB NVMe</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-text-muted">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Uplink Bandwidth:
                </span>
                <span className="font-semibold text-white">{net.hardwareRequirements.recommended.bandwidthMbps} Mbps</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Notes & IOPS Notice */}
        <div className="p-4 rounded-xl border border-border bg-background-secondary text-xs text-text-secondary leading-relaxed">
          <strong className="text-white block mb-1">Infrastructure Architecture Note:</strong>
          {net.hardwareRequirements.notes}
        </div>
      </div>

      {/* Related Setup Guides */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-cyan" />
          <span>Installation & Operational Guides</span>
        </h2>

        {relatedGuidesRes.items.length === 0 ? (
          <div className="p-6 rounded-xl border border-border/60 text-xs text-text-muted">
            No specific installation guides are linked yet for this network. Check the{" "}
            <a href={net.documentationUrl} className="text-brand-cyan underline">official docs</a>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedGuidesRes.items.map((g) => (
              <Card key={g.id} className="hover:border-border-glow transition-all">
                <CardHeader>
                  <Badge variant={g.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"} className="w-fit mb-2">
                    {g.difficulty}
                  </Badge>
                  <CardTitle className="text-base">
                    <Link href={`/guides/${g.slug}`} className="hover:text-brand-purple-light">
                      {g.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">{g.excerpt}</p>
                  <Link href={`/guides/${g.slug}`} className="text-xs text-brand-cyan hover:underline inline-flex items-center gap-1 font-medium">
                    <span>Follow Step-by-Step Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
