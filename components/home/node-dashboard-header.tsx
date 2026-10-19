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
  ChevronRight,
  Send,
  Code2,
} from "lucide-react";

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

  const handleAlertClick = () => {
    setAlertSubscribed(true);
    setTimeout(() => setAlertSubscribed(false), 3500);
  };

  return (
    <div className="space-y-5 pt-2 pb-2">
      {/* 1. BREADCRUMB ROW */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted pb-2 border-b border-dark-card-border/60">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-white transition-colors">
            Main
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-white font-medium">Potential Airdrops</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg border border-dark-card-border bg-[#0a0f1d] text-[11px] text-text-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>USD // Web3 Live Telemetry</span>
          </span>
        </div>
      </div>

      {/* 2. SECONDARY SUB-NAV PILLS BAR (CryptoRank Reference Style, Touch-scrollable on mobile) */}
      <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap no-scrollbar">
        <button
          onClick={() => onFilterChange?.("ALL")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "ALL"
              ? "bg-brand-purple text-white font-bold shadow-glow"
              : "bg-[#0d1428] border border-dark-card-border text-slate-300 hover:text-white hover:border-slate-500"
          }`}
        >
          <span>Airdrops Dashboard</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-brand-cyan font-bold">
            {totalOpportunities}
          </span>
        </button>

        <button
          onClick={() => onFilterChange?.("CONFIRMED")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "CONFIRMED"
              ? "bg-brand-purple text-white font-bold shadow-glow"
              : "bg-[#0d1428] border border-dark-card-border text-slate-300 hover:text-white hover:border-slate-500"
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-status-success" />
          <span>Confirmed Rewards</span>
          {confirmedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-success/20 text-status-success">
              {confirmedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onFilterChange?.("WATCHLIST")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "WATCHLIST"
              ? "bg-brand-purple text-white font-bold shadow-glow"
              : "bg-[#0d1428] border border-dark-card-border text-slate-300 hover:text-white hover:border-slate-500"
          }`}
        >
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          <span>My Watchlist</span>
          {watchlistCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">
              {watchlistCount}
            </span>
          )}
        </button>

        <Link
          href="/contact?type=submit_airdrop"
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#0d1428] border border-dark-card-border text-slate-300 hover:text-white hover:border-brand-purple transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-brand-purple-light" />
          <span>Submit Airdrop / Feedback</span>
        </Link>
      </div>

      {/* 3. HEADLINE, INTRO & TOP-RIGHT ACTION BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pt-1">
        {/* Left Side: Headline & Description */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Potential Airdrops Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
            Explore promising blockchain projects and potential future token airdrops. Track
            testnet tasks, incentives, reward probabilities, hardware requirements, and guides
            to maximize your Web3 node operator returns.
          </p>
        </div>

        {/* Right Side: 3 Action Buttons Stack */}
        <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0 font-mono text-xs">
          <Link
            href="/tools/hardware-checker"
            className="inline-flex items-center justify-between gap-3 px-4 py-2 rounded-xl border border-dark-card-border bg-[#0d1428] hover:bg-[#121c38] text-slate-200 hover:text-white transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-cyan" />
              <span>Get Node Drops API</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={handleAlertClick}
            className="inline-flex items-center justify-between gap-3 px-4 py-2 rounded-xl border border-dark-card-border bg-[#0d1428] hover:bg-[#121c38] text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-blue-light" />
              <span>{alertSubscribed ? "Alerts Activated! ✓" : "Telegram Alerts"}</span>
            </div>
            <Bell className="w-3.5 h-3.5 text-text-muted" />
          </button>

          <Link
            href="/contact?type=partnership"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-light text-white font-bold transition-all shadow-lg text-center"
          >
            <span>For Partnership</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. OVERVIEW CARDS (Curated Activity Overview + Most Recent Milestone) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        {/* LEFT CARD: Curated Activity Overview (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-dark-card-border bg-[#0b1020] p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-dark-card-border">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-cyan" />
              <span>Curated Activity Overview</span>
            </h2>
            <span className="text-[10px] font-mono text-text-muted">Updated Live</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="p-3 rounded-xl bg-[#070b16] border border-dark-card-border space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                <span>🪙</span>
                <span>Active Drops</span>
              </div>
              <div className="text-xl font-black text-white font-mono">{activeCount}</div>
              <div className="text-[9px] text-status-success font-mono font-medium">Live Node Ops</div>
            </div>

            {/* Metric 2 */}
            <div className="p-3 rounded-xl bg-[#070b16] border border-dark-card-border space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                <span>🔥</span>
                <span>Monitored</span>
              </div>
              <div className="text-xl font-black text-white font-mono">450+</div>
              <div className="text-[9px] text-amber-400 font-mono font-medium">Testnets & Nodes</div>
            </div>

            {/* Metric 3 */}
            <div className="p-3 rounded-xl bg-[#070b16] border border-dark-card-border space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                <span>📋</span>
                <span>Runbooks</span>
              </div>
              <div className="text-xl font-black text-white font-mono">{totalRunbooks}</div>
              <div className="text-[9px] text-brand-purple-light font-mono font-medium">100% Verified</div>
            </div>

            {/* Metric 4 */}
            <div className="p-3 rounded-xl bg-[#070b16] border border-dark-card-border space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                <span>💰</span>
                <span>Avg. Reward</span>
              </div>
              <div className="text-xl font-black text-brand-cyan font-mono">$100+</div>
              <div className="text-[9px] text-brand-cyan font-mono font-medium">Token Allocations</div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Most Recent Milestone (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-brand-purple/40 bg-gradient-to-br from-[#0b1020] to-brand-purple/15 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-dark-card-border">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <span>Community Milestone</span>
              <span className="text-amber-400">🔥</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              NEW CAMPAIGN
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Linea zkEVM & Berachain bArtio Nodes Live
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              New zero-wallet setup instructions added with automated state synchronization commands.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-muted border-t border-dark-card-border/60">
            <span>Verified 12h ago</span>
            <Link href="/guides" className="text-brand-cyan hover:underline flex items-center gap-1">
              <span>Read Runbook</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
