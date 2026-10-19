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
  DollarSign,
  TrendingUp,
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
  const [selectedTaskType, setSelectedTaskType] = React.useState("ALL");
  const [selectedPhase, setSelectedPhase] = React.useState("ALL");
  const [selectedReward, setSelectedReward] = React.useState("ALL");
  const [selectedSubTab, setSelectedSubTab] = React.useState<"ALL" | "NEW" | "EXCLUSIVE" | "TESTNET" | "MAINNET">("ALL");

  // Watchlist state stored in localStorage
  const [watchlist, setWatchlist] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

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

  // Filter pipeline
  const filtered = React.useMemo(() => {
    return initialOpportunities.filter((opp) => {
      // Watchlist tab filter
      if (currentTab === "WATCHLIST") {
        if (!watchlist.includes(opp.id)) return false;
      }

      // Confirmed top-level filter
      if (currentTab === "CONFIRMED") {
        if (opp.rewardStatus !== "CONFIRMED") return false;
      }

      // Quick sub-tabs
      if (selectedSubTab === "NEW") {
        if (!opp.id.includes("linea") && !opp.id.includes("berachain") && !opp.id.includes("babylon")) {
          return false;
        }
      } else if (selectedSubTab === "EXCLUSIVE") {
        if (opp.rewardStatus !== "CONFIRMED") return false;
      }

      // Task Type Dropdown
      if (selectedTaskType !== "ALL") {
        const matchesNodeType = opp.nodeType?.toLowerCase().includes(selectedTaskType.toLowerCase());
        const matchesCampaign = opp.campaignType?.toLowerCase().includes(selectedTaskType.toLowerCase());
        if (!matchesNodeType && !matchesCampaign) return false;
      }

      // Phase Dropdown
      if (selectedPhase !== "ALL") {
        if (selectedPhase === "ACTIVE" && opp.campaignStatus !== "ACTIVE") return false;
        if (selectedPhase === "UPCOMING" && opp.campaignStatus !== "UPCOMING") return false;
        if (selectedPhase === "CONCLUDED" && opp.campaignStatus !== "ENDED") return false;
      }

      // Reward Status
      if (selectedReward !== "ALL" && opp.rewardStatus !== selectedReward) {
        return false;
      }

      // Search Filter
      if (search.trim()) {
        const s = search.toLowerCase();
        const matchesName = opp.projectName.toLowerCase().includes(s);
        const matchesTicker = opp.ticker?.toLowerCase().includes(s);
        const matchesDesc = opp.description?.toLowerCase().includes(s);
        const matchesType = opp.nodeType?.toLowerCase().includes(s);
        if (!matchesName && !matchesTicker && !matchesDesc && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialOpportunities,
    currentTab,
    selectedSubTab,
    selectedTaskType,
    selectedPhase,
    selectedReward,
    search,
    watchlist,
  ]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [search, selectedTaskType, selectedPhase, selectedReward, selectedSubTab, currentTab]);

  const totalPages = Math.ceil(Math.max(1, filtered.length) / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTaskType("ALL");
    setSelectedPhase("ALL");
    setSelectedReward("ALL");
    setSelectedSubTab("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedTaskType !== "ALL" ||
    selectedPhase !== "ALL" ||
    selectedReward !== "ALL" ||
    selectedSubTab !== "ALL";

  return (
    <div className="space-y-4">
      {/* 1. FILTER CONTROLS BAR (CryptoRank Reference Style) */}
      <div className="rounded-2xl border border-dark-card-border bg-[#0b1020] p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by project name, network..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-dark-card-border bg-[#070b16] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
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

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Task Type Filter */}
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-dark-card-border bg-[#070b16] text-slate-200 text-xs focus:outline-none focus:border-brand-purple"
            >
              <option value="ALL">Task Type: All</option>
              <option value="Validator">Validator Nodes</option>
              <option value="Light">Light Nodes (DAS)</option>
              <option value="Full">Full Node / RPC</option>
              <option value="Prover">ZK Provers</option>
            </select>

            {/* Phase Filter */}
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-2 rounded-xl border border-dark-card-border bg-[#070b16] text-slate-200 text-xs focus:outline-none focus:border-brand-purple"
            >
              <option value="ALL">Phase: All</option>
              <option value="ACTIVE">Active Campaigns</option>
              <option value="UPCOMING">Upcoming Testnets</option>
              <option value="CONCLUDED">Concluded</option>
            </select>

            {/* Quick Watchlist & New Tasks Toggle */}
            <button
              onClick={() => setSelectedSubTab(selectedSubTab === "NEW" ? "ALL" : "NEW")}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                selectedSubTab === "NEW"
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold"
                  : "bg-[#070b16] border border-dark-card-border text-slate-300 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>New Tasks</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 rounded-xl border border-dark-card-border bg-[#070b16] text-text-muted hover:text-white flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DENSE INFORMATION TABLE (CryptoRank Exact Columns on Desktop, Mobile Cards on Mobile) */}
      <div className="rounded-2xl border border-dark-card-border bg-[#0b1020] shadow-2xl overflow-hidden">
        {/* DESKTOP TABLE VIEW (Visible on md and above) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-dark-card-border bg-[#080d1a] text-text-muted uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">⭐</th>
                <th className="py-3.5 px-4 min-w-[220px]">Name</th>
                <th className="py-3.5 px-4 min-w-[280px]">Tasks / Stage</th>
                <th className="py-3.5 px-4 min-w-[150px]">Reward Status</th>
                <th className="py-3.5 px-4 min-w-[130px]">Funding Raised</th>
                <th className="py-3.5 px-4 min-w-[130px]">Est. VPS Cost</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-card-border/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted space-y-2">
                    <p className="text-sm font-sans">No node opportunities matched your filters.</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#070b16] text-brand-cyan hover:underline text-xs"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginated.map((opp) => {
                  const isStarred = watchlist.includes(opp.id);
                  const guideHref = opp.guideSlug ? `/guides/${opp.guideSlug}` : `/opportunities/${opp.slug}`;
                  const tasksList = opp.tasks && opp.tasks.length > 0
                    ? opp.tasks
                    : [opp.nodeType || "Node Run", opp.stage || "Testnet", "Incentivized"];

                  return (
                    <tr
                      key={opp.id}
                      className="hover:bg-[#10172e]/80 transition-colors group"
                    >
                      {/* Star / Watchlist */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(opp.id)}
                          className="p-1 rounded hover:bg-[#070b16] text-text-muted hover:text-yellow-400 transition-colors"
                          title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isStarred
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-600 group-hover:text-slate-400"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Name & Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Logo Emblem */}
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border border-brand-purple/40 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 shadow-sm">
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
                                <span className="px-1.5 py-0.2 rounded bg-[#070b16] border border-dark-card-border text-[10px] text-brand-purple-light font-mono font-semibold">
                                  {opp.ticker}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                              <span className="capitalize">{opp.networkSlug?.replace(/-/g, " ") || "Ethereum L2"}</span>
                              <span>•</span>
                              <span className="text-slate-400">{opp.campaignType}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tasks / Stage Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tasksList.slice(0, 2).map((task, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-brand-blue/15 border border-brand-blue/30 text-brand-blue-light text-[10px] font-mono hover:bg-brand-blue/25 transition-colors cursor-pointer"
                            >
                              {task}
                            </span>
                          ))}
                          {tasksList.length > 2 && (
                            <span
                              className="px-1.5 py-0.5 rounded-md bg-[#070b16] border border-dark-card-border text-brand-cyan text-[10px] font-mono font-bold cursor-pointer"
                              title={tasksList.slice(2).join(", ")}
                            >
                              +{tasksList.length - 2}
                            </span>
                          )}
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
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Potential</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[11px]">
                            <span>Public Spec</span>
                          </div>
                        )}
                      </td>

                      {/* Funding Raised */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="font-bold text-white">
                          {opp.fundingRaised || "$100M"}
                        </span>
                      </td>

                      {/* Est. VPS Cost */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                        <span>{opp.vpsCost || "~$20/mo"}</span>
                      </td>

                      {/* Runbook Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={guideHref}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-purple/40 bg-brand-purple/20 hover:bg-brand-purple text-brand-purple-light hover:text-white transition-all text-xs font-semibold shadow-sm"
                        >
                          <span>Deploy</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW (Visible on screens < md) */}
        <div className="md:hidden divide-y divide-dark-card-border/60">
          {paginated.length === 0 ? (
            <div className="p-8 text-center text-text-muted space-y-3">
              <p className="text-sm font-sans">No node opportunities matched your filters.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl border border-dark-card-border bg-[#070b16] text-brand-cyan hover:underline text-xs"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            paginated.map((opp) => {
              const isStarred = watchlist.includes(opp.id);
              const guideHref = opp.guideSlug ? `/guides/${opp.guideSlug}` : `/opportunities/${opp.slug}`;
              const tasksList = opp.tasks && opp.tasks.length > 0
                ? opp.tasks
                : [opp.nodeType || "Node Run", opp.stage || "Testnet", "Incentivized"];

              return (
                <div key={opp.id} className="p-4 space-y-3 bg-[#0b1020]/90 hover:bg-[#10172e] transition-colors">
                  {/* Top: Logo + Name + Star */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/25 to-brand-blue/25 border border-brand-purple/40 flex items-center justify-center font-mono font-bold text-sm text-white shrink-0 shadow-sm">
                        {opp.ticker?.slice(0, 2) || opp.projectName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={guideHref}
                            className="font-bold text-white hover:text-brand-cyan transition-colors text-sm truncate"
                          >
                            {opp.projectName}
                          </Link>
                          {opp.ticker && (
                            <span className="px-1.5 py-0.2 rounded bg-[#070b16] border border-dark-card-border text-[10px] text-brand-purple-light font-mono font-semibold">
                              {opp.ticker}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono flex items-center gap-1 mt-0.5">
                          <span className="capitalize">{opp.networkSlug?.replace(/-/g, " ") || "Ethereum L2"}</span>
                          <span>•</span>
                          <span className="text-slate-400">{opp.campaignType}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWatchlist(opp.id)}
                      className="p-2 rounded-lg bg-[#070b16] border border-dark-card-border text-text-muted hover:text-yellow-400 transition-colors shrink-0"
                      title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isStarred ? "text-yellow-400 fill-yellow-400" : "text-slate-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Middle: Tags & Reward Status */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tasksList.slice(0, 2).map((task, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-brand-blue/15 border border-brand-blue/30 text-brand-blue-light text-[10px] font-mono"
                        >
                          {task}
                        </span>
                      ))}
                    </div>

                    <div>
                      {opp.rewardStatus === "CONFIRMED" ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-status-success/15 border border-status-success/30 text-status-success text-[10px] font-semibold font-mono">
                          <Coins className="w-3 h-3" />
                          <span>Confirmed</span>
                        </div>
                      ) : opp.rewardStatus === "POTENTIAL" ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold font-mono">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Potential</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono">
                          <span>Public Spec</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Row: Funding & VPS */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#070b16] border border-dark-card-border/80 text-[11px] font-mono">
                    <div>
                      <span className="text-text-muted block text-[10px]">Funding Raised</span>
                      <span className="text-white font-bold">{opp.fundingRaised || "$100M"}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Est. VPS Cost</span>
                      <span className="text-slate-200 font-bold">{opp.vpsCost || "~$20/mo"}</span>
                    </div>
                  </div>

                  {/* Deploy Button */}
                  <Link
                    href={guideHref}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple-light hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all text-center"
                  >
                    <span>Read Guide & Deploy Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* 3. PAGINATION (CryptoRank Reference Style, Responsive for Mobile & Desktop) */}
        {totalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-dark-card-border bg-[#080d1a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-muted">
            <div className="text-center sm:text-left text-[11px]">
              Showing <span className="text-white font-bold">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="text-white font-bold">{Math.min(filtered.length, page * pageSize)}</span> of{" "}
              <span className="text-white font-bold">{filtered.length}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-lg border border-dark-card-border bg-[#0b1020] text-slate-300 hover:text-white disabled:opacity-30 transition-colors text-xs"
                title="Previous Page"
              >
                &larr; Prev
              </button>

              <span className="px-2 text-white font-bold sm:hidden">
                {page} / {totalPages}
              </span>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                        page === pNum
                          ? "bg-brand-purple text-white shadow-glow"
                          : "border border-dark-card-border bg-[#0b1020] text-slate-300 hover:text-white"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-dark-card-border bg-[#0b1020] text-slate-300 hover:text-white disabled:opacity-30 transition-colors text-xs"
                title="Next Page"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
