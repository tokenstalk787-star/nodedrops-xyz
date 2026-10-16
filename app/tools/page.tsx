import Link from "next/link";
import {
  Wrench,
  Cpu,
  Terminal,
  HelpCircle,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Interactive Web3 Node Tools",
  description: "Suite of client-side node operator tools: Hardware Checker, Command Builder, Setup Checklist, and Troubleshooting.",
};

export default function ToolsPage() {
  const tools = [
    {
      title: "Node Hardware Checker",
      slug: "/tools/hardware-checker",
      icon: Cpu,
      badge: "Spec Benchmark",
      description:
        "Input your VPS or bare-metal server specs (CPU, RAM, SSD NVMe, Bandwidth) and test compatibility against verified network profiles.",
      cta: "Launch Hardware Checker",
      color: "text-brand-purple-light",
    },
    {
      title: "Node Command Builder",
      slug: "/tools/command-builder",
      icon: Terminal,
      badge: "Templated & Safe",
      description:
        "Generate tested Docker Compose files, systemd unit services, and initialization commands from verified templates with destructive command safeguards.",
      cta: "Launch Command Builder",
      color: "text-brand-cyan",
    },
    {
      title: "Node Setup Checklist",
      slug: "/tools/checklist",
      icon: CheckSquare,
      badge: "Local Browser Storage",
      description:
        "Interactive step-by-step validator and node launch checklist saved privately in your browser without requiring account registration.",
      cta: "Open Setup Checklist",
      color: "text-status-success",
    },
    {
      title: "Troubleshooting Hub",
      slug: "/troubleshooting",
      icon: HelpCircle,
      badge: "Diagnostic Solutions",
      description:
        "Searchable diagnostics for state disk exhaustion, zero peer discovery, JWT auth mismatches, and RPC port conflicts with safe recovery steps.",
      cta: "Search Diagnostic Hub",
      color: "text-amber-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan text-xs font-mono">
          <Wrench className="w-3.5 h-3.5" />
          <span>PRODUCTION OPERATOR UTILITIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Web3 Node Tools
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Interactive, non-invasive utilities designed to eliminate manual configuration errors,
          benchmark hardware before renting servers, and verify node health safely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.slug} className="hover:border-border-glow transition-all flex flex-col">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-background-secondary border border-border/80 ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-background-secondary text-text-muted border border-border/60">
                    {tool.badge}
                  </span>
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-6 pt-0">
                <Link href={tool.slug}>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-2 hover:border-brand-purple">
                    <span>{tool.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="mt-12 p-6 rounded-2xl border border-border bg-[#070b14] text-xs text-text-secondary flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-white block">Client-Side Safety Guarantee</strong>
          <p>
            NodeDrops tools operate entirely within your browser or execute read-only queries against our
            verified technical database. We never execute commands on your host, never require root credentials,
            and never request private keys or wallet connections.
          </p>
        </div>
      </div>
    </div>
  );
}
