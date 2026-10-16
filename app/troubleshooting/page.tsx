import Link from "next/link";
import {
  HelpCircle,
  Search,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getTroubleshooting } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Node Troubleshooting Knowledge Base",
  description: "Searchable diagnostic solutions for disk space exhaustion, zero peer sync, JWT auth errors, and RPC port conflicts.",
};

export default async function TroubleshootingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.q || "";
  const items = await getTroubleshooting({ search });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>INCIDENT DIAGNOSTICS & RECOVERY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Node Troubleshooting Center
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Field-tested diagnostic runbooks for recovering stuck, crashing, or desynced blockchain nodes.
          Includes safe state pruning procedures, firewall checks, and port conflict resolution.
        </p>

        {/* Search */}
        <form method="GET" action="/troubleshooting" className="relative w-full max-w-lg pt-2">
          <Search className="absolute left-3.5 top-5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search symptoms (e.g. 'disk space', 'zero peers', '401 JWT')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background-secondary text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple"
          />
        </form>
      </div>

      {/* Solutions Listing */}
      {items.length === 0 ? (
        <div className="text-center py-16 border border-border/60 rounded-xl bg-background-card/50">
          <HelpCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No solutions found</h3>
          <p className="text-xs text-text-muted mt-1">
            Try searching for related keywords like &quot;pruning&quot;, &quot;peers&quot;, or &quot;ports&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <Card key={item.id} className="border-border bg-background-card overflow-hidden">
              <CardHeader className="bg-background-secondary/50 border-b border-border/60">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-background-card text-[10px] font-mono text-brand-cyan border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-xl text-white">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Symptoms & Root Causes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="p-4 rounded-xl border border-border bg-background-secondary/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-status-warning font-semibold font-mono">
                      <AlertCircle className="w-4 h-4" />
                      <span>Symptoms & Error Logs</span>
                    </div>
                    <p className="text-text-secondary">{item.symptoms}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background-secondary/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-brand-purple-light font-semibold font-mono">
                      <HelpCircle className="w-4 h-4" />
                      <span>Likely Root Cause</span>
                    </div>
                    <p className="text-text-secondary">{item.likelyCauses}</p>
                  </div>
                </div>

                {/* Diagnostic Commands */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white font-mono flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Diagnostic Commands:</span>
                  </span>
                  <CodeBlock code={item.diagnosticCommands} language="bash" />
                </div>

                {/* Safe Corrective Steps */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <span className="font-semibold text-white font-mono">Safe Recovery Steps:</span>
                  <div className="p-4 rounded-xl border border-border bg-[#05070d] font-mono text-slate-200 whitespace-pre-wrap">
                    {item.correctiveSteps}
                  </div>
                </div>

                {/* Risk Warning Alert */}
                {item.riskWarnings && (
                  <div className="p-4 rounded-xl border border-status-error/40 bg-status-error/10 text-xs text-status-error flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Risk Warning:</strong> {item.riskWarnings}
                    </div>
                  </div>
                )}

                {/* Verification instructions */}
                <div className="p-4 rounded-xl border border-status-success/30 bg-status-success/5 text-xs text-status-success flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Verification Check:</strong> {item.verificationInstructions}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
