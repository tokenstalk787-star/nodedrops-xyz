import Link from "next/link";
import {
  Cpu,
  Layers,
  BookOpen,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Server,
  Zap,
  Clock,
  ExternalLink,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Logo } from "../components/ui/logo";
import { getNetworks, getGuides, getOpportunities } from "../lib/services/data-service";

export const revalidate = 3600; // Static revalidation every hour for public home

export default async function HomePage() {
  const [networksRes, guidesRes, oppsRes] = await Promise.all([
    getNetworks({ limit: 4 }),
    getGuides({ limit: 4 }),
    getOpportunities({ limit: 3 }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-border/80 bg-radial-glow">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Official Brand Logo Lockup */}
            <div className="flex justify-center mb-2">
              <Logo size="xl" href="/" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>PRODUCTION-READY WEB3 INFRASTRUCTURE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
              Run Nodes. Learn Web3. <br />
              <span className="text-gradient">Explore Opportunities.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              Technical, verified node documentation, interactive hardware validation,
              and command builders designed for validators, infrastructure engineers, and beginners.
            </p>

            {/* Quick Search Bar */}
            <div className="w-full max-w-xl">
              <form action="/search" method="GET" className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search guides, networks (e.g. Sepolia, Geth, Celestia)..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-border bg-background-card/90 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/40 shadow-glow transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple-light text-white text-xs font-medium transition-colors"
                >
                  Explore
                </button>
              </form>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/guides">
                <Button variant="primary" size="lg" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Node Guides</span>
                </Button>
              </Link>
              <Link href="/tools/hardware-checker">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Wrench className="w-4 h-4 text-brand-cyan" />
                  <span>Check Node Hardware</span>
                </Button>
              </Link>
            </div>

            {/* Core Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-text-secondary border-t border-border/40 w-full max-w-3xl">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success" />
                <span>Verified Documentation</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                <span>Zero Wallet Requirement</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4 text-brand-purple-light" />
                <span>Tested Commands</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Server className="w-4 h-4 text-brand-blue-light" />
                <span>TiDB Cloud Backed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEARNING PATHWAYS (Beginners vs Advanced Operators) */}
      <section className="py-16 bg-[#090d18] border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tailored Infrastructure Pathways
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Whether you are spinning up your very first testnet node or managing multi-region validator clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Beginner Pathway */}
            <Card className="border-brand-blue/30 bg-gradient-to-br from-background-card to-background-secondary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl group-hover:bg-brand-blue/20 transition-colors" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue-light">
                    <Zap className="w-5 h-5" />
                  </div>
                  <Badge variant="beginner">Beginner Friendly</Badge>
                </div>
                <CardTitle className="text-xl mt-3">Beginner Node Operator Path</CardTitle>
                <CardDescription>
                  Start from scratch. Learn Linux server leasing, SSH key pair creation,
                  firewall rules (UFW), Docker deployment, and lightweight node participation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    How to rent a VPS and configure static IP addresses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    Running lightweight nodes (Celestia Light, Sepolia RPC)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    Step-by-step checklist with zero private key risks
                  </li>
                </ul>
                <div className="pt-3">
                  <Link href="/learn">
                    <Button variant="outline" size="sm" className="w-full gap-2 border-brand-blue/40 hover:bg-brand-blue/10">
                      <span>Start Beginner Onboarding</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Operator Pathway */}
            <Card className="border-brand-purple/30 bg-gradient-to-br from-background-card to-background-secondary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl group-hover:bg-brand-purple/20 transition-colors" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light">
                    <Server className="w-5 h-5" />
                  </div>
                  <Badge variant="advanced">Advanced Operators</Badge>
                </div>
                <CardTitle className="text-xl mt-3">Validator & DevOps Engineer Path</CardTitle>
                <CardDescription>
                  Production architecture, consensus & execution pairing, state pruning,
                  anti-slashing safeguards, Prometheus/Grafana monitoring, and systemd automation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-light" />
                    Production Geth + Lighthouse / Nethermind sync
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-light" />
                    State trie disk pruning without database corruption
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-light" />
                    Cosmos Sentry architecture & secure RPC isolation
                  </li>
                </ul>
                <div className="pt-3">
                  <Link href="/guides">
                    <Button variant="outline" size="sm" className="w-full gap-2 border-brand-purple/40 hover:bg-brand-purple/10">
                      <span>Explore Technical Guides</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. FEATURED GUIDES */}
      <section className="py-16 border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Node Guides</h2>
              <p className="text-xs text-text-secondary mt-1">
                Field-tested setup walkthroughs with copyable commands and expected terminal outputs.
              </p>
            </div>
            <Link href="/guides" className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-medium">
              <span>View all guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidesRes.items.map((guide) => (
              <Card key={guide.id} className="hover:border-border-glow transition-all flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={guide.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}>
                      {guide.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.estimatedMinutes} mins</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    <Link href={`/guides/${guide.slug}`} className="hover:text-brand-purple-light transition-colors">
                      {guide.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {guide.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs">
                    <span className="text-text-muted">By {guide.authorName}</span>
                    <Link href={`/guides/${guide.slug}`} className="text-brand-blue-light hover:text-white flex items-center gap-1 font-medium">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR NETWORKS */}
      <section className="py-16 bg-[#090d18] border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Popular Blockchain Networks</h2>
              <p className="text-xs text-text-secondary mt-1">
                Hardware profiles, consensus architectures, and client compatibility.
              </p>
            </div>
            <Link href="/networks" className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-medium">
              <span>All networks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {networksRes.items.map((net) => (
              <Card key={net.id} className="hover:border-brand-blue/50 transition-all">
                <CardHeader className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-white">{net.name}</span>
                    <Badge variant={net.networkType === "MAINNET" ? "mainnet" : "testnet"}>
                      {net.networkType}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-2 mb-3">
                    {net.description}
                  </CardDescription>
                  <div className="space-y-1.5 pt-2 border-t border-border/60 text-[11px] font-mono text-text-secondary">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Min RAM:</span>
                      <span className="text-white">{net.hardwareRequirements.min.ramGb} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Min Storage:</span>
                      <span className="text-white">{net.hardwareRequirements.min.ssdGb} GB</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link href={`/networks/${net.slug}`}>
                      <Button variant="secondary" size="sm" className="w-full text-xs">
                        View Hardware Specs
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VERIFIED OPPORTUNITIES DIRECTORY */}
      <section className="py-16 border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INCENTIVIZED TESTNETS & VALIDATOR CAMPAIGNS</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Active Node Opportunities</h2>
              <p className="text-xs text-text-secondary mt-1">
                Verified campaigns with factual reward statuses. We never invent rewards or promise airdrops.
              </p>
            </div>
            <Link href="/opportunities" className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-medium">
              <span>View directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oppsRes.items.map((opp) => (
              <Card key={opp.id} className="flex flex-col hover:border-border-glow transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={opp.campaignStatus.toLowerCase() as "active" | "upcoming" | "ended"}>
                      {opp.campaignStatus}
                    </Badge>
                    <span className="text-[11px] font-mono text-text-muted">
                      Reward: {opp.rewardStatus}
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold">{opp.projectName}</CardTitle>
                  <CardDescription className="text-xs line-clamp-3 mt-1">
                    {opp.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="pt-3 border-t border-border/40 text-xs">
                    <Link href={`/opportunities/${opp.slug}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Participation Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECURITY & SCAM AWARENESS WARNING */}
      <section className="py-12 bg-[#0d0716] border-b border-border/80">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/10 p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 rounded-lg bg-brand-purple/20 text-brand-purple-light shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-cyan" />
            </div>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Node Operator Security Protocol
              </h3>
              <p>
                <strong>Never share your private keys or seed phrase.</strong> NodeDrops.xyz will never request your wallet connection merely to read guides, check hardware, or browse opportunities.
              </p>
              <p>
                Always verify shell commands before execution. Never pipe untrusted external curl commands directly into bash (<code className="text-status-warning">curl ... | bash</code>) without inspecting the script payload.
              </p>
              <div className="pt-2">
                <Link href="/security" className="text-brand-cyan hover:underline font-medium inline-flex items-center gap-1">
                  <span>Read our complete Security & Scam Awareness Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
