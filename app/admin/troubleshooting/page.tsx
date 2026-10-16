"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TroubleshootingItem } from "@/lib/services/mock-data";

export default function AdminTroubleshootingPage() {
  const [items, setItems] = React.useState<TroubleshootingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TroubleshootingItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formSymptoms, setFormSymptoms] = React.useState("");
  const [formCauses, setFormCauses] = React.useState("");
  const [formCommands, setFormCommands] = React.useState("");
  const [formSteps, setFormSteps] = React.useState("");
  const [formWarnings, setFormWarnings] = React.useState("");
  const [formVerification, setFormVerification] = React.useState("");
  const [formTags, setFormTags] = React.useState("P2P, Port, Network");

  const loadItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/troubleshooting");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err: any) {
      console.error("Failed to load troubleshooting items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormSlug("");
    setFormSymptoms("");
    setFormCauses("");
    setFormCommands("journalctl -u node -n 100 --no-pager");
    setFormSteps("1. Inspect recent logs\n2. Verify ports and restart daemon");
    setFormWarnings("Do not delete ledger files without a valid backup");
    setFormVerification("Confirm service status is active (running) and peer count > 0");
    setFormTags("P2P, Systemd, Logging");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TroubleshootingItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormSymptoms(item.symptoms);
    setFormCauses(item.likelyCauses);
    setFormCommands(item.diagnosticCommands);
    setFormSteps(item.correctiveSteps);
    setFormWarnings(item.riskWarnings || "");
    setFormVerification(item.verificationInstructions);
    setFormTags(item.tags.join(", "));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFeedback({ type: "error", text: "Issue title is required." });
      return;
    }

    const payload: Partial<TroubleshootingItem> = {
      id: editingItem ? editingItem.id : undefined,
      title: formTitle.trim(),
      slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      symptoms: formSymptoms.trim(),
      likelyCauses: formCauses.trim(),
      diagnosticCommands: formCommands.trim(),
      correctiveSteps: formSteps.trim(),
      riskWarnings: formWarnings.trim(),
      verificationInstructions: formVerification.trim(),
      tags: formTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch("/api/admin/troubleshooting", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to save solution");
      }

      setFeedback({
        type: "success",
        text: editingItem ? "Solution updated." : "Solution created successfully.",
      });

      setIsModalOpen(false);
      loadItems();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    try {
      const res = await fetch(`/api/admin/troubleshooting?id=${id}&slug=${slug}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to delete solution");
      }

      setFeedback({ type: "success", text: "Solution deleted." });
      setDeleteConfirmId(null);
      loadItems();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(s) ||
      item.symptoms.toLowerCase().includes(s) ||
      item.tags.some((t) => t.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Operator Tools</span>
            <span>/</span>
            <span className="text-text-primary">Troubleshooting Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Troubleshooting Knowledgebase
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">
            Maintain diagnostic runbooks, error symptom patterns, and safe recovery procedures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadItems}
            className="border-dark-card-border text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleOpenCreate}
            className="bg-brand-purple hover:bg-brand-purple-light text-white text-xs gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Solution</span>
          </Button>
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search solutions by issue title, symptoms, or tags..."
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-dark-card-border bg-dark-card text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple font-mono"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-text-muted">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="border-dark-card-border bg-dark-card shadow-2xl overflow-hidden rounded-2xl">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-dark-card-border text-text-muted bg-dark-bg/60 uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Symptoms</th>
                <th className="py-3 px-4">Diagnostic Command</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    No troubleshooting solutions found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isDeleting = deleteConfirmId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-dark-card-hover/80 transition-colors group">
                      <td className="py-3.5 px-4 font-sans font-bold text-sm text-white max-w-xs truncate">
                        {item.title}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                        {item.symptoms}
                      </td>

                      <td className="py-3.5 px-4 text-emerald-400 font-mono text-[11px] max-w-xs truncate">
                        {item.diagnosticCommands.split("\n")[0]}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((t) => (
                            <span key={t} className="px-1.5 py-0.2 rounded bg-dark-bg border border-border text-[10px] text-text-muted">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-[10px] text-rose-400">Delete?</span>
                            <button
                              onClick={() => handleDelete(item.id, item.slug)}
                              className="px-2 py-1 rounded bg-rose-600 text-white text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-dark-bg text-slate-300 text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-purple bg-dark-bg text-slate-300 hover:text-white"
                              title="Edit Solution"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href="/troubleshooting"
                              target="_blank"
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-cyan bg-dark-bg text-slate-300 hover:text-white"
                              title="View Public Hub"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-rose-500 bg-dark-bg text-slate-400 hover:text-rose-400"
                              title="Delete Solution"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-purple-light" />
                <h3 className="text-base font-bold text-white">
                  {editingItem ? "Edit Troubleshooting Solution" : "Add Troubleshooting Solution"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Issue Title *</label>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Peer Count Remains 0"
                    required
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Tags (comma separated)</label>
                  <Input
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. P2P, Ports, UFW"
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Symptoms Description</label>
                <textarea
                  value={formSymptoms}
                  onChange={(e) => setFormSymptoms(e.target.value)}
                  rows={2}
                  placeholder="What does the node operator see or experience?"
                  className="w-full rounded-xl border border-dark-card-border bg-[#070a14] p-2.5 text-xs text-slate-300 focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Likely Causes</label>
                <Input
                  value={formCauses}
                  onChange={(e) => setFormCauses(e.target.value)}
                  placeholder="e.g. Inbound TCP port 30303 closed, missing bootnodes"
                  className="h-9 font-sans"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Diagnostic Commands (Shell) *</label>
                <textarea
                  value={formCommands}
                  onChange={(e) => setFormCommands(e.target.value)}
                  rows={3}
                  placeholder="sudo ufw status verbose&#10;journalctl -u node -n 50 --no-pager"
                  required
                  className="w-full rounded-xl border border-dark-card-border bg-[#05070d] p-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Corrective Steps *</label>
                <textarea
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  rows={4}
                  placeholder="1. Open firewall port: sudo ufw allow 30303/tcp&#10;2. Restart service: sudo systemctl restart node"
                  required
                  className="w-full rounded-xl border border-dark-card-border bg-[#070a14] p-2.5 text-xs text-slate-300 focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Risk Warnings</label>
                  <Input
                    value={formWarnings}
                    onChange={(e) => setFormWarnings(e.target.value)}
                    placeholder="e.g. Do not expose RPC port 8545 publicly"
                    className="h-9 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Verification Instructions</label>
                  <Input
                    value={formVerification}
                    onChange={(e) => setFormVerification(e.target.value)}
                    placeholder="e.g. Run net_peerCount and verify count > 5"
                    className="h-9 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-card-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="default" className="bg-brand-purple text-white">
                  Save Solution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
