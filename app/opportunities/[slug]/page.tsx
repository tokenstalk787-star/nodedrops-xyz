import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getOpportunityBySlug } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = await getOpportunityBySlug(slug);
  if (!opp) return { title: "Campaign Not Found" };
  return {
    title: `${opp.projectName} — Node Program Details`,
    description: opp.description,
  };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = await getOpportunityBySlug(slug);
  if (!opp) {
    notFound();
  }

  const isExpired = opp.campaignStatus === "ENDED";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/opportunities" className="hover:text-text-primary">Opportunities</Link>
        <span>/</span>
        <span className="text-brand-cyan truncate max-w-xs">{opp.projectName}</span>
      </nav>

      {/* Expired Campaign Alert if applicable */}
      {isExpired && (
        <div className="mb-6 p-4 rounded-xl border border-status-error/40 bg-status-error/10 text-xs text-status-error flex items-start gap-3">
          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-sm font-semibold">This campaign has ended.</strong>
            This record is preserved for technical benchmarking and historical archival purposes.
            Do not submit new validator applications or expect rewards for this round.
          </div>
        </div>
      )}

      {/* Main Profile */}
      <div className="rounded-2xl border border-border bg-background-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-border/80">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{opp.projectName}</h1>
              <Badge variant={opp.campaignStatus.toLowerCase() as "active" | "upcoming" | "ended"}>
                {opp.campaignStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-muted">
              <span className="px-2.5 py-1 rounded bg-background-secondary border border-border text-brand-cyan">
                {opp.campaignType}
              </span>
              <span className="px-2.5 py-1 rounded bg-background-secondary border border-border">
                Verification: <strong>{opp.verificationStatus}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <a href={opp.officialAnnouncementUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" className="w-full gap-2 text-xs">
                <span>Official Announcement</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
            <a href={opp.officialDocumentationUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                <span>Official Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Campaign Overview</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {opp.description}
          </p>
        </div>

        {/* Verification & Metadata Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-background-secondary border border-border/60 text-xs font-mono">
          <div className="space-y-2">
            <div className="flex justify-between">
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
            <div className="flex justify-between">
              <span className="text-text-muted">Last Checked:</span>
              <span className="text-white">{new Date(opp.lastCheckedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Start Date:</span>
              <span className="text-white">
                {opp.startsAt ? new Date(opp.startsAt).toLocaleDateString() : "Ongoing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">End Date:</span>
              <span className={isExpired ? "text-status-error font-semibold" : "text-white"}>
                {opp.endsAt ? new Date(opp.endsAt).toLocaleDateString() : "Open-ended"}
              </span>
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3 pt-4 border-t border-border/60">
          <h2 className="text-lg font-bold text-white">Eligibility Requirements</h2>
          <div className="p-4 rounded-xl border border-border bg-background-card/60 text-xs text-text-secondary leading-relaxed">
            {opp.eligibility}
          </div>
        </div>

        {/* Risk & Safety Notice */}
        <div className="p-4 rounded-xl border border-border bg-[#0d0714] text-xs text-text-secondary space-y-2">
          <div className="flex items-center gap-2 text-status-warning font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Important Risk Notice</span>
          </div>
          <p className="leading-relaxed">
            Testnet incentive campaigns often undergo governance revisions, eligibility filters, and geographic restrictions by their foundation teams. NodeDrops cannot guarantee reward fulfillment. Never input seed phrases or grant wallet approval to unverified smart contracts.
          </p>
        </div>
      </div>
    </div>
  );
}
