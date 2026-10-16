import { MetadataRoute } from "next";
import { getNetworks, getGuides, getOpportunities } from "@/lib/services/data-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nodedrops.xyz";

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
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Dynamic entities
  const [networks, guides, opps] = await Promise.all([
    getNetworks({ limit: 100 }),
    getGuides({ limit: 100 }),
    getOpportunities({ limit: 100 }),
  ]);

  const networkRoutes: MetadataRoute.Sitemap = networks.items.map((n) => ({
    url: `${baseUrl}/networks/${n.slug}`,
    lastModified: new Date(n.lastVerifiedAt),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.items.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(g.lastVerifiedAt),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const opportunityRoutes: MetadataRoute.Sitemap = opps.items.map((o) => ({
    url: `${baseUrl}/opportunities/${o.slug}`,
    lastModified: new Date(o.lastCheckedAt),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  return [...staticRoutes, ...networkRoutes, ...guideRoutes, ...opportunityRoutes];
}
