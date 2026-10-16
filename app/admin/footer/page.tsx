"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterItem {
  id: string;
  label: string;
  link: string;
  columnName: string;
  orderIndex: number;
  isEnabled: boolean;
  isExternal: boolean;
}

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copyrightText, setCopyrightText] = useState("© 2026 NodeDrops.xyz. Open Web3 Node Education & Tooling.");
  const [tagline, setTagline] = useState("Run Nodes. Learn Web3. Build Resilient Blockchain Infrastructure.");

  const [items, setItems] = useState<FooterItem[]>([
    { id: "f1", label: "All Networks", link: "/networks", columnName: "Platform", orderIndex: 0, isEnabled: true, isExternal: false },
    { id: "f2", label: "Node Guides", link: "/guides", columnName: "Platform", orderIndex: 1, isEnabled: true, isExternal: false },
    { id: "f3", label: "Incentivized Opportunities", link: "/opportunities", columnName: "Platform", orderIndex: 2, isEnabled: true, isExternal: false },
    { id: "f4", label: "Learn Web3", link: "/learn", columnName: "Platform", orderIndex: 3, isEnabled: true, isExternal: false },

    { id: "f5", label: "Hardware Checker", link: "/tools/hardware-checker", columnName: "Tools", orderIndex: 0, isEnabled: true, isExternal: false },
    { id: "f6", label: "Command Builder", link: "/tools/command-builder", columnName: "Tools", orderIndex: 1, isEnabled: true, isExternal: false },
    { id: "f7", label: "Pre-Flight Checklist", link: "/tools/checklist", columnName: "Tools", orderIndex: 2, isEnabled: true, isExternal: false },
    { id: "f8", label: "Troubleshooting Runbooks", link: "/troubleshooting", columnName: "Tools", orderIndex: 3, isEnabled: true, isExternal: false },

    { id: "f9", label: "Documentation", link: "https://docs.nodedrops.xyz", columnName: "Community", orderIndex: 0, isEnabled: true, isExternal: true },
    { id: "f10", label: "GitHub Repository", link: "https://github.com", columnName: "Community", orderIndex: 1, isEnabled: true, isExternal: true },
    { id: "f11", label: "Discord Community", link: "https://discord.gg", columnName: "Community", orderIndex: 2, isEnabled: true, isExternal: true },
    { id: "f12", label: "X / Twitter", link: "https://x.com", columnName: "Community", orderIndex: 3, isEnabled: true, isExternal: true },

    { id: "f13", label: "Privacy Policy", link: "/privacy", columnName: "Legal", orderIndex: 0, isEnabled: true, isExternal: false },
    { id: "f14", label: "Terms of Service", link: "/terms", columnName: "Legal", orderIndex: 1, isEnabled: true, isExternal: false },
    { id: "f15", label: "Educational Disclaimer", link: "/disclaimer", columnName: "Legal", orderIndex: 2, isEnabled: true, isExternal: false },
    { id: "f16", label: "Security Bug Reporting", link: "/security", columnName: "Legal", orderIndex: 3, isEnabled: true, isExternal: false },
  ]);

  const [newItem, setNewItem] = useState({ label: "", link: "", columnName: "Platform", isExternal: false });

  useEffect(() => {
    async function loadFooter() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/navigation?location=FOOTER");
        const data = await res.json();
        if (data.menu) {
          if (data.menu.logoText) setTagline(data.menu.logoText);
          if (Array.isArray(data.menu.items) && data.menu.items.length > 0) {
            setItems(
              data.menu.items.map((i: any) => ({
                ...i,
                columnName: i.columnName || "Platform",
              }))
            );
          }
        }
      } catch (e: any) {
        setErrorMsg("Failed to load footer data.");
      } finally {
        setLoading(false);
      }
    }
    loadFooter();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        location: "FOOTER",
        title: "Global Footer Navigation",
        logoText: tagline,
        items,
      };

      const res = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      setSuccessMsg("Footer configuration and column links saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const columns = ["Platform", "Tools", "Community", "Legal"];

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const addItem = () => {
    if (!newItem.label || !newItem.link) return;
    const item: FooterItem = {
      id: `f-${Date.now()}`,
      label: newItem.label,
      link: newItem.link,
      columnName: newItem.columnName,
      orderIndex: items.filter((i) => i.columnName === newItem.columnName).length,
      isEnabled: true,
      isExternal: newItem.isExternal,
    };
    setItems([...items, item]);
    setNewItem({ label: "", link: "", columnName: newItem.columnName, isExternal: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">Footer Layout</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Global Footer & Legal Links
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure footer link columns, copyright notices, and external community channels.
          </p>
        </div>

        <Button variant="default" disabled={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save Footer"}
        </Button>
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

      {/* Live Footer Preview */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center justify-between">
          <span>Live Footer Preview</span>
          <span className="text-[11px] text-brand-purple">Responsive 4-column layout</span>
        </div>

        <div className="rounded-xl border border-dark-card-border bg-dark-bg p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-black text-xs">
                  N
                </div>
                <span className="font-bold text-text-primary text-sm">NodeDrops.xyz</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed max-w-xs">{tagline}</p>
            </div>

            {columns.map((col) => (
              <div key={col} className="space-y-2">
                <div className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  {col}
                </div>
                <ul className="space-y-1.5 text-xs text-text-secondary">
                  {items
                    .filter((i) => i.columnName === col && i.isEnabled)
                    .map((item) => (
                      <li key={item.id} className="hover:text-text-primary cursor-pointer">
                        {item.label}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-dark-card-border text-[11px] text-text-muted flex flex-col md:flex-row justify-between items-center gap-2">
            <span>{copyrightText}</span>
            <span>Non-custodial. Educational open-source initiative.</span>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Text */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Footer Metadata
          </h2>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
              Tagline Description
            </label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Tagline shown under logo"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
              Copyright Notice
            </label>
            <Input
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="© 2026 NodeDrops..."
            />
          </div>
        </div>

        {/* Right 2 Columns: Columns Editor */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Manage Column Links
            </h2>
            <span className="text-xs font-mono text-text-muted">{items.length} total links</span>
          </div>

          <div className="space-y-3">
            {columns.map((col) => (
              <div key={col} className="p-3.5 rounded-lg bg-dark-bg/60 border border-dark-card-border space-y-2">
                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                  Column: {col}
                </div>
                <div className="space-y-1.5">
                  {items
                    .filter((i) => i.columnName === col)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded bg-dark-card border border-dark-card-border text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-medium text-text-primary">{item.label}</span>
                          <span className="font-mono text-text-muted text-[11px] truncate max-w-xs">
                            {item.link}
                          </span>
                          {item.isExternal && (
                            <span className="text-[10px] text-text-muted font-mono">(ext)</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-text-muted hover:text-rose-400 p-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Link Form */}
          <div className="pt-4 border-t border-dark-card-border space-y-3">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Add Link to Column
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={newItem.columnName}
                onChange={(e) => setNewItem({ ...newItem, columnName: e.target.value })}
                className="bg-dark-bg border border-dark-card-border rounded-md px-3 py-1.5 text-xs text-text-primary"
              >
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Input
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Link Label"
                className="h-8 text-xs"
              />
              <Input
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                placeholder="URL (e.g. /privacy)"
                className="h-8 text-xs font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={!newItem.label || !newItem.link}
                className="border-dark-card-border text-xs"
              >
                + Add to {newItem.columnName}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
