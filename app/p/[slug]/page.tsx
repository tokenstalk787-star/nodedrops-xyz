import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, getNetworks, getGuides, getOpportunities } from "@/lib/services/data-service";
import { PageRenderer } from "@/components/builder/page-renderer";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found | NodeDrops.xyz" };
  }

  return {
    title: page.seoTitle || `${page.title} | NodeDrops.xyz`,
    description: page.seoDescription || "Custom page on NodeDrops.xyz",
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    robots: {
      index: !page.noIndex,
      follow: !page.noFollow,
    },
  };
}

export default async function CustomCmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const [networksRes, guidesRes, oppsRes] = await Promise.all([
    getNetworks({ limit: 8 }),
    getGuides({ limit: 6 }),
    getOpportunities({ limit: 6 }),
  ]);

  return (
    <div className="min-h-screen text-text-primary selection:bg-brand-purple/40">
      {/* Draft notice banner if unpublished */}
      {page.status === "DRAFT" && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 text-xs py-2 px-4 text-center font-mono flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DRAFT PREVIEW MODE — This CMS page is not yet published to public search indexes.</span>
          <Link href={`/admin/builder?pageId=${page.id}`} className="underline font-bold ml-1">
            Open in Builder &rarr;
          </Link>
        </div>
      )}

      {/* Dynamic Sections from Page Builder */}
      <main>
        <PageRenderer
          sections={page.sections || []}
          networks={networksRes.items}
          guides={guidesRes.items}
          opportunities={oppsRes.items}
        />
      </main>
    </div>
  );
}
