"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewAdminPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    pageType: "CUSTOM",
    status: "DRAFT",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImage: "",
    noIndex: false,
    noFollow: false,
    noSnippet: false,
    noArchive: false,
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.slug) {
      setErrorMsg("Title and Slug are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create page.");
      }

      router.push(`/admin/pages/${data.id}`);
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/admin/pages" className="hover:text-text-primary transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">New Page</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Create Custom Page
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <Button variant="outline" className="border-dark-card-border">
              Cancel
            </Button>
          </Link>
          <Button variant="default" disabled={saving} onClick={handleCreate}>
            {saving ? "Creating..." : "Create & Configure"}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Page Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({
                ...prev,
                title: val,
                slug: prev.slug || val.toLowerCase().replace(/[^a-z0-24-9]/g, "-"),
              }));
            }}
            placeholder="e.g. Node Runner Resources"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            URL Slug *
          </label>
          <div className="flex items-center">
            <span className="text-xs text-text-muted bg-dark-bg border border-r-0 border-dark-card-border px-3 py-2 rounded-l-md font-mono">
              /
            </span>
            <Input
              className="rounded-l-none font-mono text-sm"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. node-resources"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Meta Description
          </label>
          <Textarea
            rows={3}
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            placeholder="Brief summary for search engines and social cards..."
          />
        </div>
      </div>
    </div>
  );
}
