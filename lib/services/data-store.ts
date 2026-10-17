import fs from "fs";
import path from "path";
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
  telemetry: {
    viewsByPath: Record<string, number>;
    totalViews: number;
    events: TelemetryEvent[];
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "site-store.json");

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
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const stat = fs.statSync(STORE_FILE);
      if (globalThis.__nodeDropsStore && stat.mtimeMs === lastStoreMtime) {
        return globalThis.__nodeDropsStore;
      }

      const content = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      const defaults = getDefaultState();
      globalThis.__nodeDropsStore = {
        ...defaults,
        ...parsed,
        settings: { ...defaults.settings, ...(parsed.settings || {}) },
        telemetry: { ...defaults.telemetry, ...(parsed.telemetry || {}) },
      };
      lastStoreMtime = stat.mtimeMs;
      return globalThis.__nodeDropsStore!;
    }
  } catch (err) {
    console.warn("Failed to read site-store.json, using defaults:", err);
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
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(target, null, 2), "utf-8");
    if (fs.existsSync(STORE_FILE)) {
      lastStoreMtime = fs.statSync(STORE_FILE).mtimeMs;
    }
  } catch (err) {
    console.error("Failed to write site-store.json:", err);
  }
}

