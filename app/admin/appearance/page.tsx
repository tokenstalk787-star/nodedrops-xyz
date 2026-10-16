"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ThemeTokens {
  presetName: string;
  primaryColor: string;
  secondaryColor: string;
  cardBackground: string;
  accentCyan: string;
  accentBlue: string;
  fontFamily: string;
  borderRadius: string;
}

const PRESETS: Record<string, ThemeTokens> = {
  "Violet Bloom": {
    presetName: "Violet Bloom",
    primaryColor: "#8B5CF6",
    secondaryColor: "#101525",
    cardBackground: "#141B2D",
    accentCyan: "#06B6D4",
    accentBlue: "#3B82F6",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  "Cyber Cyan": {
    presetName: "Cyber Cyan",
    primaryColor: "#06B6D4",
    secondaryColor: "#0B1528",
    cardBackground: "#0F2038",
    accentCyan: "#22D3EE",
    accentBlue: "#3B82F6",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.5rem",
  },
  "Emerald Validator": {
    presetName: "Emerald Validator",
    primaryColor: "#10B981",
    secondaryColor: "#0A1F18",
    cardBackground: "#112B22",
    accentCyan: "#34D399",
    accentBlue: "#059669",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  "Sunset Amber": {
    presetName: "Sunset Amber",
    primaryColor: "#F59E0B",
    secondaryColor: "#1C140A",
    cardBackground: "#281D0F",
    accentCyan: "#FBBF24",
    accentBlue: "#D97706",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
};

export default function AdminAppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [theme, setTheme] = useState<ThemeTokens>(PRESETS["Violet Bloom"]);
  const [previewTab, setPreviewTab] = useState<"overview" | "buttons" | "cards" | "code">("overview");

  useEffect(() => {
    async function loadTheme() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/theme");
        const data = await res.json();
        if (data.theme) {
          setTheme({
            presetName: data.theme.presetName || "Violet Bloom",
            primaryColor: data.theme.primaryColor || "#8B5CF6",
            secondaryColor: data.theme.secondaryColor || "#101525",
            cardBackground: data.theme.cardBackground || "#141B2D",
            accentCyan: data.theme.accentCyan || "#06B6D4",
            accentBlue: data.theme.accentBlue || "#3B82F6",
            fontFamily: data.theme.fontFamily || "Inter, system-ui, sans-serif",
            borderRadius: data.theme.borderRadius || "0.75rem",
          });
        }
      } catch (e: any) {
        setErrorMsg("Failed to load theme configuration.");
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  const handleApplyPreset = (presetName: string) => {
    if (PRESETS[presetName]) {
      setTheme({ ...PRESETS[presetName] });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      setSuccessMsg("Theme tokens and branding styles saved successfully.");
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
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Design System Studio</span>
            <span>/</span>
            <span className="text-text-primary">Theme & Branding</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Global Theme & Token Studio
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Live customize primary colors, card surfaces, border radiuses, and typography with real-time preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setTheme(PRESETS["Violet Bloom"])}
            className="border-dark-card-border hover:bg-dark-card-hover text-xs"
          >
            Reset Defaults
          </Button>
          <Button variant="default" disabled={saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save Theme Tokens"}
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

      {/* Preset Selector Banner */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Curated Color Palettes
          </div>
          <div className="text-sm font-semibold text-text-primary mt-0.5">
            Select a verified Web3 infrastructure palette:
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((pName) => {
            const isSelected = theme.presetName === pName;
            const p = PRESETS[pName];
            return (
              <button
                key={pName}
                type="button"
                onClick={() => handleApplyPreset(pName)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-brand-purple bg-brand-purple/20 text-text-primary ring-1 ring-brand-purple"
                    : "border-dark-card-border bg-dark-bg/60 text-text-secondary hover:border-dark-card-hover"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.primaryColor }}
                />
                <span>{pName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Token Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Accent & Brand Colors */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider flex items-center justify-between">
              <span>Color Palette Tokens</span>
              <span className="text-[11px] font-mono text-text-muted">HEX CSS Variables</span>
            </h2>

            {/* Primary Accent */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary flex justify-between">
                <span>Primary Brand Color</span>
                <span className="font-mono text-text-muted">{theme.primaryColor}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer bg-dark-bg border border-dark-card-border p-1"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Accent Cyan */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary flex justify-between">
                <span>Accent Cyan (Highlights & Status)</span>
                <span className="font-mono text-text-muted">{theme.accentCyan}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentCyan}
                  onChange={(e) => setTheme({ ...theme, accentCyan: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer bg-dark-bg border border-dark-card-border p-1"
                />
                <Input
                  value={theme.accentCyan}
                  onChange={(e) => setTheme({ ...theme, accentCyan: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Accent Blue */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary flex justify-between">
                <span>Accent Blue (Secondary actions)</span>
                <span className="font-mono text-text-muted">{theme.accentBlue}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentBlue}
                  onChange={(e) => setTheme({ ...theme, accentBlue: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer bg-dark-bg border border-dark-card-border p-1"
                />
                <Input
                  value={theme.accentBlue}
                  onChange={(e) => setTheme({ ...theme, accentBlue: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Card Background */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary flex justify-between">
                <span>Card Surface Background</span>
                <span className="font-mono text-text-muted">{theme.cardBackground}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.cardBackground}
                  onChange={(e) => setTheme({ ...theme, cardBackground: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer bg-dark-bg border border-dark-card-border p-1"
                />
                <Input
                  value={theme.cardBackground}
                  onChange={(e) => setTheme({ ...theme, cardBackground: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Secondary Background */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary flex justify-between">
                <span>Secondary Surface (Sidebar / Bars)</span>
                <span className="font-mono text-text-muted">{theme.secondaryColor}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer bg-dark-bg border border-dark-card-border p-1"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Geometry & Typography */}
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Geometry & Typography
            </h2>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Border Radius: {theme.borderRadius}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["0.375rem", "0.5rem", "0.75rem", "1.0rem"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTheme({ ...theme, borderRadius: r })}
                    className={`p-2 text-center text-xs font-mono rounded border transition-colors ${
                      theme.borderRadius === r
                        ? "border-brand-purple bg-brand-purple/20 text-text-primary"
                        : "border-dark-card-border bg-dark-bg text-text-muted hover:border-dark-card-hover"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Typography Font Family
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                className="w-full bg-dark-bg border border-dark-card-border rounded-md px-3 py-2 text-xs text-text-primary"
              >
                <option value="Inter, system-ui, sans-serif">Inter (Web3 Standard)</option>
                <option value="JetBrains Mono, monospace">JetBrains Mono (Technical / Code)</option>
                <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Modern Display)</option>
                <option value="system-ui, -apple-system, sans-serif">Native System UI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Live Interactive Component Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-dark-card border border-dark-card-border rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-card-border pb-3">
              <div>
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Live Component Sandbox Preview
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  See how public UI components render with your active token choices.
                </p>
              </div>

              {/* Preview Tabs */}
              <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-lg border border-dark-card-border">
                {(["overview", "buttons", "cards", "code"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPreviewTab(tab)}
                    className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                      previewTab === tab
                        ? "bg-dark-card text-text-primary font-medium shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Canvas */}
            <div
              className="p-6 rounded-xl border border-dark-card-border bg-[#080B14] space-y-6"
              style={{
                borderRadius: theme.borderRadius,
                fontFamily: theme.fontFamily,
              }}
            >
              {/* Tab 1: Overview */}
              {previewTab === "overview" && (
                <div className="space-y-6">
                  {/* Hero simulation */}
                  <div className="space-y-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider inline-block"
                      style={{
                        backgroundColor: `${theme.primaryColor}20`,
                        color: theme.primaryColor,
                        border: `1px solid ${theme.primaryColor}40`,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      Infrastructure Verified
                    </span>
                    <h3 className="text-xl font-bold text-text-primary">
                      Run Nodes. Support Decentralized Networks.
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
                      Master step-by-step validator and full node deployment with production systemd configurations, security runbooks, and zero third-party dependencies.
                    </p>
                  </div>

                  {/* Cards simulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 border border-dark-card-border space-y-2 shadow-lg"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary text-sm">Celestia Mocha</span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold"
                          style={{
                            backgroundColor: `${theme.accentCyan}20`,
                            color: theme.accentCyan,
                            border: `1px solid ${theme.accentCyan}40`,
                          }}
                        >
                          TESTNET
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Data availability consensus and bridge node deployment on mocha-4.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs">
                        <span className="text-text-muted">4 Cores / 8GB RAM</span>
                        <button
                          type="button"
                          className="text-xs font-medium hover:underline"
                          style={{ color: theme.primaryColor }}
                        >
                          View Guide →
                        </button>
                      </div>
                    </div>

                    <div
                      className="p-4 border border-dark-card-border space-y-2 shadow-lg"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary text-sm">Babylon Genesis</span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold"
                          style={{
                            backgroundColor: `${theme.accentBlue}20`,
                            color: theme.accentBlue,
                            border: `1px solid ${theme.accentBlue}40`,
                          }}
                        >
                          INCENTIVIZED
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Bitcoin staking security protocol validator node testnet.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs">
                        <span className="text-text-muted">Reward Confirmed</span>
                        <button
                          type="button"
                          className="text-xs font-medium hover:underline"
                          style={{ color: theme.primaryColor }}
                        >
                          View Campaign →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Button actions simulation */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-medium text-white shadow-md transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: theme.primaryColor,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      Primary Button Action
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-medium border border-dark-card-border text-text-secondary hover:text-text-primary"
                      style={{
                        backgroundColor: theme.secondaryColor,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      Secondary Surface Action
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Buttons */}
              {previewTab === "buttons" && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-text-muted uppercase">Button Variants</div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-medium text-white shadow-md"
                      style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                    >
                      Default ({theme.primaryColor})
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-medium border"
                      style={{
                        borderColor: theme.primaryColor,
                        color: theme.primaryColor,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      Outline Variant
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary"
                      style={{ backgroundColor: `${theme.primaryColor}15`, borderRadius: theme.borderRadius }}
                    >
                      Subtle Ghost
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-text-muted uppercase pt-4">Badges & Tags</div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-2.5 py-0.5 text-xs font-mono font-medium rounded"
                      style={{
                        backgroundColor: `${theme.primaryColor}20`,
                        color: theme.primaryColor,
                        border: `1px solid ${theme.primaryColor}40`,
                      }}
                    >
                      PRIMARY
                    </span>
                    <span
                      className="px-2.5 py-0.5 text-xs font-mono font-medium rounded"
                      style={{
                        backgroundColor: `${theme.accentCyan}20`,
                        color: theme.accentCyan,
                        border: `1px solid ${theme.accentCyan}40`,
                      }}
                    >
                      CYAN ACCENT
                    </span>
                    <span
                      className="px-2.5 py-0.5 text-xs font-mono font-medium rounded"
                      style={{
                        backgroundColor: `${theme.accentBlue}20`,
                        color: theme.accentBlue,
                        border: `1px solid ${theme.accentBlue}40`,
                      }}
                    >
                      BLUE ACCENT
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Cards */}
              {previewTab === "cards" && (
                <div className="space-y-4">
                  <div
                    className="p-5 border border-dark-card-border space-y-3"
                    style={{ backgroundColor: theme.cardBackground, borderRadius: theme.borderRadius }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                      <h4 className="font-semibold text-text-primary text-sm">Node Telemetry Card</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Custom surface configured with <code>{theme.cardBackground}</code> and <code>{theme.borderRadius}</code> border radius.
                    </p>
                    <div className="pt-2 flex justify-between text-xs text-text-muted">
                      <span>Sync Height: 1,842,910</span>
                      <span style={{ color: theme.accentCyan }}>100% Synced</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Code */}
              {previewTab === "code" && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-text-muted uppercase">
                    Exported CSS Variable Root
                  </div>
                  <pre
                    className="p-4 rounded-lg bg-dark-bg border border-dark-card-border text-xs font-mono text-emerald-400 overflow-x-auto"
                    style={{ borderRadius: theme.borderRadius }}
                  >
{`:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --card: ${theme.cardBackground};
  --accent-cyan: ${theme.accentCyan};
  --accent-blue: ${theme.accentBlue};
  --font-family: ${theme.fontFamily};
  --radius: ${theme.borderRadius};
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
