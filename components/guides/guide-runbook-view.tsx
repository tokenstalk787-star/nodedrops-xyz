"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  Download,
  Share2,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Server,
  Network as NetworkIcon,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GuideFeedback } from "@/components/guide-feedback";
import type { GuideItem, NetworkItem } from "@/lib/services/mock-data";

interface GuideRunbookViewProps {
  guide: GuideItem;
  network?: NetworkItem | null;
  prevGuide?: GuideItem | null;
  nextGuide?: GuideItem | null;
}

export function GuideRunbookView({
  guide,
  network,
  prevGuide,
  nextGuide,
}: GuideRunbookViewProps) {
  // LocalStorage state for completed steps
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [copiedStepIndex, setCopiedStepIndex] = React.useState<number | null>(null);

  // Load progress from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`nodedrops_guide_${guide.slug}_progress`);
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [guide.slug]);

  // Save progress
  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepIdx)
        ? prev.filter((i) => i !== stepIdx)
        : [...prev, stepIdx];
      try {
        localStorage.setItem(
          `nodedrops_guide_${guide.slug}_progress`,
          JSON.stringify(next)
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    try {
      localStorage.removeItem(`nodedrops_guide_${guide.slug}_progress`);
    } catch {
      // ignore
    }
  };

  // Compile all commands into a single automation shell script
  const fullShellScript = React.useMemo(() => {
    const lines = [
      `#!/usr/bin/env bash`,
      `# ==============================================================================`,
      `# NodeDrops.xyz — Autonomous Node Runbook`,
      `# Guide: ${guide.title}`,
      `# Verified: ${new Date(guide.lastVerifiedAt).toISOString().split("T")[0]}`,
      `# Difficulty: ${guide.difficulty} | Estimated: ${guide.estimatedMinutes} mins`,
      `# ==============================================================================`,
      `set -euo pipefail`,
      `echo ">>> [NodeDrops] Starting runbook execution for: ${guide.title}"`,
      ``,
    ];

    guide.steps.forEach((step, idx) => {
      lines.push(`echo ">>> [Step ${idx + 1}/${guide.steps.length}] ${step.title}..."`);
      if (step.command) {
        lines.push(step.command.trim());
      }
      lines.push(``);
    });

    lines.push(`echo ">>> [NodeDrops] Runbook steps executed successfully."`);
    return lines.join("\n");
  }, [guide]);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullShellScript);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch (err) {
      console.error("Failed to copy script:", err);
    }
  };

  const handleDownloadScript = () => {
    try {
      const blob = new Blob([fullShellScript], { type: "text/x-shellscript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${guide.slug}.sh`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download script:", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleCopyStep = async (cmd: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedStepIndex(idx);
      setTimeout(() => setCopiedStepIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy step:", err);
    }
  };

  const progressPercent = Math.round(
    (completedSteps.length / Math.max(1, guide.steps.length)) * 100
  );

  // Fallback hardware specs from network or guide
  const cpuMin = network?.hardwareRequirements?.min?.cpuCores || 4;
  const ramMin = network?.hardwareRequirements?.min?.ramGb || 8;
  const ssdMin = network?.hardwareRequirements?.min?.ssdGb || 250;
  const bandwidthMin = network?.hardwareRequirements?.min?.bandwidthMbps || 100;

  return (
    <div className="relative min-h-screen pb-24 text-text-primary selection:bg-brand-purple/40">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-purple/15 via-brand-blue/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-white transition-colors">
              Runbooks & Guides
            </Link>
            <span>/</span>
            <span className="text-brand-cyan font-medium truncate max-w-[200px] sm:max-w-md">
              {guide.category}
            </span>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-dark-card hover:bg-dark-card-hover text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
              title="Copy link to runbook"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-status-success">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-text-muted" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-brand-purple/40 bg-brand-purple/15 hover:bg-brand-purple/25 text-xs font-mono text-brand-purple-light hover:text-white transition-all shadow-sm"
              title="Copy entire bash script containing all steps"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-status-success">Script Copied!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5 text-brand-purple-light" />
                  <span>Copy Full .sh</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-dark-card hover:bg-dark-card-hover text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
              title="Download script as .sh file"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Master Runbook Hero Banner */}
        <div className="pt-8 pb-10 space-y-6">
          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 text-[11px] font-mono text-brand-cyan tracking-wide uppercase font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              Verified Runbook
            </span>

            <Badge
              variant={
                guide.difficulty.toLowerCase() as
                  | "beginner"
                  | "intermediate"
                  | "advanced"
              }
            >
              {guide.difficulty}
            </Badge>

            {guide.networkSlug && (
              <span className="px-2.5 py-0.5 rounded-full border border-border bg-dark-card text-[11px] font-mono text-text-secondary">
                Network:{" "}
                <strong className="text-slate-200 capitalize">
                  {guide.networkSlug.replace(/-/g, " ")}
                </strong>
              </span>
            )}

            <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted px-2.5 py-0.5 rounded-full border border-border/40 bg-dark-card/50">
              <Clock className="w-3 h-3 text-text-muted" />
              {guide.estimatedMinutes} Mins Execution
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-text-muted px-2.5 py-0.5 rounded-full border border-border/40 bg-dark-card/50">
              <Server className="w-3 h-3 text-text-muted" />
              Linux LTS Compatible
            </span>
          </div>

          {/* Guide Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
            {guide.title}
          </h1>

          {/* Excerpt / Summary */}
          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed font-sans font-normal">
            {guide.excerpt}
          </p>

          {/* Author, Verification Seal, and Hardware Quickbar Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Verification Seal */}
            <div className="p-4 rounded-xl border border-dark-card-border bg-dark-card/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-success/15 border border-status-success/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-status-success" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-mono font-semibold text-white flex items-center gap-1">
                  <span>Audit Verified</span>
                  <span className="text-[10px] text-brand-cyan font-mono">(SHA-256)</span>
                </div>
                <div className="text-[11px] text-text-muted font-mono">
                  Reviewer:{" "}
                  <span className="text-slate-300 font-medium">
                    {guide.reviewerName || "Lead DevOps Peer"}
                  </span>
                </div>
              </div>
            </div>

            {/* Author Attribution */}
            <div className="p-4 rounded-xl border border-dark-card-border bg-dark-card/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center shrink-0 font-mono font-bold text-xs text-brand-purple-light">
                ND
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-mono font-semibold text-white">
                  {guide.authorName}
                </div>
                <div className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Verified: {new Date(guide.lastVerifiedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Minimum Hardware Spec Chip */}
            <div className="p-4 rounded-xl border border-dark-card-border bg-dark-card/70 flex items-center justify-between">
              <div className="space-y-0.5 text-xs">
                <div className="font-mono text-[11px] text-text-muted uppercase tracking-wider">
                  Hardware Profile
                </div>
                <div className="font-mono text-sm font-bold text-brand-cyan">
                  {cpuMin} Cores • {ramMin}GB RAM
                </div>
                <div className="text-[10px] text-text-muted font-mono">
                  {ssdMin}GB Storage • {bandwidthMin}Mbps
                </div>
              </div>
              <Link
                href={`/tools/hardware-checker?cpu=${cpuMin}&ram=${ramMin}&disk=${ssdMin}`}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:border-brand-purple bg-dark-bg text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                title="Verify VPS against node requirements"
              >
                Validate VPS
              </Link>
            </div>
          </div>
        </div>

        {/* Main 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR (STICKY NAVIGATION & PROGRESS TRACKER) */}
          {/* ========================================================= */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              {/* Operator Live Runbook Progress Box */}
              <div className="rounded-2xl border border-dark-card-border bg-dark-card p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-brand-purple-light" />
                    <span>Runbook Progress</span>
                  </h3>
                  {completedSteps.length > 0 && (
                    <button
                      onClick={resetProgress}
                      className="text-[10px] font-mono text-text-muted hover:text-status-warning flex items-center gap-1 transition-colors"
                      title="Reset completed steps"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-text-muted">
                      {completedSteps.length} of {guide.steps.length} Steps Done
                    </span>
                    <span className="font-bold text-brand-cyan">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-border/40">
                    <div
                      className="h-full bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist navigation */}
                <div className="pt-2 border-t border-dark-card-border space-y-1.5">
                  <a
                    href="#overview"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-dark-card-hover transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                    <span className="truncate">00. Architecture & Overview</span>
                  </a>

                  <a
                    href="#prerequisites"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-dark-card-hover transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-blue" />
                    <span className="truncate">Pre-Flight Server Checklist</span>
                  </a>

                  {guide.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    return (
                      <div
                        key={step.orderIndex}
                        className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                          isDone
                            ? "bg-status-success/10 border border-status-success/30 text-status-success"
                            : "hover:bg-dark-card-hover text-slate-300 hover:text-white"
                        }`}
                      >
                        <a
                          href={`#step-${idx + 1}`}
                          className="flex items-center gap-2.5 truncate flex-1"
                        >
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isDone
                                ? "bg-status-success text-slate-950"
                                : "bg-dark-bg border border-border text-text-muted group-hover:border-brand-purple group-hover:text-brand-purple-light"
                            }`}
                          >
                            {isDone ? "✓" : idx + 1}
                          </span>
                          <span className="truncate font-sans font-medium text-xs">
                            {step.title}
                          </span>
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className="ml-2 text-text-muted hover:text-status-success p-0.5 rounded transition-colors"
                          title={isDone ? "Mark as pending" : "Mark as verified done"}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isDone
                                ? "text-status-success fill-status-success/20"
                                : "text-border hover:text-slate-400"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}

                  <a
                    href="#ports"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-dark-card-hover transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    <span className="truncate">Port Matrix & Firewall</span>
                  </a>

                  <a
                    href="#feedback"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-dark-card-hover transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-text-muted" />
                    <span className="truncate">Feedback & Audit Notes</span>
                  </a>
                </div>
              </div>

              {/* Verified Hardware & Port Matrix Summary Card */}
              <div className="rounded-2xl border border-dark-card-border bg-dark-card p-5 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
                  <Server className="w-4 h-4 text-brand-cyan" />
                  <span>Hardware & Specs Spec</span>
                </div>

                <div className="space-y-2 text-text-secondary border-t border-dark-card-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Cpu className="w-3.5 h-3.5 text-brand-purple-light" />
                      Min CPU:
                    </span>
                    <span className="text-white font-semibold">
                      {cpuMin} vCPU Cores
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Layers className="w-3.5 h-3.5 text-brand-blue" />
                      Min Memory:
                    </span>
                    <span className="text-white font-semibold">{ramMin} GB RAM</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <HardDrive className="w-3.5 h-3.5 text-brand-cyan" />
                      Storage Type:
                    </span>
                    <span className="text-white font-semibold">
                      {ssdMin} GB NVMe SSD
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Activity className="w-3.5 h-3.5 text-status-success" />
                      Bandwidth:
                    </span>
                    <span className="text-white font-semibold">
                      {bandwidthMin} Mbps+
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-card-border">
                  <Link
                    href="/tools/hardware-checker"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-dark-bg hover:bg-dark-card-hover border border-border text-xs text-brand-cyan font-mono transition-colors"
                  >
                    <span>Run Hardware Audit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Troubleshooting Hub Quick Callout */}
              <div className="rounded-2xl border border-brand-purple/30 bg-brand-purple/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple-light">
                  <HelpCircle className="w-4 h-4" />
                  <span>Stuck or Node Crashing?</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Check our community-verified failure logs, statesync snapshots, and
                  peer repair runbooks.
                </p>
                <Link
                  href="/troubleshooting"
                  className="inline-flex items-center gap-1 text-xs font-mono text-brand-cyan hover:underline pt-1"
                >
                  <span>Open Troubleshooting Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN DOCUMENTATION STREAM (CENTER) */}
          {/* ========================================================= */}
          <main className="lg:col-span-8 order-1 lg:order-2 space-y-10">
            {/* Section 00: Architecture Overview */}
            <section
              id="overview"
              className="rounded-2xl border border-dark-card-border bg-dark-card p-6 sm:p-8 space-y-5 shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-dark-card-border pb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light font-mono font-bold text-xs">
                  00
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Architecture & Protocol Overview
                  </h2>
                  <p className="text-xs font-mono text-text-muted">
                    Execution topology, consensus mechanics, and operational assumptions.
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4 font-sans">
                <div className="whitespace-pre-line leading-relaxed">
                  {guide.content}
                </div>
              </div>

              {/* Tags Row */}
              {guide.tags && guide.tags.length > 0 && (
                <div className="pt-4 border-t border-dark-card-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">Tags:</span>
                  {guide.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md border border-border/60 bg-dark-bg text-[11px] font-mono text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Section: Pre-Flight Server Audit */}
            <section
              id="prerequisites"
              className="rounded-2xl border border-border/80 bg-[#070a14] p-6 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Pre-Flight System Check (Ubuntu 22.04 / 24.04 LTS)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-blue/15 text-brand-blue-light border border-brand-blue/30 text-[10px] font-mono">
                  PRE-FLIGHT
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Run this single diagnostics command on your host before beginning the
                installation to ensure you have sufficient compute, disk headroom,
                and proper privileges:
              </p>

              <div className="relative rounded-xl border border-dark-card-border bg-[#03060c] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-dark-card-border bg-dark-card/50 text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-text-secondary">preflight-check.sh</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyStep(
                        `lscpu | grep "Model name\\|CPU(s):"\nfree -h\ndf -h /\nuname -a`,
                        9999
                      )
                    }
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-bg hover:bg-dark-card-hover text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedStepIndex === 9999 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-status-success" />
                        <span className="text-status-success">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 text-xs font-mono text-slate-200 overflow-x-auto">
                  <pre>
                    <code>{`lscpu | grep "Model name\\|CPU(s):"\nfree -h\ndf -h /\nuname -a`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* STEP-BY-STEP RUNBOOK CARDS */}
            {/* ========================================================= */}
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Step-by-Step Runbook Execution</span>
                  <span className="text-xs font-mono text-brand-cyan font-normal">
                    ({guide.steps.length} Verified Modules)
                  </span>
                </h2>
                <span className="text-xs font-mono text-text-muted">
                  Click checkmark to save progress
                </span>
              </div>

              {guide.steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);
                return (
                  <article
                    key={step.orderIndex}
                    id={`step-${idx + 1}`}
                    className={`rounded-2xl border transition-all duration-200 p-6 sm:p-7 space-y-5 shadow-2xl ${
                      isCompleted
                        ? "border-status-success/50 bg-[#08120d]/60"
                        : "border-dark-card-border bg-dark-card hover:border-border"
                    }`}
                  >
                    {/* Step Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dark-card-border">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border ${
                            isCompleted
                              ? "bg-status-success/20 border-status-success text-status-success"
                              : "bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light"
                          }`}
                        >
                          {isCompleted ? "✓" : `0${idx + 1}`}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                              Step {idx + 1} of {guide.steps.length}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-mono text-status-success font-semibold">
                                • COMPLETED
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Complete Step Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleStep(idx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                          isCompleted
                            ? "bg-status-success/15 border-status-success/40 text-status-success hover:bg-status-success/25"
                            : "bg-dark-bg border-border text-text-muted hover:text-white hover:border-brand-purple"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isCompleted ? "text-status-success" : "text-text-muted"
                          }`}
                        />
                        <span>{isCompleted ? "Verified Done" : "Mark Complete"}</span>
                      </button>
                    </div>

                    {/* Step Explanation Text */}
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {step.explanation}
                    </p>

                    {/* Step Command Box (Interactive Terminal Style) */}
                    {step.command && (
                      <div className="space-y-2">
                        <div className="relative rounded-xl border border-dark-card-border bg-[#03060c] overflow-hidden group shadow-lg">
                          {/* Terminal Chrome Bar */}
                          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-card-border bg-dark-card/60 text-xs font-mono text-text-muted">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                              <span className="ml-2 text-text-secondary flex items-center gap-1">
                                <Terminal className="w-3 h-3 text-brand-purple-light" />
                                <span>bash ~ root@validator</span>
                              </span>
                            </div>

                            <button
                              onClick={() => handleCopyStep(step.command!, idx)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-bg hover:bg-dark-card-hover text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                              title="Copy command to clipboard"
                            >
                              {copiedStepIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-status-success" />
                                  <span className="text-status-success">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Command</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Code Content */}
                          <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed">
                            <pre className="selection:bg-brand-purple/40">
                              <code>{step.command}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expected Output Console (if provided) */}
                    {step.expectedOutput && (
                      <div className="rounded-xl bg-[#03050a] border border-border/50 p-4 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                          <span className="flex items-center gap-1.5 text-brand-cyan">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                            Expected Stdout / Terminal Verification
                          </span>
                          <span>STDOUT STREAM</span>
                        </div>
                        <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-lg border border-border/30">
                          {step.expectedOutput}
                        </pre>
                      </div>
                    )}

                    {/* Safety Warning (if provided) */}
                    {step.warning && (
                      <div className="rounded-xl bg-status-warning/10 border border-status-warning/30 p-4 flex items-start gap-3 text-xs text-status-warning">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-status-warning" />
                        <div className="leading-relaxed font-sans">
                          <strong className="font-mono uppercase tracking-wider block mb-0.5">
                            Security Protocol & Warning:
                          </strong>
                          {step.warning}
                        </div>
                      </div>
                    )}

                    {/* Verification Instructions (if provided) */}
                    {step.verificationInstructions && (
                      <div className="rounded-xl bg-status-success/10 border border-status-success/30 p-4 flex items-start gap-3 text-xs text-status-success">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-status-success" />
                        <div className="leading-relaxed font-sans">
                          <strong className="font-mono uppercase tracking-wider block mb-0.5">
                            How to Verify Step Success:
                          </strong>
                          {step.verificationInstructions}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* PORT MATRIX & FIREWALL RULES */}
            {/* ========================================================= */}
            <section
              id="ports"
              className="rounded-2xl border border-dark-card-border bg-dark-card p-6 sm:p-7 space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <NetworkIcon className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-lg font-bold text-white">
                  Network Port Matrix & UFW Firewall Hardening
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Configure your server firewall so that P2P gossip ports are accessible
                to network peers while internal RPC and Engine APIs remain strictly
                protected from public port scanners.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-dark-card-border text-text-muted">
                      <th className="py-2.5 px-3">Port / Protocol</th>
                      <th className="py-2.5 px-3">Interface</th>
                      <th className="py-2.5 px-3">Access Level</th>
                      <th className="py-2.5 px-3">UFW Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-card-border/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">22 / TCP</td>
                      <td className="py-2.5 px-3">SSH Management</td>
                      <td className="py-2.5 px-3 text-status-warning">Restricted / VPN</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">
                        sudo ufw allow 22/tcp
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">P2P Peer Ports</td>
                      <td className="py-2.5 px-3">Gossip & Block Sampling</td>
                      <td className="py-2.5 px-3 text-status-success">Public (0.0.0.0/0)</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">
                        sudo ufw allow 26656/tcp
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">RPC / REST / API</td>
                      <td className="py-2.5 px-3">Node Query & Transactions</td>
                      <td className="py-2.5 px-3 text-status-error">Localhost Only (127.0.0.1)</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">
                        (Do not open publicly)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ========================================================= */}
            {/* OPERATOR FEEDBACK SECTION */}
            {/* ========================================================= */}
            <section id="feedback" className="pt-2">
              <GuideFeedback guideId={guide.id} />
            </section>

            {/* ========================================================= */}
            {/* PREVIOUS / NEXT GUIDE NAVIGATION CARDS */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-dark-card-border">
              {prevGuide ? (
                <Link
                  href={`/guides/${prevGuide.slug}`}
                  className="group p-5 rounded-2xl border border-dark-card-border bg-dark-card hover:bg-dark-card-hover hover:border-brand-purple/50 transition-all space-y-2 shadow-lg"
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted group-hover:text-brand-purple-light transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Runbook</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                    {prevGuide.title}
                  </h4>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant={
                        prevGuide.difficulty.toLowerCase() as
                          | "beginner"
                          | "intermediate"
                          | "advanced"
                      }
                    >
                      {prevGuide.difficulty}
                    </Badge>
                    <span className="text-[11px] font-mono text-text-muted">
                      {prevGuide.estimatedMinutes}m
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-5 rounded-2xl border border-dashed border-border/40 bg-dark-bg/40 flex items-center justify-center text-xs font-mono text-text-muted">
                  First Runbook in Track
                </div>
              )}

              {nextGuide ? (
                <Link
                  href={`/guides/${nextGuide.slug}`}
                  className="group p-5 rounded-2xl border border-dark-card-border bg-dark-card hover:bg-dark-card-hover hover:border-brand-cyan/50 transition-all space-y-2 shadow-lg text-right"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs font-mono text-text-muted group-hover:text-brand-cyan transition-colors">
                    <span>Next Runbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                    {nextGuide.title}
                  </h4>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <span className="text-[11px] font-mono text-text-muted">
                      {nextGuide.estimatedMinutes}m
                    </span>
                    <Badge
                      variant={
                        nextGuide.difficulty.toLowerCase() as
                          | "beginner"
                          | "intermediate"
                          | "advanced"
                      }
                    >
                      {nextGuide.difficulty}
                    </Badge>
                  </div>
                </Link>
              ) : (
                <div className="p-5 rounded-2xl border border-dashed border-border/40 bg-dark-bg/40 flex items-center justify-center text-xs font-mono text-text-muted">
                  Final Runbook in Track
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
