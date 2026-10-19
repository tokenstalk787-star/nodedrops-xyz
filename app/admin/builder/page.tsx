"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Palette,
  Eye,
  EyeOff,
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
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Copy,
  Sliders,
  HelpCircle,
  ShieldCheck,
  FolderPlus,
  X,
  FileText,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomPageItem, PageSectionItem } from "@/lib/services/mock-data";
import { PageRenderer } from "@/components/builder/page-renderer";

// Fallback preview data so the canvas displays rich, real-looking elements
const SAMPLE_NETWORKS = [
  { name: "Ethereum Sepolia", slug: "ethereum-sepolia", networkType: "TESTNET", nodeTypes: "Execution + Consensus" },
  { name: "Celestia Mocha", slug: "celestia", networkType: "TESTNET", nodeTypes: "Light Node, Bridge" },
  { name: "Monad Devnet", slug: "monad-devnet", networkType: "TESTNET", nodeTypes: "Validator" },
  { name: "Solana Mainnet", slug: "solana", networkType: "MAINNET", nodeTypes: "RPC, Validator" },
];

const SAMPLE_GUIDES = [
  { title: "Celestia Light Node Setup", slug: "celestia-light-node-mocha-testnet", difficulty: "BEGINNER", excerpt: "Run a lightweight Data Availability Sampling node on low-cost VPS." },
  { title: "Ethereum Sepolia Full Node", slug: "ethereum-sepolia", difficulty: "INTERMEDIATE", excerpt: "Geth and Prysm paired client deployment with systemd automation." },
  { title: "Berachain Bartio Validator", slug: "berachain-bartio", difficulty: "ADVANCED", excerpt: "High-throughput validator setup with hardened UFW rules." },
];

const SAMPLE_OPPS = [
  { id: "o-1", projectName: "Story Protocol Odyssey", campaignType: "Incentivized Testnet", rewardStatus: "CONFIRMED" },
  { id: "o-2", projectName: "Babylon Bitcoin Staking", campaignType: "Finality Provider", rewardStatus: "POTENTIAL" },
  { id: "o-3", projectName: "Berachain Bartio", campaignType: "Validator Node", rewardStatus: "CONFIRMED" },
];

export default function VisualPageBuilderPage() {
  return (
    <React.Suspense fallback={<BuilderLoadingSkeleton />}>
      <VisualPageBuilderContent />
    </React.Suspense>
  );
}

function BuilderLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-text-muted">Loading Visual Page Builder...</span>
      </div>
    </div>
  );
}

function VisualPageBuilderContent() {
  const searchParams = useSearchParams();
  const requestedPageId = searchParams.get("page") || searchParams.get("pageId");

  const [pages, setPages] = React.useState<CustomPageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPageId, setSelectedPageId] = React.useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>("");
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");
  const [mobilePanel, setMobilePanel] = React.useState<"outline" | "canvas" | "inspector">("canvas");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [insertTargetIndex, setInsertTargetIndex] = React.useState<number | null>(null);
  const [showNewPageModal, setShowNewPageModal] = React.useState(false);
  const [newPageTitle, setNewPageTitle] = React.useState("");
  const [newPageSlug, setNewPageSlug] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load pages from API
  const loadPages = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (Array.isArray(data.pages) && data.pages.length > 0) {
        setPages(data.pages);

        // Target page resolution
        let target = data.pages[0];
        if (requestedPageId) {
          const match = data.pages.find((p: any) => p.id === requestedPageId || p.slug === requestedPageId);
          if (match) target = match;
        } else if (!selectedPageId) {
          const homePage = data.pages.find((p: any) => p.slug === "home" || p.pageType === "HOME");
          if (homePage) target = homePage;
        } else {
          const current = data.pages.find((p: any) => p.id === selectedPageId);
          if (current) target = current;
        }

        setSelectedPageId(target.id);
        if (target.sections && target.sections.length > 0) {
          setSelectedSectionId((prev) => (target.sections.some((s: any) => s.id === prev) ? prev : target.sections[0].id));
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to load pages." });
    } finally {
      setLoading(false);
    }
  }, [requestedPageId, selectedPageId]);

  React.useEffect(() => {
    loadPages();
  }, [loadPages]);

  const currentPage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const selectedSection = currentPage?.sections.find((s) => s.id === selectedSectionId) || currentPage?.sections[0];

  // Section manipulation helpers
  const updateSectionConfig = (key: string, value: any) => {
    if (!selectedSectionId) return;
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

  const toggleSectionVisibility = (secId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const moveSection = (index: number, direction: "up" | "down", e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const duplicateSection = (secId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = currentPage.sections.find((s) => s.id === secId);
    if (!target) return;

    const newId = `sec-${Date.now()}`;
    const clone: PageSectionItem = {
      ...target,
      id: newId,
      config: JSON.parse(JSON.stringify(target.config || {})),
      orderIndex: target.orderIndex + 1,
    };

    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        const idx = page.sections.findIndex((s) => s.id === secId);
        const newSecs = [...page.sections];
        newSecs.splice(idx + 1, 0, clone);
        return {
          ...page,
          sections: newSecs.map((s, i) => ({ ...s, orderIndex: i })),
        };
      })
    );
    setSelectedSectionId(newId);
  };

  const removeSection = (secId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPage.sections.length <= 1) {
      alert("A page must have at least one section.");
      return;
    }
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        const remaining = page.sections.filter((s) => s.id !== secId);
        return {
          ...page,
          sections: remaining.map((s, idx) => ({ ...s, orderIndex: idx })),
        };
      })
    );

    if (selectedSectionId === secId) {
      const nextSec = currentPage.sections.find((s) => s.id !== secId);
      if (nextSec) setSelectedSectionId(nextSec.id);
    }
  };

  const handleOpenAddModal = (targetIndex: number | null = null) => {
    setInsertTargetIndex(targetIndex);
    setShowAddModal(true);
  };

  const addComponent = (type: PageSectionItem["componentType"]) => {
    const newId = `sec-${Date.now()}`;
    const defaultConfigs: Record<string, any> = {
      HERO: {
        badge: "PRODUCTION-GRADE WEB3 INFRASTRUCTURE",
        heading: "Run Nodes. Learn Web3.",
        highlightText: "Explore Opportunities.",
        description: "Technical, verified node documentation, interactive hardware validation, and command builders.",
        primaryCtaLabel: "Browse Node Guides",
        primaryCtaHref: "/guides",
        secondaryCtaLabel: "Check Hardware",
        secondaryCtaHref: "/tools/hardware-checker",
        showSearch: true,
      },
      NODE_DASHBOARD: {
        title: "Verified Node & Testnet Opportunities",
        subtitle: "Track incentivized validator testnets, token airdrop stages, and verified deployment runbooks.",
      },
      SECURITY_BANNER: {
        title: "NodeDrops.xyz Operator Security Protocol",
        badge: "ZERO-WALLET GUARANTEE",
        warningText: "NodeDrops.xyz will never request your wallet connection merely to view opportunities, benchmark hardware, or read runbooks.",
        linkLabel: "Read complete Security & Slashing Prevention Protocol",
        linkHref: "/security",
      },
      STATS: {
        title: "Platform Key Metrics",
        items: [
          { label: "Active Nodes", value: "1,248+" },
          { label: "Verified Runbooks", value: "28" },
          { label: "Network Uptime", value: "99.98%" },
          { label: "Hardware Verified", value: "100%" },
        ],
      },
      FEATURES: {
        title: "Infrastructure Pathways",
        subtitle: "Built for validators, infrastructure engineers, and developers",
        cards: [
          { title: "Beginner Operator Path", description: "Learn Linux server leasing, SSH key pairs, and firewall isolation.", badge: "Beginner", href: "/learn" },
          { title: "Validator & DevOps Path", description: "Production architecture, consensus pairing, and systemd automation.", badge: "Advanced", href: "/guides" },
          { title: "Hardware Checker", description: "Benchmark RAM, CPU cores, NVMe SSD, and bandwidth requirements.", badge: "Tools", href: "/tools/hardware-checker" },
        ],
      },
      GUIDE_GRID: {
        title: "Featured Node Setup Guides",
        itemLimit: 3,
        viewAllLink: "/guides",
      },
      NETWORK_GRID: {
        title: "Supported Blockchain Networks",
        itemLimit: 4,
        viewAllLink: "/networks",
      },
      OPPORTUNITY_GRID: {
        title: "Active Validator Opportunities",
        itemLimit: 3,
        viewAllLink: "/opportunities",
      },
      FAQ: {
        title: "Frequently Asked Questions",
        subtitle: "Common questions regarding node hosting costs, testnets, and security standards.",
        items: [
          { question: "Do I need to connect my Web3 wallet to read guides?", answer: "No. NodeDrops is an educational platform and strictly enforces a zero-wallet policy." },
          { question: "What are the hardware prerequisites?", answer: "Check each network spec or use our free interactive Hardware Checker tool." },
        ],
      },
      CTA: {
        heading: "Ready to Secure Decentralized Networks?",
        description: "Join hundreds of operators running verified nodes with our step-by-step guides.",
        buttonText: "Launch Checklist",
        buttonHref: "/tools/checklist",
      },
      RICH_TEXT: {
        title: "Platform Overview",
        contentMarkdown: "Detailed documentation and technical architecture overview.",
      },
      DIVIDER: {},
    };

    const newSection: PageSectionItem = {
      id: newId,
      componentType: type,
      orderIndex: currentPage?.sections.length || 0,
      isVisible: true,
      config: defaultConfigs[type] || { heading: "New Section" },
    };

    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== selectedPageId) return page;
        const newSecs = [...page.sections];
        if (insertTargetIndex !== null && insertTargetIndex >= 0 && insertTargetIndex <= newSecs.length) {
          newSecs.splice(insertTargetIndex, 0, newSection);
        } else {
          newSecs.push(newSection);
        }
        return {
          ...page,
          sections: newSecs.map((s, idx) => ({ ...s, orderIndex: idx })),
        };
      })
    );

    setSelectedSectionId(newId);
    setShowAddModal(false);
    setInsertTargetIndex(null);
  };

  // Preset Layout Templates
  const applyTemplate = (templateName: "home" | "full" | "docs") => {
    if (!confirm(`Apply the "${templateName}" layout template? This will replace the current sections on this page.`)) {
      return;
    }

    let templateSections: PageSectionItem[] = [];
    if (templateName === "home") {
      templateSections = [
        {
          id: `sec-dashboard-${Date.now()}`,
          componentType: "NODE_DASHBOARD",
          orderIndex: 0,
          isVisible: true,
          config: {
            title: "Verified Node & Testnet Opportunities",
            subtitle: "Track incentivized validator testnets, token airdrop stages, and verified deployment runbooks.",
          },
        },
        {
          id: `sec-faq-${Date.now()}`,
          componentType: "FAQ",
          orderIndex: 1,
          isVisible: true,
          config: {
            title: "Frequently Asked Questions",
            subtitle: "Common questions regarding node hosting costs, testnets, and security standards.",
            items: [],
          },
        },
        {
          id: `sec-sec-${Date.now()}`,
          componentType: "SECURITY_BANNER",
          orderIndex: 2,
          isVisible: true,
          config: {
            title: "NodeDrops.xyz Operator Security Protocol",
            badge: "ZERO-WALLET GUARANTEE",
            warningText: "NodeDrops.xyz will never request your wallet connection merely to view opportunities, benchmark hardware, or read runbooks.",
            linkLabel: "Read complete Security & Slashing Prevention Protocol",
            linkHref: "/security",
          },
        },
      ];
    } else if (templateName === "full") {
      templateSections = [
        {
          id: `sec-hero-${Date.now()}`,
          componentType: "HERO",
          orderIndex: 0,
          isVisible: true,
          config: {
            badge: "PRODUCTION-READY WEB3 INFRASTRUCTURE",
            heading: "Run Nodes. Learn Web3.",
            highlightText: "Explore Opportunities.",
            description: "Technical, verified node documentation, interactive hardware validation, and command builders.",
            primaryCtaLabel: "Browse Guides",
            primaryCtaHref: "/guides",
            secondaryCtaLabel: "Check Hardware",
            secondaryCtaHref: "/tools/hardware-checker",
            showSearch: true,
          },
        },
        {
          id: `sec-stats-${Date.now()}`,
          componentType: "STATS",
          orderIndex: 1,
          isVisible: true,
          config: {
            title: "Platform Stats",
            items: [
              { label: "Active Nodes", value: "1,248+" },
              { label: "Verified Runbooks", value: "28" },
              { label: "Network Uptime", value: "99.98%" },
              { label: "Hardware Verified", value: "100%" },
            ],
          },
        },
        {
          id: `sec-dash-${Date.now()}`,
          componentType: "NODE_DASHBOARD",
          orderIndex: 2,
          isVisible: true,
          config: { title: "Explore Airdrop & Node Opportunities" },
        },
        {
          id: `sec-guides-${Date.now()}`,
          componentType: "GUIDE_GRID",
          orderIndex: 3,
          isVisible: true,
          config: { title: "Featured Setup Runbooks", itemLimit: 3 },
        },
        {
          id: `sec-faq-${Date.now()}`,
          componentType: "FAQ",
          orderIndex: 4,
          isVisible: true,
          config: { title: "Node Operator FAQ", items: [] },
        },
      ];
    } else {
      templateSections = [
        {
          id: `sec-hero-${Date.now()}`,
          componentType: "HERO",
          orderIndex: 0,
          isVisible: true,
          config: {
            badge: "TECHNICAL RUNBOOKS",
            heading: "Validator Architecture Docs",
            highlightText: "Field-Tested Guides",
            description: "Zero-wallet technical guides for Ethereum, Celestia, Berachain, and Cosmos ecosystems.",
          },
        },
        {
          id: `sec-rich-${Date.now()}`,
          componentType: "RICH_TEXT",
          orderIndex: 1,
          isVisible: true,
          config: {
            title: "Prerequisites & Security Hardening",
            contentMarkdown: "1. Dedicated Ubuntu 22.04 LTS instance.\n2. Non-root user with sudo permissions.\n3. Ed25519 SSH keys with password authentication disabled.",
          },
        },
        {
          id: `sec-guides-${Date.now()}`,
          componentType: "GUIDE_GRID",
          orderIndex: 2,
          isVisible: true,
          config: { title: "All Available Guides", itemLimit: 6 },
        },
      ];
    }

    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === selectedPageId ? { ...page, sections: templateSections } : page
      )
    );
    if (templateSections.length > 0) {
      setSelectedSectionId(templateSections[0].id);
    }
    setFeedback({ type: "success", text: `Applied "${templateName}" layout template.` });
    setTimeout(() => setFeedback(null), 3000);
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

  // Real Publish Live
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

      // Update local state to PUBLISHED
      setPages((prev) =>
        prev.map((p) => (p.id === currentPage.id ? { ...p, status: "PUBLISHED" } : p))
      );

      const liveTarget = currentPage.slug === "home" ? "/" : `/p/${currentPage.slug}`;
      setFeedback({
        type: "success",
        text: `Page "${currentPage.title}" published live! Accessible at ${liveTarget}.`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to publish." });
    } finally {
      setSaving(false);
    }
  };

  // Create New Page
  const handleCreateNewPage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      alert("Please provide both title and slug.");
      return;
    }
    const cleanSlug = newPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");

    const newPageObj: CustomPageItem = {
      id: `page-${Date.now()}`,
      title: newPageTitle.trim(),
      slug: cleanSlug,
      pageType: "CUSTOM",
      status: "DRAFT",
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          componentType: "HERO",
          orderIndex: 0,
          isVisible: true,
          config: {
            heading: newPageTitle.trim(),
            description: "Custom page description and introduction.",
          },
        },
      ],
      noIndex: false,
      noFollow: false,
      noSnippet: false,
      noArchive: false,
      updatedAt: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPageObj),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create page");

      setPages((prev) => [...prev, newPageObj]);
      setSelectedPageId(newPageObj.id);
      setSelectedSectionId(newPageObj.sections[0].id);
      setShowNewPageModal(false);
      setNewPageTitle("");
      setNewPageSlug("");
      setFeedback({ type: "success", text: `Created page "${newPageObj.title}".` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to create page.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && pages.length === 0) {
    return <BuilderLoadingSkeleton />;
  }

  if (!currentPage) {
    return <div className="p-8 text-center text-text-muted">No pages found in database.</div>;
  }

  const liveUrl = currentPage.slug === "home" ? "/" : `/p/${currentPage.slug}`;

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] -m-4 sm:-m-8 bg-[#04060b] text-text-primary overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP BUILDER TOOLBAR                                                   */}
      {/* ========================================================================= */}
      <header className="h-14 border-b border-dark-card-border bg-[#080b14] px-2.5 sm:px-4 flex items-center justify-between shrink-0 text-xs z-30 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/admin/pages"
            className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors font-mono"
          >
            <span>&larr; Pages</span>
          </Link>
          <div className="h-4 w-px bg-dark-card-border hidden sm:block" />

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
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
              className="h-8 rounded-lg border border-dark-card-border bg-[#0d1222] px-2 sm:px-3 font-mono text-white text-xs font-semibold focus:outline-none focus:border-brand-purple max-w-[130px] sm:max-w-[200px] truncate"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.slug === "home" ? "/" : `/${p.slug}`}) — {p.status}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewPageModal(true)}
              className="h-8 px-2.5 text-[11px] font-mono border-dark-card-border hover:bg-white/5"
              title="Create New Page"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New</span>
            </Button>
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

        {/* Center: Mode & Viewport Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0d1222] p-0.5 rounded-lg border border-dark-card-border text-[11px] font-mono">
            <button
              onClick={() => setMode("edit")}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === "edit" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === "preview" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
              }`}
            >
              Clean Preview
            </button>
          </div>

          {/* Viewport Width Controls */}
          <div className="flex items-center gap-1 bg-[#0d1222] p-1 rounded-lg border border-dark-card-border">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded transition-colors ${
                viewport === "desktop" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
              }`}
              title="Desktop 100%"
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
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 font-mono">
          {/* Templates Menu */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 border-dark-card-border text-text-muted hover:text-white hidden md:inline-flex"
            >
              <Layout className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Templates</span>
            </Button>
            <div className="absolute right-0 top-full mt-1 w-56 bg-[#0c1224] border border-dark-card-border rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
              <span className="text-[10px] text-text-muted uppercase px-2 py-1 block">Apply Layout</span>
              <button
                onClick={() => applyTemplate("home")}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-brand-purple/20 transition-colors"
              >
                🎯 NodeDrops Default
              </button>
              <button
                onClick={() => applyTemplate("full")}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-brand-purple/20 transition-colors"
              >
                🚀 Full Marketing Landing
              </button>
              <button
                onClick={() => applyTemplate("docs")}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-brand-purple/20 transition-colors"
              >
                📚 Technical Documentation
              </button>
            </div>
          </div>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#0d1222] text-text-muted hover:text-white text-xs transition-colors"
            title="Open Live Public URL"
          >
            <span>Live URL</span>
            <ExternalLink className="w-3 h-3 text-brand-cyan" />
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
            className="text-xs gap-1 font-bold shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Publish Live</span>
          </Button>
        </div>
      </header>

      {/* FEEDBACK TOAST BANNER */}
      {feedback && (
        <div
          className={`py-2 px-4 text-xs font-mono text-center flex items-center justify-center gap-2 border-b z-20 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* MOBILE RESPONSIVE PANEL SELECTOR (< lg screens) */}
      <div className="lg:hidden flex items-center justify-between border-b border-dark-card-border bg-[#070b16] px-2 py-1.5 text-xs font-mono shrink-0">
        <button
          onClick={() => setMobilePanel("outline")}
          className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobilePanel === "outline" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Outline ({currentPage.sections.length})</span>
        </button>
        <button
          onClick={() => setMobilePanel("canvas")}
          className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobilePanel === "canvas" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setMobilePanel("inspector")}
          className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobilePanel === "inspector" ? "bg-brand-purple text-white font-bold" : "text-text-muted hover:text-white"
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-brand-purple-light" />
          <span>Properties</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE (LEFT TREE, CENTER CANVAS, RIGHT INSPECTOR)             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Section Hierarchy / Outline */}
        <aside
          className={`${
            mobilePanel === "outline" ? "flex" : "hidden"
          } lg:flex w-full lg:w-64 border-r border-dark-card-border bg-[#080c17] flex-col shrink-0 text-xs overflow-y-auto`}
        >
          <div className="p-3 border-b border-dark-card-border bg-[#060810] flex items-center justify-between">
            <div className="font-mono text-[11px] text-text-muted uppercase tracking-wider font-semibold">
              Sections Outline ({currentPage.sections.length})
            </div>
            <button
              onClick={() => handleOpenAddModal(currentPage.sections.length)}
              className="p-1 rounded-md bg-brand-purple/20 text-brand-purple-light hover:bg-brand-purple hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono px-2"
              title="Add Section"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 font-mono">
            {currentPage.sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                  sec.id === selectedSectionId
                    ? "border-brand-purple bg-brand-purple/20 text-white font-medium shadow-sm"
                    : "border-dark-card-border bg-[#0d1222] text-text-secondary hover:text-white hover:border-slate-600"
                } ${!sec.isVisible ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="w-4 h-4 rounded bg-[#060810] flex items-center justify-center font-mono text-[9px] text-brand-cyan shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate text-[11px]">{getShortSectionName(sec.componentType)}</span>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={(e) => toggleSectionVisibility(sec.id, e)}
                    title={sec.isVisible ? "Hide on website" : "Show on website"}
                    className={`p-1 rounded hover:bg-white/10 ${sec.isVisible ? "text-brand-cyan" : "text-text-muted"}`}
                  >
                    {sec.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={(e) => moveSection(idx, "up", e)}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1 rounded text-text-muted hover:text-white disabled:opacity-30"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => moveSection(idx, "down", e)}
                    disabled={idx === currentPage.sections.length - 1}
                    title="Move Down"
                    className="p-1 rounded text-text-muted hover:text-white disabled:opacity-30"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSectionId(sec.id);
                      setMobilePanel("inspector");
                    }}
                    title="Edit Properties"
                    className="p-1 rounded text-text-muted hover:text-brand-purple-light lg:hidden"
                  >
                    <Settings className="w-3 h-3 text-brand-purple-light" />
                  </button>
                  <button
                    onClick={(e) => removeSection(sec.id, e)}
                    title="Delete"
                    className="p-1 rounded text-text-muted hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-dark-card-border bg-[#060810] space-y-1">
            <button
              onClick={() => handleOpenAddModal(currentPage.sections.length)}
              className="w-full py-2 rounded-lg border border-dashed border-dark-card-border hover:border-brand-purple text-text-muted hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-brand-cyan" />
              <span>+ Add Component</span>
            </button>
          </div>
        </aside>

        {/* CENTER CANVAS: WYSIWYG Real-Time Interactive Canvas */}
        <main
          className={`${
            mobilePanel === "canvas" ? "flex" : "hidden"
          } lg:flex flex-1 bg-[#020408] p-2 sm:p-6 overflow-y-auto justify-center items-start w-full min-w-0`}
        >
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
              <span className="text-brand-cyan font-bold">{mode === "edit" ? "CANVAS EDITOR" : "LIVE PREVIEW"}</span>
            </div>

            {/* Dynamic WYSIWYG PageRenderer */}
            <div className="p-4 sm:p-8 min-h-[600px]">
              <PageRenderer
                sections={currentPage.sections}
                networks={SAMPLE_NETWORKS}
                guides={SAMPLE_GUIDES}
                opportunities={SAMPLE_OPPS}
                isEditable={mode === "edit"}
                selectedSectionId={selectedSectionId}
                onSelectSection={(id) => setSelectedSectionId(id)}
                onMoveSection={moveSection}
                onDuplicateSection={duplicateSection}
                onDeleteSection={removeSection}
                onToggleVisibility={toggleSectionVisibility}
                onInsertSection={(idx) => handleOpenAddModal(idx)}
              />
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Comprehensive Property Inspector */}
        <aside
          className={`${
            mobilePanel === "inspector" ? "flex" : "hidden"
          } lg:flex w-full lg:w-80 border-l border-dark-card-border bg-[#080c17] flex-col shrink-0 overflow-y-auto p-4 space-y-5 text-xs font-mono`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
            <div>
              <span className="text-[10px] text-text-muted uppercase">Properties</span>
              <h3 className="font-bold text-white text-sm font-sans">
                {selectedSection ? getShortSectionName(selectedSection.componentType) : "Section"}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light text-[10px] font-bold">
              CONFIG
            </span>
          </div>

          {selectedSection ? (
            <div className="space-y-4 font-sans text-xs">
              {/* HERO SECTION CONFIG */}
              {selectedSection.componentType === "HERO" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Badge Text</label>
                    <Input
                      value={selectedSection.config.badge || ""}
                      onChange={(e) => updateSectionConfig("badge", e.target.value)}
                      className="h-8 text-xs"
                      placeholder="e.g. PRODUCTION-READY WEB3"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Main Heading</label>
                    <Input
                      value={selectedSection.config.heading || ""}
                      onChange={(e) => updateSectionConfig("heading", e.target.value)}
                      className="h-8 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Highlight Gradient Text</label>
                    <Input
                      value={selectedSection.config.highlightText || ""}
                      onChange={(e) => updateSectionConfig("highlightText", e.target.value)}
                      className="h-8 text-xs text-brand-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Description Text</label>
                    <Textarea
                      rows={3}
                      value={selectedSection.config.description || ""}
                      onChange={(e) => updateSectionConfig("description", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Primary CTA Label</label>
                      <Input
                        value={selectedSection.config.primaryCtaLabel || ""}
                        onChange={(e) => updateSectionConfig("primaryCtaLabel", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Primary CTA Link</label>
                      <Input
                        value={selectedSection.config.primaryCtaHref || ""}
                        onChange={(e) => updateSectionConfig("primaryCtaHref", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Secondary CTA Label</label>
                      <Input
                        value={selectedSection.config.secondaryCtaLabel || ""}
                        onChange={(e) => updateSectionConfig("secondaryCtaLabel", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Secondary CTA Link</label>
                      <Input
                        value={selectedSection.config.secondaryCtaHref || ""}
                        onChange={(e) => updateSectionConfig("secondaryCtaHref", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-text-secondary">
                      <input
                        type="checkbox"
                        checked={selectedSection.config.showSearch ?? true}
                        onChange={(e) => updateSectionConfig("showSearch", e.target.checked)}
                        className="rounded border-dark-card-border"
                      />
                      <span>Show Search Bar in Hero</span>
                    </label>
                  </div>
                </>
              )}

              {/* NODE DASHBOARD CONFIG */}
              {selectedSection.componentType === "NODE_DASHBOARD" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Dashboard Header Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                      placeholder="e.g. Verified Node & Testnet Opportunities"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Subtitle</label>
                    <Input
                      value={selectedSection.config.subtitle || ""}
                      onChange={(e) => updateSectionConfig("subtitle", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed font-sans pt-2">
                    This component automatically embeds the live CryptoRank-style interactive airdrop & testnet table with search, categories, and verified stages directly from the database.
                  </p>
                </>
              )}

              {/* SECURITY BANNER CONFIG */}
              {selectedSection.componentType === "SECURITY_BANNER" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Protocol Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Badge Text</label>
                    <Input
                      value={selectedSection.config.badge || ""}
                      onChange={(e) => updateSectionConfig("badge", e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Warning Guarantee Text</label>
                    <Textarea
                      rows={3}
                      value={selectedSection.config.warningText || ""}
                      onChange={(e) => updateSectionConfig("warningText", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Link Label</label>
                    <Input
                      value={selectedSection.config.linkLabel || ""}
                      onChange={(e) => updateSectionConfig("linkLabel", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Link Target Href</label>
                    <Input
                      value={selectedSection.config.linkHref || ""}
                      onChange={(e) => updateSectionConfig("linkHref", e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* FEATURES SECTION CONFIG */}
              {selectedSection.componentType === "FEATURES" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Subtitle</label>
                    <Input
                      value={selectedSection.config.subtitle || ""}
                      onChange={(e) => updateSectionConfig("subtitle", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-text-muted uppercase">Feature Cards</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentCards = selectedSection.config.cards || [];
                          updateSectionConfig("cards", [
                            ...currentCards,
                            { title: "New Feature", description: "Feature description details.", badge: "New", href: "/guides" },
                          ]);
                        }}
                        className="text-[10px] font-mono text-brand-cyan hover:underline"
                      >
                        + Add Card
                      </button>
                    </div>

                    {(selectedSection.config.cards || []).map((card: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-dark-card-border bg-[#0d1222] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-brand-purple">Card #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newCards = [...(selectedSection.config.cards || [])];
                              newCards.splice(idx, 1);
                              updateSectionConfig("cards", newCards);
                            }}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <Input
                          value={card.title || ""}
                          placeholder="Card Title"
                          onChange={(e) => {
                            const newCards = [...(selectedSection.config.cards || [])];
                            newCards[idx] = { ...newCards[idx], title: e.target.value };
                            updateSectionConfig("cards", newCards);
                          }}
                          className="h-7 text-xs"
                        />
                        <Textarea
                          rows={2}
                          value={card.description || ""}
                          placeholder="Card Description"
                          onChange={(e) => {
                            const newCards = [...(selectedSection.config.cards || [])];
                            newCards[idx] = { ...newCards[idx], description: e.target.value };
                            updateSectionConfig("cards", newCards);
                          }}
                          className="text-xs"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <Input
                            value={card.badge || ""}
                            placeholder="Badge"
                            onChange={(e) => {
                              const newCards = [...(selectedSection.config.cards || [])];
                              newCards[idx] = { ...newCards[idx], badge: e.target.value };
                              updateSectionConfig("cards", newCards);
                            }}
                            className="h-7 text-xs font-mono"
                          />
                          <Input
                            value={card.href || ""}
                            placeholder="Link Href"
                            onChange={(e) => {
                              const newCards = [...(selectedSection.config.cards || [])];
                              newCards[idx] = { ...newCards[idx], href: e.target.value };
                              updateSectionConfig("cards", newCards);
                            }}
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STATS SECTION CONFIG */}
              {selectedSection.componentType === "STATS" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-text-muted uppercase">Stat Counters</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = selectedSection.config.items || [];
                          updateSectionConfig("items", [...currentItems, { label: "New Metric", value: "100+" }]);
                        }}
                        className="text-[10px] font-mono text-brand-cyan hover:underline"
                      >
                        + Add Stat
                      </button>
                    </div>

                    {(selectedSection.config.items || []).map((stat: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg border border-dark-card-border bg-[#0d1222] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-brand-purple">Metric #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(selectedSection.config.items || [])];
                              newItems.splice(idx, 1);
                              updateSectionConfig("items", newItems);
                            }}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <Input
                            value={stat.value || ""}
                            placeholder="Value e.g. 1,248"
                            onChange={(e) => {
                              const newItems = [...(selectedSection.config.items || [])];
                              newItems[idx] = { ...newItems[idx], value: e.target.value };
                              updateSectionConfig("items", newItems);
                            }}
                            className="h-7 text-xs font-bold"
                          />
                          <Input
                            value={stat.label || ""}
                            placeholder="Label e.g. Active Nodes"
                            onChange={(e) => {
                              const newItems = [...(selectedSection.config.items || [])];
                              newItems[idx] = { ...newItems[idx], label: e.target.value };
                              updateSectionConfig("items", newItems);
                            }}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* GUIDE_GRID CONFIG */}
              {selectedSection.componentType === "GUIDE_GRID" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Heading</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Guides Count to Show</label>
                    <select
                      value={selectedSection.config.itemLimit || 3}
                      onChange={(e) => updateSectionConfig("itemLimit", Number(e.target.value))}
                      className="w-full h-8 rounded-lg border border-dark-card-border bg-[#0d1222] px-2 font-mono text-xs text-white"
                    >
                      <option value={3}>3 Guides</option>
                      <option value={6}>6 Guides</option>
                      <option value={9}>9 Guides</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">"View All" Link</label>
                    <Input
                      value={selectedSection.config.viewAllLink || "/guides"}
                      onChange={(e) => updateSectionConfig("viewAllLink", e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* NETWORK_GRID CONFIG */}
              {selectedSection.componentType === "NETWORK_GRID" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Heading</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Networks Count to Show</label>
                    <select
                      value={selectedSection.config.itemLimit || 4}
                      onChange={(e) => updateSectionConfig("itemLimit", Number(e.target.value))}
                      className="w-full h-8 rounded-lg border border-dark-card-border bg-[#0d1222] px-2 font-mono text-xs text-white"
                    >
                      <option value={4}>4 Networks</option>
                      <option value={8}>8 Networks</option>
                      <option value={12}>12 Networks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">"View All" Link</label>
                    <Input
                      value={selectedSection.config.viewAllLink || "/networks"}
                      onChange={(e) => updateSectionConfig("viewAllLink", e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* OPPORTUNITY_GRID CONFIG */}
              {selectedSection.componentType === "OPPORTUNITY_GRID" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Heading</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Opportunities Count</label>
                    <select
                      value={selectedSection.config.itemLimit || 3}
                      onChange={(e) => updateSectionConfig("itemLimit", Number(e.target.value))}
                      className="w-full h-8 rounded-lg border border-dark-card-border bg-[#0d1222] px-2 font-mono text-xs text-white"
                    >
                      <option value={3}>3 Campaigns</option>
                      <option value={6}>6 Campaigns</option>
                      <option value={9}>9 Campaigns</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">"View All" Link</label>
                    <Input
                      value={selectedSection.config.viewAllLink || "/opportunities"}
                      onChange={(e) => updateSectionConfig("viewAllLink", e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* FAQ SECTION CONFIG */}
              {selectedSection.componentType === "FAQ" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Subtitle</label>
                    <Input
                      value={selectedSection.config.subtitle || ""}
                      onChange={(e) => updateSectionConfig("subtitle", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-text-muted uppercase">Custom Q&A List</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = selectedSection.config.items || [];
                          updateSectionConfig("items", [
                            ...currentItems,
                            { question: "New Question?", answer: "Helpful answer explanation here." },
                          ]);
                        }}
                        className="text-[10px] font-mono text-brand-cyan hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>

                    {(selectedSection.config.items || []).map((faq: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-dark-card-border bg-[#0d1222] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-brand-purple">Q#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(selectedSection.config.items || [])];
                              newItems.splice(idx, 1);
                              updateSectionConfig("items", newItems);
                            }}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <Input
                          value={faq.question || ""}
                          placeholder="Question"
                          onChange={(e) => {
                            const newItems = [...(selectedSection.config.items || [])];
                            newItems[idx] = { ...newItems[idx], question: e.target.value };
                            updateSectionConfig("items", newItems);
                          }}
                          className="h-7 text-xs font-semibold"
                        />
                        <Textarea
                          rows={2}
                          value={faq.answer || ""}
                          placeholder="Answer"
                          onChange={(e) => {
                            const newItems = [...(selectedSection.config.items || [])];
                            newItems[idx] = { ...newItems[idx], answer: e.target.value };
                            updateSectionConfig("items", newItems);
                          }}
                          className="text-xs"
                        />
                      </div>
                    ))}
                    {(!selectedSection.config.items || selectedSection.config.items.length === 0) && (
                      <p className="text-[11px] text-text-muted italic">
                        No custom items specified — default high-quality operator FAQ answers will be rendered on the website.
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* CTA BANNER CONFIG */}
              {selectedSection.componentType === "CTA" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Heading</label>
                    <Input
                      value={selectedSection.config.heading || ""}
                      onChange={(e) => updateSectionConfig("heading", e.target.value)}
                      className="h-8 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Description</label>
                    <Textarea
                      rows={3}
                      value={selectedSection.config.description || ""}
                      onChange={(e) => updateSectionConfig("description", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Button Label</label>
                      <Input
                        value={selectedSection.config.buttonText || ""}
                        onChange={(e) => updateSectionConfig("buttonText", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1 font-mono text-[10px]">Button Link</label>
                      <Input
                        value={selectedSection.config.buttonHref || ""}
                        onChange={(e) => updateSectionConfig("buttonHref", e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* RICH TEXT CONFIG */}
              {selectedSection.componentType === "RICH_TEXT" && (
                <>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Section Title</label>
                    <Input
                      value={selectedSection.config.title || ""}
                      onChange={(e) => updateSectionConfig("title", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 font-mono text-[11px]">Content (Markdown/Text)</label>
                    <Textarea
                      rows={8}
                      value={selectedSection.config.contentMarkdown || ""}
                      onChange={(e) => updateSectionConfig("contentMarkdown", e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* DIVIDER CONFIG */}
              {selectedSection.componentType === "DIVIDER" && (
                <div className="p-3 rounded-lg border border-dark-card-border bg-[#0d1222] text-center text-text-muted text-xs">
                  Decorative horizontal gradient line spacer.
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted text-xs">Select a section in canvas or outline to edit its properties.</p>
          )}

          {/* Quick Page Info */}
          <div className="pt-4 border-t border-dark-card-border space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-text-muted">
              <span>Slug:</span>
              <span className="text-white font-bold font-mono">{liveUrl}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Status:</span>
              <span className="text-brand-cyan font-bold">{currentPage.status}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Total Sections:</span>
              <span className="text-white font-mono">{currentPage.sections.length}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD COMPONENT MODAL                                                    */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1020] border border-dark-card-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
              <div>
                <h3 className="text-lg font-bold text-white">Add Website Section</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Select a predefined, tested component to insert into your page layout.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {[
                { type: "HERO", label: "Hero Headline Banner", desc: "Top headline with gradient highlight, search bar, and primary/secondary CTA buttons" },
                { type: "NODE_DASHBOARD", label: "Node & Airdrop Dashboard", desc: "CryptoRank-style live interactive opportunities table with stage filters" },
                { type: "SECURITY_BANNER", label: "Security & Guarantee Protocol", desc: "Zero-Wallet guarantee and operational security checklist" },
                { type: "FEATURES", label: "Infrastructure Feature Cards", desc: "Pathway cards for beginners, developers, and hardware checkers" },
                { type: "STATS", label: "Platform Statistics Bar", desc: "Monitored node count, network uptime, and verified metrics" },
                { type: "GUIDE_GRID", label: "Recommended Setup Guides", desc: "Dynamic grid of published runbooks with difficulty tags" },
                { type: "NETWORK_GRID", label: "Blockchain Networks Grid", desc: "Supported networks with consensus type and client info" },
                { type: "OPPORTUNITY_GRID", label: "Validator Opportunities", desc: "Active testnet validator campaigns with reward status" },
                { type: "FAQ", label: "FAQ Accordion", desc: "Frequently asked questions with expandable answer details" },
                { type: "CTA", label: "Call to Action Conversion Card", desc: "High-contrast card prompting users to join or run nodes" },
                { type: "RICH_TEXT", label: "Rich Text Article Block", desc: "Formatted technical documentation or guide steps" },
                { type: "DIVIDER", label: "Decorative Divider Line", desc: "Subtle gradient horizontal line separator" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addComponent(item.type as any)}
                  className="p-3 rounded-xl border border-dark-card-border bg-[#0d1428] hover:border-brand-purple hover:bg-brand-purple/10 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-semibold text-white group-hover:text-brand-purple-light text-xs">
                    <span>{item.label}</span>
                    <Plus className="w-4 h-4 text-text-muted group-hover:text-brand-cyan" />
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NEW PAGE MODAL                                                         */}
      {/* ========================================================================= */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1020] border border-dark-card-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
              <h3 className="text-base font-bold text-white">Create New Page</h3>
              <button
                onClick={() => setShowNewPageModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-mono">Page Title</label>
                <Input
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }
                  }}
                  placeholder="e.g. Validator Hardware FAQ"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1 font-mono">URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 h-8 flex items-center bg-[#060810] border border-r-0 border-dark-card-border rounded-l-lg text-text-muted font-mono text-xs">
                    /p/
                  </span>
                  <Input
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="hardware-faq"
                    className="h-8 rounded-l-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewPageModal(false)}
                className="text-xs border-dark-card-border"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateNewPage}
                disabled={saving}
                className="text-xs font-bold"
              >
                Create Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getShortSectionName(type: PageSectionItem["componentType"]): string {
  switch (type) {
    case "HERO":
      return "Hero Banner";
    case "NODE_DASHBOARD":
      return "Node Dashboard";
    case "SECURITY_BANNER":
      return "Security Protocol";
    case "FEATURES":
      return "Feature Cards";
    case "STATS":
      return "Stats Bar";
    case "GUIDE_GRID":
      return "Guides Grid";
    case "NETWORK_GRID":
      return "Networks Grid";
    case "OPPORTUNITY_GRID":
      return "Opportunities";
    case "FAQ":
      return "FAQ Accordion";
    case "CTA":
      return "Call to Action";
    case "RICH_TEXT":
      return "Rich Text Block";
    case "DIVIDER":
      return "Divider";
    default:
      return type;
  }
}
