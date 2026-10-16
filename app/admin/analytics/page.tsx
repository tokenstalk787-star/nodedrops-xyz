"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Layers,
  BookOpen,
  Sparkles,
  Eye,
  RefreshCw,
  Globe,
  Clock,
  ShieldCheck,
  Server,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TelemetryData {
  telemetry: {
    totalViews: number;
    viewsByPath: Record<string, number>;
    topPages: Array<{ path: string; views: number }>;
    recentEvents: Array<{
      id: string;
      path: string;
      referrer?: string;
      userAgent?: string;
      timestamp: string;
    }>;
  };
  platform: {
    totalNetworks: number;
    totalGuides: number;
    totalOpportunities: number;
    totalTroubleshooting: number;
    totalCommandTemplates: number;
    totalPages: number;
    auditLogs: Array<{
      id: string;
      action: string;
      targetType: string;
      targetId?: string;
      actor: string;
      createdAt: string;
    }>;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/telemetry");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Platform Telemetry</span>
            <span>/</span>
            <span className="text-text-primary">Real-Time Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Usage Telemetry & Platform Intelligence
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real database counts, live page hits, route popularity, and recent operator actions. Never fabricated.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchTelemetry}
          disabled={loading}
          className="text-xs font-mono gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* Top Real Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                <span className="uppercase font-semibold">Total Page Hits</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {data.telemetry.totalViews.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">Real hits tracked across public routes</p>
            </div>

            <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                <span className="uppercase font-semibold">Published Runbooks</span>
                <BookOpen className="w-4 h-4 text-brand-purple" />
              </div>
              <div className="text-3xl font-black text-brand-purple-light tracking-tight">
                {data.platform.totalGuides}
              </div>
              <p className="text-[11px] text-text-muted font-mono">Hardware verified setup guides</p>
            </div>

            <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                <span className="uppercase font-semibold">Supported Networks</span>
                <Layers className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="text-3xl font-black text-brand-cyan tracking-tight">
                {data.platform.totalNetworks}
              </div>
              <p className="text-[11px] text-text-muted font-mono">Mainnet & testnet chains configured</p>
            </div>

            <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                <span className="uppercase font-semibold">Active Opportunities</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 tracking-tight">
                {data.platform.totalOpportunities}
              </div>
              <p className="text-[11px] text-text-muted font-mono">Incentivized programs monitored</p>
            </div>
          </div>

          {/* Secondary 2-Column Split: Popular Routes vs Real-Time Event Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Top Pages Breakdown */}
            <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-dark-card-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs uppercase font-bold text-white font-mono">Most Visited Routes</span>
                </div>
                <span className="text-[11px] font-mono text-text-muted">Ranked by real requests</span>
              </div>

              <div className="divide-y divide-dark-card-border/60 text-xs font-mono">
                {data.telemetry.topPages.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">No route events recorded yet.</div>
                ) : (
                  data.telemetry.topPages.slice(0, 8).map((page, idx) => (
                    <div
                      key={page.path}
                      className="p-3 px-4 flex items-center justify-between hover:bg-dark-card-hover/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-5 h-5 rounded bg-[#070a14] border border-dark-card-border flex items-center justify-center text-[10px] text-text-muted">
                          {idx + 1}
                        </span>
                        <span className="text-text-primary font-semibold truncate">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-cyan font-bold">{page.views}</span>
                        <span className="text-text-muted text-[10px]">hits</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Live Real-Time Events Stream */}
            <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-dark-card-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase font-bold text-white font-mono">Recent Telemetry Events</span>
                </div>
                <span className="text-[11px] font-mono text-text-muted">Live event stream</span>
              </div>

              <div className="divide-y divide-dark-card-border/60 text-xs font-mono max-h-[360px] overflow-y-auto">
                {data.telemetry.recentEvents.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">
                    No recent events logged yet. Visit pages to see live pings.
                  </div>
                ) : (
                  data.telemetry.recentEvents.slice(0, 8).map((evt) => (
                    <div key={evt.id} className="p-3 px-4 flex items-start justify-between gap-3">
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                          <span className="text-white font-semibold">{evt.path}</span>
                        </div>
                        {evt.userAgent && (
                          <p className="text-[10px] text-text-muted truncate max-w-xs">{evt.userAgent}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Card: Platform Content Summary */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase font-mono mb-3">
              Platform Content Engine Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">NETWORKS</span>
                <span className="text-lg font-bold text-white">{data.platform.totalNetworks}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">GUIDES</span>
                <span className="text-lg font-bold text-white">{data.platform.totalGuides}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">OPPORTUNITIES</span>
                <span className="text-lg font-bold text-white">{data.platform.totalOpportunities}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">TROUBLESHOOTING</span>
                <span className="text-lg font-bold text-white">{data.platform.totalTroubleshooting}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">COMMAND SCRIPTS</span>
                <span className="text-lg font-bold text-white">{data.platform.totalCommandTemplates}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070a14] border border-dark-card-border">
                <span className="text-text-muted block text-[10px]">CMS PAGES</span>
                <span className="text-lg font-bold text-white">{data.platform.totalPages}</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
