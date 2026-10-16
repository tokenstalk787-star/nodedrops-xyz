"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Flame,
  Coins,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OpportunityItem } from "@/lib/services/mock-data";

interface NodeOpportunitiesTableProps {
  initialOpportunities: OpportunityItem[];
  currentTab?: string;
  onWatchlistCountChange?: (count: number) => void;
}

export function NodeOpportunitiesTable({
  initialOpportunities,
  currentTab = "ALL",
  onWatchlistCountChange,
}: NodeOpportunitiesTableProps) {
  const [search, setSearch] = React.useState("");
  const [selectedNodeType, setSelectedNodeType] = React.useState("ALL");
  const [selectedReward, setSelectedReward] = React.useState("ALL");
  const [selectedEcosystem, setSelectedEcosystem] = React.useState("ALL");
  const [selectedSubTab, setSelectedSubTab] = React.useState<"ALL" | "NEW" | "EXCLUSIVE" | "TESTNET" | "MAINNET">("ALL");
  
  // Watchlist state stored in localStorage
  const [watchlist, setWatchlist] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  // Load watchlist on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("nodedrops_watchlist");
      if (saved) {
        const list = JSON.parse(saved);
        setWatchlist(list);
        onWatchlistCountChange?.(list.length);
      }
    } catch {
      // ignore
    }
  }, [onWatchlistCountChange]);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("nodedrops_watchlist", JSON.stringify(next));
      } catch {
        // ignore
      }
      onWatchlistCountChange?.(next.length);
      return next;
    });
  };

  // Extract unique ecosystems and node types
  const ecosystems = React.useMemo(() => {
    const set = new Set<string>();
    initialOpportunities.forEach((opp) => {
      if (opp.networkSlug) set.add(opp.networkSlug);
    });
    return Array.from(set);
  }, [initialOpportunities]);

  const nodeTypes = React.useMemo(() => {
    const set = new Set<string>();
    initialOpportunities.forEach((opp) => {
      if (opp.nodeType) set.add(opp.nodeType);
    });
    return Array.from(set);
  }, [initialOpportunities]);

  // Filter pipeline
  const filtered = React.useMemo(() => {
    return initialOpportunities.filter((opp) => {
      // Watchlist tab filter
      if (currentTab === "WATCHLIST") {
        if (!watchlist.includes(opp.id)) return false;
      }

      // Incentivized top-level filter
      if (currentTab === "INCENTIVIZED") {
        if (opp.rewardStatus === "NONE") return false;
      }

      // Confirmed top-level filter
      if (currentTab === "CONFIRMED") {
        if (opp.rewardStatus !== "CONFIRMED") return false;
      }

      // Sub-tab filters
      if (selectedSubTab === "NEW") {
        if (!opp.id.includes("celestia") && !opp.id.includes("babylon") && !opp.id.includes("berachain")) {
          return false;
        }
      } else if (selectedSubTab === "EXCLUSIVE") {
        if (opp.rewardStatus !== "CONFIRMED") return false;
      } else if (selectedSubTab === "TESTNET") {
        if (opp.stage && !opp.stage.toLowerCase().includes("testnet") && !opp.stage.toLowerCase().includes("devnet")) {
          return false;
        }
      } else if (selectedSubTab === "MAINNET") {
        if (opp.stage && !opp.stage.toLowerCase().includes("mainnet")) return false;
      }

      // Dropdown: Node Type
      if (selectedNodeType !== "ALL" && opp.nodeType !== selectedNodeType) {
        return false;
      }

      // Dropdown: Reward Status
      if (selectedReward !== "ALL" && opp.rewardStatus !== selectedReward) {
        return false;
      }

      // Dropdown: Ecosystem
      if (selectedEcosystem !== "ALL" && opp.networkSlug !== selectedEcosystem) {
        return false;
      }

      // Text Search
      if (search.trim()) {
        const s = search.toLowerCase();
        const matchesName = opp.projectName.toLowerCase().includes(s);
        const matchesTicker = opp.ticker?.toLowerCase().includes(s);
        const matchesDesc = opp.description.toLowerCase().includes(s);
        const matchesType = opp.nodeType?.toLowerCase().includes(s);
        const matchesStage = opp.stage?.toLowerCase().includes(s);
        if (!matchesName && !matchesTicker && !matchesDesc && !matchesType && !matchesStage) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialOpportunities,
    currentTab,
    selectedSubTab,
    selectedNodeType,
    selectedReward,
    selectedEcosystem,
    search,
    watchlist,
  ]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [search, selectedNodeType, selectedReward, selectedEcosystem, selectedSubTab, currentTab]);

  // Pagination slice
  const totalPages = Math.ceil(Math.max(1, filtered.length) / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedNodeType("ALL");
    setSelectedReward("ALL");
    setSelectedEcosystem("ALL");
    setSelectedSubTab("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedNodeType !== "ALL" ||
    selectedReward !== "ALL" ||
    selectedEcosystem !== "ALL" ||
    selectedSubTab !== "ALL";

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar (CryptoRank Style Dense Controls) */}
      <div className="rounded-2xl border border-dark-card-border bg-dark-card p-4 sm:p-5 shadow-xl space-y-4">
        {/* Top Filter Row: Search & Sub-tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by project, ticker (e.g. TIA, BERA), or node type..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-dark-card-border bg-[#070a14] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-text-muted hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Sub-Tabs Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedSubTab("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedSubTab === "ALL"
                  ? "bg-brand-purple/20 border border-brand-purple/50 text-white font-semibold"
                  : "bg-dark-bg border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setSelectedSubTab("NEW")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                selectedSubTab === "NEW"
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold"
                  : "bg-dark-bg border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>New Tasks</span>
            </button>
            <button
              onClick={() => setSelectedSubTab("EXCLUSIVE")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                selectedSubTab === "EXCLUSIVE"
                  ? "bg-status-success/20 border border-status-success/50 text-status-success font-semibold"
                  : "bg-dark-bg border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              <Coins className="w-3 h-3 text-status-success" />
              <span>Exclusive</span>
            </button>
            <button
              onClick={() => setSelectedSubTab("TESTNET")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedSubTab === "TESTNET"
                  ? "bg-brand-blue/20 border border-brand-blue/50 text-brand-blue-light font-semibold"
                  : "bg-dark-bg border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              Testnets
            </button>
            <button
              onClick={() => setSelectedSubTab("MAINNET")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedSubTab === "MAINNET"
                  ? "bg-brand-cyan/20 border border-brand-cyan/50 text-brand-cyan font-semibold"
                  : "bg-dark-bg border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              Mainnet
            </button>
          </div>
        </div>

        {/* Bottom Filter Row: Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dark-card-border text-xs font-mono">
          <div className="flex items-center gap-1.5 text-text-muted">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Node Type Dropdown */}
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#070a14] text-slate-300 text-xs focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Node Types</option>
            {nodeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Reward Status Dropdown */}
          <select
            value={selectedReward}
            onChange={(e) => setSelectedReward(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#070a14] text-slate-300 text-xs focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Reward Statuses</option>
            <option value="CONFIRMED">🏆 Confirmed Rewards</option>
            <option value="POTENTIAL">🎁 Potential Airdrop</option>
            <option value="NONE">⚡ Public / Non-Incentivized</option>
          </select>

          {/* Ecosystem Dropdown */}
          <select
            value={selectedEcosystem}
            onChange={(e) => setSelectedEcosystem(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#070a14] text-slate-300 text-xs focus:outline-none focus:border-brand-purple capitalize"
          >
            <option value="ALL">All Ecosystems</option>
            {ecosystems.map((eco) => (
              <option key={eco} value={eco}>
                {eco.replace(/-/g, " ")}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-text-muted hover:text-status-warning text-xs flex items-center gap-1 ml-auto transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Opportunities Table (Dense, Information-Rich, CryptoRank Aesthetic) */}
      <div className="rounded-2xl border border-dark-card-border bg-dark-card shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-dark-card-border bg-dark-bg/60 text-text-muted uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-8 text-center">⭐</th>
                <th className="py-3 px-4 min-w-[200px]">Project & Node</th>
                <th className="py-3 px-4 min-w-[220px]">Required Node Task</th>
                <th className="py-3 px-4 min-w-[170px]">Reward Status</th>
                <th className="py-3 px-4 min-w-[140px]">Stage / Network</th>
                <th className="py-3 px-4 min-w-[130px]">Est. VPS Cost</th>
                <th className="py-3 px-4 text-right min-w-[130px]">Runbook Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-card-border/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted space-y-2">
                    <p className="text-sm">No node opportunities matched your filters.</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-1 rounded-lg border border-border bg-dark-bg text-brand-cyan hover:underline text-xs"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginated.map((opp) => {
                  const isStarred = watchlist.includes(opp.id);
                  const guideHref = opp.guideSlug
                    ? `/guides/${opp.guideSlug}`
                    : `/opportunities/${opp.slug}`;

                  return (
                    <tr
                      key={opp.id}
                      className="hover:bg-dark-card-hover/80 transition-colors group"
                    >
                      {/* Star Column */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(opp.id)}
                          className="p-1 rounded hover:bg-dark-bg text-text-muted hover:text-yellow-400 transition-colors"
                          title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isStarred
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-border group-hover:text-slate-500"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Project & Node Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Logo avatar */}
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border border-brand-purple/30 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 shadow-sm">
                            {opp.ticker?.slice(0, 2) || opp.projectName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={guideHref}
                                className="font-sans font-bold text-sm text-white hover:text-brand-cyan transition-colors"
                              >
                                {opp.projectName}
                              </Link>
                              {opp.ticker && (
                                <span className="px-1.5 py-0.2 rounded bg-dark-bg border border-border/80 text-[10px] text-brand-purple-light font-mono">
                                  {opp.ticker}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                              <span className="capitalize">{opp.networkSlug?.replace(/-/g, " ") || "Independent"}</span>
                              <span>•</span>
                              <span className="text-slate-400">{opp.campaignType}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Required Node Task */}
                      <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                            <span className="font-medium text-white">
                              {opp.nodeType || "Node Operator"}
                            </span>
                            {opp.tasksCount && (
                              <span className="px-1.5 py-0.2 rounded bg-brand-blue/15 text-brand-blue-light border border-brand-blue/30 text-[10px] font-mono">
                                {opp.tasksCount} steps
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-muted line-clamp-1 font-mono">
                            {opp.description}
                          </p>
                        </div>
                      </td>

                      {/* Reward Status */}
                      <td className="py-3.5 px-4 font-mono">
                        {opp.rewardStatus === "CONFIRMED" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-success/15 border border-status-success/30 text-status-success text-[11px] font-semibold">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Confirmed</span>
                          </div>
                        ) : opp.rewardStatus === "POTENTIAL" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-purple/15 border border-brand-purple/30 text-brand-purple-light text-[11px] font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Potential Airdrop</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-bg border border-border text-text-muted text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Public Spec</span>
                          </div>
                        )}
                      </td>

                      {/* Stage / Network */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-card-border text-slate-300">
                          {opp.stage || "Active Phase"}
                        </span>
                      </td>

                      {/* Est. VPS Cost */}
                      <td className="py-3.5 px-4 font-mono text-xs text-brand-cyan font-bold">
                        {opp.vpsCost || "~$20/mo"}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={guideHref}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-purple/15 hover:bg-brand-purple text-brand-purple-light hover:text-white border border-brand-purple/40 text-xs font-mono font-medium transition-all group-hover:border-brand-purple"
                        >
                          <span>Deploy</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Table Footer & Pagination */}
        <div className="p-4 border-t border-dark-card-border bg-dark-bg/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-muted">
          <div>
            Showing{" "}
            <strong className="text-white">
              {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, filtered.length)}
            </strong>{" "}
            of <strong className="text-white">{filtered.length}</strong> node opportunities
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-dark-card-border bg-dark-card hover:bg-dark-card-hover disabled:opacity-30 disabled:pointer-events-none text-slate-300"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                  page === i + 1
                    ? "bg-brand-purple text-white shadow-glow"
                    : "border border-dark-card-border bg-dark-card text-slate-400 hover:text-white hover:bg-dark-card-hover"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-dark-card-border bg-dark-card hover:bg-dark-card-hover disabled:opacity-30 disabled:pointer-events-none text-slate-300"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
