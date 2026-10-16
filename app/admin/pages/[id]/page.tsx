"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AdminPageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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

  useEffect(() => {
    async function loadPage() {
      if (!pageId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/pages/${pageId}`);
        const data = await res.json();
        if (data.page) {
          setFormData({
            title: data.page.title || "",
            slug: data.page.slug || "",
            pageType: data.pageType || data.page.pageType || "CUSTOM",
            status: data.page.status || "DRAFT",
            seoTitle: data.page.seoTitle || "",
            seoDescription: data.page.seoDescription || "",
            canonicalUrl: data.page.canonicalUrl || "",
            ogImage: data.page.ogImage || "",
            noIndex: Boolean(data.page.noIndex),
            noFollow: Boolean(data.page.noFollow),
            noSnippet: Boolean(data.page.noSnippet),
            noArchive: Boolean(data.page.noArchive),
          });
        }
      } catch (e: any) {
        setErrorMsg("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [pageId]);

  const handleSave = async (newStatus?: string) => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        ...formData,
        status: newStatus || formData.status,
      };

      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      if (newStatus) {
        setFormData((prev) => ({ ...prev, status: newStatus }));
      }
      setSuccessMsg("Page configuration and SEO settings saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Loading page settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header breadcrumb & actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/admin/pages" className="hover:text-text-primary transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{formData.title || "Configure Page"}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {formData.title || "Page Settings"}
            </h1>
            <Badge
              variant={formData.status === "PUBLISHED" ? "default" : "secondary"}
              className="text-xs"
            >
              {formData.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/builder?page=${pageId}`}>
            <Button variant="outline" className="border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              Open in Visual Builder
            </Button>
          </Link>
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => handleSave("DRAFT")}
            className="border-dark-card-border hover:bg-dark-card-hover"
          >
            Save as Draft
          </Button>
          <Button
            variant="default"
            disabled={saving}
            onClick={() => handleSave("PUBLISHED")}
          >
            {saving ? "Saving..." : "Publish Page"}
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Basic Info & SEO Directives */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Page Information */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Page General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Page Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    placeholder="e.g. resources"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Engine Optimization (SEO) & Robots */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
              <div>
                <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Engine Directives & Meta Robots
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Control how search engine crawlers index this page and display snippets.
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Meta Title
                </label>
                <span className={`text-xs font-mono ${(formData.seoTitle?.length || 0) > 60 ? "text-amber-400" : "text-text-muted"}`}>
                  {formData.seoTitle?.length || 0} / 60 characters
                </span>
              </div>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Page Title | NodeDrops"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Meta Description
                </label>
                <span className={`text-xs font-mono ${(formData.seoDescription?.length || 0) > 160 ? "text-amber-400" : "text-text-muted"}`}>
                  {formData.seoDescription?.length || 0} / 160 characters
                </span>
              </div>
              <Textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Comprehensive technical guide and node running instructions on NodeDrops..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Canonical URL
              </label>
              <Input
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                placeholder="https://nodedrops.xyz/..."
              />
              <p className="text-[11px] text-text-muted mt-1">
                Specify original source URL to prevent duplicate content indexing penalties.
              </p>
            </div>

            {/* Meta Robots Directives Checkboxes - Matching Image 7 */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-3">
                Crawler Directives (Meta Robots)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border hover:border-dark-card-hover cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.noIndex}
                    onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                    className="mt-0.5 rounded border-dark-card-border bg-dark-card text-brand-purple focus:ring-brand-purple"
                  />
                  <div>
                    <div className="text-xs font-semibold text-text-primary font-mono">noindex</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Prevent search engines from indexing this page in search results.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border hover:border-dark-card-hover cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.noFollow}
                    onChange={(e) => setFormData({ ...formData, noFollow: e.target.checked })}
                    className="mt-0.5 rounded border-dark-card-border bg-dark-card text-brand-purple focus:ring-brand-purple"
                  />
                  <div>
                    <div className="text-xs font-semibold text-text-primary font-mono">nofollow</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Instruct crawlers not to follow outbound links on this page.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border hover:border-dark-card-hover cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.noSnippet}
                    onChange={(e) => setFormData({ ...formData, noSnippet: e.target.checked })}
                    className="mt-0.5 rounded border-dark-card-border bg-dark-card text-brand-purple focus:ring-brand-purple"
                  />
                  <div>
                    <div className="text-xs font-semibold text-text-primary font-mono">nosnippet</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Do not display a snippet in the search results.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border hover:border-dark-card-hover cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.noArchive}
                    onChange={(e) => setFormData({ ...formData, noArchive: e.target.checked })}
                    className="mt-0.5 rounded border-dark-card-border bg-dark-card text-brand-purple focus:ring-brand-purple"
                  />
                  <div>
                    <div className="text-xs font-semibold text-text-primary font-mono">noarchive</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Do not store a cached copy of this page in search index.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* OpenGraph & Social Sharing Image */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              OpenGraph & Social Sharing Card
            </h2>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Social Preview Image URL (1200x630 recommended)
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  placeholder="https://nodedrops.xyz/og/image.png"
                />
                <Link href="/admin/media">
                  <Button variant="outline" className="border-dark-card-border text-xs whitespace-nowrap">
                    Media Library
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live SERP & Social Card Previews */}
        <div className="space-y-6">
          {/* Google Search Result Preview Card */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Google SERP Preview
            </div>

            <div className="p-3.5 rounded-lg bg-dark-bg border border-dark-card-border space-y-1">
              <div className="text-xs text-text-muted flex items-center gap-1 font-sans">
                <span className="text-[11px] text-text-muted">nodedrops.xyz</span>
                <span>›</span>
                <span className="text-[11px] text-text-secondary">{formData.slug || "page"}</span>
              </div>
              <div className="text-sm font-medium text-brand-purple hover:underline cursor-pointer truncate">
                {formData.seoTitle || formData.title || "Page Title | NodeDrops"}
              </div>
              <div className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {formData.seoDescription || "Provide an accurate meta description to help searchers understand your node deployment guides and resources."}
              </div>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-purple" />
              Social Card Preview (X / Discord / Telegram)
            </div>

            <div className="rounded-lg overflow-hidden border border-dark-card-border bg-dark-bg">
              <div className="h-32 bg-dark-card flex items-center justify-center border-b border-dark-card-border relative overflow-hidden">
                {formData.ogImage ? (
                  <img src={formData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-xs text-text-muted font-mono">NodeDrops.xyz Preview Banner</span>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <div className="text-[10px] text-text-muted uppercase font-mono">nodedrops.xyz</div>
                <div className="text-xs font-semibold text-text-primary truncate">
                  {formData.seoTitle || formData.title || "NodeDrops Platform"}
                </div>
                <div className="text-[11px] text-text-secondary line-clamp-2">
                  {formData.seoDescription || "Explore blockchain testnet and mainnet node deployment guides."}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Publishing Info
            </div>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Page Type:</span>
                <span className="font-mono text-text-primary">{formData.pageType}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-text-primary">{formData.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Directives:</span>
                <span className="font-mono text-emerald-400">
                  {formData.noIndex ? "noindex" : "index"}, {formData.noFollow ? "nofollow" : "follow"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-dark-card-border">
              <Link href={`/admin/versions?pageId=${pageId}`}>
                <Button variant="ghost" size="sm" className="w-full text-xs text-text-muted hover:text-text-primary">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Revision History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
