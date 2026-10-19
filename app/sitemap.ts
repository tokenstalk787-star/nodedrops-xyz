import { MetadataRoute } from "next";
import { getNetworks, getGuides, getOpportunities } from "@/lib/services/data-service";

// Har 12 ghante baad sitemap cache revalidate hoga (Google Bot ko instant response milega)
export const revalidate = 43200;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nodedrops.xyz";

  // Safe date parser: ISO standard me return karta hai
  const safeDate = (dateVal: any): Date => {
    if (!dateVal) return new Date();
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // Safe URL encoder (XML validation errors se bachata hai)
  const sanitizeUrl = (url: string): string => {
    return encodeURI(url.trim());
  };

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/networks`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/opportunities`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/hardware-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/command-builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/checklist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/troubleshooting`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    // Dynamic entities fetch
    const [networks, guides, opps] = await Promise.all([
      getNetworks({ limit: 100 }).catch(() => ({ items: [] })),
      getGuides({ limit: 100 }).catch(() => ({ items: [] })),
      getOpportunities({ limit: 100 }).catch(() => ({ items: [] })),
    ]);

    const networkRoutes: MetadataRoute.Sitemap = ((networks as any)?.items || [])
      .filter((n: any) => Boolean(n?.slug))
      .map((n: any) => ({
        url: sanitizeUrl(`${baseUrl}/networks/${n.slug}`),
        lastModified: safeDate(n.lastVerifiedAt || n.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));

    const guideRoutes: MetadataRoute.Sitemap = ((guides as any)?.items || [])
      .filter((g: any) => Boolean(g?.slug))
      .map((g: any) => ({
        url: sanitizeUrl(`${baseUrl}/guides/${g.slug}`),
        lastModified: safeDate(g.lastVerifiedAt || g.publishedAt || g.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));

    const opportunityRoutes: MetadataRoute.Sitemap = ((opps as any)?.items || [])
      .filter((o: any) => Boolean(o?.slug))
      .map((o: any) => ({
        url: sanitizeUrl(`${baseUrl}/opportunities/${o.slug}`),
        lastModified: safeDate(o.lastCheckedAt || o.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.75,
      }));

    return [...staticRoutes, ...networkRoutes, ...guideRoutes, ...opportunityRoutes];
  } catch (err) {
    console.error("Failed to generate dynamic sitemap routes, fallback to static:", err);
    return staticRoutes;
  }
}