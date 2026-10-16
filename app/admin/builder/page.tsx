"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  Eye,
  Save,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  Settings,
  Sparkles,
  Type,
  Layout,
  CheckCircle2,
  Upload,
  Globe,
  Share2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomPageItem, PageSectionItem } from "@/lib/services/mock-data";

export default function VisualPageBuilderPage() {
  const [pages, setPages] = React.useState<CustomPageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPageId, setSelectedPageId] = React.useState<string>("");
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [leftTab, setLeftTab] = React.useState<"tree" | "elements">("tree");
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>("");

  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [versionNumber, setVersionNumber] = React.useState(1);

  // Load pages from API
  const loadPages = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (Array.isArray(data.pages) && data.pages.length > 0) {
        setPages(data.pages);
        if (!selectedPageId) {
          const homeOrFirst = data.pages.find((p: any) => p.slug === "home" || p.pageType === "HOME") || data.pages[0];
          setSelectedPageId(homeOrFirst.id);
          if (homeOrFirst.sections && homeOrFirst.sections.length > 0) {
            setSelectedSectionId(homeOrFirst.sections[0].id);
          }
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to load pages." });
    } finally {
      setLoading(false);
    }
  }, [selectedPageId]);

  React.useEffect(() => {
    loadPages();
  }, [loadPages]);

  const currentPage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const selectedSection =
    currentPage?.sections.find((s) => s.id === selectedSectionId) ||
    currentPage?.sections[0];

  // Section manipulation
  const updateSectionConfig = (key: string, value: any) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        return {
          ...page,
          sections: page.sections.map((sec) => {
            if (sec.id !== selectedSectionId) return sec;
            return {
              ...sec,
              config: {
                ...sec.config,
                [key]: value,
              },
            };
          }),
        };
      })
    );
  };

  const toggleSectionVisibility = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        return {
          ...page,
          sections: page.sections.map((sec) =>
            sec.id === secId ? { ...sec, isVisible: !sec.isVisible } : sec
          ),
        };
      })
    );
  };

  const moveSection = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentPage.sections.length) return;

    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        const newSections = [...page.sections];
        const [removed] = newSections.splice(index, 1);
        newSections.splice(newIndex, 0, removed);
        return {
          ...page,
          sections: newSections.map((s, idx) => ({ ...s, orderIndex: idx })),
        };
      })
    );
  };

  const addComponent = (type: PageSectionItem["componentType"]) => {
    const newId = `sec-${Date.now()}`;
    const defaultConfigs: Record<string, any> = {
      HERO: {
        badge: "NEW ANNOUNCEMENT",
        heading: "Custom Headline Title",
        highlightText: "Highlight Phrase",
        description: "Detail your value proposition and platform features.",
        primaryCtaLabel: "Explore",
        primaryCtaHref: "/guides",
      },
      STATS: {
        title: "Key Metrics",
        items: [
          { label: "Active Nodes", value: "1,248" },
          { label: "Uptime", value: "99.98%" },
        ],
      },
      FEATURES: {
        title: "Feature Grid",
        subtitle: "Built for validators and developers",
        cards: [
          { title: "Validator Security", description: "Hardened systemd sandboxing", badge: "Core" },
          { title: "Hardware Evaluation", description: "Benchmarked hardware compatibility", badge: "Tools" },
        ],
      },
      RICH_TEXT: {
        title: "Platform Overview",
        contentMarkdown: "Editable markdown section content...",
      },
      FAQ: {
        title: "Frequently Asked Questions",
        items: [
          { question: "How do I participate?", answer: "Follow our verified setup guides." },
        ],
      },
      CTA: {
        heading: "Start Running Your Node Today",
        description: "Join hundreds of operators securing decentralized networks.",
        buttonText: "Launch Checklist",
        buttonHref: "/tools/checklist",
      },
      GUIDE_GRID: { itemLimit: 3 },
      NETWORK_GRID: { itemLimit: 4 },
      OPPORTUNITY_GRID: { itemLimit: 3 },
    };

    const newSection: PageSectionItem = {
      id: newId,
      componentType: type,
      orderIndex: currentPage?.sections.length || 0,
      isVisible: true,
      config: defaultConfigs[type] || { heading: "New Section" },
    };

    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === selectedPageId
          ? { ...page, sections: [...page.sections, newSection] }
          : page
      )
    );
    setSelectedSectionId(newId);
  };

  const removeSection = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage.sections.length <= 1) {
      alert("Page must have at least one section.");
      return;
    }
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === selectedPageId
          ? { ...page, sections: page.sections.filter((s) => s.id !== secId) }
          : page
      )
    );
  };

  // Real Save Draft
  const handleSaveDraft = async () => {
    if (!currentPage) return;
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        ...currentPage,
        status: "DRAFT",
      };

      const res = await fetch(`/api/admin/pages/${currentPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save draft failed.");

      setFeedback({ type: "success", text: `Draft saved successfully for "${currentPage.title}".` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save draft." });
    } finally {
      setSaving(false);
    }
  };

  // Real Publish Revision
  const handlePublish = async () => {
    if (!currentPage) return;
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        ...currentPage,
        status: "PUBLISHED",
      };

      const res = await fetch(`/api/admin/pages/${currentPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed.");

      setVersionNumber((v) => v + 1);
      setFeedback({
        type: "success",
        text: `Page "${currentPage.title}" published live! Accessible at /p/${currentPage.slug}.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to publish." });
    } finally {
      setSaving(false);
    }
  };

  if (loading && pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentPage) {
    return <div className="p-8 text-center text-text-muted">No pages found in database.</div>;
  }

  const liveUrl = currentPage.slug === "home" ? "/" : `/p/${currentPage.slug}`;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -m-4 sm:-m-8 bg-[#04060b] text-text-primary overflow-hidden font-sans">
      {/* BUILDER TOP BAR */}
      <header className="h-14 border-b border-dark-card-border bg-[#080b14] px-4 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors font-mono"
          >
            <span>&larr; Pages</span>
          </Link>
          <div className="h-4 w-px bg-dark-card-border" />

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted font-mono uppercase">Page:</span>
            <select
              value={selectedPageId}
              onChange={(e) => {
                const targetId = e.target.value;
                setSelectedPageId(targetId);
                const p = pages.find((page) => page.id === targetId);
                if (p && p.sections.length > 0) {
                  setSelectedSectionId(p.sections[0].id);
                }
              }}
              className="h-8 rounded-lg border border-dark-card-border bg-[#0d1222] px-3 font-mono text-white text-xs font-semibold focus:outline-none focus:border-brand-purple"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.slug}) — {p.status}
                </option>
              ))}
            </select>
          </div>

          <Badge
            className={`text-[10px] font-mono uppercase ${
              currentPage.status === "PUBLISHED"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            {currentPage.status}
          </Badge>
        </div>

        {/* Center: Viewport Controls */}
        <div className="hidden md:flex items-center gap-1 bg-[#0d1222] p-1 rounded-lg border border-dark-card-border">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "desktop" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Desktop 1200px"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "tablet" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "mobile" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 font-mono">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#0d1222] text-text-muted hover:text-white text-xs transition-colors"
          >
            <span>Live URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={saving}
            className="text-xs gap-1 border-dark-card-border"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePublish}
            disabled={saving}
            className="text-xs gap-1 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Publish Live</span>
          </Button>
        </div>
      </header>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`py-2 px-4 text-xs font-mono text-center flex items-center justify-center gap-2 border-b ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* MAIN 3-PANEL WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Sections Tree & Component Library */}
        <aside className="w-72 border-r border-dark-card-border bg-[#080c17] flex flex-col shrink-0 text-xs">
          <div className="flex border-b border-dark-card-border bg-[#060810] font-mono text-[11px]">
            <button
              onClick={() => setLeftTab("tree")}
              className={`flex-1 py-2.5 text-center transition-colors ${
                leftTab === "tree" ? "border-b-2 border-brand-purple text-white bg-[#0d1222]" : "text-text-muted hover:text-white"
              }`}
            >
              Page Structure ({currentPage.sections.length})
            </button>
            <button
              onClick={() => setLeftTab("elements")}
              className={`flex-1 py-2.5 text-center transition-colors ${
                leftTab === "elements" ? "border-b-2 border-brand-purple text-white bg-[#0d1222]" : "text-text-muted hover:text-white"
              }`}
            >
              + Add Section
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono">
            {leftTab === "tree" ? (
              currentPage.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    sec.id === selectedSectionId
                      ? "border-brand-purple bg-brand-purple/20 text-white font-medium shadow-sm"
                      : "border-dark-card-border bg-[#0d1222] text-text-secondary hover:text-white hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-[#060810] flex items-center justify-center font-mono text-[10px] text-brand-cyan">
                      {idx + 1}
                    </span>
                    <span className="truncate">{sec.componentType}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleSectionVisibility(sec.id, e)}
                      title={sec.isVisible ? "Hide section" : "Show section"}
                      className={`p-1 rounded ${sec.isVisible ? "text-brand-cyan" : "text-text-muted"}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => moveSection(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1 rounded text-text-muted hover:text-white disabled:opacity-30"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => moveSection(idx, "down", e)}
                      disabled={idx === currentPage.sections.length - 1}
                      className="p-1 rounded text-text-muted hover:text-white disabled:opacity-30"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => removeSection(sec.id, e)}
                      className="p-1 rounded text-text-muted hover:text-status-error"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-2">
                  Predefined Components
                </span>
                {[
                  { type: "HERO", label: "Hero Banner", desc: "Headline, description, and CTA button" },
                  { type: "FEATURES", label: "Feature Cards", desc: "Multi-column pathway cards" },
                  { type: "STATS", label: "Statistics Bar", desc: "Network numbers and metric gauges" },
                  { type: "GUIDE_GRID", label: "Guide Grid", desc: "Dynamic list of published setup guides" },
                  { type: "NETWORK_GRID", label: "Network Grid", desc: "Blockchain network compatibility cards" },
                  { type: "OPPORTUNITY_GRID", label: "Opportunities", desc: "Active testnet validator campaigns" },
                  { type: "FAQ", label: "FAQ Accordion", desc: "Question & answer expanders" },
                  { type: "CTA", label: "Call to Action", desc: "High-conversion onboarding banner" },
                  { type: "RICH_TEXT", label: "Rich Text", desc: "Custom formatted technical article block" },
                  { type: "DIVIDER", label: "Section Divider", desc: "Horizontal rule spacer" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addComponent(item.type as any)}
                    className="w-full p-2.5 rounded-lg border border-dark-card-border bg-[#0d1222] hover:border-brand-purple text-left transition-all group"
                  >
                    <div className="font-semibold text-white group-hover:text-brand-purple-light flex items-center justify-between">
                      <span>{item.label}</span>
                      <Plus className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-cyan" />
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANEL: Interactive Canvas */}
        <main className="flex-1 bg-[#020408] p-6 overflow-y-auto flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-[#080b14] border border-dark-card-border rounded-2xl overflow-hidden shadow-2xl ${
              viewport === "desktop"
                ? "w-full max-w-5xl"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            {/* Virtual Browser Top Nav Indicator */}
            <div className="h-8 border-b border-dark-card-border bg-[#0d1222] px-4 flex items-center justify-between text-[10px] font-mono text-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success/80" />
              </div>
              <span className="truncate">https://nodedrops.xyz{liveUrl}</span>
              <span className="text-brand-cyan font-bold">CANVAS PREVIEW</span>
            </div>

            {/* Sections Canvas */}
            <div className="p-6 sm:p-8 space-y-8 min-h-[600px]">
              {currentPage.sections.map((sec) => {
                if (!sec.isVisible) return null;
                const isSelected = sec.id === selectedSectionId;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`relative rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-brand-purple ring-offset-4 ring-offset-[#080b14] shadow-glow-purple"
                        : "hover:ring-1 hover:ring-dark-card-border"
                    }`}
                  >
                    {/* Element Selector Badge */}
                    {isSelected && (
                      <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-brand-purple text-white text-[10px] font-mono font-bold tracking-wider z-10 shadow-sm flex items-center gap-1">
                        <span>{sec.componentType}</span>
                        <span className="text-brand-cyan">• Active Selection</span>
                      </div>
                    )}

                    {/* Section Renderers */}
                    {sec.componentType === "HERO" && (
                      <div className="py-8 text-center space-y-4">
                        <span className="inline-block px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-[10px] font-mono">
                          {sec.config.badge || "ANNOUNCEMENT"}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          {sec.config.heading || "Headline Title"}{" "}
                          <span className="text-brand-cyan">{sec.config.highlightText || ""}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
                          {sec.config.description || "Section description text."}
                        </p>
                        <div className="pt-2">
                          <span className="inline-block px-4 py-2 rounded-lg bg-brand-purple text-white text-xs font-semibold">
                            {sec.config.primaryCtaLabel || "Get Started"} &rarr;
                          </span>
                        </div>
                      </div>
                    )}

                    {sec.componentType === "STATS" && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                        {(sec.config.items || []).map((stat: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl border border-dark-card-border bg-[#0d1222] text-center">
                            <div className="text-xl font-black text-white">{stat.value}</div>
                            <div className="text-[11px] text-text-muted font-mono">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.componentType === "FEATURES" && (
                      <div className="space-y-4 py-4">
                        <h2 className="text-lg font-bold text-white text-center">{sec.config.title || "Features"}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(sec.config.cards || []).map((card: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl border border-dark-card-border bg-[#0d1222] space-y-2">
                              <h3 className="font-bold text-sm text-white">{card.title}</h3>
                              <p className="text-xs text-text-secondary">{card.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.componentType === "FAQ" && (
                      <div className="space-y-3 py-4 max-w-2xl mx-auto">
                        <h2 className="text-lg font-bold text-white text-center">{sec.config.title || "FAQs"}</h2>
                        <div className="space-y-2">
                          {(sec.config.items || []).map((faq: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-lg border border-dark-card-border bg-[#0d1222]">
                              <span className="font-semibold text-white block text-xs">{faq.question}</span>
                              <p className="text-[11px] text-text-secondary mt-1">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.componentType === "CTA" && (
                      <div className="p-6 rounded-xl border border-brand-purple/40 bg-gradient-to-r from-[#0d1222] to-brand-purple/10 text-center space-y-3">
                        <h2 className="text-xl font-bold text-white">{sec.config.heading}</h2>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">{sec.config.description}</p>
                        <span className="inline-block px-4 py-2 rounded-lg bg-brand-purple text-white text-xs font-semibold">
                          {sec.config.buttonText} &rarr;
                        </span>
                      </div>
                    )}

                    {sec.componentType === "RICH_TEXT" && (
                      <div className="p-4 rounded-xl border border-dark-card-border bg-[#0d1222] space-y-2">
                        <h3 className="text-base font-bold text-white">{sec.config.title}</h3>
                        <p className="text-xs text-text-secondary whitespace-pre-line">{sec.config.contentMarkdown}</p>
                      </div>
                    )}

                    {sec.componentType === "DIVIDER" && (
                      <hr className="border-dark-card-border my-4" />
                    )}

                    {sec.componentType === "GUIDE_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-dark-card-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Guide Grid Component]</strong>
                        <span className="text-[11px]">Renders published setup guides from database</span>
                      </div>
                    )}

                    {sec.componentType === "NETWORK_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-dark-card-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Network Grid Component]</strong>
                        <span className="text-[11px]">Renders active blockchain networks</span>
                      </div>
                    )}

                    {sec.componentType === "OPPORTUNITY_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-dark-card-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Opportunities Grid]</strong>
                        <span className="text-[11px]">Renders verified validator opportunities</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Property Inspector */}
        <aside className="w-80 border-l border-dark-card-border bg-[#080c17] flex flex-col shrink-0 overflow-y-auto p-4 space-y-6 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
            <div>
              <span className="text-[10px] text-text-muted uppercase">Properties</span>
              <h3 className="font-bold text-white text-sm font-sans">{selectedSection?.componentType || "Section"}</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light text-[10px] font-bold">
              ACTIVE
            </span>
          </div>

          {selectedSection ? (
            <div className="space-y-4">
              {selectedSection.componentType === "HERO" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Badge Text</label>
                    <Input
                      value={selectedSection.config.badge || ""}
                      onChange={(e) => updateSectionConfig("badge", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Main Heading</label>
                    <Input
                      value={selectedSection.config.heading || ""}
                      onChange={(e) => updateSectionConfig("heading", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Highlight Gradient Text</label>
                    <Input
                      value={selectedSection.config.highlightText || ""}
                      onChange={(e) => updateSectionConfig("highlightText", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Description Text</label>
                    <Textarea
                      rows={3}
                      value={selectedSection.config.description || ""}
                      onChange={(e) => updateSectionConfig("description", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-text-muted mb-1 text-[11px]">CTA Label</label>
                      <Input
                        value={selectedSection.config.primaryCtaLabel || ""}
                        onChange={(e) => updateSectionConfig("primaryCtaLabel", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1 text-[11px]">CTA Link</label>
                      <Input
                        value={selectedSection.config.primaryCtaHref || ""}
                        onChange={(e) => updateSectionConfig("primaryCtaHref", e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedSection.componentType === "CTA" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">CTA Heading</label>
                    <Input
                      value={selectedSection.config.heading || ""}
                      onChange={(e) => updateSectionConfig("heading", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Description</label>
                    <Textarea
                      rows={3}
                      value={selectedSection.config.description || ""}
                      onChange={(e) => updateSectionConfig("description", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-text-muted mb-1 text-[11px]">Button Text</label>
                      <Input
                        value={selectedSection.config.buttonText || ""}
                        onChange={(e) => updateSectionConfig("buttonText", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1 text-[11px]">Button Link</label>
                      <Input
                        value={selectedSection.config.buttonHref || ""}
                        onChange={(e) => updateSectionConfig("buttonHref", e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedSection.componentType === "RICH_TEXT" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Section Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[11px]">Markdown Content</label>
                    <Textarea
                      rows={6}
                      value={selectedSection.config.contentMarkdown || ""}
                      onChange={(e) => updateSectionConfig("contentMarkdown", e.target.value)}
                    />
                  </div>
                </>
              )}

              {selectedSection.componentType === "FAQ" && (
                <div>
                  <label className="block text-text-muted mb-1 text-[11px]">Section Title</label>
                  <Input
                    value={selectedSection.config.title || ""}
                    onChange={(e) => updateSectionConfig("title", e.target.value)}
                    className="h-8"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted text-xs">Select a section in canvas to edit its properties.</p>
          )}

          {/* Quick Page Info */}
          <div className="pt-4 border-t border-dark-card-border space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-text-muted">
              <span>Slug:</span>
              <span className="text-white font-bold">/{currentPage.slug}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Type:</span>
              <span className="text-brand-cyan">{currentPage.pageType}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Sections:</span>
              <span className="text-white">{currentPage.sections.length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
