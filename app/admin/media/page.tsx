"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

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
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<"image" | "logo" | "icon" | "document">("image");
  const [uploadAltText, setUploadAltText] = useState("");
  const [urlFilename, setUrlFilename] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const nextList = assets.filter((a) => a.id !== id);
        setAssets(nextList);
        if (selectedAsset?.id === id) {
          setSelectedAsset(nextList[0] || null);
        }
        setSuccessMsg("Asset deleted from media library.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      setErrorMsg("Failed to delete asset.");
    }
  };

  const handleSetAsOgImage = async (url: string) => {
    try {
      await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ogImage: url }),
      });
      setSuccessMsg("Asset set as default OpenGraph social sharing image.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg("Failed to update OG Image.");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      setErrorMsg(null);

      if (uploadMode === "file") {
        if (!selectedFile) {
          setErrorMsg("Please select a file to upload.");
          setUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("category", uploadCategory);
        formData.append("altText", uploadAltText || selectedFile.name);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");

        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadAltText("");
        loadAssets();
        setSuccessMsg("File uploaded successfully to /uploads/!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        if (!urlFilename || !urlInput) {
          setErrorMsg("Filename and URL are required.");
          setUploading(false);
          return;
        }

        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: urlFilename,
            url: urlInput,
            category: uploadCategory,
            altText: uploadAltText,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed.");

        setShowUploadModal(false);
        setUrlFilename("");
        setUrlInput("");
        setUploadAltText("");
        loadAssets();
        setSuccessMsg("Media link added successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.filename.toLowerCase().includes(q) || (a.altText && a.altText.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Content Assets</span>
            <span>/</span>
            <span className="text-text-primary">Media Library</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Media Assets & Storage Manager
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real file upload to disk storage, image CDN links, logo branding, and social preview assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setShowUploadModal(true)} className="text-xs gap-1.5 font-mono">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card p-3 rounded-xl border border-dark-card-border text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "image", "logo", "icon", "document"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg uppercase font-mono text-[11px] transition-colors ${
                categoryFilter === cat
                  ? "bg-brand-purple text-white font-bold"
                  : "text-text-muted hover:text-white hover:bg-dark-bg"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="pl-8 h-8 text-xs font-mono"
          />
        </div>
      </div>

      {/* Main Grid & Preview Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Columns of Asset Cards */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-16 bg-dark-card border border-dark-card-border rounded-xl text-text-muted text-xs">
              No media assets found. Click &quot;Upload Media&quot; to add your first image.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl border bg-dark-card overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-purple ring-2 ring-brand-purple/40 shadow-glow-purple"
                        : "border-dark-card-border hover:border-slate-600"
                    }`}
                  >
                    <div className="aspect-video w-full bg-[#05070e] flex items-center justify-center overflow-hidden p-2">
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.filename}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5 border-t border-dark-card-border/60 text-xs">
                      <p className="font-mono text-text-primary truncate font-medium">{asset.filename}</p>
                      <div className="flex items-center justify-between text-[10px] text-text-muted mt-1 font-mono">
                        <span className="uppercase">{asset.category}</span>
                        <span>{asset.fileSizeKb} KB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Asset Detail Inspector */}
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4 shadow-xl text-xs font-mono h-fit">
          <div className="pb-3 border-b border-dark-card-border flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-white font-sans">Asset Inspector</span>
            {selectedAsset && (
              <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple-light border border-brand-purple/30 text-[10px] uppercase">
                {selectedAsset.category}
              </span>
            )}
          </div>

          {selectedAsset ? (
            <div className="space-y-4">
              {/* Preview */}
              <div className="rounded-xl bg-[#05070e] border border-dark-card-border p-3 flex items-center justify-center min-h-[160px]">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.filename}
                  className="max-h-40 max-w-full object-contain"
                />
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-text-muted block">Filename:</span>
                  <span className="text-white font-bold break-all">{selectedAsset.filename}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Direct URL:</span>
                  <span className="text-brand-cyan break-all">{selectedAsset.url}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-text-muted block">Size:</span>
                    <span className="text-slate-300">{selectedAsset.fileSizeKb} KB</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Type:</span>
                    <span className="text-slate-300">{selectedAsset.fileType}</span>
                  </div>
                </div>
                {selectedAsset.altText && (
                  <div>
                    <span className="text-text-muted block">Alt Text:</span>
                    <span className="text-slate-300">{selectedAsset.altText}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-dark-card-border">
                <Button
                  variant="outline"
                  onClick={() => handleCopyUrl(selectedAsset.url)}
                  className="w-full text-xs font-mono gap-1.5 justify-center"
                >
                  {copiedUrl === selectedAsset.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === selectedAsset.url ? "URL Copied!" : "Copy Public URL"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSetAsOgImage(selectedAsset.url)}
                  className="w-full text-xs font-mono gap-1.5 justify-center border-brand-purple/40 text-brand-purple-light hover:bg-brand-purple/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Set as Social Share Card</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="w-full text-xs font-mono gap-1.5 justify-center text-status-error hover:bg-status-error/10 border-status-error/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs">
              Select an asset on the left to view properties.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Upload Media */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-dark-card-border">
              <h3 className="text-base font-bold text-white font-sans">Upload Media Asset</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Mode switch */}
            <div className="flex items-center gap-1 bg-[#070a14] p-1 rounded-xl border border-dark-card-border">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`flex-1 py-1.5 rounded-lg text-center ${
                  uploadMode === "file" ? "bg-brand-purple text-white font-bold" : "text-text-muted"
                }`}
              >
                Local File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`flex-1 py-1.5 rounded-lg text-center ${
                  uploadMode === "url" ? "bg-brand-purple text-white font-bold" : "text-text-muted"
                }`}
              >
                External URL
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              {uploadMode === "file" ? (
                <div>
                  <label className="block text-text-muted mb-1">Choose File (PNG, JPG, SVG, WebP) *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.svg,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    required
                    className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-purple/20 file:text-brand-purple-light hover:file:bg-brand-purple/30"
                  />
                  {selectedFile && (
                    <p className="text-[10px] text-emerald-400 mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-text-muted mb-1">Asset Filename *</label>
                    <Input
                      value={urlFilename}
                      onChange={(e) => setUrlFilename(e.target.value)}
                      placeholder="e.g. solana-logo.png"
                      required
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1">Image URL *</label>
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://..."
                      required
                      className="h-9"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-text-muted mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300 focus:outline-none focus:border-brand-purple"
                >
                  <option value="image">Image / Graphic</option>
                  <option value="logo">Brand Logo</option>
                  <option value="icon">Icon / Emblem</option>
                  <option value="document">Documentation / PDF</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Alt Text Description</label>
                <Input
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Short description for accessibility & SEO"
                  className="h-9"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Save Asset"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
