"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSizeKb: number;
  dimensions?: string;
  altText?: string;
  category: "image" | "logo" | "icon" | "document";
  createdAt: string;
}

export default function AdminMediaPage() {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    filename: "",
    url: "",
    category: "image" as "image" | "logo" | "icon" | "document",
    altText: "",
    fileSizeKb: 145,
    dimensions: "1200x630",
  });
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, [categoryFilter]);

  async function loadAssets() {
    try {
      setLoading(true);
      const url = categoryFilter === "all" ? "/api/admin/media" : `/api/admin/media?category=${categoryFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data.assets)) {
        setAssets(data.assets);
        if (data.assets.length > 0 && !selectedAsset) {
          setSelectedAsset(data.assets[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets(assets.filter((a) => a.id !== id));
        if (selectedAsset?.id === id) {
          setSelectedAsset(null);
        }
        setSuccessMsg("Asset deleted.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e: any) {
      setErrorMsg("Failed to delete asset.");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.filename || !uploadData.url) {
      setErrorMsg("Filename and URL are required.");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setShowUploadModal(false);
      setUploadData({
        filename: "",
        url: "",
        category: "image",
        altText: "",
        fileSizeKb: 120,
        dimensions: "1200x630",
      });
      loadAssets();
      setSuccessMsg("Asset added to library.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add asset.");
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter((a) =>
    a.filename.toLowerCase().includes(search.toLowerCase()) ||
    (a.altText && a.altText.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">Media Library</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Media & Asset Gallery
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage screenshots, diagrams, network logos, and OpenGraph banners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setShowUploadModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Media Asset
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-dark-card border border-dark-card-border p-4 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["all", "image", "logo", "icon", "document"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-brand-purple text-white font-medium"
                  : "bg-dark-bg text-text-secondary hover:text-text-primary border border-dark-card-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or alt text..."
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Gallery Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Media Grid */}
        <div className="lg:col-span-8 bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Showing {filteredAssets.length} assets</span>
            <span className="font-mono">Web3 Optimized</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No media assets match your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group cursor-pointer rounded-xl border p-2 bg-dark-bg transition-all ${
                      isSelected
                        ? "border-brand-purple ring-2 ring-brand-purple/30 shadow-lg"
                        : "border-dark-card-border hover:border-dark-card-hover"
                    }`}
                  >
                    <div className="h-28 rounded-lg bg-dark-card flex items-center justify-center overflow-hidden relative">
                      {asset.category === "image" || asset.category === "logo" ? (
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-2 text-text-muted">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px] font-mono mt-1 block uppercase">{asset.fileType}</span>
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-dark-bg/80 text-text-muted">
                        {asset.fileSizeKb} KB
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-text-primary truncate" title={asset.filename}>
                        {asset.filename}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono capitalize">
                        {asset.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Selected Asset Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedAsset ? (
            <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Asset Details
                </h3>
                <Badge variant="outline" className="text-xs capitalize font-mono border-dark-card-border">
                  {selectedAsset.category}
                </Badge>
              </div>

              {/* Preview */}
              <div className="rounded-lg overflow-hidden border border-dark-card-border bg-dark-bg h-48 flex items-center justify-center">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.filename}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-text-muted block">Filename:</span>
                  <span className="font-semibold text-text-primary break-all font-mono">
                    {selectedAsset.filename}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-text-muted block">Dimensions:</span>
                    <span className="font-mono text-text-primary">{selectedAsset.dimensions || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">File Size:</span>
                    <span className="font-mono text-text-primary">{selectedAsset.fileSizeKb} KB</span>
                  </div>
                </div>

                <div>
                  <span className="text-text-muted block">Alt Text:</span>
                  <span className="text-text-secondary italic">
                    {selectedAsset.altText || "No alt text provided."}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block">Asset URL:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      readOnly
                      value={selectedAsset.url}
                      className="bg-dark-bg border border-dark-card-border rounded px-2 py-1 text-[11px] font-mono text-text-secondary flex-1 truncate"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(selectedAsset.url)}
                      className="h-7 text-xs border-dark-card-border"
                    >
                      {copiedUrl === selectedAsset.url ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-card-border flex items-center justify-between">
                <a
                  href={selectedAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-purple hover:underline"
                >
                  Open Original File ↗
                </a>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="h-8 text-xs"
                >
                  Delete Asset
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-card-border rounded-xl p-8 text-center text-text-muted text-xs">
              Select an asset from the gallery to view dimensions, copy link, or delete.
            </div>
          )}
        </div>
      </div>

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
              <h3 className="text-base font-bold text-text-primary">Add Asset to Media Library</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Filename *
                </label>
                <Input
                  value={uploadData.filename}
                  onChange={(e) => setUploadData({ ...uploadData, filename: e.target.value })}
                  placeholder="e.g. solana-validator-dashboard.png"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  File URL *
                </label>
                <Input
                  value={uploadData.url}
                  onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, category: e.target.value as any })
                    }
                    className="w-full bg-dark-bg border border-dark-card-border rounded-md px-3 py-2 text-xs text-text-primary"
                  >
                    <option value="image">Image / Graphic</option>
                    <option value="logo">Logo / Brand</option>
                    <option value="icon">Icon</option>
                    <option value="document">Document / PDF</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                    Dimensions
                  </label>
                  <Input
                    value={uploadData.dimensions}
                    onChange={(e) => setUploadData({ ...uploadData, dimensions: e.target.value })}
                    placeholder="1200x630"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Alt Text (Accessibility)
                </label>
                <Input
                  value={uploadData.altText}
                  onChange={(e) => setUploadData({ ...uploadData, altText: e.target.value })}
                  placeholder="Visual representation of node metrics..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="border-dark-card-border"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={uploading}>
                  {uploading ? "Saving..." : "Add to Library"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
