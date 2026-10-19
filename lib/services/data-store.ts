import fs from "fs";
import path from "path";
import os from "os";
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
} from "./mock-data";

export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  tagline: string;
  announcementText: string;
  announcementLink: string;
  showAnnouncement: boolean;
  contactEmail: string;
  maintenanceMode: boolean;
  keywords: string[];
  ogImage: string;
  robotsDirective: string;
  googleVerification: string;
}

export interface TelemetryEvent {
  id: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  role: "ADMIN" | "EDITOR" | "USER";
  status: "ACTIVE" | "SUSPENDED";
  provider: "email" | "google" | "x" | "github";
  providerId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSession {
  id: string;
  sessionTokenHash: string;
  userId: string;
  expiresAt: string;
}

export interface SiteStoreState {
  theme: ThemeConfigItem;
  settings: SiteSettingsData;
  navHeader: NavigationMenuItem;
  navFooter: NavigationMenuItem;
  pages: CustomPageItem[];
  media: MediaAssetItem[];
  redirects: RedirectRuleItem[];
  networks: NetworkItem[];
  guides: GuideItem[];
  opportunities: OpportunityItem[];
  commandTemplates: CommandTemplateItem[];
  troubleshooting: TroubleshootingItem[];
  users: StoredUser[];
  sessions: StoredSession[];
  telemetry: {
    viewsByPath: Record<string, number>;
    totalViews: number;
    events: TelemetryEvent[];
  };
}

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_STORE_FILE = path.join(LOCAL_DATA_DIR, "site-store.json");

const TMP_DATA_DIR = path.join(os.tmpdir(), "nodedrops-data");
const TMP_STORE_FILE = path.join(TMP_DATA_DIR, "site-store.json");

function getStoragePaths() {
  if (isServerless) {
    return {
      dir: TMP_DATA_DIR,
      file: TMP_STORE_FILE,
      fallbackRead: LOCAL_STORE_FILE,
    };
  }
  return {
    dir: LOCAL_DATA_DIR,
    file: LOCAL_STORE_FILE,
    fallbackRead: null,
  };
}


function getDefaultState(): SiteStoreState {
  return {
    theme: { ...SEED_THEME },
    settings: {
      siteTitle: "NodeDrops.xyz — Blockchain Node Education, Discovery & Tooling",
      siteDescription:
        "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive production-grade node documentation, hardware checkers, and validator guides.",
      tagline: "Run Nodes. Learn Web3. Build Resilient Blockchain Infrastructure.",
      announcementText: "Welcome to NodeDrops.xyz! Explore our interactive Node Hardware Checker.",
      announcementLink: "/tools/hardware-checker",
      showAnnouncement: false,
      contactEmail: "security@nodedrops.xyz",
      maintenanceMode: false,
      keywords: ["blockchain nodes", "validator guide", "testnet node", "web3 infrastructure"],
      ogImage: "/brand/logo-horizontal.png",
      robotsDirective: "index, follow",
      googleVerification: "",
    },
    navHeader: JSON.parse(JSON.stringify(SEED_NAV_HEADER)),
    navFooter: JSON.parse(JSON.stringify(SEED_NAV_FOOTER)),
    pages: JSON.parse(JSON.stringify(SEED_PAGES)),
    media: JSON.parse(JSON.stringify(SEED_MEDIA)),
    redirects: JSON.parse(JSON.stringify(SEED_REDIRECTS)),
    networks: JSON.parse(JSON.stringify(SEED_NETWORKS)),
    guides: JSON.parse(JSON.stringify(SEED_GUIDES)),
    opportunities: JSON.parse(JSON.stringify(SEED_OPPORTUNITIES)),
    commandTemplates: JSON.parse(JSON.stringify(SEED_COMMAND_TEMPLATES)),
    troubleshooting: JSON.parse(JSON.stringify(SEED_TROUBLESHOOTING)),
    users: [
      {
        id: "admin-default",
        email: "admin@nodedrops.xyz",
        name: "Lead System Admin",
        passwordHash: "$2a$12$K1dJv.e32Mh.RjQpQ0X0qO3Xj0yG4nUjA8vFq2K9gq0123456789a",
        role: "ADMIN",
        status: "ACTIVE",
        provider: "email",
        createdAt: "2026-04-12T00:00:00Z",
        updatedAt: "2026-04-12T00:00:00Z",
      },
    ],
    sessions: [],
    telemetry: {
      viewsByPath: {
        "/": 38,
        "/networks": 24,
        "/guides": 31,
        "/tools/hardware-checker": 19,
        "/opportunities": 27,
      },
      totalViews: 139,
      events: [],
    },
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __nodeDropsStore: SiteStoreState | undefined;
}

let lastStoreMtime = 0;

export function getStore(): SiteStoreState {
  const { file, fallbackRead } = getStoragePaths();

  try {
    let sourceFile: string | null = null;
    if (fs.existsSync(file)) {
      sourceFile = file;
    } else if (fallbackRead && fs.existsSync(fallbackRead)) {
      sourceFile = fallbackRead;
    }

    if (sourceFile) {
      const stat = fs.statSync(sourceFile);
      if (globalThis.__nodeDropsStore && stat.mtimeMs === lastStoreMtime) {
        return globalThis.__nodeDropsStore;
      }

      const content = fs.readFileSync(sourceFile, "utf-8");
      const parsed = JSON.parse(content);
      const defaults = getDefaultState();
      globalThis.__nodeDropsStore = {
        ...defaults,
        ...parsed,
        settings: { ...defaults.settings, ...(parsed.settings || {}) },
        telemetry: { ...defaults.telemetry, ...(parsed.telemetry || {}) },
        users: Array.isArray(parsed.users) ? parsed.users : defaults.users,
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : defaults.sessions,
      };
      lastStoreMtime = stat.mtimeMs;
      return globalThis.__nodeDropsStore!;
    }
  } catch (err) {
    // In serverless read or parse error, quietly continue to in-memory or defaults
  }

  if (globalThis.__nodeDropsStore) {
    return globalThis.__nodeDropsStore;
  }

  const defaultState = getDefaultState();
  globalThis.__nodeDropsStore = defaultState;
  saveStore(defaultState);
  return defaultState;
}

export function saveStore(state?: SiteStoreState): void {
  const target = state || globalThis.__nodeDropsStore;
  if (!target) return;
  globalThis.__nodeDropsStore = target;

  try {
    const { dir, file } = getStoragePaths();
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (mkdirErr: any) {
        if (mkdirErr?.code === "EROFS" || mkdirErr?.message?.includes("read-only")) {
          return;
        }
      }
    }
    fs.writeFileSync(file, JSON.stringify(target, null, 2), "utf-8");
    if (fs.existsSync(file)) {
      lastStoreMtime = fs.statSync(file).mtimeMs;
    }
  } catch (err: any) {
    // Silently suppress read-only filesystem errors in serverless environments
    if (err?.code === "EROFS" || err?.message?.includes("read-only file system")) {
      return;
    }
    console.warn("Notice: Persistent site-store write skipped:", err?.message || err);
  }
}

