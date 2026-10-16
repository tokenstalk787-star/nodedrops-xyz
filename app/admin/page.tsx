import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Plus,
  Terminal,
  HelpCircle,
  Cpu,
  CheckCircle2,
  Activity,
  FileText,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdminMetrics,
  getNetworks,
  getGuides,
  getOpportunities,
  getCommandTemplates,
  getTroubleshooting,
} from "@/lib/services/data-service";

export default async function AdminDashboardPage() {
  const [metrics, networksRes, guidesRes, oppsRes, templates, troubleItems] =
    await Promise.all([
      getAdminMetrics(),
      getNetworks({ limit: 10 }),
      getGuides({ limit: 10 }),
      getOpportunities({ limit: 10 }),
      getCommandTemplates(),
      getTroubleshooting({}),
    ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 font-sans">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Control Center</span>
            <span>/</span>
            <span className="text-white">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            NodeDrops Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 font-sans">
            Real-time management for blockchain networks, technical runbooks, command generators, and diagnostic tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <Link href="/admin/networks">
            <Button size="sm" variant="default" className="bg-brand-purple hover:bg-brand-purple-light text-white gap-1.5 shadow-md">
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Network</span>
            </Button>
          </Link>

          <Link href="/admin/guides/new">
            <Button size="sm" variant="outline" className="border-dark-card-border hover:border-brand-purple text-slate-300 hover:text-white gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-purple-light" />
              <span>+ Create Guide</span>
            </Button>
          </Link>

          <Link href="/admin/opportunities">
            <Button size="sm" variant="outline" className="border-dark-card-border hover:border-brand-cyan text-slate-300 hover:text-white gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>+ Add Opportunity</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Live Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Networks */}
        <Link href="/admin/networks" className="group">
          <Card className="border-dark-card-border bg-dark-card hover:border-brand-purple/50 transition-all shadow-lg p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="uppercase tracking-wider">Networks Registry</span>
              <Layers className="w-4 h-4 text-brand-purple-light group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {networksRes.total}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>Real-Time Active</span>
              <span className="text-text-muted group-hover:text-brand-purple-light flex items-center gap-0.5">
                Manage →
              </span>
            </div>
          </Card>
        </Link>

        {/* Guides */}
        <Link href="/admin/guides" className="group">
          <Card className="border-dark-card-border bg-dark-card hover:border-brand-blue/50 transition-all shadow-lg p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="uppercase tracking-wider">Production Guides</span>
              <BookOpen className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {guidesRes.total}
            </div>
            <div className="text-[11px] font-mono text-brand-blue-light flex items-center justify-between">
              <span>{metrics.draftGuides || 0} Drafts in Queue</span>
              <span className="text-text-muted group-hover:text-brand-blue-light flex items-center gap-0.5">
                Manage →
              </span>
            </div>
          </Card>
        </Link>

        {/* Opportunities */}
        <Link href="/admin/opportunities" className="group">
          <Card className="border-dark-card-border bg-dark-card hover:border-brand-cyan/50 transition-all shadow-lg p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="uppercase tracking-wider">Opportunities</span>
              <Sparkles className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {oppsRes.total}
            </div>
            <div className="text-[11px] font-mono text-brand-cyan flex items-center justify-between">
              <span>Incentivized Campaigns</span>
              <span className="text-text-muted group-hover:text-brand-cyan flex items-center gap-0.5">
                Manage →
              </span>
            </div>
          </Card>
        </Link>

        {/* Command Templates & Troubleshooting */}
        <Link href="/admin/tools" className="group">
          <Card className="border-dark-card-border bg-dark-card hover:border-amber-400/50 transition-all shadow-lg p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="uppercase tracking-wider">Tools & Templates</span>
              <Cpu className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {templates.length + troubleItems.length}
            </div>
            <div className="text-[11px] font-mono text-amber-400 flex items-center justify-between">
              <span>{templates.length} Cmds • {troubleItems.length} Solutions</span>
              <span className="text-text-muted group-hover:text-amber-400 flex items-center gap-0.5">
                Configure →
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Two Operations Hub Grids (Simple, Real-Time, Easy to Handle) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Node Platform & Tools Management */}
        <div className="rounded-2xl border border-dark-card-border bg-dark-card p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light font-bold text-xs">
                ⚡
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-sans">
                  Interactive Node Tooling Modules
                </h2>
                <p className="text-xs text-text-muted font-mono">
                  Live tools configuration & command generation
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Tool Item 1: Hardware Checker Rules */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-brand-cyan shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Hardware Checker Rules</h4>
                  <p className="text-xs text-text-muted font-mono">
                    Configure CPU, RAM, NVMe thresholds for live validator calculator
                  </p>
                </div>
              </div>
              <Link href="/admin/tools">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  Edit Rules
                </Button>
              </Link>
            </div>

            {/* Tool Item 2: Command Builder */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-brand-purple-light shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Command Builder Templates</h4>
                  <p className="text-xs text-text-muted font-mono">
                    {templates.length} templates (Systemd units, Docker Compose files)
                  </p>
                </div>
              </div>
              <Link href="/admin/command-templates">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  Manage Templates
                </Button>
              </Link>
            </div>

            {/* Tool Item 3: Troubleshooting Knowledgebase */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Troubleshooting Runbooks</h4>
                  <p className="text-xs text-text-muted font-mono">
                    {troubleItems.length} verified diagnostic solutions and scripts
                  </p>
                </div>
              </div>
              <Link href="/admin/troubleshooting">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  Manage Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Module 2: Core Blockchain Content Management */}
        <div className="rounded-2xl border border-dark-card-border bg-dark-card p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue-light font-bold text-xs">
                🌐
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-sans">
                  Blockchain Registries & Content Hub
                </h2>
                <p className="text-xs text-text-muted font-mono">
                  Real-time database records and runbooks
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Content Item 1: Networks Registry */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-brand-purple-light shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Blockchain Networks Registry</h4>
                  <p className="text-xs text-text-muted font-mono">
                    {networksRes.total} networks with chain IDs & hardware profiles
                  </p>
                </div>
              </div>
              <Link href="/admin/networks">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  Manage Registry
                </Button>
              </Link>
            </div>

            {/* Content Item 2: Node Guides */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Node Guides & Runbooks</h4>
                  <p className="text-xs text-text-muted font-mono">
                    {guidesRes.total} step-by-step developer guides published
                  </p>
                </div>
              </div>
              <Link href="/admin/guides">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  View Runbooks
                </Button>
              </Link>
            </div>

            {/* Content Item 3: Opportunities */}
            <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-card-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-brand-cyan shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Opportunities Directory</h4>
                  <p className="text-xs text-text-muted font-mono">
                    {oppsRes.total} incentivized testnet campaigns monitored
                  </p>
                </div>
              </div>
              <Link href="/admin/opportunities">
                <Button size="sm" variant="outline" className="border-dark-card-border text-xs">
                  Manage Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Website Customizer Navigation Bar */}
      <div className="rounded-2xl border border-dark-card-border bg-dark-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Website Customizer & CMS Tools
            </h3>
            <p className="text-xs text-text-muted">
              Configure public layout, visual blocks, global navigation, and branding.
            </p>
          </div>
          <Link href="/admin/builder">
            <Button size="sm" variant="default" className="text-xs bg-brand-purple text-white">
              Visual Page Builder
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <Link
            href="/admin/header"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-brand-cyan group-hover:scale-110 transition-transform">Header & Nav</div>
            <div className="text-[10px] text-text-muted">Navbar Links</div>
          </Link>

          <Link
            href="/admin/footer"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-brand-purple-light group-hover:scale-110 transition-transform">Footer Layout</div>
            <div className="text-[10px] text-text-muted">Columns & Legal</div>
          </Link>

          <Link
            href="/admin/appearance"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-amber-400 group-hover:scale-110 transition-transform">Theme & Colors</div>
            <div className="text-[10px] text-text-muted">Dark Tokens</div>
          </Link>

          <Link
            href="/admin/media"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-emerald-400 group-hover:scale-110 transition-transform">Media Library</div>
            <div className="text-[10px] text-text-muted">Logos & Assets</div>
          </Link>

          <Link
            href="/admin/seo"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-rose-400 group-hover:scale-110 transition-transform">SEO & 301s</div>
            <div className="text-[10px] text-text-muted">Meta & Redirects</div>
          </Link>

          <Link
            href="/admin/versions"
            className="p-3 rounded-xl bg-dark-bg/80 border border-dark-card-border hover:border-brand-purple text-center space-y-1 transition-all group"
          >
            <div className="text-indigo-400 group-hover:scale-110 transition-transform">Revisions</div>
            <div className="text-[10px] text-text-muted">Safe Rollback</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
