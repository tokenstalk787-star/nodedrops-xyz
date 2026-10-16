import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminMetrics } from "@/lib/services/data-service";

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Operations Dashboard
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time infrastructure statistics, content publication metrics, and audit records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/guides/new">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Guide</span>
            </Button>
          </Link>
          <Link href="/admin/networks">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>Manage Networks</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (4 key cards matching reference visuals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-brand-purple/30 bg-background-card">
          <CardHeader className="p-5 pb-2">
            <span className="text-[11px] font-mono text-text-muted uppercase">Published Guides</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">{metrics.publishedGuides}</span>
              <span className="text-xs text-status-success font-mono">
                {metrics.draftGuides} Drafts
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-text-secondary">
            Verified step-by-step technical guides
          </CardContent>
        </Card>

        <Card className="border-brand-blue/30 bg-background-card">
          <CardHeader className="p-5 pb-2">
            <span className="text-[11px] font-mono text-text-muted uppercase">Monitored Networks</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-brand-blue-light font-mono">{metrics.totalNetworks}</span>
              <span className="text-xs text-brand-cyan font-mono">100% Up to Date</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-text-secondary">
            L1, L2 & Modular network profiles
          </CardContent>
        </Card>

        <Card className="border-brand-cyan/30 bg-background-card">
          <CardHeader className="p-5 pb-2">
            <span className="text-[11px] font-mono text-text-muted uppercase">Active Opportunities</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-brand-cyan font-mono">{metrics.activeOpportunities}</span>
              <span className="text-xs text-text-muted font-mono">{metrics.expiredOpportunities} Ended</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-text-secondary">
            Verified public node testnet campaigns
          </CardContent>
        </Card>

        <Card className="border-status-success/30 bg-background-card">
          <CardHeader className="p-5 pb-2">
            <span className="text-[11px] font-mono text-text-muted uppercase">Database Layer</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-status-success font-mono">
                {metrics.isDbConnected ? "TiDB Cloud" : "Demo Cache"}
              </span>
              <span className="text-xs text-status-success font-mono">Active</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-text-secondary">
            {metrics.isDbConnected ? "MySQL Protocol TLS Connected" : "Local Mock Storage Mode"}
          </CardContent>
        </Card>
      </div>

      {/* Website Control Center Quick-Launch Deck */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
              Website Control Center Modules
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Rapid access to visual builder, page configurations, design studio, and publishing workflows.
            </p>
          </div>
          <Link href="/admin/builder">
            <Button size="sm" variant="default" className="text-xs">
              Open Visual Builder ↗
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Visual Builder", href: "/admin/builder", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z", color: "text-brand-purple" },
            { label: "Pages & SEO", href: "/admin/pages", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "text-brand-blue" },
            { label: "Header & Nav", href: "/admin/header", icon: "M4 6h16M4 12h16M4 18h16", color: "text-brand-cyan" },
            { label: "Footer Layout", href: "/admin/footer", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "text-emerald-400" },
            { label: "Theme Studio", href: "/admin/appearance", icon: "M7 21a4 4 0 01-4-4 4 4 0 014-4c.78 0 1.5.22 2.11.61L18 4.72a2 2 0 112.83 2.83L11.39 17.06c.39.61.61 1.33.61 2.11a4 4 0 01-4 4z", color: "text-purple-400" },
            { label: "Media Library", href: "/admin/media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "text-amber-400" },
            { label: "Redirect Rules", href: "/admin/seo", icon: "M13 7l5 5m0 0l-5 5m5-5H6", color: "text-rose-400" },
            { label: "Rollback & Revs", href: "/admin/versions", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-indigo-400" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/60 border border-dark-card-border hover:border-brand-purple/50 hover:bg-dark-bg transition-all group text-center"
            >
              <div className={`p-2 rounded-lg bg-dark-card ${item.color} group-hover:scale-110 transition-transform mb-1.5`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-text-primary group-hover:text-white transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Visual Analytics Chart Board (matching user screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-background-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-white">Documentation Traffic & Verifications</CardTitle>
                <CardDescription className="text-xs">Weekly verification throughput and guide reads</CardDescription>
              </div>
              <Badge variant="active" className="text-[10px]">Live Telemetry</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* SVG Wave / Line Chart Representation */}
            <div className="h-52 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
                {/* Area */}
                <path
                  d="M0,120 Q50,90 100,105 T200,60 T300,80 T400,35 T500,45 L500,140 L0,140 Z"
                  fill="url(#purpleGrad)"
                />
                {/* Stroke */}
                <path
                  d="M0,120 Q50,90 100,105 T200,60 T300,80 T400,35 T500,45"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                />
                {/* Data Points */}
                <circle cx="100" cy="105" r="4" fill="#38bdf8" />
                <circle cx="200" cy="60" r="4" fill="#a855f7" />
                <circle cx="300" cy="80" r="4" fill="#38bdf8" />
                <circle cx="400" cy="35" r="5" fill="#22c55e" />
                <circle cx="500" cy="45" r="4" fill="#38bdf8" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-border/40">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Node Distribution Breakdown */}
        <Card className="border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-base text-white">Network Distribution</CardTitle>
            <CardDescription className="text-xs">Monitored client types across all chains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">Execution & Consensus (EVM)</span>
                <span className="text-white font-semibold">45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-secondary overflow-hidden">
                <div className="w-[45%] h-full bg-brand-purple" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">Data Availability (Celestia)</span>
                <span className="text-white font-semibold">30%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-secondary overflow-hidden">
                <div className="w-[30%] h-full bg-brand-cyan" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">Cosmos SDK / CometBFT</span>
                <span className="text-white font-semibold">15%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-secondary overflow-hidden">
                <div className="w-[15%] h-full bg-brand-blue" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">High Throughput (Solana)</span>
                <span className="text-white font-semibold">10%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-secondary overflow-hidden">
                <div className="w-[10%] h-full bg-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Logs Table */}
      <Card className="border-border bg-background-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">Recent Security & Content Audit Trail</CardTitle>
              <CardDescription className="text-xs">Immutable action log for administrative operations</CardDescription>
            </div>
            <Link href="/admin/audit-logs">
              <Button variant="outline" size="sm" className="text-xs">View All Logs</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted">
                <th className="py-2.5 pr-4 font-normal">Action</th>
                <th className="py-2.5 px-4 font-normal">Target Type</th>
                <th className="py-2.5 px-4 font-normal">Operator / Actor</th>
                <th className="py-2.5 pl-4 font-normal text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {metrics.recentLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 pr-4 text-brand-cyan font-semibold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300">{log.targetType}</td>
                  <td className="py-3 px-4 text-text-secondary">{log.actor}</td>
                  <td className="py-3 pl-4 text-right text-text-muted">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
