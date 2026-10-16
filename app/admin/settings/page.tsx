"use client";

import * as React from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Bell,
  Mail,
  Lock,
  RefreshCw,
  Server,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Real-time Settings Fields
  const [siteTitle, setSiteTitle] = React.useState("");
  const [siteDescription, setSiteDescription] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [showAnnouncement, setShowAnnouncement] = React.useState(false);
  const [announcementText, setAnnouncementText] = React.useState("");
  const [announcementLink, setAnnouncementLink] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.settings) {
          setSiteTitle(data.settings.siteTitle || "");
          setSiteDescription(data.settings.siteDescription || "");
          setTagline(data.settings.tagline || "");
          setShowAnnouncement(Boolean(data.settings.showAnnouncement));
          setAnnouncementText(data.settings.announcementText || "");
          setAnnouncementLink(data.settings.announcementLink || "");
          setContactEmail(data.settings.contactEmail || "security@nodedrops.xyz");
          setMaintenanceMode(Boolean(data.settings.maintenanceMode));
        }
      } catch (err: any) {
        setFeedback({ type: "error", text: "Failed to load platform settings." });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        siteTitle,
        siteDescription,
        tagline,
        showAnnouncement,
        announcementText,
        announcementLink,
        contactEmail,
        maintenanceMode,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");

      setFeedback({
        type: "success",
        text: "Platform & Security settings saved successfully. Changes are live on the website.",
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Platform Engine</span>
            <span>/</span>
            <span className="text-text-primary">Security & Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Platform Control & Security Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Global announcement banner, operator contact endpoints, branding parameters, and security sandboxing.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
        {/* Card 1: Branding & Platform Identity */}
        <Card className="border-dark-card-border bg-dark-card shadow-xl">
          <CardHeader className="border-b border-dark-card-border pb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-purple" />
              <CardTitle className="text-sm font-bold text-white font-sans">Platform Identity & Metadata</CardTitle>
            </div>
            <CardDescription className="text-xs text-text-muted font-mono">
              Controls default website titles, descriptions, and footer slogans.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-text-muted mb-1">Platform Slogan / Tagline</label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Run Nodes. Learn Web3. Build Resilient Blockchain Infrastructure."
                className="h-9 font-sans"
              />
            </div>

            <div>
              <label className="block text-text-muted mb-1">Global Site Title</label>
              <Input
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="NodeDrops.xyz — Blockchain Node Platform"
                className="h-9 font-sans"
              />
            </div>

            <div>
              <label className="block text-text-muted mb-1">Default Meta Description</label>
              <Textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={2}
                className="text-xs font-sans"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Global Announcement Banner */}
        <Card className="border-dark-card-border bg-dark-card shadow-xl">
          <CardHeader className="border-b border-dark-card-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-cyan" />
                <CardTitle className="text-sm font-bold text-white font-sans">Global Announcement Banner</CardTitle>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-brand-purple focus:ring-0 w-4 h-4"
                />
                <span className={showAnnouncement ? "text-emerald-400 font-bold" : "text-text-muted"}>
                  {showAnnouncement ? "ENABLED & VISIBLE" : "DISABLED"}
                </span>
              </label>
            </div>
            <CardDescription className="text-xs text-text-muted font-mono">
              Displays a prominent banner across the top of all public pages for breaking validator notices or releases.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-text-muted mb-1">Announcement Message Headline</label>
              <Input
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Celestia Mocha-4 Testnet upgrade scheduled for Block 2,400,000"
                className="h-9 font-sans"
              />
            </div>

            <div>
              <label className="block text-text-muted mb-1">Call-to-Action Link URL</label>
              <Input
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/guides/celestia-light-node or https://..."
                className="h-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Security & Operational Sandboxing */}
        <Card className="border-dark-card-border bg-dark-card shadow-xl">
          <CardHeader className="border-b border-dark-card-border pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-white font-sans">Security & Incident Management</CardTitle>
            </div>
            <CardDescription className="text-xs text-text-muted font-mono">
              Vulnerability disclosure contact, rate limits, and maintenance controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-text-muted mb-1">Security Disclosure & Contact Email</label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="security@nodedrops.xyz"
                className="h-9"
              />
            </div>

            <div className="pt-2 border-t border-dark-card-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">Maintenance Mode</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    When active, public visitors receive a high-priority maintenance notice.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-status-warning focus:ring-0 w-4 h-4"
                  />
                  <span className={maintenanceMode ? "text-amber-400 font-bold text-xs" : "text-text-muted text-xs"}>
                    {maintenanceMode ? "ACTIVE" : "OFF"}
                  </span>
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070a14] border border-dark-card-border text-[11px] space-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span>Security Engine:</span>
                <span className="text-emerald-400 font-bold">SHA-256 + Bcrypt + Session Tokens</span>
              </div>
              <div className="flex items-center justify-between text-text-muted">
                <span>Database Engine:</span>
                <span className="text-brand-cyan font-bold">TiDB Cloud / Local Persistent Store</span>
              </div>
              <div className="flex items-center justify-between text-text-muted">
                <span>Client Code Execution:</span>
                <span className="text-white font-bold">Sandboxed (Copy-only, Zero Server-Side Root Exec)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="text-xs font-sans gap-2">
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Platform Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
