"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Check,
  Copy,
  SlidersHorizontal,
  X,
  Zap,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideItem } from "@/lib/services/mock-data";

interface GuidesHubClientProps {
  initialGuides: GuideItem[];
}

export function GuidesHubClient({ initialGuides }: GuidesHubClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Extract unique ecosystems and categories
  const ecosystems = [
    { label: "All Ecosystems", value: "ALL" },
    { label: "Ethereum & EVM", value: "ethereum" },
    { label: "Celestia Modular", value: "celestia" },
    { label: "Solana High-TPS", value: "solana" },
    { label: "Babylon Staking", value: "babylon" },
    { label: "Berachain Polaris", value: "berachain" },
    { label: "Linux Hardening", value: "security" },
  ];

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialGuides.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [initialGuides]);

  // Filtered guides calculation
  const filteredGuides = useMemo(() => {
    return initialGuides.filter((guide) => {
      // 1. Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = guide.title.toLowerCase().includes(q);
        const matchesExcerpt = guide.excerpt.toLowerCase().includes(q);
        const matchesTags = guide.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = guide.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== "ALL" && guide.difficulty !== selectedDifficulty) {
        return false;
      }

      // 3. Ecosystem filter
      if (selectedEcosystem !== "ALL") {
        const netSlug = (guide.networkSlug || "").toLowerCase();
        const tagsStr = guide.tags.join(" ").toLowerCase();
        const titleStr = guide.title.toLowerCase();

        if (selectedEcosystem === "ethereum" && !netSlug.includes("eth") && !tagsStr.includes("eth")) {
          return false;
        }
        if (selectedEcosystem === "celestia" && !netSlug.includes("celestia") && !tagsStr.includes("celestia")) {
          return false;
        }
        if (selectedEcosystem === "solana" && !netSlug.includes("solana") && !tagsStr.includes("solana")) {
          return false;
        }
        if (selectedEcosystem === "babylon" && !netSlug.includes("babylon") && !tagsStr.includes("babylon")) {
          return false;
        }
        if (selectedEcosystem === "berachain" && !netSlug.includes("berachain") && !tagsStr.includes("berachain")) {
          return false;
        }
        if (selectedEcosystem === "security" && !tagsStr.includes("security") && !titleStr.includes("hardening")) {
          return false;
        }
      }

      // 4. Category filter
      if (selectedCategory !== "ALL" && guide.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [initialGuides, search, selectedDifficulty, selectedEcosystem, selectedCategory]);

  const handleCopyCommand = (commandText: string, id: string) => {
    navigator.clipboard.writeText(commandText);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2200);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedDifficulty("ALL");
    setSelectedEcosystem("ALL");
    setSelectedCategory("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedDifficulty !== "ALL" ||
    selectedEcosystem !== "ALL" ||
    selectedCategory !== "ALL";

  return (
    <div className="space-y-8">
      {/* Search & Ecosystem Control Bar */}
      <div className="bg-dark-card border border-dark-card-border rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, terminal commands, or network tags (e.g. geth, celestia, ufw)..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-dark-card-border bg-[#070a14] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-12 top-2.5 text-text-muted hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="absolute right-3.5 top-3 text-[10px] font-mono text-text-muted border border-dark-card-border px-1.5 py-0.5 rounded bg-dark-bg">
              /
            </span>
          </div>

          {/* Quick Cheat Sheet Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCheatSheet(true)}
              className="border-dark-card-border hover:bg-dark-card-hover text-xs gap-1.5 text-brand-cyan"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Operator CLI Cheatsheet</span>
            </Button>
          </div>
        </div>

        {/* Ecosystem Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-text-muted font-medium shrink-0 mr-1">Ecosystem:</span>
          {ecosystems.map((eco) => {
            const isSelected = selectedEcosystem === eco.value;
            return (
              <button
                key={eco.value}
                type="button"
                onClick={() => setSelectedEcosystem(eco.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-brand-purple text-white shadow-glow-purple border border-brand-purple"
                    : "bg-[#070a14] text-text-secondary hover:text-white border border-dark-card-border hover:border-dark-card-hover"
                }`}
              >
                {eco.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty & Category Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-dark-card-border/60 text-xs">
          {/* Difficulty Dots */}
          <div className="flex items-center gap-2">
            <span className="text-text-muted font-medium">Difficulty:</span>
            {[
              { label: "All Levels", val: "ALL", color: "bg-slate-400" },
              { label: "Beginner", val: "BEGINNER", color: "bg-emerald-400" },
              { label: "Intermediate", val: "INTERMEDIATE", color: "bg-brand-cyan" },
              { label: "Advanced", val: "ADVANCED", color: "bg-brand-purple" },
            ].map((d) => (
              <button
                key={d.val}
                type="button"
                onClick={() => setSelectedDifficulty(d.val)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  selectedDifficulty === d.val
                    ? "bg-dark-bg text-white font-medium border border-dark-card-border shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${d.color}`} />
                <span>{d.label}</span>
              </button>
            ))}
          </div>

          {/* Reset Filters if Active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-brand-purple hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters ({filteredGuides.length} results)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Guides Content Section */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 border border-dark-card-border rounded-2xl bg-dark-card/40 space-y-3">
          <BookOpen className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-bold text-white">No engineering guides match your query</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Try adjusting your search terms, selecting &quot;All Ecosystems&quot;, or clearing the difficulty filter.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="border-dark-card-border text-xs">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => {
            // First step command preview if available
            const firstCmd = guide.steps?.[0]?.command;
            const stepCount = guide.steps?.length || 4;

            return (
              <div
                key={guide.id}
                className="group rounded-2xl border border-dark-card-border bg-dark-card hover:border-brand-purple/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-glow-purple/20"
              >
                {/* Card Top: Badges & Meta */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25 font-semibold">
                        {guide.networkSlug ? guide.networkSlug.toUpperCase() : "CROSS-CHAIN"}
                      </span>
                      <Badge
                        variant={guide.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}
                        className="text-[10px]"
                      >
                        {guide.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        {guide.estimatedMinutes}m read
                      </span>
                      <span>•</span>
                      <span className="text-brand-purple font-semibold">{stepCount} Steps</span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-purple-light transition-colors leading-snug">
                      <Link href={`/guides/${guide.slug}`} className="hover:underline">
                        {guide.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>

                  {/* Interactive Code Preview Box (like modern programming guides) */}
                  {firstCmd && (
                    <div className="rounded-xl border border-dark-card-border/80 bg-[#060810] p-3 space-y-1.5 font-mono text-[11px] relative">
                      <div className="flex items-center justify-between text-[10px] text-text-muted border-b border-dark-card-border/40 pb-1">
                        <span className="text-brand-cyan flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          <span>Step 1: Terminal Setup</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(firstCmd, guide.id)}
                          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-white transition-colors"
                          title="Copy step command"
                        >
                          {copiedSnippetId === guide.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-emerald-400 line-clamp-2 overflow-x-hidden leading-relaxed">
                        <code>{firstCmd}</code>
                      </pre>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {guide.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-dark-bg text-[10px] text-text-muted border border-dark-card-border font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Action Row */}
                <div className="px-6 py-4 border-t border-dark-card-border/60 bg-[#090d1a] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-[10px] font-bold text-white">
                      {guide.authorName.charAt(0)}
                    </div>
                    <div className="truncate max-w-[140px]">
                      <div className="text-[11px] font-semibold text-text-primary truncate">
                        {guide.authorName}
                      </div>
                      {guide.reviewerName && (
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/guides/${guide.slug}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs gap-1.5 shadow-glow-purple group-hover:scale-105 transition-transform"
                    >
                      <span>Start Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Operator CLI Cheat Sheet Slide-over Drawer */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-dark-card border-l border-dark-card-border w-full max-w-lg h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-dark-card-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Linux Node Operator Cheat Sheet</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Essential daily maintenance commands for systemd & containers
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheatSheet(false)}
                  className="text-text-muted hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Commands Section 1 */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                  Service Management (systemd)
                </div>
                {[
                  {
                    desc: "Stream real-time daemon logs without truncation",
                    cmd: "journalctl -u <service-name> -f -o cat",
                  },
                  {
                    desc: "Reload configuration files and restart daemon",
                    cmd: "sudo systemctl daemon-reload && sudo systemctl restart <service-name>",
                  },
                  {
                    desc: "Check active status, memory usage, and uptime",
                    cmd: "systemctl status <service-name>",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#060810] border border-dark-card-border space-y-1.5">
                    <div className="text-[11px] text-text-secondary">{item.desc}</div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-emerald-400 font-mono truncate">{item.cmd}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyCommand(item.cmd, `cheat-${idx}`)}
                        className="text-text-muted hover:text-white p-1"
                      >
                        {copiedSnippetId === `cheat-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commands Section 2 */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-brand-cyan uppercase tracking-wider">
                  P2P Network & Port Inspection
                </div>
                {[
                  {
                    desc: "List all listening TCP/UDP ports and process names",
                    cmd: "sudo ss -tulpn | grep LISTEN",
                  },
                  {
                    desc: "Inspect active UFW firewall rules with port numbers",
                    cmd: "sudo ufw status numbered",
                  },
                  {
                    desc: "Check available disk space on NVMe mount point",
                    cmd: "df -h /",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#060810] border border-dark-card-border space-y-1.5">
                    <div className="text-[11px] text-text-secondary">{item.desc}</div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-emerald-400 font-mono truncate">{item.cmd}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyCommand(item.cmd, `cheat-net-${idx}`)}
                        className="text-text-muted hover:text-white p-1"
                      >
                        {copiedSnippetId === `cheat-net-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-dark-card-border">
              <Button
                variant="outline"
                onClick={() => setShowCheatSheet(false)}
                className="w-full border-dark-card-border text-xs"
              >
                Close Cheatsheet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
