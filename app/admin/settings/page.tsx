"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [siteTitle, setSiteTitle] = React.useState("NodeDrops.xyz — Blockchain Node Education & Discovery");
  const [siteDescription, setSiteDescription] = React.useState(
    "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive production-grade node documentation."
  );
  const [announcementText, setAnnouncementText] = React.useState(
    "Welcome to NodeDrops.xyz! Explore our interactive Node Hardware Checker."
  );
  const [announcementLink, setAnnouncementLink] = React.useState("/tools/hardware-checker");
  const [contactEmail, setContactEmail] = React.useState("security@nodedrops.xyz");

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Site & Platform Settings</h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure global announcements, platform contact points, and SEO metadata defaults.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl border border-status-success/40 bg-status-success/10 text-xs text-status-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Platform settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <Card className="border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-base">Metadata & Branding</CardTitle>
            <CardDescription className="text-xs">
              Default titles and search descriptions used across public routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-text-muted mb-1 font-mono">Site Title</label>
              <Input
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1 font-mono">Meta Description</label>
              <Input
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1 font-mono">Security & Contact Email</label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-base">Global Announcement Banner</CardTitle>
            <CardDescription className="text-xs">
              Displays at the top of the homepage for urgent testnet announcements or version updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-text-muted mb-1 font-mono">Banner Headline Text</label>
              <Input
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1 font-mono">Destination Link</label>
              <Input
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={saving}
          className="gap-2 text-xs font-semibold"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </Button>
      </form>
    </div>
  );
}
