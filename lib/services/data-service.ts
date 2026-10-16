import { prisma, isDatabaseConnected } from "../db/prisma";
import {
  SEED_NETWORKS,
  SEED_GUIDES,
  SEED_OPPORTUNITIES,
  SEED_TROUBLESHOOTING,
  SEED_COMMAND_TEMPLATES,
  SEED_THEME,
  SEED_NAV_HEADER,
  SEED_NAV_FOOTER,
  SEED_PAGES,
  SEED_MEDIA,
  SEED_REDIRECTS,
  SEED_REVISIONS,
  NetworkItem,
  GuideItem,
  OpportunityItem,
  TroubleshootingItem,
  CommandTemplateItem,
  CustomPageItem,
  NavigationMenuItem,
  ThemeConfigItem,
  MediaAssetItem,
  RedirectRuleItem,
  PageRevisionItem,
} from "./mock-data";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  isDbBacked: boolean;
}

/**
 * Get all networks with search and filtering
 */
export async function getNetworks(params: {
  search?: string;
  type?: "MAINNET" | "TESTNET";
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<NetworkItem>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 12));
  const hasDb = await isDatabaseConnected();

  if (hasDb) {
    try {
      const where: Record<string, unknown> = {};
      if (params.type) {
        where.networkType = params.type;
      }
      if (params.search) {
        where.OR = [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ];
      }

      const [total, items] = await Promise.all([
        prisma.network.count({ where }),
        prisma.network.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { name: "asc" },
        }),
      ]);

      if (total > 0) {
        const mapped: NetworkItem[] = items.map((net) => ({
          id: net.id,
          name: net.name,
          slug: net.slug,
          description: net.description,
          networkType: net.networkType as "MAINNET" | "TESTNET",
          chainId: net.chainId || undefined,
          officialUrl: net.officialUrl,
          documentationUrl: net.documentationUrl,
          nodeTypes: net.nodeTypes,
          hardwareRequirements: JSON.parse(net.hardwareRequirements),
          status: net.status as "ACTIVE" | "UPCOMING" | "DEPRECATED",
          lastVerifiedAt: net.lastVerifiedAt?.toISOString() || new Date().toISOString(),
        }));

        return {
          items: mapped,
          total,
          page,
          totalPages: Math.ceil(total / limit),
          isDbBacked: true,
        };
      }
    } catch (e) {
      console.warn("DB query error in getNetworks, using fallback:", e);
    }
  }

  let filtered = [...SEED_NETWORKS];
  if (params.type) {
    filtered = filtered.filter((n) => n.networkType === params.type);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (n) => n.name.toLowerCase().includes(s) || n.description.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    isDbBacked: false,
  };
}

/**
 * Get a single network by slug
 */
export async function getNetworkBySlug(slug: string): Promise<NetworkItem | null> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const net = await prisma.network.findUnique({
        where: { slug },
      });
      if (net) {
        return {
          id: net.id,
          name: net.name,
          slug: net.slug,
          description: net.description,
          networkType: net.networkType as "MAINNET" | "TESTNET",
          chainId: net.chainId || undefined,
          officialUrl: net.officialUrl,
          documentationUrl: net.documentationUrl,
          nodeTypes: net.nodeTypes,
          hardwareRequirements: JSON.parse(net.hardwareRequirements),
          status: net.status as "ACTIVE" | "UPCOMING" | "DEPRECATED",
          lastVerifiedAt: net.lastVerifiedAt?.toISOString() || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("DB query error in getNetworkBySlug:", e);
    }
  }

  const fallback = SEED_NETWORKS.find((n) => n.slug === slug);
  return fallback || null;
}

/**
 * Get guides with filtering, pagination and search
 */
export async function getGuides(params: {
  search?: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  networkSlug?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<GuideItem>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 9));
  const hasDb = await isDatabaseConnected();

  if (hasDb) {
    try {
      const where: Record<string, unknown> = {
        status: "PUBLISHED",
      };
      if (params.difficulty) {
        where.difficulty = params.difficulty;
      }
      if (params.search) {
        where.OR = [
          { title: { contains: params.search } },
          { excerpt: { contains: params.search } },
        ];
      }

      const [total, items] = await Promise.all([
        prisma.guide.count({ where }),
        prisma.guide.findMany({
          where,
          include: {
            author: { select: { name: true } },
            reviewer: { select: { name: true } },
            category: { select: { name: true } },
            tags: { include: { tag: true } },
            steps: { orderBy: { orderIndex: "asc" } },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { publishedAt: "desc" },
        }),
      ]);

      if (total > 0) {
        const mapped: GuideItem[] = items.map((g) => ({
          id: g.id,
          title: g.title,
          slug: g.slug,
          excerpt: g.excerpt,
          content: g.content,
          status: g.status as "PUBLISHED",
          difficulty: g.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
          estimatedMinutes: g.estimatedMinutes,
          authorName: g.author.name || "NodeDrops Contributor",
          reviewerName: g.reviewer?.name || undefined,
          publishedAt: g.publishedAt?.toISOString() || g.createdAt.toISOString(),
          lastVerifiedAt: g.lastVerifiedAt?.toISOString() || g.updatedAt.toISOString(),
          category: g.category?.name || "General Node Ops",
          tags: g.tags.map((t) => t.tag.name),
          steps: g.steps.map((s) => ({
            orderIndex: s.orderIndex,
            title: s.title,
            explanation: s.explanation,
            command: s.command || undefined,
            expectedOutput: s.expectedOutput || undefined,
            warning: s.warning || undefined,
            verificationInstructions: s.verificationInstructions || undefined,
          })),
        }));

        return {
          items: mapped,
          total,
          page,
          totalPages: Math.ceil(total / limit),
          isDbBacked: true,
        };
      }
    } catch (e) {
      console.warn("DB query error in getGuides:", e);
    }
  }

  let filtered = SEED_GUIDES.filter((g) => g.status === "PUBLISHED");
  if (params.difficulty) {
    filtered = filtered.filter((g) => g.difficulty === params.difficulty);
  }
  if (params.networkSlug) {
    filtered = filtered.filter((g) => g.networkSlug === params.networkSlug);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(s) ||
        g.excerpt.toLowerCase().includes(s) ||
        g.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    isDbBacked: false,
  };
}

/**
 * Get a single guide by slug
 */
export async function getGuideBySlug(slug: string): Promise<GuideItem | null> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const g = await prisma.guide.findUnique({
        where: { slug },
        include: {
          author: { select: { name: true } },
          reviewer: { select: { name: true } },
          category: { select: { name: true } },
          tags: { include: { tag: true } },
          steps: { orderBy: { orderIndex: "asc" } },
        },
      });

      if (g) {
        return {
          id: g.id,
          title: g.title,
          slug: g.slug,
          excerpt: g.excerpt,
          content: g.content,
          status: g.status as "PUBLISHED" | "DRAFT" | "ARCHIVED",
          difficulty: g.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
          estimatedMinutes: g.estimatedMinutes,
          authorName: g.author.name || "NodeDrops Contributor",
          reviewerName: g.reviewer?.name || undefined,
          publishedAt: g.publishedAt?.toISOString() || g.createdAt.toISOString(),
          lastVerifiedAt: g.lastVerifiedAt?.toISOString() || g.updatedAt.toISOString(),
          category: g.category?.name || "General Node Ops",
          tags: g.tags.map((t) => t.tag.name),
          steps: g.steps.map((s) => ({
            orderIndex: s.orderIndex,
            title: s.title,
            explanation: s.explanation,
            command: s.command || undefined,
            expectedOutput: s.expectedOutput || undefined,
            warning: s.warning || undefined,
            verificationInstructions: s.verificationInstructions || undefined,
          })),
        };
      }
    } catch (e) {
      console.warn("DB query error in getGuideBySlug:", e);
    }
  }

  const fallback = SEED_GUIDES.find((g) => g.slug === slug);
  return fallback || null;
}

/**
 * Get opportunities with status filter and pagination
 */
export async function getOpportunities(params: {
  search?: string;
  status?: string;
  rewardStatus?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<OpportunityItem>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 9));
  const hasDb = await isDatabaseConnected();

  if (hasDb) {
    try {
      const where: Record<string, unknown> = {};
      if (params.status && params.status !== "ALL") {
        where.campaignStatus = params.status;
      }
      if (params.rewardStatus && params.rewardStatus !== "ALL") {
        where.rewardStatus = params.rewardStatus;
      }
      if (params.search) {
        where.OR = [
          { projectName: { contains: params.search } },
          { description: { contains: params.search } },
        ];
      }

      const [total, items] = await Promise.all([
        prisma.opportunity.count({ where }),
        prisma.opportunity.findMany({
          where,
          include: { network: { select: { slug: true } } },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      if (total > 0) {
        const mapped: OpportunityItem[] = items.map((opp) => ({
          id: opp.id,
          projectName: opp.projectName,
          slug: opp.slug,
          description: opp.description,
          campaignType: opp.campaignType,
          networkSlug: opp.network?.slug,
          officialAnnouncementUrl: opp.officialAnnouncementUrl,
          officialDocumentationUrl: opp.officialDocumentationUrl,
          startsAt: opp.startsAt?.toISOString(),
          endsAt: opp.endsAt?.toISOString(),
          eligibility: opp.eligibility,
          rewardStatus: opp.rewardStatus as "CONFIRMED" | "POTENTIAL" | "NONE" | "UNKNOWN",
          campaignStatus: opp.campaignStatus as "UPCOMING" | "ACTIVE" | "ENDED" | "PAUSED" | "UNVERIFIED",
          verificationStatus: opp.verificationStatus as "VERIFIED" | "RESEARCH_ONLY" | "UNVERIFIED",
          lastCheckedAt: opp.lastCheckedAt?.toISOString() || opp.updatedAt.toISOString(),
        }));

        return {
          items: mapped,
          total,
          page,
          totalPages: Math.ceil(total / limit),
          isDbBacked: true,
        };
      }
    } catch (e) {
      console.warn("DB query error in getOpportunities:", e);
    }
  }

  let filtered = [...SEED_OPPORTUNITIES];
  if (params.status && params.status !== "ALL") {
    filtered = filtered.filter((o) => o.campaignStatus === params.status);
  }
  if (params.rewardStatus && params.rewardStatus !== "ALL") {
    filtered = filtered.filter((o) => o.rewardStatus === params.rewardStatus);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (o) => o.projectName.toLowerCase().includes(s) || o.description.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    isDbBacked: false,
  };
}

export async function getOpportunityBySlug(slug: string): Promise<OpportunityItem | null> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const opp = await prisma.opportunity.findUnique({
        where: { slug },
        include: { network: { select: { slug: true } } },
      });
      if (opp) {
        return {
          id: opp.id,
          projectName: opp.projectName,
          slug: opp.slug,
          description: opp.description,
          campaignType: opp.campaignType,
          networkSlug: opp.network?.slug,
          officialAnnouncementUrl: opp.officialAnnouncementUrl,
          officialDocumentationUrl: opp.officialDocumentationUrl,
          startsAt: opp.startsAt?.toISOString(),
          endsAt: opp.endsAt?.toISOString(),
          eligibility: opp.eligibility,
          rewardStatus: opp.rewardStatus as "CONFIRMED" | "POTENTIAL" | "NONE" | "UNKNOWN",
          campaignStatus: opp.campaignStatus as "UPCOMING" | "ACTIVE" | "ENDED" | "PAUSED" | "UNVERIFIED",
          verificationStatus: opp.verificationStatus as "VERIFIED" | "RESEARCH_ONLY" | "UNVERIFIED",
          lastCheckedAt: opp.lastCheckedAt?.toISOString() || opp.updatedAt.toISOString(),
        };
      }
    } catch (e) {
      console.warn("DB query error in getOpportunityBySlug:", e);
    }
  }

  return SEED_OPPORTUNITIES.find((o) => o.slug === slug) || null;
}

export async function getTroubleshooting(params: { search?: string }): Promise<TroubleshootingItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const where: Record<string, unknown> = {};
      if (params.search) {
        where.OR = [
          { title: { contains: params.search } },
          { symptoms: { contains: params.search } },
          { likelyCauses: { contains: params.search } },
        ];
      }
      const items = await prisma.troubleshootingSolution.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      });
      if (items.length > 0) {
        return items.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          symptoms: t.symptoms,
          likelyCauses: t.likelyCauses,
          diagnosticCommands: t.diagnosticCommands,
          correctiveSteps: t.correctiveSteps,
          riskWarnings: t.riskWarnings || undefined,
          verificationInstructions: t.verificationInstructions,
          sourceReferences: t.sourceReferences || undefined,
          tags: t.tags ? t.tags.split(",").map((s) => s.trim()) : [],
        }));
      }
    } catch (e) {
      console.warn("DB query error in getTroubleshooting:", e);
    }
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    return SEED_TROUBLESHOOTING.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.symptoms.toLowerCase().includes(s) ||
        t.likelyCauses.toLowerCase().includes(s) ||
        t.tags.some((tag) => tag.toLowerCase().includes(s))
    );
  }

  return SEED_TROUBLESHOOTING;
}

export async function evaluateHardware(input: {
  networkSlug: string;
  nodeType: string;
  cpuCores: number;
  ramGb: number;
  ssdGb: number;
  bandwidthMbps: number;
  operatingSystem: string;
}) {
  const network = await getNetworkBySlug(input.networkSlug);
  if (!network) {
    return {
      status: "INSUFFICIENT_INFORMATION" as const,
      message: "Target network specifications could not be verified in the database.",
      details: [],
      notes: "Please refer to official documentation.",
    };
  }

  const { min, recommended, notes } = network.hardwareRequirements;
  const checks = [
    {
      component: "CPU Cores",
      provided: input.cpuCores,
      min: min.cpuCores,
      recommended: recommended.cpuCores,
      meetsMin: input.cpuCores >= min.cpuCores,
      meetsRecommended: input.cpuCores >= recommended.cpuCores,
      unit: "Cores",
    },
    {
      component: "System RAM",
      provided: input.ramGb,
      min: min.ramGb,
      recommended: recommended.ramGb,
      meetsMin: input.ramGb >= min.ramGb,
      meetsRecommended: input.ramGb >= recommended.ramGb,
      unit: "GB",
    },
    {
      component: "Storage (SSD/NVMe)",
      provided: input.ssdGb,
      min: min.ssdGb,
      recommended: recommended.ssdGb,
      meetsMin: input.ssdGb >= min.ssdGb,
      meetsRecommended: input.ssdGb >= recommended.ssdGb,
      unit: "GB",
    },
    {
      component: "Network Bandwidth",
      provided: input.bandwidthMbps,
      min: min.bandwidthMbps,
      recommended: recommended.bandwidthMbps,
      meetsMin: input.bandwidthMbps >= min.bandwidthMbps,
      meetsRecommended: input.bandwidthMbps >= recommended.bandwidthMbps,
      unit: "Mbps",
    },
  ];

  const failsMin = checks.some((c) => !c.meetsMin);
  const meetsAllRecommended = checks.every((c) => c.meetsRecommended);

  let status: "MEETS_RECOMMENDED" | "MEETS_MINIMUM" | "BELOW_MINIMUM";
  let message: string;

  if (failsMin) {
    status = "BELOW_MINIMUM";
    message = `Your hardware falls below the minimum required specs for running a ${input.nodeType} on ${network.name}. You may experience state desync or missed blocks.`;
  } else if (meetsAllRecommended) {
    status = "MEETS_RECOMMENDED";
    message = `Your hardware exceeds the recommended specifications for ${network.name} ${input.nodeType}. It is well-suited for stable production operation.`;
  } else {
    status = "MEETS_MINIMUM";
    message = `Your hardware satisfies minimum requirements for ${network.name} ${input.nodeType}, but falls below recommended specs. Heavy block traffic may stress resources.`;
  }

  return {
    status,
    message,
    networkName: network.name,
    officialUrl: network.documentationUrl,
    details: checks,
    notes,
  };
}

export async function getCommandTemplates(networkSlug?: string): Promise<CommandTemplateItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const where: Record<string, unknown> = { status: "PUBLISHED" };
      if (networkSlug) {
        where.network = { slug: networkSlug };
      }
      const templates = await prisma.commandTemplate.findMany({
        where,
        include: { network: { select: { slug: true } } },
      });
      if (templates.length > 0) {
        return templates.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          networkSlug: t.network.slug,
          client: t.client,
          operatingSystem: t.operatingSystem,
          installationMethod: t.installationMethod as "Docker" | "Systemd" | "Binary",
          version: t.version,
          templateContent: t.templateContent,
          validationNotes: t.validationNotes || "",
          riskLevel: t.riskLevel as "SAFE" | "CAUTION" | "DESTRUCTIVE",
          lastVerifiedAt: t.lastVerifiedAt?.toISOString() || t.updatedAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("DB query error in getCommandTemplates:", e);
    }
  }

  if (networkSlug) {
    return SEED_COMMAND_TEMPLATES.filter((t) => t.networkSlug === networkSlug);
  }
  return SEED_COMMAND_TEMPLATES;
}

export async function searchAll(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { guides: [], networks: [], opportunities: [], troubleshooting: [] };
  }

  const [guidesRes, networksRes, oppsRes, trouble] = await Promise.all([
    getGuides({ search: q, limit: 5 }),
    getNetworks({ search: q, limit: 5 }),
    getOpportunities({ search: q, limit: 5 }),
    getTroubleshooting({ search: q }),
  ]);

  return {
    guides: guidesRes.items,
    networks: networksRes.items,
    opportunities: oppsRes.items,
    troubleshooting: trouble.slice(0, 5),
  };
}

export async function getAdminMetrics() {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const [
        totalGuides,
        publishedGuides,
        draftGuides,
        totalNetworks,
        activeOpportunities,
        expiredOpportunities,
        recentLogs,
      ] = await Promise.all([
        prisma.guide.count(),
        prisma.guide.count({ where: { status: "PUBLISHED" } }),
        prisma.guide.count({ where: { status: "DRAFT" } }),
        prisma.network.count({ where: { status: "ACTIVE" } }),
        prisma.opportunity.count({ where: { campaignStatus: "ACTIVE" } }),
        prisma.opportunity.count({ where: { campaignStatus: "ENDED" } }),
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { actor: { select: { email: true, name: true } } },
        }),
      ]);

      return {
        isDbConnected: true,
        totalGuides,
        publishedGuides,
        draftGuides,
        totalNetworks,
        activeOpportunities,
        expiredOpportunities,
        recentLogs: recentLogs.map((l) => ({
          id: l.id,
          action: l.action,
          targetType: l.targetType,
          targetId: l.targetId,
          actor: l.actor?.name || l.actor?.email || "System",
          createdAt: l.createdAt.toISOString(),
        })),
      };
    } catch (e) {
      console.warn("DB query error in getAdminMetrics:", e);
    }
  }

  return {
    isDbConnected: false,
    totalGuides: SEED_GUIDES.length,
    publishedGuides: SEED_GUIDES.filter((g) => g.status === "PUBLISHED").length,
    draftGuides: SEED_GUIDES.filter((g) => g.status === "DRAFT").length,
    totalNetworks: SEED_NETWORKS.length,
    activeOpportunities: SEED_OPPORTUNITIES.filter((o) => o.campaignStatus === "ACTIVE").length,
    expiredOpportunities: SEED_OPPORTUNITIES.filter((o) => o.campaignStatus === "ENDED").length,
    recentLogs: [
      {
        id: "log-seed-1",
        action: "SYSTEM_BOOTSTRAP",
        targetType: "DATABASE",
        targetId: "local",
        actor: "Bootstrap Initializer",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

// ----------------------------------------------------
// CMS Data Service Methods
// ----------------------------------------------------

/**
 * Get all CMS custom pages
 */
export async function getPages(): Promise<CustomPageItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const pages = await prisma.customPage.findMany({
        orderBy: { updatedAt: "desc" },
        include: { sections: { orderBy: { orderIndex: "asc" } } },
      });
      if (pages.length > 0) {
        return pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          pageType: p.pageType as any,
          status: p.status as any,
          seoTitle: p.seoTitle || undefined,
          seoDescription: p.seoDescription || undefined,
          canonicalUrl: p.canonicalUrl || undefined,
          ogImage: p.ogImage || undefined,
          noIndex: p.noIndex,
          noFollow: p.noFollow,
          noSnippet: p.noSnippet,
          noArchive: p.noArchive,
          publishedAt: p.publishedAt?.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          sections: p.sections.map((s) => ({
            id: s.id,
            componentType: s.componentType as any,
            orderIndex: s.orderIndex,
            config: JSON.parse(s.config),
            isVisible: s.isVisible,
          })),
        }));
      }
    } catch (e) {
      console.warn("DB query error in getPages:", e);
    }
  }

  return SEED_PAGES;
}

/**
 * Get a specific page by slug
 */
export async function getPageBySlug(slug: string): Promise<CustomPageItem | null> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const p = await prisma.customPage.findUnique({
        where: { slug },
        include: { sections: { orderBy: { orderIndex: "asc" } } },
      });
      if (p) {
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          pageType: p.pageType as any,
          status: p.status as any,
          seoTitle: p.seoTitle || undefined,
          seoDescription: p.seoDescription || undefined,
          canonicalUrl: p.canonicalUrl || undefined,
          ogImage: p.ogImage || undefined,
          noIndex: p.noIndex,
          noFollow: p.noFollow,
          noSnippet: p.noSnippet,
          noArchive: p.noArchive,
          publishedAt: p.publishedAt?.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          sections: p.sections.map((s) => ({
            id: s.id,
            componentType: s.componentType as any,
            orderIndex: s.orderIndex,
            config: JSON.parse(s.config),
            isVisible: s.isVisible,
          })),
        };
      }
    } catch (e) {
      console.warn("DB query error in getPageBySlug:", e);
    }
  }

  return SEED_PAGES.find((p) => p.slug === slug) || null;
}

/**
 * Get Navigation menu by location
 */
export async function getNavigationMenu(location: "HEADER" | "FOOTER"): Promise<NavigationMenuItem> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const menu = await prisma.navigationMenu.findUnique({
        where: { location },
        include: { items: { orderBy: { orderIndex: "asc" } } },
      });
      if (menu) {
        return {
          id: menu.id,
          location: menu.location as "HEADER" | "FOOTER",
          title: menu.title,
          logoUrl: menu.logoUrl || undefined,
          logoText: menu.logoText || undefined,
          showAnnouncement: menu.showAnnouncement,
          announcementText: menu.announcementText || undefined,
          announcementLink: menu.announcementLink || undefined,
          items: menu.items.map((i) => ({
            id: i.id,
            label: i.label,
            link: i.link,
            orderIndex: i.orderIndex,
            isEnabled: i.isEnabled,
            isExternal: i.isExternal,
            columnName: i.columnName || undefined,
          })),
        };
      }
    } catch (e) {
      console.warn("DB query error in getNavigationMenu:", e);
    }
  }

  return location === "HEADER" ? SEED_NAV_HEADER : SEED_NAV_FOOTER;
}

/**
 * Get Theme configuration
 */
export async function getThemeConfig(): Promise<ThemeConfigItem> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const theme = await prisma.themeConfig.findUnique({
        where: { id: "global-theme" },
      });
      if (theme) {
        return {
          presetName: theme.presetName,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          cardBackground: theme.cardBackground,
          accentCyan: theme.accentCyan,
          accentBlue: theme.accentBlue,
          fontFamily: theme.fontFamily,
          borderRadius: theme.borderRadius,
        };
      }
    } catch (e) {
      console.warn("DB query error in getThemeConfig:", e);
    }
  }

  return SEED_THEME;
}

/**
 * Get Media Library assets
 */
export async function getMediaAssets(category?: string): Promise<MediaAssetItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const where: Record<string, unknown> = {};
      if (category && category !== "all") {
        where.category = category;
      }
      const assets = await prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      if (assets.length > 0) {
        return assets.map((a) => ({
          id: a.id,
          filename: a.filename,
          url: a.url,
          fileType: a.fileType,
          fileSizeKb: a.fileSizeKb,
          dimensions: a.dimensions || undefined,
          altText: a.altText || undefined,
          category: a.category as any,
          createdAt: a.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("DB query error in getMediaAssets:", e);
    }
  }

  if (category && category !== "all") {
    return SEED_MEDIA.filter((m) => m.category === category);
  }
  return SEED_MEDIA;
}

/**
 * Get 301/302 Redirect Rules
 */
export async function getRedirectRules(): Promise<RedirectRuleItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const rules = await prisma.redirectRule.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (rules.length > 0) {
        return rules.map((r) => ({
          id: r.id,
          sourcePath: r.sourcePath,
          targetPath: r.targetPath,
          statusCode: r.statusCode,
          isActive: r.isActive,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("DB query error in getRedirectRules:", e);
    }
  }

  return SEED_REDIRECTS;
}

/**
 * Get Page Revisions for Version History & Rollback
 */
export async function getPageRevisions(pageId: string): Promise<PageRevisionItem[]> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const revs = await prisma.pageRevision.findMany({
        where: { pageId },
        orderBy: { versionNumber: "desc" },
        include: { changedBy: { select: { name: true, email: true } } },
      });
      if (revs.length > 0) {
        return revs.map((r) => ({
          id: r.id,
          pageId: r.pageId,
          versionNumber: r.versionNumber,
          snapshot: JSON.parse(r.snapshot),
          changedByName: r.changedBy.name || r.changedBy.email,
          changeSummary: r.changeSummary || "Revision update",
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("DB query error in getPageRevisions:", e);
    }
  }

  return SEED_REVISIONS;
}

/**
 * Save or update a Custom CMS Page with sections and revision history
 */
export async function savePage(
  data: Partial<CustomPageItem> & { title: string; slug: string },
  userId?: string
): Promise<{ success: boolean; id: string; error?: string }> {
  const hasDb = await isDatabaseConnected();
  const pageId = data.id || `page-${Date.now()}`;

  if (hasDb) {
    try {
      const existing = data.id
        ? await prisma.customPage.findUnique({ where: { id: data.id } })
        : await prisma.customPage.findUnique({ where: { slug: data.slug } });

      const sectionsJson = JSON.stringify(data.sections || []);
      let savedPageId = data.id;

      if (existing) {
        savedPageId = existing.id;
        await prisma.customPage.update({
          where: { id: existing.id },
          data: {
            title: data.title,
            slug: data.slug,
            pageType: data.pageType || existing.pageType,
            status: data.status || existing.status,
            draftConfig: sectionsJson,
            publishedConfig: data.status === "PUBLISHED" ? sectionsJson : existing.publishedConfig,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            canonicalUrl: data.canonicalUrl,
            ogImage: data.ogImage,
            noIndex: data.noIndex ?? existing.noIndex,
            noFollow: data.noFollow ?? existing.noFollow,
            noSnippet: data.noSnippet ?? existing.noSnippet,
            noArchive: data.noArchive ?? existing.noArchive,
            publishedAt: data.status === "PUBLISHED" ? new Date() : existing.publishedAt,
          },
        });

        // Recreate sections if provided
        if (data.sections && data.sections.length > 0) {
          await prisma.pageSection.deleteMany({ where: { pageId: existing.id } });
          await prisma.pageSection.createMany({
            data: data.sections.map((s, idx) => ({
              id: s.id || `sec-${Date.now()}-${idx}`,
              pageId: existing.id,
              componentType: s.componentType,
              orderIndex: s.orderIndex ?? idx,
              config: JSON.stringify(s.config || {}),
              isVisible: s.isVisible ?? true,
            })),
          });
        }
      } else {
        const created = await prisma.customPage.create({
          data: {
            id: pageId,
            title: data.title,
            slug: data.slug,
            pageType: data.pageType || "CUSTOM",
            status: data.status || "DRAFT",
            draftConfig: sectionsJson,
            publishedConfig: data.status === "PUBLISHED" ? sectionsJson : null,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            canonicalUrl: data.canonicalUrl,
            ogImage: data.ogImage,
            noIndex: data.noIndex ?? false,
            noFollow: data.noFollow ?? false,
            noSnippet: data.noSnippet ?? false,
            noArchive: data.noArchive ?? false,
            publishedAt: data.status === "PUBLISHED" ? new Date() : null,
            sections: {
              create: (data.sections || []).map((s, idx) => ({
                id: s.id || `sec-${Date.now()}-${idx}`,
                componentType: s.componentType,
                orderIndex: s.orderIndex ?? idx,
                config: JSON.stringify(s.config || {}),
                isVisible: s.isVisible ?? true,
              })),
            },
          },
        });
        savedPageId = created.id;
      }

      // Record page revision snapshot if user provided
      if (userId && savedPageId) {
        const count = await prisma.pageRevision.count({ where: { pageId: savedPageId } });
        await prisma.pageRevision.create({
          data: {
            pageId: savedPageId,
            versionNumber: count + 1,
            snapshot: sectionsJson,
            changedById: userId,
            changeSummary: `Updated page ${data.title} (${data.status || "DRAFT"})`,
          },
        });
      }

      return { success: true, id: savedPageId! };
    } catch (e: any) {
      console.warn("DB savePage error, applying mock fallback:", e);
      return { success: false, id: pageId, error: e.message };
    }
  }

  // In-memory fallback
  const idx = SEED_PAGES.findIndex((p) => p.id === data.id || p.slug === data.slug);
  const updatedPage: CustomPageItem = {
    id: data.id || pageId,
    title: data.title,
    slug: data.slug,
    pageType: data.pageType || "CUSTOM",
    status: data.status || "DRAFT",
    sections: data.sections || [],
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    canonicalUrl: data.canonicalUrl,
    ogImage: data.ogImage,
    noIndex: data.noIndex ?? false,
    noFollow: data.noFollow ?? false,
    noSnippet: data.noSnippet ?? false,
    noArchive: data.noArchive ?? false,
    publishedAt: data.status === "PUBLISHED" ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    SEED_PAGES[idx] = updatedPage;
  } else {
    SEED_PAGES.push(updatedPage);
  }

  return { success: true, id: updatedPage.id };
}

/**
 * Delete a custom page
 */
export async function deletePage(pageId: string): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      await prisma.customPage.delete({ where: { id: pageId } });
      return { success: true };
    } catch (e: any) {
      console.warn("DB deletePage error:", e);
      return { success: false, error: e.message };
    }
  }
  const idx = SEED_PAGES.findIndex((p) => p.id === pageId);
  if (idx >= 0) {
    SEED_PAGES.splice(idx, 1);
  }
  return { success: true };
}

/**
 * Save Navigation Menu (Header or Footer)
 */
export async function saveNavigationMenu(
  location: "HEADER" | "FOOTER",
  data: {
    title?: string;
    logoUrl?: string;
    logoText?: string;
    showAnnouncement?: boolean;
    announcementText?: string;
    announcementLink?: string;
    items: Array<{
      id?: string;
      label: string;
      link: string;
      orderIndex: number;
      isEnabled: boolean;
      isExternal: boolean;
      columnName?: string;
    }>;
  }
): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const menu = await prisma.navigationMenu.upsert({
        where: { location },
        update: {
          title: data.title || (location === "HEADER" ? "Primary Navigation" : "Footer Navigation"),
          logoUrl: data.logoUrl,
          logoText: data.logoText,
          showAnnouncement: data.showAnnouncement ?? false,
          announcementText: data.announcementText,
          announcementLink: data.announcementLink,
        },
        create: {
          location,
          title: data.title || (location === "HEADER" ? "Primary Navigation" : "Footer Navigation"),
          logoUrl: data.logoUrl,
          logoText: data.logoText,
          showAnnouncement: data.showAnnouncement ?? false,
          announcementText: data.announcementText,
          announcementLink: data.announcementLink,
        },
      });

      // Recreate items
      await prisma.navigationItem.deleteMany({ where: { menuId: menu.id } });
      if (data.items && data.items.length > 0) {
        await prisma.navigationItem.createMany({
          data: data.items.map((item, idx) => ({
            id: item.id || `nav-item-${Date.now()}-${idx}`,
            menuId: menu.id,
            label: item.label,
            link: item.link,
            orderIndex: item.orderIndex ?? idx,
            isEnabled: item.isEnabled ?? true,
            isExternal: item.isExternal ?? false,
            columnName: item.columnName,
          })),
        });
      }

      return { success: true };
    } catch (e: any) {
      console.warn("DB saveNavigationMenu error:", e);
      return { success: false, error: e.message };
    }
  }

  // In-memory update
  const target = location === "HEADER" ? SEED_NAV_HEADER : SEED_NAV_FOOTER;
  if (data.logoText !== undefined) target.logoText = data.logoText;
  if (data.logoUrl !== undefined) target.logoUrl = data.logoUrl;
  if (data.showAnnouncement !== undefined) target.showAnnouncement = data.showAnnouncement;
  if (data.announcementText !== undefined) target.announcementText = data.announcementText;
  if (data.announcementLink !== undefined) target.announcementLink = data.announcementLink;
  target.items = data.items.map((i, idx) => ({
    id: i.id || `nav-${Date.now()}-${idx}`,
    label: i.label,
    link: i.link,
    orderIndex: i.orderIndex ?? idx,
    isEnabled: i.isEnabled ?? true,
    isExternal: i.isExternal ?? false,
    columnName: i.columnName,
  }));

  return { success: true };
}

/**
 * Save Theme tokens
 */
export async function saveThemeConfig(
  theme: Partial<ThemeConfigItem>
): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      await prisma.themeConfig.upsert({
        where: { id: "global-theme" },
        update: {
          presetName: theme.presetName,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          cardBackground: theme.cardBackground,
          accentCyan: theme.accentCyan,
          accentBlue: theme.accentBlue,
          fontFamily: theme.fontFamily,
          borderRadius: theme.borderRadius,
        },
        create: {
          id: "global-theme",
          presetName: theme.presetName || "Violet Bloom",
          primaryColor: theme.primaryColor || "#8B5CF6",
          secondaryColor: theme.secondaryColor || "#101525",
          cardBackground: theme.cardBackground || "#141B2D",
          accentCyan: theme.accentCyan || "#06B6D4",
          accentBlue: theme.accentBlue || "#3B82F6",
          fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
          borderRadius: theme.borderRadius || "0.75rem",
        },
      });
      return { success: true };
    } catch (e: any) {
      console.warn("DB saveThemeConfig error:", e);
      return { success: false, error: e.message };
    }
  }

  Object.assign(SEED_THEME, theme);
  return { success: true };
}

/**
 * Add a new media asset
 */
export async function addMediaAsset(
  asset: Omit<MediaAssetItem, "id" | "createdAt">,
  userId?: string
): Promise<{ success: boolean; id: string; error?: string }> {
  const hasDb = await isDatabaseConnected();
  const id = `asset-${Date.now()}`;
  if (hasDb) {
    try {
      const created = await prisma.mediaAsset.create({
        data: {
          id,
          filename: asset.filename,
          url: asset.url,
          fileType: asset.fileType,
          fileSizeKb: asset.fileSizeKb,
          dimensions: asset.dimensions,
          altText: asset.altText,
          category: asset.category,
          uploadedById: userId,
        },
      });
      return { success: true, id: created.id };
    } catch (e: any) {
      console.warn("DB addMediaAsset error:", e);
      return { success: false, id, error: e.message };
    }
  }

  const newAsset: MediaAssetItem = {
    ...asset,
    id,
    createdAt: new Date().toISOString(),
  };
  SEED_MEDIA.unshift(newAsset);
  return { success: true, id };
}

/**
 * Delete a media asset
 */
export async function deleteMediaAsset(assetId: string): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      await prisma.mediaAsset.delete({ where: { id: assetId } });
      return { success: true };
    } catch (e: any) {
      console.warn("DB deleteMediaAsset error:", e);
      return { success: false, error: e.message };
    }
  }

  const idx = SEED_MEDIA.findIndex((m) => m.id === assetId);
  if (idx >= 0) {
    SEED_MEDIA.splice(idx, 1);
  }
  return { success: true };
}

/**
 * Save or update a 301/302 redirect rule
 */
export async function saveRedirectRule(rule: {
  id?: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      if (rule.id) {
        await prisma.redirectRule.update({
          where: { id: rule.id },
          data: {
            sourcePath: rule.sourcePath,
            targetPath: rule.targetPath,
            statusCode: rule.statusCode,
            isActive: rule.isActive,
          },
        });
      } else {
        await prisma.redirectRule.upsert({
          where: { sourcePath: rule.sourcePath },
          update: {
            targetPath: rule.targetPath,
            statusCode: rule.statusCode,
            isActive: rule.isActive,
          },
          create: {
            sourcePath: rule.sourcePath,
            targetPath: rule.targetPath,
            statusCode: rule.statusCode,
            isActive: rule.isActive,
          },
        });
      }
      return { success: true };
    } catch (e: any) {
      console.warn("DB saveRedirectRule error:", e);
      return { success: false, error: e.message };
    }
  }

  const idx = SEED_REDIRECTS.findIndex((r) => r.id === rule.id || r.sourcePath === rule.sourcePath);
  if (idx >= 0) {
    SEED_REDIRECTS[idx] = {
      ...SEED_REDIRECTS[idx],
      ...rule,
    };
  } else {
    SEED_REDIRECTS.push({
      id: rule.id || `red-${Date.now()}`,
      sourcePath: rule.sourcePath,
      targetPath: rule.targetPath,
      statusCode: rule.statusCode,
      isActive: rule.isActive,
      createdAt: new Date().toISOString(),
    });
  }
  return { success: true };
}

/**
 * Delete a redirect rule
 */
export async function deleteRedirectRule(ruleId: string): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      await prisma.redirectRule.delete({ where: { id: ruleId } });
      return { success: true };
    } catch (e: any) {
      console.warn("DB deleteRedirectRule error:", e);
      return { success: false, error: e.message };
    }
  }

  const idx = SEED_REDIRECTS.findIndex((r) => r.id === ruleId);
  if (idx >= 0) {
    SEED_REDIRECTS.splice(idx, 1);
  }
  return { success: true };
}

/**
 * Restore a previous page revision
 */
export async function restorePageRevision(
  revisionId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      const revision = await prisma.pageRevision.findUnique({
        where: { id: revisionId },
        include: { page: true },
      });
      if (!revision) {
        return { success: false, error: "Revision not found" };
      }

      const sections = JSON.parse(revision.snapshot);
      await prisma.customPage.update({
        where: { id: revision.pageId },
        data: {
          draftConfig: revision.snapshot,
          publishedConfig: revision.snapshot,
          status: "PUBLISHED",
          updatedAt: new Date(),
        },
      });

      // Recreate sections
      await prisma.pageSection.deleteMany({ where: { pageId: revision.pageId } });
      if (Array.isArray(sections)) {
        await prisma.pageSection.createMany({
          data: sections.map((s: any, idx: number) => ({
            id: `sec-${Date.now()}-${idx}`,
            pageId: revision.pageId,
            componentType: s.componentType || "HERO",
            orderIndex: s.orderIndex ?? idx,
            config: JSON.stringify(s.config || {}),
            isVisible: s.isVisible ?? true,
          })),
        });
      }

      if (userId) {
        const count = await prisma.pageRevision.count({ where: { pageId: revision.pageId } });
        await prisma.pageRevision.create({
          data: {
            pageId: revision.pageId,
            versionNumber: count + 1,
            snapshot: revision.snapshot,
            changedById: userId,
            changeSummary: `Restored to version ${revision.versionNumber}`,
          },
        });
      }

      return { success: true };
    } catch (e: any) {
      console.warn("DB restorePageRevision error:", e);
      return { success: false, error: e.message };
    }
  }

  const rev = SEED_REVISIONS.find((r) => r.id === revisionId);
  if (!rev) return { success: false, error: "Revision not found" };

  const page = SEED_PAGES.find((p) => p.id === rev.pageId);
  if (page) {
    if (rev.snapshot && Array.isArray((rev.snapshot as any).sections)) {
      page.sections = (rev.snapshot as any).sections;
    } else if (Array.isArray(rev.snapshot)) {
      page.sections = rev.snapshot;
    }
    page.updatedAt = new Date().toISOString();
  }

  return { success: true };
}

/**
 * Save or update Tool Configuration
 */
export async function saveToolConfig(
  toolType: string,
  config: {
    title: string;
    description: string;
    rulesConfig: any;
    version?: string;
    status?: "DRAFT" | "PUBLISHED";
  }
): Promise<{ success: boolean; error?: string }> {
  const hasDb = await isDatabaseConnected();
  if (hasDb) {
    try {
      await prisma.toolConfig.upsert({
        where: { toolType },
        update: {
          title: config.title,
          description: config.description,
          rulesConfig: JSON.stringify(config.rulesConfig),
          version: config.version || "1.0.0",
          status: config.status || "PUBLISHED",
        },
        create: {
          toolType,
          title: config.title,
          description: config.description,
          rulesConfig: JSON.stringify(config.rulesConfig),
          version: config.version || "1.0.0",
          status: config.status || "PUBLISHED",
        },
      });
      return { success: true };
    } catch (e: any) {
      console.warn("DB saveToolConfig error:", e);
      return { success: false, error: e.message };
    }
  }

  return { success: true };
}
