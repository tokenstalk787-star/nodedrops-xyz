import React from "react";
import Link from "next/link";
import {
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { PageSectionItem } from "@/lib/services/mock-data";
import { Button } from "@/components/ui/button";

export function PageRenderer({
  sections,
  networks = [],
  guides = [],
  opportunities = [],
}: {
  sections: PageSectionItem[];
  networks?: any[];
  guides?: any[];
  opportunities?: any[];
}) {
  const visibleSections = sections.filter((s) => s.isVisible);

  return (
    <div className="space-y-16 py-8">
      {visibleSections.map((sec) => {
        const cfg = sec.config || {};

        switch (sec.componentType) {
          case "HERO":
            return (
              <section key={sec.id} className="text-center py-12 px-4 max-w-4xl mx-auto space-y-5">
                {cfg.badge && (
                  <span className="inline-block px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
                    {cfg.badge}
                  </span>
                )}
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {cfg.heading || "Run Nodes. Build Web3."}{" "}
                  {cfg.highlightText && (
                    <span className="bg-gradient-to-r from-brand-cyan to-brand-purple-light bg-clip-text text-transparent">
                      {cfg.highlightText}
                    </span>
                  )}
                </h1>
                {cfg.description && (
                  <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    {cfg.description}
                  </p>
                )}
                {cfg.primaryCtaLabel && (
                  <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
                    <Link href={cfg.primaryCtaHref || "/guides"}>
                      <Button variant="default" className="text-sm font-semibold px-6 h-11">
                        {cfg.primaryCtaLabel} &rarr;
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            );

          case "STATS":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-6xl">
                {cfg.title && (
                  <h3 className="text-sm uppercase font-mono text-text-muted text-center mb-6">
                    {cfg.title}
                  </h3>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(cfg.items || [
                    { label: "Active Nodes", value: "1,248" },
                    { label: "Uptime", value: "99.98%" },
                  ]).map((stat: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-dark-card border border-dark-card-border text-center shadow-lg"
                    >
                      <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-text-muted font-mono mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "FEATURES":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-6xl space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {cfg.title || "Platform Architecture & Features"}
                  </h2>
                  {cfg.subtitle && <p className="text-sm text-text-muted">{cfg.subtitle}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {(cfg.cards || [
                    { title: "Hardened Runbooks", description: "Step-by-step validator documentation" },
                    { title: "Hardware Checker", description: "Verify RAM, SSD, and CPU compatibility" },
                    { title: "Command Builder", description: "Generate shell scripts in seconds" },
                  ]).map((card: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-dark-card border border-dark-card-border hover:border-brand-purple/50 transition-all shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-lg bg-brand-purple/20 text-brand-purple-light flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        {card.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 font-mono">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white">{card.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{card.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "GUIDE_GRID":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-6xl space-y-4">
                <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-purple" />
                    <h3 className="text-lg font-bold text-white">Recommended Node Setup Guides</h3>
                  </div>
                  <Link href="/guides" className="text-xs font-mono text-brand-cyan hover:underline">
                    View All Guides &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(guides.length > 0
                    ? guides.slice(0, 3)
                    : [
                        { title: "Celestia Light Node", slug: "celestia-light-node", difficulty: "BEGINNER" },
                        { title: "Ethereum Sepolia Full Node", slug: "ethereum-sepolia", difficulty: "INTERMEDIATE" },
                        { title: "Berachain Bartio Validator", slug: "berachain-bartio", difficulty: "ADVANCED" },
                      ]
                  ).map((guide: any) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="p-4 rounded-xl bg-dark-card border border-dark-card-border hover:border-brand-purple transition-all space-y-2 block"
                    >
                      <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light font-mono">
                        {guide.difficulty || "NODE GUIDE"}
                      </span>
                      <h4 className="text-sm font-bold text-white">{guide.title}</h4>
                      <p className="text-xs text-text-muted line-clamp-2">
                        {guide.excerpt || "Production-ready step-by-step setup documentation."}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );

          case "NETWORK_GRID":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-6xl space-y-4">
                <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-cyan" />
                    <h3 className="text-lg font-bold text-white">Supported Blockchain Networks</h3>
                  </div>
                  <Link href="/networks" className="text-xs font-mono text-brand-cyan hover:underline">
                    All Networks &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(networks.length > 0
                    ? networks.slice(0, 4)
                    : [
                        { name: "Ethereum Sepolia", slug: "ethereum-sepolia", networkType: "TESTNET" },
                        { name: "Celestia", slug: "celestia", networkType: "TESTNET" },
                        { name: "Monad", slug: "monad-devnet", networkType: "TESTNET" },
                        { name: "Solana", slug: "solana", networkType: "MAINNET" },
                      ]
                  ).map((net: any) => (
                    <Link
                      key={net.slug}
                      href={`/networks/${net.slug}`}
                      className="p-4 rounded-xl bg-dark-card border border-dark-card-border hover:border-brand-cyan transition-all space-y-2 block"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{net.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-bg border border-dark-card-border font-mono text-brand-cyan">
                          {net.networkType}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted font-mono truncate">
                        {net.nodeTypes || "Full Node, Validator"}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );

          case "FAQ":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-3xl space-y-4">
                <h3 className="text-xl font-bold text-white text-center mb-6">
                  {cfg.title || "Frequently Asked Questions"}
                </h3>
                <div className="space-y-3">
                  {(cfg.items || [
                    {
                      question: "What are the hardware prerequisites?",
                      answer: "Refer to each network specification or use our Hardware Checker tool.",
                    },
                    {
                      question: "Do I need to connect a Web3 wallet?",
                      answer: "No. NodeDrops is strictly an educational resource and never requires wallet keys.",
                    },
                  ]).map((faq: any, idx: number) => (
                    <details
                      key={idx}
                      className="p-4 rounded-xl bg-dark-card border border-dark-card-border text-xs text-text-secondary cursor-pointer"
                    >
                      <summary className="font-semibold text-white text-sm list-none flex items-center justify-between">
                        <span>{faq.question}</span>
                        <span className="text-brand-purple font-mono text-base">+</span>
                      </summary>
                      <p className="mt-3 leading-relaxed text-text-muted pl-1">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );

          case "CTA":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-4xl">
                <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/40 text-center space-y-4 shadow-2xl">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {cfg.heading || "Ready to Run Your Node?"}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
                    {cfg.description || "Start following our tested instructions and join the decentralized validator set."}
                  </p>
                  <div className="pt-2">
                    <Link href={cfg.buttonHref || "/tools/checklist"}>
                      <Button variant="default" className="text-xs font-semibold px-6 h-10">
                        {cfg.buttonText || "Launch Pre-Flight Checklist"} &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            );

          case "RICH_TEXT":
            return (
              <section key={sec.id} className="container mx-auto px-4 max-w-3xl prose prose-invert">
                {cfg.title && <h2 className="text-2xl font-bold text-white mb-4">{cfg.title}</h2>}
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {cfg.contentMarkdown || "Custom content article."}
                </div>
              </section>
            );

          case "DIVIDER":
            return (
              <div key={sec.id} className="container mx-auto px-4 max-w-5xl">
                <hr className="border-t border-dark-card-border" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
