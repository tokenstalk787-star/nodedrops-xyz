import { Cpu, ShieldCheck, Heart, Terminal, Server } from "lucide-react";

export const metadata = {
  title: "About NodeDrops.xyz",
  description: "Mission, engineering principles, and infrastructure philosophy of NodeDrops.xyz.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About NodeDrops.xyz
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Building reproducible, secure, and production-tested blockchain infrastructure documentation.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p>
            Blockchains can only be as decentralized and censorship-resistant as the community running their nodes.
            Yet, finding accurate, up-to-date, and reproducible node deployment guides is notoriously difficult.
            Outdated documentation, insecure copy-paste curl scripts, and fabricated reward promises run rampant across the Web3 ecosystem.
          </p>
          <p>
            NodeDrops.xyz was founded to establish an engineering standard for blockchain node education:
            factual hardware benchmarks, safe systemd sandboxing, zero wallet mandates, and transparent reward verification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Core Engineering Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-status-success" />
                <span>Zero Wallet Mandate</span>
              </div>
              <p className="text-xs text-text-secondary">
                We will never ask you to connect a Web3 wallet or reveal private keys to read technical documentation or use our tools.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Terminal className="w-4 h-4 text-brand-cyan" />
                <span>Verifiable Shell Commands</span>
              </div>
              <p className="text-xs text-text-secondary">
                Every command block is tested and documented. We never recommend unvetted external scripts piped directly to bash.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Server className="w-4 h-4 text-brand-purple-light" />
                <span>Factual Hardware Profiles</span>
              </div>
              <p className="text-xs text-text-secondary">
                We distinguish between minimum baseline specs and recommended production validator requirements.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Cpu className="w-4 h-4 text-brand-blue-light" />
                <span>No Airdrop Guarantees</span>
              </div>
              <p className="text-xs text-text-secondary">
                We clearly label confirmed rewards versus speculative testnets without sensationalized promises.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
