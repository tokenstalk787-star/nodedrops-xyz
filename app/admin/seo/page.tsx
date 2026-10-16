"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<RedirectRule[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newRule, setNewRule] = useState({
    sourcePath: "",
    targetPath: "",
    statusCode: 301,
    isActive: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/redirects");
      const data = await res.json();
      if (Array.isArray(data.rules)) {
        setRules(data.rules);
      }
    } catch (e) {
      console.error("Failed to load redirects:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
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
      loadRules();
      setSuccessMsg("Redirect rule added successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add redirect rule.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this redirect rule?")) return;
    try {
      const res = await fetch(`/api/admin/redirects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRules(rules.filter((r) => r.id !== id));
        setSuccessMsg("Redirect rule deleted.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e: any) {
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">SEO & Redirects</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            SEO Infrastructure & URL Redirects
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage 301 permanent and 302 temporary redirects, crawl budget, and sitemap health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setShowAddModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Redirect Rule
          </Button>
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

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* SEO Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">XML Sitemap</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xl font-bold text-text-primary">sitemap.xml</div>
          <div className="text-xs text-text-secondary">
            Auto-generated dynamic route indexing all published guides, networks, and opportunities.
          </div>
          <div className="pt-2">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-brand-purple hover:underline"
            >
              Inspect Live Sitemap ↗
            </a>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Robots File</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xl font-bold text-text-primary">robots.txt</div>
          <div className="text-xs text-text-secondary">
            Disallows crawler access to <code>/admin/</code> and <code>/api/</code> while allowing public content.
          </div>
          <div className="pt-2">
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-brand-purple hover:underline"
            >
              Inspect robots.txt ↗
            </a>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Active Redirects</span>
            <span className="text-xs font-mono text-brand-purple">{rules.length} rules</span>
          </div>
          <div className="text-xl font-bold text-text-primary">
            {rules.filter((r) => r.isActive).length} Active
          </div>
          <div className="text-xs text-text-secondary">
            Prevents broken links and preserves historical Google PageRank.
          </div>
        </div>
      </div>

      {/* Redirect Rules Table */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-dark-card-border flex items-center justify-between">
          <div className="text-sm font-semibold text-text-primary">Configured 301 / 302 Redirect Rules</div>
          <span className="text-xs text-text-muted font-mono">{rules.length} total entries</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">
            No redirect rules configured yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-bg/60 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-dark-card-border">
                <tr>
                  <th className="py-3 px-4">Source Path</th>
                  <th className="py-3 px-4">Destination Target</th>
                  <th className="py-3 px-4">Status Code</th>
                  <th className="py-3 px-4">Rule Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-card-border text-text-secondary">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-dark-card-hover/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-text-primary">
                      {rule.sourcePath}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-brand-purple">
                      {rule.targetPath}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-card-border">
                        {rule.statusCode} {rule.statusCode === 301 ? "Permanent" : "Temporary"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleRuleActive(rule)}
                        className={`text-xs px-2.5 py-0.5 rounded font-mono border transition-colors ${
                          rule.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-dark-card text-text-muted border-dark-card-border"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                        className="h-8 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
              <h3 className="text-base font-bold text-text-primary">Create URL Redirect Rule</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Source Path *
                </label>
                <Input
                  value={newRule.sourcePath}
                  onChange={(e) => setNewRule({ ...newRule, sourcePath: e.target.value })}
                  placeholder="/old-guide-path"
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Target Destination Path *
                </label>
                <Input
                  value={newRule.targetPath}
                  onChange={(e) => setNewRule({ ...newRule, targetPath: e.target.value })}
                  placeholder="/guides/new-path"
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  HTTP Status Code
                </label>
                <select
                  value={newRule.statusCode}
                  onChange={(e) => setNewRule({ ...newRule, statusCode: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-card-border rounded-md px-3 py-2 text-xs text-text-primary"
                >
                  <option value={301}>301 Moved Permanently (Recommended for SEO)</option>
                  <option value={302}>302 Found / Temporary Redirect</option>
                  <option value={307}>307 Temporary Redirect</option>
                  <option value={308}>308 Permanent Redirect</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-dark-card-border"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={saving}>
                  {saving ? "Saving..." : "Save Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
