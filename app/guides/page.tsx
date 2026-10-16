import Link from "next/link";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Zap,
  Sparkles,
  Layers,
  Wrench,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { getGuides } from "@/lib/services/data-service";
import { GuidesHeroTerminal } from "@/components/guides/guides-hero-terminal";
import { GuidesHubClient } from "@/components/guides/guides-hub-client";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Node Engineering & Validator Guides | NodeDrops",
  description:
    "Production-tested, reproducible node deployment recipes for Ethereum, Celestia, Solana, Babylon, and Berachain.",
};

export default async function GuidesPage() {
  const guidesRes = await getGuides({ limit: 50 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. DEVELOPER HERO WITH LIVE TERMINAL EMULATOR */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-border/80 bg-radial-glow">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Mission */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                <span>DEV RUNBOOKS // PRODUCTION ARCHITECTURE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Node Engineering & <br />
                <span className="text-gradient">Validator Runbooks</span>
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                Field-tested execution recipes, peer discovery, automated systemd services, and anti-slashing safeguards. Written for validators, infrastructure engineers, and aspiring node runners.
              </p>

              {/* Quick Specs Callouts */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-dark-card border border-dark-card-border space-y-1">
                  <div className="text-[10px] text-text-muted uppercase">Verified Guides</div>
                  <div className="text-lg font-bold text-white">{guidesRes.items.length}+ Runbooks</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-card border border-dark-card-border space-y-1">
                  <div className="text-[10px] text-text-muted uppercase">Zero Third-Party</div>
                  <div className="text-lg font-bold text-brand-cyan">100% Native</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-card border border-dark-card-border space-y-1">
                  <div className="text-[10px] text-text-muted uppercase">Platform Spec</div>
                  <div className="text-lg font-bold text-emerald-400">Linux LTS</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Terminal Emulator */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <GuidesHeroTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED QUICKSTART LEARNING TRACKS (Like Rust Book / Modern Docs) */}
      <section className="py-12 border-b border-border/80 bg-[#060810]">
        <div className="container mx-auto px-4 max-w-7xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-brand-purple">
                Curated Engineering Tracks
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                Start Here: Step-by-Step Operator Pathways
              </h2>
            </div>
            <span className="text-xs text-text-muted font-mono">
              Designed for progressive mastery
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Track 1 */}
            <div className="p-6 rounded-2xl border border-dark-card-border bg-dark-card hover:border-brand-purple/40 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  TRACK 01 // BEGINNER
                </span>
                <span className="text-xs text-text-muted font-mono">4 Modules • 25m</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-purple-light transition-colors">
                  Genesis to First Node
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  Master Linux server leasing, SSH key isolation, UFW firewall security, and spin up a lightweight Celestia DAS sampling node.
                </p>
              </div>
              <div className="pt-2 border-t border-dark-card-border/60">
                <Link
                  href="/guides/setting-up-celestia-light-node-mocha"
                  className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                >
                  <span>Launch Track 01</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Track 2 */}
            <div className="p-6 rounded-2xl border border-dark-card-border bg-dark-card hover:border-brand-purple/40 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                  TRACK 02 // INTERMEDIATE
                </span>
                <span className="text-xs text-text-muted font-mono">5 Modules • 45m</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-purple-light transition-colors">
                  EVM Execution & PoS Consensus
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  Deploy paired Execution (Geth) and Consensus (Lighthouse) daemons with JWT Engine API authentication and state syncing.
                </p>
              </div>
              <div className="pt-2 border-t border-dark-card-border/60">
                <Link
                  href="/guides/run-ethereum-sepolia-node-geth-lighthouse"
                  className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                >
                  <span>Launch Track 02</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Track 3 */}
            <div className="p-6 rounded-2xl border border-dark-card-border bg-dark-card hover:border-brand-purple/40 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                  TRACK 03 // ADVANCED
                </span>
                <span className="text-xs text-text-muted font-mono">6 Modules • 60m</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-purple-light transition-colors">
                  Validator Security & Hardening
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  Linux kernel sysctl network optimization, remote signer key isolation, Fail2ban brute force defense, and Prometheus telemetry.
                </p>
              </div>
              <div className="pt-2 border-t border-dark-card-border/60">
                <Link
                  href="/guides/linux-security-hardening-node-operators"
                  className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                >
                  <span>Launch Track 03</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE GUIDES REPOSITORY & CLIENT FILTER HUB */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <GuidesHubClient initialGuides={guidesRes.items} />
        </div>
      </section>

      {/* 4. DEVELOPER UTILITY TOOLS PROMO */}
      <section className="py-12 border-t border-border/80 bg-gradient-to-b from-[#070a14] to-[#04060c]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool 1 */}
            <div className="p-6 rounded-2xl border border-dark-card-border bg-dark-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan uppercase">
                <Cpu className="w-4 h-4" />
                <span>Pre-Flight Validation</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Check Server Hardware Compatibility
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Before purchasing or provisioning a VPS, verify whether your CPU cores, RAM, and NVMe disk meet the consensus network requirements.
              </p>
              <div className="pt-2">
                <Link href="/tools/hardware-checker">
                  <Button variant="outline" size="sm" className="border-dark-card-border text-xs gap-1.5">
                    <span>Evaluate Server Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="p-6 rounded-2xl border border-dark-card-border bg-dark-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-purple uppercase">
                <Terminal className="w-4 h-4" />
                <span>Zero-Error Configuration</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Automated Command & Systemd Generator
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate production-ready systemd service files, Docker Compose templates, and initialization flags customized to your directory paths.
              </p>
              <div className="pt-2">
                <Link href="/tools/command-builder">
                  <Button variant="outline" size="sm" className="border-dark-card-border text-xs gap-1.5">
                    <span>Generate Commands</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
