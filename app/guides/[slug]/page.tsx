import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGuideBySlug, getNetworkBySlug, getAdjacentGuides } from "@/lib/services/data-service";
import { GuideRunbookView } from "@/components/guides/guide-runbook-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) {
    return {
      title: "Runbook Not Found — NodeDrops.xyz",
      description: "The requested node engineering runbook could not be found.",
    };
  }

  return {
    title: `${guide.title} — NodeDrops.xyz Runbooks`,
    description: guide.excerpt,
    openGraph: {
      title: `${guide.title} | NodeDrops.xyz Developer Runbook`,
      description: guide.excerpt,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.lastVerifiedAt,
      authors: [guide.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.excerpt,
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Fetch linked network details if available
  const network = guide.networkSlug ? await getNetworkBySlug(guide.networkSlug) : null;

  // Fetch adjacent guides for continuous documentation flow
  const { prevGuide, nextGuide } = await getAdjacentGuides(guide.slug);

  return (
    <GuideRunbookView
      guide={guide}
      network={network}
      prevGuide={prevGuide}
      nextGuide={nextGuide}
    />
  );
}
