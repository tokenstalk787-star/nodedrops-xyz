"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  ArrowRight,
  Shield,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState<"redirects" | "meta" | "robots">("redirects");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirects state
  const [rules, setRules] = useState<RedirectRule[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    sourcePath: "",
    targetPath: "",
    statusCode: 301,
    isActive: true,
  });

  // Global SEO state
  const [seoConfig, setSeoConfig] = useState({
    siteTitle: "NodeDrops.xyz — Blockchain Node Education, Discovery & Tooling",
    siteDescription:
      "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive production-grade node documentation, hardware checkers, command builders, and validator guides.",
    keywords: "blockchain nodes, validator guide, testnet node, ethereum geth lighthouse, celestia light node, web3 infrastructure",
    ogImage: "/brand/logo-horizontal.png",
    robotsDirective: "index, follow",
    googleVerification: "",
  });

  useEffect(() => {
    loadAllSeoData();
  }, []);

  async function loadAllSeoData() {
    try {
      setLoading(true);
      const [redirectRes, seoRes] = await Promise.all([
        fetch("/api/admin/redirects"),
        fetch("/api/admin/seo"),
      ]);

      const redirectData = await redirectRes.json();
      if (Array.isArray(redirectData.rules)) {
        setRules(redirectData.rules);
      }

      const seoData = await seoRes.json();
      if (seoData.settings) {
        setSeoConfig({
          siteTitle: seoData.settings.siteTitle || "",
          siteDescription: seoData.settings.siteDescription || "",
          keywords: Array.isArray(seoData.settings.keywords)
            ? seoData.settings.keywords.join(", ")
            : seoData.settings.keywords || "",
          ogImage: seoData.settings.ogImage || "/brand/logo-horizontal.png",
          robotsDirective: seoData.settings.robotsDirective || "index, follow",
          googleVerification: seoData.settings.googleVerification || "",
        });
      }
    } catch (e: any) {
      setErrorMsg("Failed to load SEO configuration.");
    } finally {
      setLoading(false);
    }
  }

  const handleSaveGlobalSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        siteTitle: seoConfig.siteTitle,
        siteDescription: seoConfig.siteDescription,
        keywords: seoConfig.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogImage: seoConfig.ogImage,
        robotsDirective: seoConfig.robotsDirective,
        googleVerification: seoConfig.googleVerification,
      };

      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update SEO settings.");

      setSuccessMsg("Global SEO metadata and search crawler directives updated successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.sourcePath || !newRule.targetPath) {
      setErrorMsg("Source and Target paths are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRule),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save rule.");

      setShowAddModal(false);
      setNewRule({ sourcePath: "", targetPath: "", statusCode: 301, isActive: true });
      loadAllSeoData();
      setSuccessMsg("Redirect rule added successfully. Real-time middleware is active.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add redirect rule.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Delete this redirect rule?")) return;
    try {
      const res = await fetch(`/api/admin/redirects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRules(rules.filter((r) => r.id !== id));
        setSuccessMsg("Redirect rule deleted.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      setErrorMsg("Failed to delete rule.");
    }
  };

  const toggleRuleActive = async (rule: RedirectRule) => {
    try {
      const updated = { ...rule, isActive: !rule.isActive };
      await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setRules(rules.map((r) => (r.id === rule.id ? updated : r)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">SEO & Redirects</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            SEO Infrastructure & URL Routing
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time Next.js middleware redirects, OpenGraph social previews, and Google search indexing directives.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-dark-card p-1 rounded-xl border border-dark-card-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("redirects")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
              activeTab === "redirects" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
            }`}
          >
            URL Redirects ({rules.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("meta")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
              activeTab === "meta" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
            }`}
          >
            Global Meta & OpenGraph
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("robots")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
              activeTab === "robots" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
            }`}
          >
            Sitemap & Robots
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: 301 / 302 REDIRECTS                                                */}
      {/* ========================================================================= */}
      {activeTab === "redirects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Active 301 Permanent & 302 Temporary Redirect Rules</h2>
              <p className="text-xs text-text-muted font-mono mt-0.5">
                Processed automatically on incoming HTTP requests via Next.js Middleware.
              </p>
            </div>
            <Button variant="default" onClick={() => setShowAddModal(true)} className="text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Redirect Rule</span>
            </Button>
          </div>

          <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex items-center justify-center min-h-[160px]">
                <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-xs">
                No redirect rules configured yet. Click &quot;Add Redirect Rule&quot; to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#090d18] text-[11px] text-text-muted uppercase border-b border-dark-card-border">
                    <tr>
                      <th className="py-3 px-4">Incoming URL (Source)</th>
                      <th className="py-3 px-4">Destination (Target)</th>
                      <th className="py-3 px-4">HTTP Status</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-card-border/60 text-text-secondary">
                    {rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-dark-card-hover/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-text-primary">
                          {rule.sourcePath}
                        </td>
                        <td className="py-3 px-4 text-brand-cyan">
                          {rule.targetPath}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-card-border text-[11px]">
                            {rule.statusCode} {rule.statusCode === 301 ? "Permanent" : "Temporary"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleRuleActive(rule)}
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border transition-colors ${
                              rule.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {rule.isActive ? "ACTIVE" : "DISABLED"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 rounded text-text-muted hover:text-status-error hover:bg-dark-bg"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GLOBAL META & OPENGRAPH                                            */}
      {/* ========================================================================= */}
      {activeTab === "meta" && (
        <form onSubmit={handleSaveGlobalSeo} className="space-y-6 text-xs font-mono">
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-4 shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white font-sans">Default Website Title & Meta Description</h2>
              <p className="text-text-muted text-[11px] mt-0.5">
                Applied to public pages that do not override custom page titles.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-text-muted mb-1">Global Site Title (Title Template)</label>
                <Input
                  value={seoConfig.siteTitle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, siteTitle: e.target.value })}
                  placeholder="NodeDrops.xyz — Blockchain Node Platform"
                  className="h-9"
                  required
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Default Meta Description</label>
                <Textarea
                  value={seoConfig.siteDescription}
                  onChange={(e) => setSeoConfig({ ...seoConfig, siteDescription: e.target.value })}
                  rows={3}
                  className="text-xs"
                  required
                />
                <span className="text-[10px] text-text-muted">
                  Recommended length: 140 - 160 characters. Current: {seoConfig.siteDescription.length}
                </span>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Global Target Keywords (Comma separated)</label>
                <Input
                  value={seoConfig.keywords}
                  onChange={(e) => setSeoConfig({ ...seoConfig, keywords: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-text-muted mb-1">Default OpenGraph Share Image URL</label>
                  <Input
                    value={seoConfig.ogImage}
                    onChange={(e) => setSeoConfig({ ...seoConfig, ogImage: e.target.value })}
                    placeholder="/brand/logo-horizontal.png or https://..."
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Google Search Console Verification Token</label>
                  <Input
                    value={seoConfig.googleVerification}
                    onChange={(e) => setSeoConfig({ ...seoConfig, googleVerification: e.target.value })}
                    placeholder="google-site-verification token..."
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving} className="text-xs font-sans">
                {saving ? "Saving Changes..." : "Save SEO Settings"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SITEMAP & ROBOTS                                                   */}
      {/* ========================================================================= */}
      {activeTab === "robots" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-purple" />
                <span className="font-bold text-sm text-white">sitemap.xml</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                LIVE
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Dynamically generated XML sitemap indexing all published guides, networks, and opportunities for Google Search and Bing crawlers.
            </p>
            <div className="pt-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-brand-cyan hover:underline inline-flex items-center gap-1"
              >
                <span>Inspect live /sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-cyan" />
                <span className="font-bold text-sm text-white">robots.txt</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                SECURED
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Restricts search bot crawlers from indexing private operator zones (<code>/admin/</code> and <code>/api/</code>) while allowing all public documentation.
            </p>
            <div className="pt-2">
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-brand-cyan hover:underline inline-flex items-center gap-1"
              >
                <span>Inspect live /robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Redirect Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-dark-card-border">
              <h3 className="text-base font-bold text-white font-sans">Add HTTP Redirect Rule</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRedirect} className="space-y-3">
              <div>
                <label className="block text-text-muted mb-1">Source Path *</label>
                <Input
                  value={newRule.sourcePath}
                  onChange={(e) => setNewRule({ ...newRule, sourcePath: e.target.value })}
                  placeholder="/old-guide or /docs/celestia"
                  required
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Destination Target *</label>
                <Input
                  value={newRule.targetPath}
                  onChange={(e) => setNewRule({ ...newRule, targetPath: e.target.value })}
                  placeholder="/guides/celestia-light-node or https://..."
                  required
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Status Code</label>
                <select
                  value={newRule.statusCode}
                  onChange={(e) => setNewRule({ ...newRule, statusCode: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300 focus:outline-none focus:border-brand-purple"
                >
                  <option value={301}>301 — Moved Permanently (SEO standard)</option>
                  <option value={302}>302 — Temporary Redirect</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Add Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
