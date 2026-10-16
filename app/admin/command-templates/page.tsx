"use client";

import * as React from "react";
import Link from "next/link";
import {
  Terminal,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  Layers,
  Code,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { CommandTemplateItem } from "@/lib/services/mock-data";

export default function AdminCommandTemplatesPage() {
  const [templates, setTemplates] = React.useState<CommandTemplateItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<CommandTemplateItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formNetworkSlug, setFormNetworkSlug] = React.useState("general");
  const [formClient, setFormClient] = React.useState("Geth");
  const [formOS, setFormOS] = React.useState("Ubuntu 22.04 LTS / 24.04 LTS");
  const [formMethod, setFormMethod] = React.useState<"Docker" | "Systemd" | "Binary">("Systemd");
  const [formVersion, setFormVersion] = React.useState("1.0.0");
  const [formRisk, setFormRisk] = React.useState<"SAFE" | "CAUTION" | "DESTRUCTIVE">("SAFE");
  const [formContent, setFormContent] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");

  const loadTemplates = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/command-templates");
      const data = await res.json();
      if (data.items) {
        setTemplates(data.items);
      }
    } catch (err: any) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormName("");
    setFormSlug("");
    setFormNetworkSlug("general");
    setFormClient("Geth");
    setFormOS("Ubuntu 22.04 LTS / 24.04 LTS");
    setFormMethod("Systemd");
    setFormVersion("1.0.0");
    setFormRisk("SAFE");
    setFormContent(`[Unit]
Description=Node Service Daemon
After=network-online.target

[Service]
User=nodeoperator
ExecStart=/usr/local/bin/node start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`);
    setFormNotes("Standard verified unit");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: CommandTemplateItem) => {
    setEditingTemplate(t);
    setFormName(t.name);
    setFormSlug(t.slug);
    setFormNetworkSlug(t.networkSlug);
    setFormClient(t.client);
    setFormOS(t.operatingSystem);
    setFormMethod(t.installationMethod);
    setFormVersion(t.version);
    setFormRisk(t.riskLevel);
    setFormContent(t.templateContent);
    setFormNotes(t.validationNotes);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedback({ type: "error", text: "Template name is required." });
      return;
    }

    const payload: Partial<CommandTemplateItem> = {
      id: editingTemplate ? editingTemplate.id : undefined,
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      networkSlug: formNetworkSlug.trim(),
      client: formClient.trim(),
      operatingSystem: formOS.trim(),
      installationMethod: formMethod,
      version: formVersion.trim(),
      riskLevel: formRisk,
      templateContent: formContent,
      validationNotes: formNotes.trim(),
    };

    try {
      const method = editingTemplate ? "PUT" : "POST";
      const res = await fetch("/api/admin/command-templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to save template");
      }

      setFeedback({
        type: "success",
        text: editingTemplate ? "Template updated." : "Template created successfully.",
      });

      setIsModalOpen(false);
      loadTemplates();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    try {
      const res = await fetch(`/api/admin/command-templates?id=${id}&slug=${slug}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to delete template");
      }

      setFeedback({ type: "success", text: "Template removed." });
      setDeleteConfirmId(null);
      loadTemplates();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const handleCopyCode = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = templates.filter((t) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(s) ||
      t.networkSlug.toLowerCase().includes(s) ||
      t.client.toLowerCase().includes(s)
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
            <span className="text-text-primary">Command Templates</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Node Command Templates
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">
            Maintain parameterized bash scripts, systemd service units, and docker-compose files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTemplates}
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
            <span>New Command Template</span>
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
          placeholder="Search templates by name, network, or client..."
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
                <th className="py-3 px-4">Template Name</th>
                <th className="py-3 px-4">Network & Client</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted">
                    No command templates found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isDeleting = deleteConfirmId === t.id;
                  const isCopied = copiedId === t.id;

                  return (
                    <tr key={t.id} className="hover:bg-dark-card-hover/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-sm text-white">{t.name}</div>
                        <div className="text-[11px] text-text-muted font-mono">{t.validationNotes}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="capitalize">{t.networkSlug}</span> •{" "}
                        <strong className="text-white">{t.client}</strong>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-[10px]">
                          {t.installationMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-text-muted">v{t.version}</td>

                      <td className="py-3.5 px-4">
                        <Badge variant={t.riskLevel.toLowerCase() as any}>
                          {t.riskLevel}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-[10px] text-rose-400">Delete?</span>
                            <button
                              onClick={() => handleDelete(t.id, t.slug)}
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
                              onClick={() => handleCopyCode(t.templateContent, t.id)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-cyan bg-dark-bg text-slate-300 hover:text-white"
                              title="Copy Template Code"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-status-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-purple bg-dark-bg text-slate-300 hover:text-white"
                              title="Edit Template"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(t.id)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-rose-500 bg-dark-bg text-slate-400 hover:text-rose-400"
                              title="Delete Template"
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
                <Terminal className="w-5 h-5 text-brand-purple-light" />
                <h3 className="text-base font-bold text-white">
                  {editingTemplate ? "Edit Command Template" : "Add Command Template"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Template Name *</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Geth Systemd Unit"
                    required
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Network Slug</label>
                  <Input
                    value={formNetworkSlug}
                    onChange={(e) => setFormNetworkSlug(e.target.value)}
                    placeholder="e.g. ethereum-sepolia, celestia"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Client Daemon</label>
                  <Input
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Geth, celestia-node"
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Installation Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300"
                  >
                    <option value="Systemd">Systemd</option>
                    <option value="Docker">Docker Compose</option>
                    <option value="Binary">Native Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Risk Level</label>
                  <select
                    value={formRisk}
                    onChange={(e) => setFormRisk(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300"
                  >
                    <option value="SAFE">SAFE</option>
                    <option value="CAUTION">CAUTION</option>
                    <option value="DESTRUCTIVE">DESTRUCTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Template Shell / Config Content *</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={8}
                  placeholder="#!/usr/bin/env bash..."
                  required
                  className="w-full rounded-xl border border-dark-card-border bg-[#05070d] p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Validation Notes</label>
                <Input
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Field-tested on Ubuntu 24.04 LTS"
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-card-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="default" className="bg-brand-purple text-white">
                  Save Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
