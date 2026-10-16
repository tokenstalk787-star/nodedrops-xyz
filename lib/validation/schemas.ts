import { z } from "zod";

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Hardware Checker Schema
export const hardwareCheckerSchema = z.object({
  networkSlug: z.string().min(1, "Please select a network"),
  nodeType: z.string().min(1, "Please select a node type"),
  cpuCores: z.number().int().min(1, "CPU must be at least 1 core").max(256),
  ramGb: z.number().min(1, "RAM must be at least 1 GB").max(2048),
  ssdGb: z.number().min(10, "Storage must be at least 10 GB").max(50000),
  bandwidthMbps: z.number().min(1, "Bandwidth must be at least 1 Mbps").max(100000),
  operatingSystem: z.string().min(1, "Please specify your operating system"),
});

// Command Builder Schema
export const commandBuilderSchema = z.object({
  networkSlug: z.string().min(1, "Please select a target network"),
  client: z.string().min(1, "Please select a client software"),
  operatingSystem: z.string().min(1, "Please select an operating system"),
  installationMethod: z.enum(["Docker", "Systemd", "Binary"]),
  networkType: z.enum(["MAINNET", "TESTNET"]),
  customMoniker: z
    .string()
    .max(32, "Moniker must be under 32 characters")
    .regex(/^[a-zA-Z0-9_-]*$/, "Moniker can only contain letters, numbers, and dashes")
    .optional(),
});

// Guide Step Schema
export const guideStepSchema = z.object({
  orderIndex: z.number().int().min(0),
  title: z.string().min(2, "Step title is required"),
  explanation: z.string().min(5, "Step explanation is required"),
  command: z.string().optional(),
  expectedOutput: z.string().optional(),
  warning: z.string().optional(),
  verificationInstructions: z.string().optional(),
});

// Guide Schema
export const guideFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300),
  content: z.string().min(20, "Guide markdown content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedMinutes: z.number().int().min(1).max(720),
  seoTitle: z.string().max(80).optional(),
  seoDescription: z.string().max(200).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  networkId: z.string().optional(),
  steps: z.array(guideStepSchema).optional(),
});

// Network Schema
export const networkFormSchema = z.object({
  name: z.string().min(2, "Network name is required").max(60),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description is required"),
  networkType: z.enum(["MAINNET", "TESTNET"]),
  chainId: z.string().optional().or(z.literal("")),
  officialUrl: z.string().url("Must be a valid official URL"),
  documentationUrl: z.string().url("Must be a valid documentation URL"),
  nodeTypes: z.string().min(2, "Node types required (comma separated or JSON)"),
  hardwareRequirements: z.string().min(5, "Hardware requirements JSON required"),
  status: z.enum(["ACTIVE", "UPCOMING", "DEPRECATED"]),
});

// Opportunity Schema
export const opportunityFormSchema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description is required"),
  campaignType: z.string().min(2, "Campaign type required"),
  networkId: z.string().optional().or(z.literal("")),
  officialAnnouncementUrl: z.string().url("Valid announcement URL required"),
  officialDocumentationUrl: z.string().url("Valid documentation URL required"),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
  eligibility: z.string().min(5, "Eligibility criteria required"),
  rewardStatus: z.enum(["CONFIRMED", "POTENTIAL", "NONE", "UNKNOWN"]),
  campaignStatus: z.enum(["UPCOMING", "ACTIVE", "ENDED", "PAUSED", "UNVERIFIED"]),
  verificationStatus: z.enum(["VERIFIED", "RESEARCH_ONLY", "UNVERIFIED"]),
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

// Guide Feedback Schema
export const guideFeedbackSchema = z.object({
  guideId: z.string().min(1),
  helpful: z.boolean(),
  message: z.string().max(500).optional(),
});

// Site Settings Schema
export const siteSettingSchema = z.object({
  siteTitle: z.string().min(2).max(100),
  siteDescription: z.string().min(10).max(300),
  announcementText: z.string().max(200).optional(),
  announcementLink: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email(),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  discordUrl: z.string().url().optional().or(z.literal("")),
});

// ----------------------------------------------------
// CMS: Page Builder Section Schemas
// ----------------------------------------------------
export const heroSectionSchema = z.object({
  type: z.literal("HERO"),
  badge: z.string().default("PRODUCTION INFRASTRUCTURE PLATFORM"),
  heading: z.string().min(1, "Heading is required"),
  highlightText: z.string().default("Explore Opportunities."),
  description: z.string().min(1, "Description is required"),
  primaryCtaLabel: z.string().default("Browse Guides"),
  primaryCtaHref: z.string().default("/guides"),
  secondaryCtaLabel: z.string().default("Check Hardware"),
  secondaryCtaHref: z.string().default("/tools/hardware-checker"),
  showSearch: z.boolean().default(true),
  paddingTop: z.number().default(20),
  paddingBottom: z.number().default(16),
  visible: z.boolean().default(true),
});

export const richTextSectionSchema = z.object({
  type: z.literal("RICH_TEXT"),
  title: z.string().optional(),
  contentMarkdown: z.string().min(1, "Content is required"),
  visible: z.boolean().default(true),
});

export const statsSectionSchema = z.object({
  type: z.literal("STATS"),
  title: z.string().default("Network Benchmarks"),
  items: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      change: z.string().optional(),
    })
  ).default([]),
  visible: z.boolean().default(true),
});

export const featuresSectionSchema = z.object({
  type: z.literal("FEATURES"),
  title: z.string().default("Operator Pathways"),
  subtitle: z.string().optional(),
  cards: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      badge: z.string().optional(),
      href: z.string().default("#"),
      iconName: z.string().default("Server"),
    })
  ).default([]),
  visible: z.boolean().default(true),
});

export const gridSectionSchema = z.object({
  type: z.enum(["NETWORK_GRID", "GUIDE_GRID", "OPPORTUNITY_GRID"]),
  title: z.string(),
  subtitle: z.string().optional(),
  itemLimit: z.number().int().min(1).max(24).default(6),
  viewAllLink: z.string().optional(),
  visible: z.boolean().default(true),
});

export const faqSectionSchema = z.object({
  type: z.literal("FAQ"),
  title: z.string().default("Frequently Asked Questions"),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ).default([]),
  visible: z.boolean().default(true),
});

export const ctaSectionSchema = z.object({
  type: z.literal("CTA"),
  heading: z.string(),
  description: z.string(),
  buttonText: z.string(),
  buttonHref: z.string(),
  visible: z.boolean().default(true),
});

export const dividerSectionSchema = z.object({
  type: z.literal("DIVIDER"),
  spacing: z.enum(["sm", "md", "lg"]).default("md"),
  visible: z.boolean().default(true),
});

export const pageSectionConfigSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  richTextSectionSchema,
  statsSectionSchema,
  featuresSectionSchema,
  gridSectionSchema,
  faqSectionSchema,
  ctaSectionSchema,
  dividerSectionSchema,
]);

export type PageSectionConfig = z.infer<typeof pageSectionConfigSchema>;

// Custom Page Form Schema
export const customPageFormSchema = z.object({
  title: z.string().min(2, "Page title is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-/]+$/, "Slug can contain lowercase letters, numbers, hyphens, and slashes"),
  pageType: z.enum(["HOME", "NETWORKS", "GUIDES", "TOOLS", "CUSTOM"]).default("CUSTOM"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(250).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  noSnippet: z.boolean().default(false),
  noArchive: z.boolean().default(false),
  customHeadCode: z.string().optional(),
  customBodyCode: z.string().optional(),
  sections: z.array(z.any()).default([]),
});

// Navigation Menu Schema
export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  link: z.string().min(1, "Link destination is required"),
  isEnabled: z.boolean().default(true),
  isExternal: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
  columnName: z.string().optional(),
});

export const navigationMenuFormSchema = z.object({
  location: z.enum(["HEADER", "FOOTER"]),
  title: z.string().min(2),
  logoUrl: z.string().optional().or(z.literal("")),
  logoText: z.string().optional().or(z.literal("")),
  showAnnouncement: z.boolean().default(false),
  announcementText: z.string().optional().or(z.literal("")),
  announcementLink: z.string().optional().or(z.literal("")),
  items: z.array(navigationItemSchema),
});

// Theme Config Schema
export const themeConfigSchema = z.object({
  presetName: z.string().default("Violet Bloom"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be valid hex color"),
  cardBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be valid hex color"),
  accentCyan: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be valid hex color"),
  accentBlue: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be valid hex color"),
  fontFamily: z.string().default("Inter, system-ui, sans-serif"),
  borderRadius: z.string().default("0.75rem"),
});

// Media Asset Schema
export const mediaAssetSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url("Must be valid URL"),
  fileType: z.string().min(1),
  fileSizeKb: z.number().int().default(0),
  dimensions: z.string().optional(),
  altText: z.string().max(200).optional(),
  category: z.enum(["image", "video", "document", "logo"]).default("image"),
});

// Redirect Rule Schema
export const redirectRuleSchema = z.object({
  sourcePath: z.string().startsWith("/", "Source path must start with /"),
  targetPath: z.string().min(1, "Target path is required"),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
  isActive: z.boolean().default(true),
});

// User Permissions Schema
export const userPermissionsSchema = z.object({
  viewUsers: z.boolean().default(false),
  editUsers: z.boolean().default(false),
  createUsers: z.boolean().default(false),
  deleteUsers: z.boolean().default(false),
  manageContent: z.boolean().default(true),
  publishContent: z.boolean().default(false),
  manageTools: z.boolean().default(false),
  manageSettings: z.boolean().default(false),
  viewAuditLogs: z.boolean().default(false),
});
