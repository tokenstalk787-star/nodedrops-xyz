import React from "react";
import Link from "next/link";
import { getPages } from "@/lib/services/data-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-purple">
              CMS Control Center
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-xs uppercase tracking-wider text-text-muted">Pages & Sections</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            Website Pages & SEO Manager
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage custom pages, section trees, routing slugs, robots directives, and OpenGraph social cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/builder">
            <Button variant="outline" className="border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              Visual Page Builder
            </Button>
          </Link>
          <Link href="/admin/pages/new">
            <Button variant="default">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-4">
          <div className="text-xs text-text-muted uppercase font-medium">Total Pages</div>
          <div className="text-2xl font-bold text-text-primary mt-1">{pages.length}</div>
          <div className="text-xs text-text-secondary mt-1">Managed via Control Center</div>
        </div>
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-4">
          <div className="text-xs text-text-muted uppercase font-medium">Published Live</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {pages.filter((p) => p.status === "PUBLISHED").length}
          </div>
          <div className="text-xs text-text-secondary mt-1">Publicly indexed & active</div>
        </div>
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-4">
          <div className="text-xs text-text-muted uppercase font-medium">Drafts / In Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {pages.filter((p) => p.status === "DRAFT").length}
          </div>
          <div className="text-xs text-text-secondary mt-1">Unpublished revisions</div>
        </div>
        <div className="bg-dark-card border border-dark-card-border rounded-xl p-4">
          <div className="text-xs text-text-muted uppercase font-medium">Active Sections</div>
          <div className="text-2xl font-bold text-brand-purple mt-1">
            {pages.reduce((acc, p) => acc + (p.sections?.length || 0), 0)}
          </div>
          <div className="text-xs text-text-secondary mt-1">Reusable components wired</div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-dark-card-border flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold text-text-primary">All Configured Pages</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Directives:</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              index, follow
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              noindex
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-bg/60 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-dark-card-border">
              <tr>
                <th className="py-3 px-4">Page Title & Slug</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">SEO Robots</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card-border text-text-secondary">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-dark-card-hover/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-text-primary">{page.title}</div>
                    <div className="text-xs font-mono text-brand-purple mt-0.5">
                      /{page.slug === "home" ? "" : page.slug}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className="text-xs border-dark-card-border text-text-muted">
                      {page.pageType}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-card-border text-text-primary">
                      {page.sections?.length || 0} sections
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {page.noIndex ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          noindex
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          index
                        </span>
                      )}
                      {page.noFollow && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          nofollow
                        </span>
                      )}
                      {page.canonicalUrl && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          canonical
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        page.status === "PUBLISHED"
                          ? "default"
                          : page.status === "DRAFT"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {page.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-text-muted">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/pages/${page.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-brand-purple hover:bg-brand-purple/10">
                          Edit SEO & Settings
                        </Button>
                      </Link>
                      <Link href={`/admin/builder?page=${page.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-dark-card-border hover:bg-dark-card-hover">
                          Builder
                        </Button>
                      </Link>
                      <a
                        href={page.slug === "home" ? "/" : `/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-muted hover:text-text-primary p-1.5 transition-colors"
                        title="View Live Page"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
