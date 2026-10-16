"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminToolsManagementPage() {
  const [activeTab, setActiveTab] = useState<"hardware" | "commands" | "troubleshooting">("hardware");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Hardware Checker Mock Rules State
  const [hardwareRules, setHardwareRules] = useState([
    {
      network: "Celestia",
      minCpu: 4,
      minRam: 8,
      minSsd: 250,
      recCpu: 8,
      recRam: 16,
      recSsd: 500,
      notes: "Mocha-4 testnet requires fast NVMe disk I/O.",
    },
    {
      network: "Babylon",
      minCpu: 4,
      minRam: 16,
      minSsd: 500,
      recCpu: 8,
      recRam: 32,
      recSsd: 1000,
      notes: "High memory utilization during block processing.",
    },
    {
      network: "Solana",
      minCpu: 12,
      minRam: 128,
      minSsd: 2000,
      recCpu: 16,
      recRam: 256,
      recSsd: 4000,
      notes: "Requires dedicated NVMe drives for ledger and accounts.",
    },
  ]);

  const handleSaveHardware = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "HARDWARE_CHECKER",
          title: "Hardware Spec Evaluator",
          description: "Evaluates node runner hardware compatibility",
          rulesConfig: hardwareRules,
          version: "1.2.0",
        }),
      });
      if (res.ok) {
        setSuccessMsg("Hardware compatibility rules saved.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">Tools Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Interactive Tools Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure rules and parameters for Hardware Checker, Command Builder, and Troubleshooting runbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tools" target="_blank">
            <Button variant="outline" className="border-dark-card-border text-xs">
              Open Public Tools ↗
            </Button>
          </Link>
          {activeTab === "hardware" && (
            <Button variant="default" disabled={saving} onClick={handleSaveHardware}>
              {saving ? "Saving..." : "Save Hardware Rules"}
            </Button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-card-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("hardware")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "hardware"
              ? "bg-brand-purple text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Hardware Checker Rules
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("commands")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "commands"
              ? "bg-brand-purple text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Command Builder Templates
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("troubleshooting")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "troubleshooting"
              ? "bg-brand-purple text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Troubleshooting Runbooks
        </button>
      </div>

      {/* Tab 1: Hardware Checker Rules */}
      {activeTab === "hardware" && (
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Network Hardware Thresholds
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Set baseline CPU, RAM, and SSD storage requirements used by the client-side calculator.
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-xs">
                v1.2.0 Active
              </Badge>
            </div>

            <div className="space-y-4 pt-2">
              {hardwareRules.map((rule, idx) => (
                <div
                  key={rule.network}
                  className="p-4 rounded-xl bg-dark-bg/60 border border-dark-card-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary text-sm">{rule.network}</span>
                    <span className="text-xs text-text-muted font-mono">Rule #{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Min Cores</span>
                      <Input
                        type="number"
                        value={rule.minCpu}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].minCpu = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Min RAM (GB)</span>
                      <Input
                        type="number"
                        value={rule.minRam}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].minRam = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Min SSD (GB)</span>
                      <Input
                        type="number"
                        value={rule.minSsd}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].minSsd = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Rec Cores</span>
                      <Input
                        type="number"
                        value={rule.recCpu}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].recCpu = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Rec RAM (GB)</span>
                      <Input
                        type="number"
                        value={rule.recRam}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].recRam = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-text-muted block text-[11px] mb-1">Rec SSD (GB)</span>
                      <Input
                        type="number"
                        value={rule.recSsd}
                        onChange={(e) => {
                          const updated = [...hardwareRules];
                          updated[idx].recSsd = Number(e.target.value);
                          setHardwareRules(updated);
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-text-muted block text-[11px] mb-1">Validation Notes</span>
                    <Input
                      value={rule.notes}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].notes = e.target.value;
                        setHardwareRules(updated);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Command Builder */}
      {activeTab === "commands" && (
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Command Builder Templates
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Validated client templates executed entirely on the user&apos;s machine.
              </p>
            </div>
            <Link href="/admin/command-templates">
              <Button size="sm" variant="default" className="text-xs">
                Manage All Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-card-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary text-sm">Systemd Service Generator</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  SAFE
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Generates robust linux systemd service files with restart policies and user security isolation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-card-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary text-sm">Docker Compose Generator</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  SAFE
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Produces reproducible containerized deployment configs with persistent volume mappings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Troubleshooting */}
      {activeTab === "troubleshooting" && (
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Troubleshooting Knowledgebase
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Verified error resolutions for peer connection drops, out of memory crashes, and sync stalls.
              </p>
            </div>
            <Link href="/admin/troubleshooting">
              <Button size="sm" variant="default" className="text-xs">
                Manage Runbooks
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-card-border space-y-2">
            <div className="text-xs text-text-muted font-mono">Current Runbook Categories</div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["P2P & Port Forwarding", "Storage & Disk I/O", "RPC & API Config", "Genesis Sync", "Keyring & Staking"].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded bg-dark-card border border-dark-card-border text-xs text-text-secondary font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
