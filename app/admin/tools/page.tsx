"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Cpu,
  Terminal,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Layers,
  Sparkles,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CommandTemplateItem, TroubleshootingItem } from "@/lib/services/mock-data";

interface HardwareRule {
  network: string;
  minCpu: number;
  minRam: number;
  minSsd: number;
  recCpu: number;
  recRam: number;
  recSsd: number;
  notes: string;
}

export default function AdminToolsManagementPage() {
  const [activeTab, setActiveTab] = React.useState<"hardware" | "commands" | "troubleshooting">("hardware");
  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Hardware Checker Rules State
  const [hardwareRules, setHardwareRules] = React.useState<HardwareRule[]>([
    {
      network: "Celestia",
      minCpu: 2,
      minRam: 4,
      minSsd: 100,
      recCpu: 4,
      recRam: 8,
      recSsd: 250,
      notes: "Light nodes sample data availability over P2P using minimal compute.",
    },
    {
      network: "Ethereum Sepolia",
      minCpu: 4,
      minRam: 16,
      minSsd: 500,
      recCpu: 8,
      recRam: 32,
      recSsd: 1000,
      notes: "Geth + Lighthouse paired over Engine API with fast NVMe disk I/O.",
    },
    {
      network: "Berachain bArtio",
      minCpu: 8,
      minRam: 32,
      minSsd: 1000,
      recCpu: 16,
      recRam: 64,
      recSsd: 2000,
      notes: "Polaris EVM execution engine requires minimum 3000 IOPS NVMe.",
    },
    {
      network: "Babylon",
      minCpu: 4,
      minRam: 16,
      minSsd: 500,
      recCpu: 8,
      recRam: 32,
      recSsd: 1000,
      notes: "Bitcoin timestamping validator requires CometBFT state sync.",
    },
    {
      network: "Solana",
      minCpu: 12,
      minRam: 128,
      minSsd: 2000,
      recCpu: 24,
      recRam: 256,
      recSsd: 4000,
      notes: "Requires dedicated NVMe drives for ledger and unmetered 1Gbps uplink.",
    },
    {
      network: "Monad Devnet",
      minCpu: 16,
      minRam: 32,
      minSsd: 1000,
      recCpu: 32,
      recRam: 64,
      recSsd: 2000,
      notes: "High-throughput parallel EVM execution environment.",
    },
  ]);

  // Modal for Add New Hardware Rule
  const [isAddRuleOpen, setIsAddRuleOpen] = React.useState(false);
  const [newRuleNetwork, setNewRuleNetwork] = React.useState("");
  const [newRuleMinCpu, setNewRuleMinCpu] = React.useState(4);
  const [newRuleMinRam, setNewRuleMinRam] = React.useState(8);
  const [newRuleMinSsd, setNewRuleMinSsd] = React.useState(250);
  const [newRuleRecCpu, setNewRuleRecCpu] = React.useState(8);
  const [newRuleRecRam, setNewRuleRecRam] = React.useState(16);
  const [newRuleRecSsd, setNewRuleRecSsd] = React.useState(500);
  const [newRuleNotes, setNewRuleNotes] = React.useState("");

  // 2. Command Templates State
  const [templates, setTemplates] = React.useState<CommandTemplateItem[]>([]);
  const [loadingTemplates, setLoadingTemplates] = React.useState(false);

  // 3. Troubleshooting State
  const [troubleshootingItems, setTroubleshootingItems] = React.useState<TroubleshootingItem[]>([]);
  const [loadingTrouble, setLoadingTrouble] = React.useState(false);

  // Load hardware rules from API or localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("nodedrops_hardware_rules");
      if (saved) {
        setHardwareRules(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch command templates when tab active
  React.useEffect(() => {
    if (activeTab === "commands" && templates.length === 0) {
      setLoadingTemplates(true);
      fetch("/api/admin/command-templates")
        .then((r) => r.json())
        .then((d) => {
          if (d.items) setTemplates(d.items);
        })
        .finally(() => setLoadingTemplates(false));
    }
  }, [activeTab, templates.length]);

  // Fetch troubleshooting items when tab active
  React.useEffect(() => {
    if (activeTab === "troubleshooting" && troubleshootingItems.length === 0) {
      setLoadingTrouble(true);
      fetch("/api/admin/troubleshooting")
        .then((r) => r.json())
        .then((d) => {
          if (d.items) setTroubleshootingItems(d.items);
        })
        .finally(() => setLoadingTrouble(false));
    }
  }, [activeTab, troubleshootingItems.length]);

  // Save Hardware Rules
  const handleSaveHardware = async () => {
    try {
      setSaving(true);
      localStorage.setItem("nodedrops_hardware_rules", JSON.stringify(hardwareRules));

      const res = await fetch("/api/admin/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "HARDWARE_CHECKER",
          title: "Hardware Spec Evaluator",
          description: "Evaluates node runner hardware compatibility",
          rulesConfig: hardwareRules,
          version: "1.3.0",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save rules to backend API.");
      }

      setFeedback({
        type: "success",
        text: `All ${hardwareRules.length} hardware rules saved and live on public tools!`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      setFeedback({ type: "error", text: e.message || "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  // Add new Hardware Rule
  const handleAddHardwareRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleNetwork.trim()) {
      setFeedback({ type: "error", text: "Network name is required." });
      return;
    }

    const newRule: HardwareRule = {
      network: newRuleNetwork.trim(),
      minCpu: Number(newRuleMinCpu),
      minRam: Number(newRuleMinRam),
      minSsd: Number(newRuleMinSsd),
      recCpu: Number(newRuleRecCpu),
      recRam: Number(newRuleRecRam),
      recSsd: Number(newRuleRecSsd),
      notes: newRuleNotes.trim() || "Configured via Admin Tools",
    };

    const updated = [newRule, ...hardwareRules];
    setHardwareRules(updated);
    try {
      localStorage.setItem("nodedrops_hardware_rules", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsAddRuleOpen(false);
    setNewRuleNetwork("");
    setNewRuleNotes("");
    setFeedback({ type: "success", text: `Rule for "${newRule.network}" added.` });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Delete Hardware Rule
  const handleDeleteRule = (network: string) => {
    const updated = hardwareRules.filter((r) => r.network !== network);
    setHardwareRules(updated);
    try {
      localStorage.setItem("nodedrops_hardware_rules", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setFeedback({ type: "success", text: `Rule for "${network}" deleted.` });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Operator Tools</span>
            <span>/</span>
            <span className="text-text-primary">Tools Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Interactive Tools & Diagnostics Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">
            Real-time configuration for Hardware Checker, Command Generator, and Troubleshooting runbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tools" target="_blank">
            <Button variant="outline" size="sm" className="border-dark-card-border text-xs gap-1.5">
              <span>View Public Tools</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>

          {activeTab === "hardware" && (
            <Button
              variant="default"
              size="sm"
              disabled={saving}
              onClick={handleSaveHardware}
              className="bg-brand-purple hover:bg-brand-purple-light text-white text-xs gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Hardware Rules"}</span>
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-card-border pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab("hardware")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "hardware"
              ? "bg-brand-purple text-white shadow-glow font-bold"
              : "text-slate-300 hover:text-white bg-dark-card border border-dark-card-border"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hardware Checker Rules ({hardwareRules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("commands")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "commands"
              ? "bg-brand-purple text-white shadow-glow font-bold"
              : "text-slate-300 hover:text-white bg-dark-card border border-dark-card-border"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Command Builder Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("troubleshooting")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "troubleshooting"
              ? "bg-brand-purple text-white shadow-glow font-bold"
              : "text-slate-300 hover:text-white bg-dark-card border border-dark-card-border"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Troubleshooting Runbooks</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HARDWARE CHECKER RULES                                             */}
      {/* ========================================================================= */}
      {activeTab === "hardware" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-dark-card border border-dark-card-border p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Blockchain Hardware Requirements Matrix
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Edit thresholds below in real time or add new networks. Changes apply immediately to the public Hardware Checker tool.
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddRuleOpen(true)}
              className="bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-brand-purple-light hover:text-white text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Network Rule</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hardwareRules.map((rule, idx) => (
              <div
                key={rule.network}
                className="p-5 rounded-2xl bg-dark-card border border-dark-card-border space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between pb-2 border-b border-dark-card-border">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-brand-purple-light font-bold text-xs flex items-center justify-center font-mono">
                      0{idx + 1}
                    </span>
                    <span className="font-bold text-white text-base font-sans">{rule.network}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.network)}
                    className="p-1.5 rounded-lg border border-dark-card-border hover:border-rose-500/50 bg-dark-bg text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Min CPU (Cores)</span>
                    <Input
                      type="number"
                      value={rule.minCpu}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].minCpu = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Min RAM (GB)</span>
                    <Input
                      type="number"
                      value={rule.minRam}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].minRam = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Min SSD (GB)</span>
                    <Input
                      type="number"
                      value={rule.minSsd}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].minSsd = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Rec CPU (Cores)</span>
                    <Input
                      type="number"
                      value={rule.recCpu}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].recCpu = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Rec RAM (GB)</span>
                    <Input
                      type="number"
                      value={rule.recRam}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].recRam = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted">Rec SSD (GB)</span>
                    <Input
                      type="number"
                      value={rule.recSsd}
                      onChange={(e) => {
                        const updated = [...hardwareRules];
                        updated[idx].recSsd = Number(e.target.value);
                        setHardwareRules(updated);
                      }}
                      className="h-8 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-mono text-text-muted">Operator Guidance Notes</span>
                  <Input
                    value={rule.notes}
                    onChange={(e) => {
                      const updated = [...hardwareRules];
                      updated[idx].notes = e.target.value;
                      setHardwareRules(updated);
                    }}
                    className="h-8 text-xs font-sans"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMMAND BUILDER TEMPLATES                                          */}
      {/* ========================================================================= */}
      {activeTab === "commands" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-dark-card border border-dark-card-border p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Command Builder Node Templates
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Templates used by the interactive CLI and Systemd generator.
              </p>
            </div>
            <Link href="/admin/command-templates">
              <Button size="sm" variant="default" className="bg-brand-purple text-white text-xs gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Open Dedicated Template Manager</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-dark-card border border-dark-card-border space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-sans">{t.name}</span>
                  <Badge variant={t.riskLevel.toLowerCase() as any}>{t.riskLevel}</Badge>
                </div>
                <div className="text-xs text-text-secondary font-mono flex items-center gap-2">
                  <span>Client: <strong className="text-white">{t.client}</strong></span>
                  <span>•</span>
                  <span>Method: <strong className="text-brand-cyan">{t.installationMethod}</strong></span>
                </div>
                <div className="bg-[#05070d] p-3 rounded-xl border border-dark-card-border text-[11px] font-mono text-emerald-300 max-h-32 overflow-y-auto">
                  <pre>{t.templateContent}</pre>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <span className="text-text-muted">v{t.version}</span>
                  <Link
                    href="/admin/command-templates"
                    className="text-brand-purple-light hover:underline flex items-center gap-1"
                  >
                    <span>Edit in Manager</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TROUBLESHOOTING RUNBOOKS                                           */}
      {/* ========================================================================= */}
      {activeTab === "troubleshooting" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-dark-card border border-dark-card-border p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Troubleshooting Knowledgebase Solutions
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Verified error patterns and automated diagnostic scripts.
              </p>
            </div>
            <Link href="/admin/troubleshooting">
              <Button size="sm" variant="default" className="bg-brand-purple text-white text-xs gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Open Dedicated Solution Manager</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {troubleshootingItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-dark-card border border-dark-card-border space-y-3 shadow-lg"
              >
                <div className="font-bold text-white text-sm font-sans">{item.title}</div>
                <p className="text-xs text-slate-300 font-sans line-clamp-2">{item.symptoms}</p>
                <div className="bg-[#05070d] p-2.5 rounded-xl border border-dark-card-border text-[11px] font-mono text-emerald-400 truncate">
                  <code>{item.diagnosticCommands.split("\n")[0]}</code>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <div className="flex gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.2 rounded bg-dark-bg border border-border text-[10px] text-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/admin/troubleshooting"
                    className="text-brand-purple-light hover:underline flex items-center gap-1"
                  >
                    <span>Edit Solution</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW HARDWARE RULE                                              */}
      {/* ========================================================================= */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-purple-light" />
                <h3 className="text-base font-bold text-white">Add Hardware Checker Rule</h3>
              </div>
              <button onClick={() => setIsAddRuleOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHardwareRule} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-text-muted mb-1">Network Name *</label>
                <Input
                  value={newRuleNetwork}
                  onChange={(e) => setNewRuleNetwork(e.target.value)}
                  placeholder="e.g. Aleo Canary or Movement"
                  required
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Min CPU</label>
                  <Input
                    type="number"
                    value={newRuleMinCpu}
                    onChange={(e) => setNewRuleMinCpu(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Min RAM (GB)</label>
                  <Input
                    type="number"
                    value={newRuleMinRam}
                    onChange={(e) => setNewRuleMinRam(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Min SSD (GB)</label>
                  <Input
                    type="number"
                    value={newRuleMinSsd}
                    onChange={(e) => setNewRuleMinSsd(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Rec CPU</label>
                  <Input
                    type="number"
                    value={newRuleRecCpu}
                    onChange={(e) => setNewRuleRecCpu(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Rec RAM (GB)</label>
                  <Input
                    type="number"
                    value={newRuleRecRam}
                    onChange={(e) => setNewRuleRecRam(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Rec SSD (GB)</label>
                  <Input
                    type="number"
                    value={newRuleRecSsd}
                    onChange={(e) => setNewRuleRecSsd(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Guidance Notes</label>
                <Input
                  value={newRuleNotes}
                  onChange={(e) => setNewRuleNotes(e.target.value)}
                  placeholder="e.g. Fast NVMe disk with statesync"
                  className="h-9 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-card-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddRuleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="default" className="bg-brand-purple text-white">
                  Add Rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
