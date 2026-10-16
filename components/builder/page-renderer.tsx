"use client";

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
  ChevronDown,
  Search,
  MoveUp,
  MoveDown,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Settings2,
} from "lucide-react";
import { PageSectionItem } from "@/lib/services/mock-data";
import { Button } from "@/components/ui/button";
import { NodeDashboardContainer } from "@/components/home/node-dashboard-container";
import { HomeFaqSection } from "@/components/home/home-faq-section";

interface PageRendererProps {
  sections: PageSectionItem[];
  networks?: any[];
  guides?: any[];
  opportunities?: any[];
  isEditable?: boolean;
  selectedSectionId?: string;
  onSelectSection?: (id: string) => void;
  onMoveSection?: (index: number, direction: "up" | "down", e: React.MouseEvent) => void;
  onDuplicateSection?: (secId: string, e: React.MouseEvent) => void;
  onDeleteSection?: (secId: string, e: React.MouseEvent) => void;
  onToggleVisibility?: (secId: string, e: React.MouseEvent) => void;
  onInsertSection?: (index: number) => void;
}

export function PageRenderer({
  sections,
  networks = [],
  guides = [],
  opportunities = [],
  isEditable = false,
  selectedSectionId,
  onSelectSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleVisibility,
  onInsertSection,
}: PageRendererProps) {
  // If not in editor mode, filter out invisible sections
  const displaySections = isEditable ? sections : sections.filter((s) => s.isVisible);

  return (
    <div className="space-y-12 py-4">
      {displaySections.map((sec, idx) => {
        const cfg = sec.config || {};
        const isSelected = isEditable && sec.id === selectedSectionId;

        const content = renderSectionContent(sec, cfg, networks, guides, opportunities);

        if (!isEditable) {
          return <React.Fragment key={sec.id}>{content}</React.Fragment>;
        }

        // EDITABLE WRAPPER
        return (
          <div key={sec.id} className="relative group">
            {/* Quick Add Insert Button Above */}
            {onInsertSection && (
              <div className="flex justify-center -my-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 relative">
                <button
                  type="button"
                  onClick={() => onInsertSection(idx)}
                  className="px-3 py-1 rounded-full bg-brand-purple hover:bg-brand-purple-light text-white text-[10px] font-mono flex items-center gap-1 shadow-lg border border-brand-purple/40 hover:scale-105 transition-transform"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert Section Here</span>
                </button>
              </div>
            )}

            {/* Section Card Frame */}
            <div
              onClick={() => onSelectSection?.(sec.id)}
              className={`relative rounded-2xl transition-all cursor-pointer ${
                !sec.isVisible ? "opacity-40 border-dashed" : ""
              } ${
                isSelected
                  ? "ring-2 ring-brand-purple ring-offset-4 ring-offset-[#080b14] bg-[#0c1020]/40 shadow-glow-purple border border-brand-purple/50"
                  : "border border-dark-card-border/60 hover:border-brand-purple/40 hover:bg-[#0c1020]/20"
              }`}
            >
              {/* Floating Action Header for Canvas */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-dark-card-border/80 bg-[#0c1224]/90 rounded-t-2xl font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-brand-purple/20 text-brand-purple-light flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white text-xs">{getSectionLabel(sec.componentType)}</span>
                  {!sec.isVisible && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      HIDDEN
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40">
                      EDITING
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {onMoveSection && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => onMoveSection(idx, "up", e)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded text-text-muted hover:text-white hover:bg-white/10 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onMoveSection(idx, "down", e)}
                        disabled={idx === displaySections.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-text-muted hover:text-white hover:bg-white/10 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {onDuplicateSection && (
                    <button
                      type="button"
                      onClick={(e) => onDuplicateSection(sec.id, e)}
                      title="Duplicate Section"
                      className="p-1 rounded text-text-muted hover:text-brand-cyan hover:bg-white/10"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onToggleVisibility && (
                    <button
                      type="button"
                      onClick={(e) => onToggleVisibility(sec.id, e)}
                      title={sec.isVisible ? "Hide on website" : "Show on website"}
                      className={`p-1 rounded hover:bg-white/10 ${
                        sec.isVisible ? "text-brand-cyan" : "text-amber-400"
                      }`}
                    >
                      {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {onDeleteSection && (
                    <button
                      type="button"
                      onClick={(e) => onDeleteSection(sec.id, e)}
                      title="Delete Section"
                      className="p-1 rounded text-text-muted hover:text-rose-400 hover:bg-rose-500/10 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rendered Component Content */}
              <div className="p-4 sm:p-6">{content}</div>
            </div>
          </div>
        );
      })}

      {/* Insert Button at Very End (in Editor mode) */}
      {isEditable && onInsertSection && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => onInsertSection(displaySections.length)}
            className="px-4 py-2 rounded-xl border border-dashed border-brand-purple/60 hover:border-brand-purple text-brand-purple hover:text-brand-purple-light hover:bg-brand-purple/10 text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section at Bottom</span>
          </button>
        </div>
      )}
    </div>
  );
}

function getSectionLabel(type: PageSectionItem["componentType"]): string {
  switch (type) {
    case "HERO":
      return "Hero Headline Banner";
    case "NODE_DASHBOARD":
      return "Potential Airdrops & Testnets (CryptoRank Table)";
    case "SECURITY_BANNER":
      return "Security & Scam Prevention Protocol";
    case "FEATURES":
      return "Infrastructure Pathways & Feature Cards";
    case "STATS":
      return "Platform Statistics Bar";
    case "GUIDE_GRID":
      return "Setup Runbooks & Guides Grid";
    case "NETWORK_GRID":
      return "Supported Blockchain Networks";
    case "OPPORTUNITY_GRID":
      return "Airdrop & Validator Opportunities";
    case "FAQ":
      return "Frequently Asked Questions (FAQ Accordion)";
    case "CTA":
      return "Call to Action Conversion Card";
    case "RICH_TEXT":
      return "Rich Text & Article Block";
    case "DIVIDER":
      return "Decorative Divider Line";
    default:
      return type;
  }
}

function renderSectionContent(
  sec: PageSectionItem,
  cfg: Record<string, any>,
  networks: any[],
  guides: any[],
  opportunities: any[]
) {
  switch (sec.componentType) {
    case "HERO":
      return (
        <section className="text-center py-8 px-4 max-w-4xl mx-auto space-y-5">
          {cfg.badge && (
            <span className="inline-block px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono font-medium">
              {cfg.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {cfg.heading || "Run Nodes. Learn Web3."}{" "}
            {cfg.highlightText && (
              <span className="bg-gradient-to-r from-brand-cyan to-brand-purple-light bg-clip-text text-transparent">
                {cfg.highlightText}
              </span>
            )}
          </h1>
          {cfg.description && (
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {cfg.description}
            </p>
          )}

          {cfg.showSearch && (
            <div className="max-w-md mx-auto relative pt-2">
              <Search className="w-4 h-4 absolute left-3.5 top-5 text-text-muted" />
              <input
                type="text"
                disabled
                placeholder="Search networks, testnets, or guide commands..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-card-border bg-[#0d1222] text-xs text-white placeholder-text-muted focus:outline-none"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {cfg.primaryCtaLabel && (
              <Link href={cfg.primaryCtaHref || "/guides"}>
                <Button variant="default" className="text-xs sm:text-sm font-semibold px-6 h-10 shadow-lg">
                  {cfg.primaryCtaLabel} &rarr;
                </Button>
              </Link>
            )}
            {cfg.secondaryCtaLabel && (
              <Link href={cfg.secondaryCtaHref || "/tools/hardware-checker"}>
                <Button variant="outline" className="text-xs sm:text-sm font-semibold px-5 h-10 border-dark-card-border">
                  {cfg.secondaryCtaLabel}
                </Button>
              </Link>
            )}
          </div>
        </section>
      );

    case "NODE_DASHBOARD":
      return (
        <section className="py-2">
          {cfg.title && (
            <div className="mb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{cfg.title}</h2>
              {cfg.subtitle && <p className="text-xs text-text-muted mt-1">{cfg.subtitle}</p>}
            </div>
          )}
          <NodeDashboardContainer
            initialOpportunities={opportunities.length > 0 ? opportunities : []}
            totalRunbooks={guides.length || 28}
          />
        </section>
      );

    case "SECURITY_BANNER":
      return (
        <section className="py-4">
          <div className="rounded-2xl border border-brand-purple/40 bg-gradient-to-r from-brand-purple/10 via-dark-card to-brand-blue/10 p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-5 shadow-xl">
            <div className="p-3 rounded-xl bg-brand-purple/20 text-brand-purple-light shrink-0 border border-brand-purple/30">
              <ShieldCheck className="w-7 h-7 text-brand-cyan" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {cfg.title || "NodeDrops.xyz Operator Security Protocol"}
                </h3>
                <span className="px-2 py-0.5 rounded bg-status-success/20 text-status-success text-[10px] font-mono border border-status-success/40">
                  {cfg.badge || "ZERO-WALLET GUARANTEE"}
                </span>
              </div>
              <p>
                <strong>Never share your mnemonic seed phrase or private keys.</strong>{" "}
                {cfg.warningText ||
                  "NodeDrops.xyz will never request your wallet connection merely to view opportunities, benchmark hardware, or read runbooks."}
              </p>
              <div className="pt-2">
                <Link
                  href={cfg.linkHref || "/security"}
                  className="text-brand-cyan hover:underline font-mono text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>{cfg.linkLabel || "Read complete Security & Slashing Prevention Protocol"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      );

    case "FAQ":
      if (cfg.items && Array.isArray(cfg.items) && cfg.items.length > 0) {
        return (
          <section className="py-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {cfg.title || "Frequently Asked Questions"}
              </h2>
              {cfg.subtitle && <p className="text-xs sm:text-sm text-text-muted">{cfg.subtitle}</p>}
            </div>
            <div className="space-y-3">
              {cfg.items.map((faq: any, i: number) => (
                <details
                  key={i}
                  className="p-4 rounded-xl bg-dark-card border border-dark-card-border text-xs text-text-secondary cursor-pointer hover:border-brand-purple/40 transition-colors"
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
      }
      return <HomeFaqSection />;

    case "FEATURES":
      return (
        <section className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {cfg.title || "Platform Architecture & Features"}
            </h2>
            {cfg.subtitle && <p className="text-xs sm:text-sm text-text-muted">{cfg.subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {(cfg.cards || [
              {
                title: "Beginner Operator Path",
                description: "Start from scratch. Learn Linux server leasing, SSH key pairs, and firewall rules.",
                badge: "Beginner",
                href: "/learn",
              },
              {
                title: "Validator & DevOps Path",
                description: "Production architecture, consensus & execution pairing, and systemd automation.",
                badge: "Advanced",
                href: "/guides",
              },
              {
                title: "Hardware Benchmarking",
                description: "Real-time hardware verification for CPU, RAM, NVMe SSD, and bandwidth requirements.",
                badge: "Interactive Tool",
                href: "/tools/hardware-checker",
              },
            ]).map((card: any, i: number) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-dark-card border border-dark-card-border hover:border-brand-purple/50 transition-all shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-brand-purple/20 text-brand-purple-light flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </span>
                  {card.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 font-mono">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{card.description}</p>
                {card.href && (
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1 text-xs font-mono text-brand-cyan hover:underline pt-1"
                  >
                    <span>Explore pathway</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case "STATS":
      return (
        <section className="py-4">
          {cfg.title && (
            <h3 className="text-xs uppercase font-mono text-text-muted text-center mb-6 tracking-wider">
              {cfg.title}
            </h3>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(cfg.items || [
              { label: "Active Nodes Monitored", value: "1,248+" },
              { label: "Verified Runbooks", value: "28" },
              { label: "Average Network Uptime", value: "99.98%" },
              { label: "Hardware Verified", value: "100%" },
            ]).map((stat: any, i: number) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-dark-card border border-dark-card-border text-center shadow-lg"
              >
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-text-muted font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case "GUIDE_GRID": {
      const limit = Number(cfg.itemLimit) || 3;
      const displayGuides = guides.slice(0, limit);
      return (
        <section className="space-y-4 py-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-purple" />
              <h3 className="text-lg font-bold text-white">{cfg.title || "Recommended Node Setup Guides"}</h3>
            </div>
            <Link
              href={cfg.viewAllLink || "/guides"}
              className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>View All Guides</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(displayGuides.length > 0
              ? displayGuides
              : [
                  { title: "Celestia Light Node", slug: "celestia-light-node-mocha-testnet", difficulty: "BEGINNER" },
                  { title: "Ethereum Sepolia Validator", slug: "ethereum-sepolia", difficulty: "INTERMEDIATE" },
                  { title: "Berachain Bartio Node", slug: "berachain-bartio", difficulty: "ADVANCED" },
                ]
            ).map((guide: any) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="p-4 rounded-xl bg-dark-card border border-dark-card-border hover:border-brand-purple transition-all space-y-2 block"
              >
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light font-mono font-semibold">
                  {guide.difficulty || "NODE GUIDE"}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{guide.title}</h4>
                <p className="text-xs text-text-muted line-clamp-2">
                  {guide.excerpt || "Production-ready step-by-step setup documentation."}
                </p>
              </Link>
            ))}
          </div>
        </section>
      );
    }

    case "NETWORK_GRID": {
      const limit = Number(cfg.itemLimit) || 4;
      const displayNetworks = networks.slice(0, limit);
      return (
        <section className="space-y-4 py-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-lg font-bold text-white">{cfg.title || "Supported Blockchain Networks"}</h3>
            </div>
            <Link
              href={cfg.viewAllLink || "/networks"}
              className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>All Networks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(displayNetworks.length > 0
              ? displayNetworks
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
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#080b14] border border-dark-card-border font-mono text-brand-cyan">
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
    }

    case "OPPORTUNITY_GRID": {
      const limit = Number(cfg.itemLimit) || 3;
      const displayOpps = opportunities.slice(0, limit);
      return (
        <section className="space-y-4 py-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple-light" />
              <h3 className="text-lg font-bold text-white">{cfg.title || "Featured Node Opportunities"}</h3>
            </div>
            <Link
              href={cfg.viewAllLink || "/opportunities"}
              className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(displayOpps.length > 0
              ? displayOpps
              : [
                  { projectName: "Story Protocol Odyssey", campaignType: "Incentivized Testnet", rewardStatus: "CONFIRMED" },
                  { projectName: "Babylon Bitcoin Staking", campaignType: "Finality Provider", rewardStatus: "POTENTIAL" },
                  { projectName: "Berachain Bartio", campaignType: "Validator Node", rewardStatus: "CONFIRMED" },
                ]
            ).map((opp: any, i: number) => (
              <div
                key={opp.id || i}
                className="p-4 rounded-xl bg-dark-card border border-dark-card-border hover:border-brand-purple/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{opp.projectName}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      opp.rewardStatus === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {opp.rewardStatus}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{opp.campaignType}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "CTA":
      return (
        <section className="py-4">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/40 text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {cfg.heading || "Ready to Run Your Node?"}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
              {cfg.description || "Start following our tested instructions and join the decentralized validator set."}
            </p>
            <div className="pt-2">
              <Link href={cfg.buttonHref || "/tools/checklist"}>
                <Button variant="default" className="text-xs font-semibold px-6 h-10 shadow-lg">
                  {cfg.buttonText || "Launch Pre-Flight Checklist"} &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </section>
      );

    case "RICH_TEXT":
      return (
        <section className="py-4 max-w-3xl mx-auto space-y-3">
          {cfg.title && <h2 className="text-2xl font-bold text-white">{cfg.title}</h2>}
          <div className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {cfg.contentMarkdown || "Custom content article block."}
          </div>
        </section>
      );

    case "DIVIDER":
      return (
        <div className="py-2">
          <div className="h-px bg-gradient-to-r from-transparent via-dark-card-border to-transparent" />
        </div>
      );

    default:
      return null;
  }
}
