"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  X,
  RefreshCw,
  Coins,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { OpportunityItem } from "@/lib/services/mock-data";

export default function AdminOpportunitiesPage() {
  const [opps, setOpps] = React.useState<OpportunityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOpp, setEditingOpp] = React.useState<OpportunityItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formTicker, setFormTicker] = React.useState("");
  const [formFundingRaised, setFormFundingRaised] = React.useState("$100M");
  const [formTasks, setFormTasks] = React.useState("Node Run, Incentivized, Faucet");
  const [formNodeType, setFormNodeType] = React.useState("Full Node / Validator");
  const [formCampaignType, setFormCampaignType] = React.useState("Incentivized Testnet");
  const [formNetworkSlug, setFormNetworkSlug] = React.useState("");
  const [formRewardStatus, setFormRewardStatus] = React.useState<"CONFIRMED" | "POTENTIAL" | "NONE">("CONFIRMED");
  const [formCampaignStatus, setFormCampaignStatus] = React.useState<"ACTIVE" | "UPCOMING" | "ENDED">("ACTIVE");
  const [formVpsCost, setFormVpsCost] = React.useState("~$25 - $40/mo");
  const [formStage, setFormStage] = React.useState("Phase 2 Testnet");
  const [formGuideSlug, setFormGuideSlug] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formEligibility, setFormEligibility] = React.useState("Open to community participants");
  const [formAnnounceUrl, setFormAnnounceUrl] = React.useState("https://");
  const [formDocsUrl, setFormDocsUrl] = React.useState("https://");

  const loadOpps = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/opportunities");
      const data = await res.json();
      if (data.items) {
        setOpps(data.items);
      }
    } catch (err: any) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadOpps();
  }, [loadOpps]);

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setFormName("");
    setFormSlug("");
    setFormTicker("");
    setFormFundingRaised("$100M");
    setFormTasks("Node Run, Incentivized, Faucet");
    setFormNodeType("Full Node / Validator");
    setFormCampaignType("Incentivized Testnet");
    setFormNetworkSlug("");
    setFormRewardStatus("CONFIRMED");
    setFormCampaignStatus("ACTIVE");
    setFormVpsCost("~$25 - $40/mo");
    setFormStage("Phase 2 Testnet");
    setFormGuideSlug("");
    setFormDesc("");
    setFormEligibility("Open to community participants");
    setFormAnnounceUrl("https://");
    setFormDocsUrl("https://");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: OpportunityItem) => {
    setEditingOpp(opp);
    setFormName(opp.projectName);
    setFormSlug(opp.slug);
    setFormTicker(opp.ticker || "");
    setFormFundingRaised(opp.fundingRaised || "$100M");
    setFormTasks(opp.tasks ? opp.tasks.join(", ") : "Node Run, Incentivized");
    setFormNodeType(opp.nodeType || "Full Node / Validator");
    setFormCampaignType(opp.campaignType);
    setFormNetworkSlug(opp.networkSlug || "");
    setFormRewardStatus((opp.rewardStatus as any) || "CONFIRMED");
    setFormCampaignStatus((opp.campaignStatus as any) || "ACTIVE");
    setFormVpsCost(opp.vpsCost || "~$25/mo");
    setFormStage(opp.stage || "Active");
    setFormGuideSlug(opp.guideSlug || "");
    setFormDesc(opp.description);
    setFormEligibility(opp.eligibility);
    setFormAnnounceUrl(opp.officialAnnouncementUrl);
    setFormDocsUrl(opp.officialDocumentationUrl);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedback({ type: "error", text: "Project name is required." });
      return;
    }

    const tasksArray = formTasks
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<OpportunityItem> = {
      id: editingOpp ? editingOpp.id : undefined,
      projectName: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ticker: formTicker.trim() || undefined,
      fundingRaised: formFundingRaised.trim() || undefined,
      tasks: tasksArray.length > 0 ? tasksArray : undefined,
      nodeType: formNodeType.trim(),
      campaignType: formCampaignType.trim(),
      networkSlug: formNetworkSlug.trim() || undefined,
      rewardStatus: formRewardStatus,
      campaignStatus: formCampaignStatus,
      vpsCost: formVpsCost.trim(),
      stage: formStage.trim(),
      guideSlug: formGuideSlug.trim() || undefined,
      description: formDesc.trim(),
      eligibility: formEligibility.trim(),
      officialAnnouncementUrl: formAnnounceUrl.trim(),
      officialDocumentationUrl: formDocsUrl.trim(),
    };

    try {
      const method = editingOpp ? "PUT" : "POST";
      const res = await fetch("/api/admin/opportunities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Save failed.");
      }

      setFeedback({
        type: "success",
        text: `Opportunity "${payload.projectName}" saved successfully.`,
      });
      setIsModalOpen(false);
      loadOpps();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save." });
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    try {
      const res = await fetch(`/api/admin/opportunities?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed.");
      }

      setFeedback({ type: "success", text: "Opportunity removed from database." });
      setDeleteConfirmId(null);
      loadOpps();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to delete." });
    }
  };

  const filtered = opps.filter((opp) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      opp.projectName.toLowerCase().includes(s) ||
      opp.ticker?.toLowerCase().includes(s) ||
      opp.nodeType?.toLowerCase().includes(s) ||
      opp.campaignType.toLowerCase().includes(s)
    );
  });

  const activeCount = opps.filter((o) => o.campaignStatus === "ACTIVE").length;
  const confirmedCount = opps.filter((o) => o.rewardStatus === "CONFIRMED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-purple">
              CMS Control Center
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-xs uppercase tracking-wider text-text-muted">Opportunities</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Potential Airdrops & Node Opportunities
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage projects displayed on the CryptoRank-style live dashboard, task tags, reward statuses, and funding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadOpps} disabled={loading} className="border-dark-card-border">
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button variant="default" size="sm" onClick={handleOpenCreate} className="font-semibold shadow-lg">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-mono flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-dark-card-border bg-dark-card p-4 rounded-xl">
          <div className="text-[11px] font-mono text-text-muted uppercase">Total Campaigns</div>
          <div className="text-2xl font-bold text-white mt-1">{opps.length}</div>
          <div className="text-xs text-text-secondary mt-0.5">Tracked in database</div>
        </Card>

        <Card className="border-dark-card-border bg-dark-card p-4 rounded-xl">
          <div className="text-[11px] font-mono text-text-muted uppercase">Active Drops</div>
          <div className="text-2xl font-bold text-status-success mt-1">{activeCount}</div>
          <div className="text-xs text-text-secondary mt-0.5">Live node testnets</div>
        </Card>

        <Card className="border-dark-card-border bg-dark-card p-4 rounded-xl">
          <div className="text-[11px] font-mono text-text-muted uppercase">Confirmed Rewards</div>
          <div className="text-2xl font-bold text-brand-cyan mt-1">{confirmedCount}</div>
          <div className="text-xs text-text-secondary mt-0.5">Verified token allocations</div>
        </Card>

        <Card className="border-dark-card-border bg-dark-card p-4 rounded-xl">
          <div className="text-[11px] font-mono text-text-muted uppercase">Average VPS Cost</div>
          <div className="text-2xl font-bold text-brand-purple mt-1">$15 - $40</div>
          <div className="text-xs text-text-secondary mt-0.5">Monthly server hosting</div>
        </Card>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name, ticker, or node type..."
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-dark-card-border bg-dark-card text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple font-mono"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-text-muted">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table (CryptoRank Matching Columns) */}
      <Card className="border-dark-card-border bg-dark-card shadow-2xl overflow-hidden rounded-2xl">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-dark-card-border text-text-muted bg-dark-bg/60 uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Project & Node</th>
                <th className="py-3.5 px-4">Tasks / Stage</th>
                <th className="py-3.5 px-4">Funding</th>
                <th className="py-3.5 px-4">Reward Status</th>
                <th className="py-3.5 px-4">Est. VPS</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No opportunities found.
                  </td>
                </tr>
              ) : (
                filtered.map((opp) => {
                  const isDeleting = deleteConfirmId === opp.id;
                  const tasksList = opp.tasks && opp.tasks.length > 0 ? opp.tasks : [opp.nodeType || "Node Run"];

                  return (
                    <tr key={opp.id} className="hover:bg-dark-card-hover/80 transition-colors group">
                      {/* Project & Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border border-brand-purple/30 flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {opp.ticker?.slice(0, 2) || opp.projectName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-sans font-bold text-sm text-white">
                                {opp.projectName}
                              </span>
                              {opp.ticker && (
                                <span className="px-1.5 py-0.2 rounded bg-dark-bg border border-border text-[10px] text-brand-purple-light font-mono font-bold">
                                  {opp.ticker}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted font-mono">{opp.nodeType || opp.campaignType}</div>
                          </div>
                        </div>
                      </td>

                      {/* Tasks / Stage Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {tasksList.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-brand-blue/15 border border-brand-blue/30 text-brand-blue-light text-[10px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Funding Raised */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        {opp.fundingRaised || "$100M"}
                      </td>

                      {/* Reward Status */}
                      <td className="py-3.5 px-4">
                        {opp.rewardStatus === "CONFIRMED" ? (
                          <span className="text-status-success flex items-center gap-1 font-semibold">
                            <Coins className="w-3.5 h-3.5" /> Confirmed
                          </span>
                        ) : opp.rewardStatus === "POTENTIAL" ? (
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3.5 h-3.5" /> Potential
                          </span>
                        ) : (
                          <span className="text-text-muted">Public</span>
                        )}
                      </td>

                      {/* VPS Cost */}
                      <td className="py-3.5 px-4 text-brand-cyan font-bold">{opp.vpsCost || "~$20/mo"}</td>

                      {/* Campaign Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={opp.campaignStatus.toLowerCase() as any}>
                          {opp.campaignStatus}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-[10px] text-rose-400">Delete?</span>
                            <button
                              onClick={() => handleDelete(opp.id, opp.slug)}
                              className="px-2 py-1 rounded bg-rose-600 text-white text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-dark-bg text-slate-300 text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(opp)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-purple bg-dark-bg text-slate-300 hover:text-white"
                              title="Edit Opportunity"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/opportunities/${opp.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-brand-cyan bg-dark-bg text-slate-300 hover:text-white"
                              title="View Public Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setDeleteConfirmId(opp.id)}
                              className="p-1.5 rounded-lg border border-dark-card-border hover:border-rose-500 bg-dark-bg text-slate-400 hover:text-rose-400"
                              title="Delete Opportunity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple-light" />
                <h3 className="text-base font-bold text-white">
                  {editingOpp ? "Edit Opportunity" : "Add Node Opportunity"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Project Name *</label>
                  <Input
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingOpp) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Linea zkEVM Prover"
                    required
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Slug (URL Key)</label>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. linea-zkevm-prover"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Token Ticker</label>
                  <Input
                    value={formTicker}
                    onChange={(e) => setFormTicker(e.target.value)}
                    placeholder="e.g. LINEA"
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Funding Raised ($)</label>
                  <Input
                    value={formFundingRaised}
                    onChange={(e) => setFormFundingRaised(e.target.value)}
                    placeholder="e.g. $725M"
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Est. VPS Cost</label>
                  <Input
                    value={formVpsCost}
                    onChange={(e) => setFormVpsCost(e.target.value)}
                    placeholder="e.g. ~$25 - $45/mo"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Tasks Tags */}
              <div>
                <label className="block text-text-muted mb-1">Task Tags (comma separated for blue badges)</label>
                <Input
                  value={formTasks}
                  onChange={(e) => setFormTasks(e.target.value)}
                  placeholder="e.g. Node Run, Incentivized, Snapshot Q2, Testnet Faucet"
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Reward Status</label>
                  <select
                    value={formRewardStatus}
                    onChange={(e) => setFormRewardStatus(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300"
                  >
                    <option value="CONFIRMED">🏆 Confirmed Rewards</option>
                    <option value="POTENTIAL">🎁 Potential Airdrop</option>
                    <option value="NONE">⚡ Public Spec</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Campaign Status</label>
                  <select
                    value={formCampaignStatus}
                    onChange={(e) => setFormCampaignStatus(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-dark-card-border bg-[#070a14] px-3 text-slate-300"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Stage / Phase</label>
                  <Input
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value)}
                    placeholder="e.g. Mainnet Alpha"
                    className="h-9 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Node Task / Role</label>
                  <Input
                    value={formNodeType}
                    onChange={(e) => setFormNodeType(e.target.value)}
                    placeholder="e.g. Full Node / RPC"
                    className="h-9 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Linked Guide Slug (Optional)</label>
                  <Input
                    value={formGuideSlug}
                    onChange={(e) => setFormGuideSlug(e.target.value)}
                    placeholder="e.g. setting-up-celestia-light-node-mocha"
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  placeholder="Summary of the campaign, incentives, and requirements..."
                  className="w-full rounded-xl border border-dark-card-border bg-[#070a14] p-2.5 text-xs text-slate-300 focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1">Official Announcement URL</label>
                  <Input
                    value={formAnnounceUrl}
                    onChange={(e) => setFormAnnounceUrl(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Official Docs URL</label>
                  <Input
                    value={formDocsUrl}
                    onChange={(e) => setFormDocsUrl(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-card-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-dark-card-border"
                >
                  Cancel
                </Button>

                <Button type="submit" variant="default" size="sm" className="font-semibold shadow-lg">
                  {editingOpp ? "Save Changes" : "Create Opportunity"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
