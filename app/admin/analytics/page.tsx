"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Platform Telemetry</span>
            <span>/</span>
            <span className="text-text-primary">Analytics & Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            NodeDrops Telemetry & Usage Analytics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time traffic telemetry, guide completion rates, command generations, and network distribution.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-dark-card p-1 rounded-lg border border-dark-card-border">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase transition-colors ${
                timeRange === r
                  ? "bg-brand-purple text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards with Sparklines - Matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="uppercase font-semibold tracking-wider">Guide Reads</span>
            <span className="text-emerald-400 font-mono font-semibold">+18.4%</span>
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">48,920</div>
          {/* Sparkline SVG */}
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full text-brand-purple" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,20 Q15,10 30,16 T60,8 T80,12 T100,3 L100,25 L0,25 Z"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <path
                d="M0,20 Q15,10 30,16 T60,8 T80,12 T100,3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="uppercase font-semibold tracking-wider">Active Operators</span>
            <span className="text-emerald-400 font-mono font-semibold">+12.1%</span>
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">12,410</div>
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full text-brand-cyan" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,18 Q20,15 40,8 T70,14 T100,4 L100,25 L0,25 Z"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <path
                d="M0,18 Q20,15 40,8 T70,14 T100,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="uppercase font-semibold tracking-wider">Commands Built</span>
            <span className="text-emerald-400 font-mono font-semibold">+24.8%</span>
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">8,730</div>
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full text-brand-blue" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,22 Q25,18 50,12 T80,6 T100,2 L100,25 L0,25 Z"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <path
                d="M0,22 Q25,18 50,12 T80,6 T100,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="uppercase font-semibold tracking-wider">System Health</span>
            <span className="text-emerald-400 font-mono font-semibold">Optimal</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">99.98%</div>
          <div className="h-10 w-full pt-1 flex items-end gap-1">
            {[40, 60, 75, 90, 85, 95, 100, 95, 98, 92, 99, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/30 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Telemetry Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Traffic Volume Bar Graph (8 cols) */}
        <div className="lg:col-span-8 bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Daily Active Node Runners & Request Telemetry
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Calculated across all testnet and mainnet tutorial views
              </p>
            </div>
            <span className="text-xs font-mono text-brand-purple">Oct 10 - Oct 16</span>
          </div>

          <div className="h-64 flex items-end gap-4 pt-6 px-2">
            {[
              { day: "Thu", views: 4200, height: "65%" },
              { day: "Fri", views: 5100, height: "78%" },
              { day: "Sat", views: 3900, height: "60%" },
              { day: "Sun", views: 4400, height: "68%" },
              { day: "Mon", views: 6100, height: "92%" },
              { day: "Tue", views: 5800, height: "88%" },
              { day: "Wed", views: 6850, height: "100%" },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.views}
                </span>
                <div className="w-full bg-dark-bg rounded-t-lg overflow-hidden h-48 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-brand-purple/40 to-brand-purple rounded-t-lg group-hover:from-brand-purple/60 group-hover:to-brand-purple transition-all"
                    style={{ height: bar.height }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Popularity Distribution (4 cols) - Donut/Pie representation */}
        <div className="lg:col-span-4 bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-4">
          <div className="border-b border-dark-card-border pb-4">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Network Popularity Share
            </h3>
            <p className="text-xs text-text-muted mt-0.5">By node setup completion count</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: "Ethereum Mainnet", pct: 38, color: "#8B5CF6" },
              { name: "Solana Validator", pct: 24, color: "#06B6D4" },
              { name: "Celestia Mocha", pct: 18, color: "#3B82F6" },
              { name: "Babylon Genesis", pct: 12, color: "#10B981" },
              { name: "Berachain Artio", pct: 8, color: "#F59E0B" },
            ].map((net) => (
              <div key={net.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-text-primary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: net.color }} />
                    {net.name}
                  </span>
                  <span className="font-mono text-text-muted">{net.pct}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${net.pct}%`, backgroundColor: net.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-dark-card-border space-y-2">
            <div className="text-xs font-semibold text-text-primary">Operating System Profile</div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Ubuntu / Debian Linux</span>
              <span className="font-mono font-semibold text-text-primary">82%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>macOS (Apple Silicon)</span>
              <span className="font-mono font-semibold text-text-primary">10%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Windows (WSL2 Linux)</span>
              <span className="font-mono font-semibold text-text-primary">8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
