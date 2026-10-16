"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Activity,
  Coins,
  Bell,
  Plus,
  Cpu,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NodeDashboardHeaderProps {
  totalOpportunities: number;
  activeCount: number;
  confirmedCount: number;
  totalRunbooks?: number;
  onFilterChange?: (tab: string) => void;
  activeTab?: string;
  watchlistCount?: number;
}

export function NodeDashboardHeader({
  totalOpportunities,
  activeCount,
  confirmedCount,
  totalRunbooks = 28,
  onFilterChange,
  activeTab = "ALL",
  watchlistCount = 0,
}: NodeDashboardHeaderProps) {
  const [alertSubscribed, setAlertSubscribed] = React.useState(false);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);

  const handleAlertClick = () => {
    setAlertSubscribed(true);
    setTimeout(() => setAlertSubscribed(false), 3000);
  };

  return (
    <div className="space-y-6 pt-4 pb-2">
      {/* 1. Sub-Navigation / Breadcrumb Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-muted">Explore:</span>
          <button
            onClick={() => onFilterChange?.("ALL")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "ALL"
                ? "bg-brand-purple text-white font-semibold shadow-glow"
                : "bg-dark-card border border-dark-card-border text-slate-300 hover:text-white"
            }`}
          >
            <span>All Opportunities</span>
            <span className="text-[10px] px-1 rounded bg-black/40">
              {totalOpportunities}
            </span>
          </button>

          <button
            onClick={() => onFilterChange?.("INCENTIVIZED")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "INCENTIVIZED"
                ? "bg-brand-purple text-white font-semibold shadow-glow"
                : "bg-dark-card border border-dark-card-border text-slate-300 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Incentivized Testnets</span>
          </button>

          <button
            onClick={() => onFilterChange?.("CONFIRMED")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "CONFIRMED"
                ? "bg-brand-purple text-white font-semibold shadow-glow"
                : "bg-dark-card border border-dark-card-border text-slate-300 hover:text-white"
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-status-success" />
            <span>Confirmed Rewards</span>
          </button>

          <button
            onClick={() => onFilterChange?.("WATCHLIST")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "WATCHLIST"
                ? "bg-brand-purple text-white font-semibold shadow-glow"
                : "bg-dark-card border border-dark-card-border text-slate-300 hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span>My Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-[10px] px-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold">
                {watchlistCount}
              </span>
            )}
          </button>

          <Link
            href="/tools/hardware-checker"
            className="px-3 py-1 rounded-lg bg-dark-card border border-dark-card-border text-slate-300 hover:text-white hover:border-brand-cyan transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Hardware Matcher</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>Live Node Drops Engine</span>
          </span>
        </div>
      </div>

      {/* 2. Main Title Section with Action Buttons (CryptoRank Reference Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan text-[11px] font-mono tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AIRDROP & TESTNET TRACKER // NODEDROPS 2.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Potential Airdrops & Node Dashboard
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Track, discover, and deploy verified blockchain node testnets, validator programs,
            and modular data availability runners. Real hardware benchmarks, zero wallet
            connections, and production-tested shell runbooks.
          </p>
        </div>

        {/* Action Buttons Right Side */}
        <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0">
          <button
            onClick={handleAlertClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-dark-card hover:bg-dark-card-hover text-xs font-mono text-white transition-all shadow-md"
          >
            <Bell className="w-4 h-4 text-brand-cyan" />
            <span>{alertSubscribed ? "Alerts Activated! ✓" : "Get Node Drop Alerts"}</span>
          </button>

          <Link
            href="/contact?type=submit_campaign"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-purple/40 bg-brand-purple/20 hover:bg-brand-purple/30 text-xs font-mono text-brand-purple-light hover:text-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Node Campaign</span>
          </Link>

          <Link
            href="/tools/hardware-checker"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dark-card-border bg-dark-bg hover:bg-dark-card-hover text-xs font-mono text-slate-300 hover:text-white transition-all"
          >
            <Cpu className="w-4 h-4 text-brand-blue" />
            <span>Pre-Flight VPS Matcher</span>
          </Link>
        </div>
      </div>

      {/* 3. The 2 Overview Cards (Curated Activity Overview + Most Recent Updates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* LEFT CARD: Curated Activity Overview (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-dark-card-border bg-dark-card p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-cyan" />
              <span>Network Activity Overview</span>
            </h2>
            <span className="text-[11px] font-mono text-text-muted">
              Updated Live • Every Hour
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-3.5 rounded-xl bg-dark-bg/80 border border-dark-card-border space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
                <span>Active Nodes</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {activeCount}
              </div>
              <div className="text-[10px] text-status-success font-mono font-medium">
                Live Testnets
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 rounded-xl bg-dark-bg/80 border border-dark-card-border space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Monitored</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                450+
              </div>
              <div className="text-[10px] text-amber-400 font-mono font-medium">
                Tracked Daemons
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-3.5 rounded-xl bg-dark-bg/80 border border-dark-card-border space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-purple-light" />
                <span>Verified Guides</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalRunbooks}
              </div>
              <div className="text-[10px] text-brand-purple-light font-mono font-medium">
                100% Tested
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-3.5 rounded-xl bg-dark-bg/80 border border-dark-card-border space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                <Coins className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Avg. VPS Cost</span>
              </div>
              <div className="text-2xl font-black text-brand-cyan font-mono">
                $15-$40
              </div>
              <div className="text-[10px] text-brand-cyan-light font-mono font-medium">
                Monthly Estimate
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Most Recent Updates / Milestone Alert (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-brand-purple/40 bg-gradient-to-br from-dark-card via-dark-card to-brand-purple/10 p-5 sm:p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-wide uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Summary Milestone 🔥</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Just Verified
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Babylon Bitcoin Staking Phase 2 Live
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
              BTC finality provider campaign is now active on the bbn-test-3 network.
              Stake testnet BTC and earn timestamping validation points.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-dark-card-border/80 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light text-[10px] font-medium border border-brand-purple/30">
                Confirmed Reward
              </span>
              <span className="text-text-muted text-[11px]">bbn-test-3</span>
            </div>

            <Link
              href="/guides/deploying-babylon-bitcoin-staking-testnet-node"
              className="inline-flex items-center gap-1 text-xs text-brand-cyan hover:text-white font-medium transition-colors"
            >
              <span>Deploy Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
