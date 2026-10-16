"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  id: string;
  label: string;
  link: string;
  orderIndex: number;
  isEnabled: boolean;
  isExternal: boolean;
}

export default function AdminHeaderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [logoText, setLogoText] = useState("NodeDrops");
  const [logoUrl, setLogoUrl] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementText, setAnnouncementText] = useState(
    "Babylon Genesis Node Campaign Live — Check active opportunities."
  );
  const [announcementLink, setAnnouncementLink] = useState("/opportunities");

  const [items, setItems] = useState<NavItem[]>([
    { id: "1", label: "Networks", link: "/networks", orderIndex: 0, isEnabled: true, isExternal: false },
    { id: "2", label: "Guides", link: "/guides", orderIndex: 1, isEnabled: true, isExternal: false },
    { id: "3", label: "Opportunities", link: "/opportunities", orderIndex: 2, isEnabled: true, isExternal: false },
    { id: "4", label: "Tools", link: "/tools", orderIndex: 3, isEnabled: true, isExternal: false },
    { id: "5", label: "Troubleshooting", link: "/troubleshooting", orderIndex: 4, isEnabled: true, isExternal: false },
    { id: "6", label: "Learn", link: "/learn", orderIndex: 5, isEnabled: true, isExternal: false },
  ]);

  const [newItem, setNewItem] = useState({ label: "", link: "", isExternal: false });

  useEffect(() => {
    async function loadNav() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/navigation?location=HEADER");
        const data = await res.json();
        if (data.menu) {
          setLogoText(data.menu.logoText || "NodeDrops");
          setLogoUrl(data.menu.logoUrl || "");
          setShowAnnouncement(Boolean(data.menu.showAnnouncement));
          setAnnouncementText(data.menu.announcementText || "");
          setAnnouncementLink(data.menu.announcementLink || "");
          if (Array.isArray(data.menu.items) && data.menu.items.length > 0) {
            setItems(data.menu.items);
          }
        }
      } catch (e: any) {
        setErrorMsg("Failed to load header navigation.");
      } finally {
        setLoading(false);
      }
    }
    loadNav();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        location: "HEADER",
        logoText,
        logoUrl,
        showAnnouncement,
        announcementText,
        announcementLink,
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

      setSuccessMsg("Header settings and navigation menu updated successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    newItems.forEach((it, idx) => {
      it.orderIndex = idx;
    });

    setItems(newItems);
  };

  const toggleItemEnabled = (index: number) => {
    const newItems = [...items];
    newItems[index].isEnabled = !newItems[index].isEnabled;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    newItems.forEach((it, idx) => {
      it.orderIndex = idx;
    });
    setItems(newItems);
  };

  const addItem = () => {
    if (!newItem.label || !newItem.link) return;
    const item: NavItem = {
      id: `item-${Date.now()}`,
      label: newItem.label,
      link: newItem.link,
      orderIndex: items.length,
      isEnabled: true,
      isExternal: newItem.isExternal,
    };
    setItems([...items, item]);
    setNewItem({ label: "", link: "", isExternal: false });
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
            <span className="text-text-primary">Header & Navigation</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Global Header & Navigation
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure branding, top navigation menu items, and announcement banner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" disabled={saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save Changes"}
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

      {/* Live Interactive Navbar Preview */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center justify-between">
          <span>Live Header Preview</span>
          <span className="text-[11px] text-brand-purple">Updates in real-time</span>
        </div>

        <div className="rounded-xl border border-dark-card-border bg-dark-bg/95 overflow-hidden shadow-2xl">
          {/* Announcement banner preview */}
          {showAnnouncement && announcementText && (
            <div className="bg-gradient-to-r from-brand-purple/20 via-brand-blue/20 to-brand-cyan/20 border-b border-dark-card-border px-4 py-2 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              <span>{announcementText}</span>
              {announcementLink && (
                <span className="text-brand-purple font-medium hover:underline cursor-pointer">
                  Explore →
                </span>
              )}
            </div>
          )}

          {/* Nav bar */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 shrink-0">
                <img
                  src="/brand/logo-icon.png"
                  alt="NodeDrops"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center text-sm font-black tracking-tight leading-none">
                  <span className="text-white">NODE</span>
                  <span className="bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
                    DROPS
                  </span>
                </div>
                <span className="text-[8px] text-text-muted font-mono tracking-widest uppercase mt-0.5">
                  INCENTIVES NODES GUIDE
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {items
                .filter((i) => i.isEnabled)
                .map((item) => (
                  <span
                    key={item.id}
                    className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {item.label}
                    {item.isExternal && (
                      <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </span>
                ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-dark-card border border-dark-card-border text-text-muted font-mono">
                ⌘K Search
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branding & Announcement Banner */}
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Branding & Logo
            </h2>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Brand Text
              </label>
              <Input
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="NodeDrops"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Logo Image URL (Optional)
              </label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://nodedrops.xyz/logo.svg"
              />
              <p className="text-[11px] text-text-muted mt-1">
                If omitted, brand text with gradient icon will be displayed.
              </p>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Announcement Bar
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="rounded border-dark-card-border bg-dark-bg text-brand-purple focus:ring-brand-purple"
                />
                <span className="text-xs text-text-secondary">Show banner</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Banner Message
              </label>
              <Input
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Celestia Mocha Testnet Upgraded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Action Link
              </label>
              <Input
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/opportunities"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Navigation Menu Items Editor */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
            <div>
              <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Header Menu Items
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Reorder links, toggle visibility, or add external documentation links.
              </p>
            </div>
            <span className="text-xs font-mono text-text-muted">{items.length} items</span>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border hover:border-dark-card-hover transition-colors"
              >
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 hover:bg-dark-card rounded text-text-muted hover:text-text-primary disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, "down")}
                    disabled={idx === items.length - 1}
                    className="p-1 hover:bg-dark-card rounded text-text-muted hover:text-text-primary disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].label = e.target.value;
                      setItems(updated);
                    }}
                    placeholder="Link Label"
                    className="h-8 text-xs"
                  />
                  <Input
                    value={item.link}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].link = e.target.value;
                      setItems(updated);
                    }}
                    placeholder="/destination"
                    className="h-8 text-xs font-mono"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isExternal}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].isExternal = e.target.checked;
                        setItems(updated);
                      }}
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span className="text-[11px]">External</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => toggleItemEnabled(idx)}
                    className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
                      item.isEnabled
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-dark-card text-text-muted border-dark-card-border"
                    }`}
                  >
                    {item.isEnabled ? "Active" : "Hidden"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1 text-text-muted hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Item Row */}
          <div className="pt-4 border-t border-dark-card-border">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Add New Header Link
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <Input
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Link Label (e.g. Analytics)"
                className="h-8 text-xs"
              />
              <Input
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                placeholder="Destination URL (e.g. /analytics)"
                className="h-8 text-xs font-mono"
              />
              <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer whitespace-nowrap px-2">
                <input
                  type="checkbox"
                  checked={newItem.isExternal}
                  onChange={(e) => setNewItem({ ...newItem, isExternal: e.target.checked })}
                  className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                />
                <span className="text-[11px]">External</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={!newItem.label || !newItem.link}
                className="border-dark-card-border text-xs whitespace-nowrap"
              >
                + Add Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
