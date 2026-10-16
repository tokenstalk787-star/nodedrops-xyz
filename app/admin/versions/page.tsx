"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Revision {
  id: string;
  pageId: string;
  versionNumber: number;
  snapshot: any;
  changedByName: string;
  changeSummary: string;
  createdAt: string;
}

export default function AdminVersionsPage() {
  const searchParams = useSearchParams();
  const initialPageId = searchParams.get("pageId") || "page-home";

  const [selectedPageId, setSelectedPageId] = useState(initialPageId);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectingRev, setInspectingRev] = useState<Revision | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadVersions(selectedPageId);
  }, [selectedPageId]);

  async function loadVersions(pageId: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/versions?pageId=${pageId}`);
      const data = await res.json();
      if (Array.isArray(data.revisions)) {
        setRevisions(data.revisions);
      }
    } catch (e) {
      console.error("Failed to load versions:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleRestore = async (revision: Revision) => {
    if (
      !confirm(
        `Are you sure you want to rollback to Version ${revision.versionNumber}? This will replace the active page sections.`
      )
    ) {
      return;
    }

    try {
      setRestoringId(revision.id);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: revision.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rollback failed.");

      setSuccessMsg(`Successfully restored page to Version ${revision.versionNumber}.`);
      loadVersions(selectedPageId);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to rollback version.");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">CMS Control Center</span>
            <span>/</span>
            <span className="text-text-primary">Audit & Rollback</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Versions & Safe Rollback History
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Inspect previous content snapshots, audit changelogs, and instantly rollback regressions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="bg-dark-card border border-dark-card-border rounded-lg px-3 py-2 text-xs text-text-primary font-medium"
          >
            <option value="page-home">Home (/) Page</option>
            <option value="page-networks">Networks Page</option>
            <option value="page-guides">Guides Page</option>
            <option value="page-tools">Tools Page</option>
          </select>
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

      {/* Version Timeline */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-dark-card-border pb-4">
          <div className="text-sm font-semibold text-text-primary">
            Revision History for <span className="font-mono text-brand-purple">{selectedPageId}</span>
          </div>
          <span className="text-xs text-text-muted font-mono">{revisions.length} total snapshots</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : revisions.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">
            No revision snapshots recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {revisions.map((rev, idx) => {
              const isLatest = idx === 0;
              return (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isLatest
                      ? "bg-dark-bg/80 border-brand-purple/40 shadow-md"
                      : "bg-dark-bg/40 border-dark-card-border hover:border-dark-card-hover"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary font-mono">
                          v{rev.versionNumber}
                        </span>
                        {isLatest ? (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current Live
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-card text-text-muted border border-dark-card-border">
                            Archived
                          </span>
                        )}
                        <span className="text-xs text-text-muted">by {rev.changedByName}</span>
                      </div>
                      <p className="text-xs text-text-secondary">{rev.changeSummary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted mr-2">
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInspectingRev(rev)}
                        className="h-8 text-xs border-dark-card-border"
                      >
                        Inspect
                      </Button>
                      {!isLatest && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={restoringId === rev.id}
                          onClick={() => handleRestore(rev)}
                          className="h-8 text-xs bg-brand-purple hover:bg-brand-purple/90"
                        >
                          {restoringId === rev.id ? "Restoring..." : "Restore"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Snapshot Modal */}
      {inspectingRev && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-card-border rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Version {inspectingRev.versionNumber} Snapshot
                </h3>
                <span className="text-xs text-text-muted">
                  Recorded at {new Date(inspectingRev.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingRev(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 rounded-lg bg-dark-bg border border-dark-card-border text-xs font-mono text-text-secondary max-h-96 overflow-y-auto">
              {JSON.stringify(inspectingRev.snapshot, null, 2)}
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setInspectingRev(null)}
                className="border-dark-card-border"
              >
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const target = inspectingRev;
                  setInspectingRev(null);
                  handleRestore(target);
                }}
              >
                Restore This Version
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
