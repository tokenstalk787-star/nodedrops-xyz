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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEED_PAGES, CustomPageItem, PageSectionItem } from "@/lib/services/mock-data";

export default function VisualPageBuilderPage() {
  const [pages, setPages] = React.useState<CustomPageItem[]>(SEED_PAGES);
  const [selectedPageId, setSelectedPageId] = React.useState<string>("page-home");
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [leftTab, setLeftTab] = React.useState<"tree" | "elements">("tree");
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>("sec-hero");

  const [saving, setSaving] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [versionNumber, setVersionNumber] = React.useState(225);

  const currentPage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const selectedSection = currentPage.sections.find((s) => s.id === selectedSectionId) || currentPage.sections[0];

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
          { title: "Validator Security", description: "Hardened systemd sandboxing", badge: "Core", href: "#" },
          { title: "RPC Endpoints", description: "Low-latency regional peering", badge: "Infra", href: "#" },
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
    };

    const newSection: PageSectionItem = {
      id: newId,
      componentType: type,
      orderIndex: currentPage.sections.length,
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

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Draft revision saved successfully to TiDB cache.");
    }, 500);
  };

  const handlePublish = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setVersionNumber((v) => v + 1);
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-6 md:-m-8 bg-[#060911] text-xs select-none">
      {/* 1. TOP TOOLBAR (matching Image 2) */}
      <header className="h-14 border-b border-border bg-[#0a0e1c] px-4 flex items-center justify-between gap-4 shrink-0">
        {/* Left: Page Title & Version */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-white shadow-glow-purple">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">{currentPage.title}</span>
              <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30 text-[10px] font-mono">
                v.{versionNumber}
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-mono">
              Slug: /{currentPage.slug === "home" ? "" : currentPage.slug} • Edited moments ago
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-background-secondary border border-border">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "desktop" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Desktop (1440px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "tablet" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded transition-colors ${
              viewport === "mobile" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-text-muted px-2 border-l border-border/80">
            {viewport === "desktop" ? "1440 px" : viewport === "tablet" ? "768 px" : "375 px"}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {published && (
            <span className="flex items-center gap-1 text-status-success font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published v.{versionNumber}!</span>
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={saving}
            className="text-xs gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            isLoading={saving}
            className="text-xs gap-1.5 bg-gradient-to-r from-brand-purple to-brand-blue"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </Button>
        </div>
      </header>

      {/* 2. THREE-PANEL EDITOR WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Elements & Section Tree (matching Image 2 & 3) */}
        <aside className="w-64 border-r border-border bg-[#080c17] flex flex-col shrink-0">
          <div className="flex border-b border-border text-[11px] font-mono font-medium">
            <button
              onClick={() => setLeftTab("tree")}
              className={`flex-1 py-2.5 text-center transition-colors ${
                leftTab === "tree" ? "border-b-2 border-brand-purple text-white bg-background-card/40" : "text-text-muted hover:text-white"
              }`}
            >
              Sections ({currentPage.sections.length})
            </button>
            <button
              onClick={() => setLeftTab("elements")}
              className={`flex-1 py-2.5 text-center transition-colors ${
                leftTab === "elements" ? "border-b-2 border-brand-purple text-white bg-background-card/40" : "text-text-muted hover:text-white"
              }`}
            >
              + Components
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-1.5 scrollbar-thin">
            {leftTab === "tree" ? (
              /* Section Tree (Image 3) */
              currentPage.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    sec.id === selectedSectionId
                      ? "border-brand-purple bg-brand-purple/20 text-white font-medium shadow-sm"
                      : "border-border/60 bg-background-secondary/60 text-text-secondary hover:text-white hover:bg-background-hover"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-background-card flex items-center justify-center font-mono text-[10px] text-brand-cyan">
                      {idx + 1}
                    </span>
                    <span className="truncate">{sec.componentType}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleSectionVisibility(sec.id, e)}
                      title={sec.isVisible ? "Hide section" : "Show section"}
                      className={`p-1 rounded hover:bg-background-card ${
                        sec.isVisible ? "text-brand-cyan" : "text-text-muted"
                      }`}
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
              /* Elements Component Library (Image 2) */
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-2">
                  Add to Page Canvas
                </span>
                {[
                  { type: "HERO", label: "Hero Banner", desc: "Top headline with call-to-action & search" },
                  { type: "FEATURES", label: "Feature Cards", desc: "Multi-column pathway cards with icons" },
                  { type: "STATS", label: "Statistics Bar", desc: "Network numbers and metric gauges" },
                  { type: "GUIDE_GRID", label: "Guide Grid", desc: "Dynamic list of published setup guides" },
                  { type: "NETWORK_GRID", label: "Network Grid", desc: "Hardware requirements cards" },
                  { type: "OPPORTUNITY_GRID", label: "Opportunities", desc: "Active testnet validator campaigns" },
                  { type: "FAQ", label: "FAQ Accordion", desc: "Question & answer expanders" },
                  { type: "CTA", label: "Call to Action", desc: "High-conversion onboarding banner" },
                  { type: "RICH_TEXT", label: "Rich Text", desc: "Custom formatted technical article block" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addComponent(item.type as any)}
                    className="w-full p-2.5 rounded-lg border border-border/70 bg-background-secondary/80 hover:border-brand-purple hover:bg-background-hover text-left transition-all group"
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

        {/* CENTER PANEL: Interactive Canvas (matching Image 2 center spotlight) */}
        <main className="flex-1 bg-[#04060b] p-6 overflow-y-auto flex justify-center items-start scrollbar-thin">
          <div
            className={`transition-all duration-300 bg-background border border-border/80 rounded-2xl overflow-hidden shadow-2xl ${
              viewport === "desktop"
                ? "w-full max-w-5xl"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            {/* Virtual Browser Top Nav Indicator */}
            <div className="h-8 border-b border-border/60 bg-background-card px-4 flex items-center justify-between text-[10px] font-mono text-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success/80" />
              </div>
              <span className="truncate">https://nodedrops.xyz/{currentPage.slug === "home" ? "" : currentPage.slug}</span>
              <span className="text-brand-cyan font-bold">CANVAS MODE</span>
            </div>

            {/* Sections Canvas */}
            <div className="p-4 sm:p-8 space-y-8 bg-radial-glow min-h-[600px]">
              {currentPage.sections.map((sec) => {
                if (!sec.isVisible) return null;
                const isSelected = sec.id === selectedSectionId;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`relative rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-brand-purple ring-offset-4 ring-offset-background shadow-glow-purple"
                        : "hover:ring-1 hover:ring-border/80"
                    }`}
                  >
                    {/* Element Selector Badge (matching Image 2 "H1 Heading 1 Title") */}
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
                          {sec.config.badge}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          {sec.config.heading} <br />
                          <span className="text-gradient">{sec.config.highlightText}</span>
                        </h1>
                        <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
                          {sec.config.description}
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <Button variant="primary" size="sm" className="text-xs">
                            {sec.config.primaryCtaLabel}
                          </Button>
                          <Button variant="secondary" size="sm" className="text-xs">
                            {sec.config.secondaryCtaLabel}
                          </Button>
                        </div>
                      </div>
                    )}

                    {sec.componentType === "FEATURES" && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h2 className="text-xl font-bold text-white">{sec.config.title}</h2>
                          {sec.config.subtitle && (
                            <p className="text-xs text-text-secondary mt-1">{sec.config.subtitle}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(sec.config.cards || []).map((card: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl border border-border bg-background-card">
                              <span className="text-[10px] font-mono text-brand-cyan">{card.badge}</span>
                              <h3 className="text-sm font-bold text-white mt-1">{card.title}</h3>
                              <p className="text-xs text-text-secondary mt-1">{card.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.componentType === "STATS" && (
                      <div className="p-6 rounded-xl border border-border bg-background-card/90 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {(sec.config.items || []).map((st: any, i: number) => (
                          <div key={i}>
                            <span className="text-2xl font-black text-white font-mono">{st.value}</span>
                            <span className="block text-[10px] text-text-muted font-mono uppercase mt-1">{st.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.componentType === "FAQ" && (
                      <div className="space-y-3">
                        <h2 className="text-lg font-bold text-white text-center">{sec.config.title}</h2>
                        <div className="space-y-2">
                          {(sec.config.items || []).map((faq: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-lg border border-border bg-background-card">
                              <span className="font-semibold text-white block">{faq.question}</span>
                              <p className="text-xs text-text-secondary mt-1">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.componentType === "CTA" && (
                      <div className="p-6 rounded-xl border border-brand-purple/40 bg-gradient-to-r from-background-card to-brand-purple/10 text-center space-y-3">
                        <h2 className="text-xl font-bold text-white">{sec.config.heading}</h2>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">{sec.config.description}</p>
                        <Button variant="primary" size="sm" className="text-xs">
                          {sec.config.buttonText}
                        </Button>
                      </div>
                    )}

                    {sec.componentType === "GUIDE_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Guide Grid Component]</strong>
                        <span>Renders {sec.config.itemLimit} featured setup guides from database</span>
                      </div>
                    )}

                    {sec.componentType === "NETWORK_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Blockchain Network Grid]</strong>
                        <span>Renders {sec.config.itemLimit} active network hardware profiles</span>
                      </div>
                    )}

                    {sec.componentType === "OPPORTUNITY_GRID" && (
                      <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-muted">
                        <strong className="text-white block text-xs">[Dynamic Opportunities Grid]</strong>
                        <span>Renders {sec.config.itemLimit} verified testnet validator campaigns</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Property Inspector (matching Image 2 & 3 right inspector) */}
        <aside className="w-80 border-l border-border bg-[#080c17] flex flex-col shrink-0 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase">Properties</span>
              <h3 className="font-bold text-white text-sm">{selectedSection.componentType}</h3>
            </div>
            <Badge variant="active" className="text-[10px]">Active Node</Badge>
          </div>

          {/* Form Properties based on selected component */}
          {selectedSection.componentType === "HERO" && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">Badge Headline</label>
                <Input
                  value={selectedSection.config.badge || ""}
                  onChange={(e) => updateSectionConfig("badge", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">Main Heading</label>
                <Input
                  value={selectedSection.config.heading || ""}
                  onChange={(e) => updateSectionConfig("heading", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">Gradient Highlight Text</label>
                <Input
                  value={selectedSection.config.highlightText || ""}
                  onChange={(e) => updateSectionConfig("highlightText", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">Description Text</label>
                <Textarea
                  rows={3}
                  value={selectedSection.config.description || ""}
                  onChange={(e) => updateSectionConfig("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-text-muted mb-1 font-mono text-[11px]">Primary Button</label>
                  <Input
                    value={selectedSection.config.primaryCtaLabel || ""}
                    onChange={(e) => updateSectionConfig("primaryCtaLabel", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-mono text-[11px]">Button Link</label>
                  <Input
                    value={selectedSection.config.primaryCtaHref || ""}
                    onChange={(e) => updateSectionConfig("primaryCtaHref", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedSection.componentType === "CTA" && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">CTA Heading</label>
                <Input
                  value={selectedSection.config.heading || ""}
                  onChange={(e) => updateSectionConfig("heading", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-mono text-[11px]">Description</label>
                <Textarea
                  rows={3}
                  value={selectedSection.config.description || ""}
                  onChange={(e) => updateSectionConfig("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-text-muted mb-1 font-mono text-[11px]">Button Text</label>
                  <Input
                    value={selectedSection.config.buttonText || ""}
                    onChange={(e) => updateSectionConfig("buttonText", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-mono text-[11px]">Button Link</label>
                  <Input
                    value={selectedSection.config.buttonHref || ""}
                    onChange={(e) => updateSectionConfig("buttonHref", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SPACING BOX MODEL (matching Image 2 Right Inspector Margin/Padding Diagram) */}
          <div className="space-y-2 pt-4 border-t border-border">
            <span className="text-[11px] font-mono text-text-muted uppercase">Box Model Spacing</span>
            <div className="p-4 rounded-xl border border-border bg-background-card/80 flex flex-col items-center justify-center font-mono text-[10px]">
              <span className="text-text-muted mb-1">Margin: 40px</span>
              <div className="w-full h-24 border border-brand-purple/40 bg-brand-purple/10 rounded-lg flex items-center justify-center relative">
                <span className="text-brand-purple-light font-bold">Padding: 24px</span>
                <div className="absolute inset-4 border border-dashed border-brand-cyan/40 bg-brand-cyan/5 rounded flex items-center justify-center">
                  <span className="text-brand-cyan font-bold">Content</span>
                </div>
              </div>
            </div>
          </div>

          {/* TYPOGRAPHY PRESETS (matching Image 2) */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[11px] font-mono text-text-muted uppercase">Typography Style</span>
            <select className="w-full h-8 rounded border border-border bg-background-secondary px-2 text-xs text-white focus:outline-none focus:border-brand-purple font-mono">
              <option>Plus Jakarta Sans (Inter)</option>
              <option>Roboto Mono</option>
              <option>System UI Standard</option>
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
}
