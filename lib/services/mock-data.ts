export interface NetworkItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  networkType: "MAINNET" | "TESTNET";
  chainId?: string;
  officialUrl: string;
  documentationUrl: string;
  nodeTypes: string;
  hardwareRequirements: {
    min: { cpuCores: number; ramGb: number; ssdGb: number; bandwidthMbps: number };
    recommended: { cpuCores: number; ramGb: number; ssdGb: number; bandwidthMbps: number };
    notes: string;
  };
  status: "ACTIVE" | "UPCOMING" | "DEPRECATED";
  lastVerifiedAt: string;
}

export interface GuideItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedMinutes: number;
  authorName: string;
  reviewerName?: string;
  publishedAt: string;
  lastVerifiedAt: string;
  category: string;
  networkSlug?: string;
  tags: string[];
  steps: {
    orderIndex: number;
    title: string;
    explanation: string;
    command?: string;
    expectedOutput?: string;
    warning?: string;
    verificationInstructions?: string;
  }[];
}

export interface OpportunityItem {
  id: string;
  projectName: string;
  slug: string;
  description: string;
  campaignType: string;
  networkSlug?: string;
  officialAnnouncementUrl: string;
  officialDocumentationUrl: string;
  startsAt?: string;
  endsAt?: string;
  eligibility: string;
  rewardStatus: "CONFIRMED" | "POTENTIAL" | "NONE" | "UNKNOWN";
  campaignStatus: "UPCOMING" | "ACTIVE" | "ENDED" | "PAUSED" | "UNVERIFIED";
  verificationStatus: "VERIFIED" | "RESEARCH_ONLY" | "UNVERIFIED";
  lastCheckedAt: string;
}

export interface TroubleshootingItem {
  id: string;
  slug: string;
  title: string;
  symptoms: string;
  likelyCauses: string;
  diagnosticCommands: string;
  correctiveSteps: string;
  riskWarnings?: string;
  verificationInstructions: string;
  sourceReferences?: string;
  tags: string[];
}

export interface CommandTemplateItem {
  id: string;
  name: string;
  slug: string;
  networkSlug: string;
  client: string;
  operatingSystem: string;
  installationMethod: "Docker" | "Systemd" | "Binary";
  version: string;
  templateContent: string;
  validationNotes: string;
  riskLevel: "SAFE" | "CAUTION" | "DESTRUCTIVE";
  lastVerifiedAt: string;
}

// ----------------------------------------------------
// CMS Entities
// ----------------------------------------------------
export interface PageSectionItem {
  id: string;
  componentType: "HERO" | "RICH_TEXT" | "STATS" | "FEATURES" | "NETWORK_GRID" | "GUIDE_GRID" | "OPPORTUNITY_GRID" | "FAQ" | "CTA" | "DIVIDER";
  orderIndex: number;
  config: Record<string, any>;
  isVisible: boolean;
}

export interface CustomPageItem {
  id: string;
  title: string;
  slug: string;
  pageType: "HOME" | "NETWORKS" | "GUIDES" | "TOOLS" | "CUSTOM";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sections: PageSectionItem[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
  noSnippet: boolean;
  noArchive: boolean;
  publishedAt?: string;
  updatedAt: string;
}

export interface NavigationMenuItem {
  id: string;
  location: "HEADER" | "FOOTER";
  title: string;
  logoUrl?: string;
  logoText?: string;
  showAnnouncement: boolean;
  announcementText?: string;
  announcementLink?: string;
  items: {
    id: string;
    label: string;
    link: string;
    orderIndex: number;
    isEnabled: boolean;
    isExternal: boolean;
    columnName?: string;
  }[];
}

export interface ThemeConfigItem {
  presetName: string;
  primaryColor: string;
  secondaryColor: string;
  cardBackground: string;
  accentCyan: string;
  accentBlue: string;
  fontFamily: string;
  borderRadius: string;
}

export interface MediaAssetItem {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSizeKb: number;
  dimensions?: string;
  altText?: string;
  category: "image" | "video" | "document" | "logo";
  createdAt: string;
}

export interface RedirectRuleItem {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  createdAt: string;
}

export interface PageRevisionItem {
  id: string;
  pageId: string;
  versionNumber: number;
  snapshot: CustomPageItem;
  changedByName: string;
  changeSummary: string;
  createdAt: string;
}

// ----------------------------------------------------
// Seed Data
// ----------------------------------------------------
export const SEED_THEME: ThemeConfigItem = {
  presetName: "Violet Bloom",
  primaryColor: "#8B5CF6",
  secondaryColor: "#101525",
  cardBackground: "#141B2D",
  accentCyan: "#06B6D4",
  accentBlue: "#3B82F6",
  fontFamily: "Inter, system-ui, sans-serif",
  borderRadius: "0.75rem",
};

export const SEED_NAV_HEADER: NavigationMenuItem = {
  id: "nav-header",
  location: "HEADER",
  title: "Main Navigation",
  logoText: "NodeDrops.xyz",
  showAnnouncement: true,
  announcementText: "Welcome to NodeDrops.xyz! Explore our interactive Node Hardware Checker.",
  announcementLink: "/tools/hardware-checker",
  items: [
    { id: "h-1", label: "Networks", link: "/networks", orderIndex: 0, isEnabled: true, isExternal: false },
    { id: "h-2", label: "Guides", link: "/guides", orderIndex: 1, isEnabled: true, isExternal: false },
    { id: "h-3", label: "Tools", link: "/tools", orderIndex: 2, isEnabled: true, isExternal: false },
    { id: "h-4", label: "Opportunities", link: "/opportunities", orderIndex: 3, isEnabled: true, isExternal: false },
    { id: "h-5", label: "Learn", link: "/learn", orderIndex: 4, isEnabled: true, isExternal: false },
  ],
};

export const SEED_NAV_FOOTER: NavigationMenuItem = {
  id: "nav-footer",
  location: "FOOTER",
  title: "Footer Navigation",
  showAnnouncement: false,
  items: [
    { id: "f-1", label: "Networks", link: "/networks", orderIndex: 0, isEnabled: true, isExternal: false, columnName: "Directory" },
    { id: "f-2", label: "Guides", link: "/guides", orderIndex: 1, isEnabled: true, isExternal: false, columnName: "Directory" },
    { id: "f-3", label: "Opportunities", link: "/opportunities", orderIndex: 2, isEnabled: true, isExternal: false, columnName: "Directory" },
    { id: "f-4", label: "Hardware Checker", link: "/tools/hardware-checker", orderIndex: 3, isEnabled: true, isExternal: false, columnName: "Tools" },
    { id: "f-5", label: "Command Builder", link: "/tools/command-builder", orderIndex: 4, isEnabled: true, isExternal: false, columnName: "Tools" },
    { id: "f-6", label: "Setup Checklist", link: "/tools/checklist", orderIndex: 5, isEnabled: true, isExternal: false, columnName: "Tools" },
    { id: "f-7", label: "Troubleshooting Hub", link: "/troubleshooting", orderIndex: 6, isEnabled: true, isExternal: false, columnName: "Tools" },
    { id: "f-8", label: "Security Protocol", link: "/security", orderIndex: 7, isEnabled: true, isExternal: false, columnName: "Trust & Legal" },
    { id: "f-9", label: "Risk Disclaimer", link: "/disclaimer", orderIndex: 8, isEnabled: true, isExternal: false, columnName: "Trust & Legal" },
    { id: "f-10", label: "Privacy Policy", link: "/privacy", orderIndex: 9, isEnabled: true, isExternal: false, columnName: "Trust & Legal" },
    { id: "f-11", label: "Terms of Service", link: "/terms", orderIndex: 10, isEnabled: true, isExternal: false, columnName: "Trust & Legal" },
    { id: "f-12", label: "Contact Support", link: "/contact", orderIndex: 11, isEnabled: true, isExternal: false, columnName: "Trust & Legal" },
  ],
};

export const SEED_PAGES: CustomPageItem[] = [
  {
    id: "page-home",
    title: "NodeDrops Home",
    slug: "home",
    pageType: "HOME",
    status: "PUBLISHED",
    seoTitle: "NodeDrops.xyz — Blockchain Node Education, Discovery & Tooling",
    seoDescription: "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive node setup guides, hardware checkers, and validator tooling.",
    noIndex: false,
    noFollow: false,
    noSnippet: false,
    noArchive: false,
    updatedAt: "2026-04-12T10:00:00Z",
    sections: [
      {
        id: "sec-hero",
        componentType: "HERO",
        orderIndex: 0,
        isVisible: true,
        config: {
          badge: "PRODUCTION-READY WEB3 INFRASTRUCTURE PLATFORM",
          heading: "Run Nodes. Learn Web3.",
          highlightText: "Explore Opportunities.",
          description: "Technical, verified node documentation, interactive hardware validation, and command builders designed for validators, infrastructure engineers, and beginners.",
          primaryCtaLabel: "Browse Node Guides",
          primaryCtaHref: "/guides",
          secondaryCtaLabel: "Check Node Hardware",
          secondaryCtaHref: "/tools/hardware-checker",
          showSearch: true,
        },
      },
      {
        id: "sec-features",
        componentType: "FEATURES",
        orderIndex: 1,
        isVisible: true,
        config: {
          title: "Tailored Infrastructure Pathways",
          subtitle: "Whether you are spinning up your very first testnet node or managing multi-region validator clusters.",
          cards: [
            {
              title: "Beginner Node Operator Path",
              description: "Start from scratch. Learn Linux server leasing, SSH key pair creation, firewall rules (UFW), Docker deployment, and lightweight node participation.",
              badge: "Beginner Friendly",
              href: "/learn",
              iconName: "Zap",
            },
            {
              title: "Validator & DevOps Engineer Path",
              description: "Production architecture, consensus & execution pairing, state pruning, anti-slashing safeguards, Prometheus/Grafana monitoring, and systemd automation.",
              badge: "Advanced Operators",
              href: "/guides",
              iconName: "Server",
            },
          ],
        },
      },
      {
        id: "sec-guides",
        componentType: "GUIDE_GRID",
        orderIndex: 2,
        isVisible: true,
        config: {
          title: "Featured Node Guides",
          subtitle: "Field-tested setup walkthroughs with copyable commands and expected terminal outputs.",
          itemLimit: 4,
          viewAllLink: "/guides",
        },
      },
      {
        id: "sec-networks",
        componentType: "NETWORK_GRID",
        orderIndex: 3,
        isVisible: true,
        config: {
          title: "Popular Blockchain Networks",
          subtitle: "Hardware profiles, consensus architectures, and client compatibility.",
          itemLimit: 4,
          viewAllLink: "/networks",
        },
      },
      {
        id: "sec-opps",
        componentType: "OPPORTUNITY_GRID",
        orderIndex: 4,
        isVisible: true,
        config: {
          title: "Active Node Opportunities",
          subtitle: "Verified campaigns with factual reward statuses. We never invent rewards or promise airdrops.",
          itemLimit: 3,
          viewAllLink: "/opportunities",
        },
      },
      {
        id: "sec-faq",
        componentType: "FAQ",
        orderIndex: 5,
        isVisible: true,
        config: {
          title: "Node Operator FAQ",
          subtitle: "Common questions regarding hardware costs, testnets, and security standards.",
          items: [
            {
              question: "Do I need to connect my Web3 wallet to read guides?",
              answer: "No. NodeDrops is an educational platform and strictly enforces a zero-wallet policy for browsing documentation and using tools.",
            },
            {
              question: "Are airdrops guaranteed for testnet node runners?",
              answer: "No. Testnet campaigns are independent and subject to project foundations. We label reward statuses transparently as Confirmed, Potential, None, or Unknown.",
            },
            {
              question: "Can I run multiple blockchain nodes on one VPS?",
              answer: "It depends on storage IOPS and RAM. CPU and NVMe disk throughput are typically the primary bottlenecks when pairing execution and consensus daemons.",
            },
          ],
        },
      },
    ],
  },
];

export const SEED_MEDIA: MediaAssetItem[] = [
  {
    id: "med-1",
    filename: "nodedrops-logo-dark.png",
    url: "/images/nodedrops-logo-dark.png",
    fileType: "image/png",
    fileSizeKb: 42,
    dimensions: "512x512",
    altText: "NodeDrops Hexagonal Wordmark",
    category: "logo",
    createdAt: "2026-03-01T12:00:00Z",
  },
  {
    id: "med-2",
    filename: "hero-topography-glow.png",
    url: "/images/hero-topography-glow.png",
    fileType: "image/png",
    fileSizeKb: 380,
    dimensions: "1920x1080",
    altText: "Neon Purple Topography Elevation Map",
    category: "image",
    createdAt: "2026-03-05T14:00:00Z",
  },
  {
    id: "med-3",
    filename: "sepolia-architecture-diagram.svg",
    url: "/images/sepolia-architecture-diagram.svg",
    fileType: "image/svg+xml",
    fileSizeKb: 18,
    dimensions: "800x450",
    altText: "Execution and Consensus Engine API Pairing Architecture",
    category: "image",
    createdAt: "2026-03-10T16:00:00Z",
  },
];

export const SEED_REDIRECTS: RedirectRuleItem[] = [
  {
    id: "red-1",
    sourcePath: "/eth-guide",
    targetPath: "/guides/run-ethereum-sepolia-node-geth-lighthouse",
    statusCode: 301,
    isActive: true,
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "red-2",
    sourcePath: "/hardware",
    targetPath: "/tools/hardware-checker",
    statusCode: 301,
    isActive: true,
    createdAt: "2026-03-15T00:00:00Z",
  },
];

export const SEED_REVISIONS: PageRevisionItem[] = [
  {
    id: "rev-225",
    pageId: "page-home",
    versionNumber: 225,
    snapshot: SEED_PAGES[0],
    changedByName: "Lead Administrator",
    changeSummary: "Updated Hero CTA labels and refreshed Sepolia minimum RAM specs.",
    createdAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "rev-224",
    pageId: "page-home",
    versionNumber: 224,
    snapshot: SEED_PAGES[0],
    changedByName: "Alex Vance",
    changeSummary: "Added Celestia light node quick-link in features section.",
    createdAt: "2026-04-11T16:30:00Z",
  },
  {
    id: "rev-223",
    pageId: "page-home",
    versionNumber: 223,
    snapshot: SEED_PAGES[0],
    changedByName: "Elena Rostova",
    changeSummary: "Initial production baseline deployment.",
    createdAt: "2026-04-10T09:15:00Z",
  },
];

export const SEED_NETWORKS: NetworkItem[] = [
  {
    id: "net-eth-sepolia",
    name: "Ethereum Sepolia",
    slug: "ethereum-sepolia",
    description: "The primary proof-of-stake testnet for Ethereum protocol upgrades and application testing.",
    networkType: "TESTNET",
    chainId: "11155111",
    officialUrl: "https://ethereum.org",
    documentationUrl: "https://ethereum.org/en/developers/docs/nodes-and-clients/",
    nodeTypes: "Full Node, Archive Node, Validator",
    hardwareRequirements: {
      min: { cpuCores: 4, ramGb: 16, ssdGb: 500, bandwidthMbps: 25 },
      recommended: { cpuCores: 8, ramGb: 32, ssdGb: 1000, bandwidthMbps: 100 },
      notes: "Requires fast NVMe SSD for state storage and continuous sync with both Execution (Geth/Nethermind) and Consensus (Lighthouse/Prysm) clients.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "net-celestia",
    name: "Celestia",
    slug: "celestia",
    description: "The first modular data availability network that securely scales with the number of users.",
    networkType: "MAINNET",
    chainId: "celestia",
    officialUrl: "https://celestia.org",
    documentationUrl: "https://docs.celestia.org/how-to-guides/light-node",
    nodeTypes: "Light Node, Bridge Node, Full Storage Node, Validator",
    hardwareRequirements: {
      min: { cpuCores: 2, ramGb: 4, ssdGb: 50, bandwidthMbps: 10 },
      recommended: { cpuCores: 4, ramGb: 8, ssdGb: 100, bandwidthMbps: 50 },
      notes: "Light nodes sample data availability over P2P using minimal compute. Consensus validators require 8 cores and 16GB RAM.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "net-berachain",
    name: "Berachain bArtio",
    slug: "berachain-bartio",
    description: "An EVM-identical Layer 1 built on Proof-of-Liquidity and Polaris EVM framework.",
    networkType: "TESTNET",
    chainId: "80084",
    officialUrl: "https://berachain.com",
    documentationUrl: "https://docs.berachain.com/nodes",
    nodeTypes: "Full Node, Validator, RPC Node",
    hardwareRequirements: {
      min: { cpuCores: 8, ramGb: 32, ssdGb: 1000, bandwidthMbps: 50 },
      recommended: { cpuCores: 16, ramGb: 64, ssdGb: 2000, bandwidthMbps: 200 },
      notes: "Requires high-throughput NVMe SSD with minimum 3000 IOPS and reliable public static IP.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "net-solana",
    name: "Solana",
    slug: "solana",
    description: "High-performance blockchain with Proof of History and Tower BFT consensus.",
    networkType: "MAINNET",
    officialUrl: "https://solana.com",
    documentationUrl: "https://docs.solanalabs.com/operations",
    nodeTypes: "RPC Node, Validator",
    hardwareRequirements: {
      min: { cpuCores: 12, ramGb: 128, ssdGb: 2000, bandwidthMbps: 1000 },
      recommended: { cpuCores: 24, ramGb: 256, ssdGb: 4000, bandwidthMbps: 1000 },
      notes: "Requires enterprise server grade hardware with separate NVMe disks for ledger and OS, and unmetered 1Gbps symmetric uplink.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "net-cosmos-gaia",
    name: "Cosmos Hub",
    slug: "cosmos-hub",
    description: "The economic heart of the Interchain, secured by the Tendermint/CometBFT consensus engine.",
    networkType: "MAINNET",
    chainId: "cosmoshub-4",
    officialUrl: "https://cosmos.network",
    documentationUrl: "https://hub.cosmos.network/main/hub-tutorials/join-mainnet.html",
    nodeTypes: "Full Node, Sentry Node, Validator",
    hardwareRequirements: {
      min: { cpuCores: 4, ramGb: 16, ssdGb: 500, bandwidthMbps: 50 },
      recommended: { cpuCores: 8, ramGb: 32, ssdGb: 1500, bandwidthMbps: 100 },
      notes: "High disk write requirements. Use statesync for faster snapshot synchronization.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-03-25T00:00:00Z",
  },
  {
    id: "net-arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    slug: "arbitrum-sepolia",
    description: "Leading Ethereum Optimistic Rollup testnet running Nitro tech stack.",
    networkType: "TESTNET",
    chainId: "421614",
    officialUrl: "https://arbitrum.io",
    documentationUrl: "https://docs.arbitrum.io/run-arbitrum-node/overview",
    nodeTypes: "Full Node, Sequencer Feed",
    hardwareRequirements: {
      min: { cpuCores: 4, ramGb: 16, ssdGb: 500, bandwidthMbps: 50 },
      recommended: { cpuCores: 8, ramGb: 32, ssdGb: 1000, bandwidthMbps: 100 },
      notes: "Requires an active Ethereum Sepolia L1 execution RPC endpoint for Nitro rollup feed.",
    },
    status: "ACTIVE",
    lastVerifiedAt: "2026-03-12T00:00:00Z",
  },
];

export const SEED_GUIDES: GuideItem[] = [
  {
    id: "guide-eth-sepolia",
    title: "How to Run an Ethereum Sepolia Full Node with Geth and Lighthouse",
    slug: "run-ethereum-sepolia-node-geth-lighthouse",
    excerpt: "Complete step-by-step technical guide to deploying a paired Execution Client (Go-Ethereum) and Consensus Client (Lighthouse) on Ubuntu 24.04 LTS.",
    content: `Running a paired Ethereum testnet node allows you to verify blocks locally, broadcast transactions without third-party rate limits, and test smart contract deployments in a production-identical PoS environment.

### Prerequisites
- An Ubuntu 24.04 / 22.04 LTS server with root or sudo access.
- Static public IPv4 address.
- Configured firewall (UFW) with required P2P ports open.

### Architecture Overview
Ethereum requires two software daemons running concurrently and communicating via the JWT-authenticated Engine API on port 8551:
1. **Execution Client (Geth):** Manages the state trie, processes EVM bytecode, and handles transaction gossip.
2. **Consensus Client (Lighthouse):** Follows the Proof of Stake beacon chain and tracks block attestations.`,
    status: "PUBLISHED",
    difficulty: "INTERMEDIATE",
    estimatedMinutes: 45,
    authorName: "NodeDrops Infrastructure Team",
    reviewerName: "Alex Vance (Lead DevOps)",
    publishedAt: "2026-03-18T10:00:00Z",
    lastVerifiedAt: "2026-03-18T10:00:00Z",
    category: "Execution & Consensus Clients",
    networkSlug: "ethereum-sepolia",
    tags: ["Ethereum", "Geth", "Lighthouse", "Sepolia", "PoS", "Linux"],
    steps: [
      {
        orderIndex: 0,
        title: "System Preparation and Firewall Configuration",
        explanation: "Update existing packages, install essential tools, and configure UFW to protect RPC interfaces while exposing P2P ports.",
        command: `sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git jq
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment "SSH"
sudo ufw allow 30303/tcp comment "Geth P2P TCP"
sudo ufw allow 30303/udp comment "Geth P2P UDP"
sudo ufw allow 9000/tcp comment "Lighthouse P2P TCP"
sudo ufw allow 9000/udp comment "Lighthouse P2P UDP"
sudo ufw enable`,
        expectedOutput: `Firewall is active and enabled on system startup`,
        warning: "Never expose port 8545 (HTTP RPC) or 8551 (Engine API) to 0.0.0.0. Keep them bound strictly to 127.0.0.1.",
        verificationInstructions: "Run 'sudo ufw status verbose' and confirm that only ports 22, 30303, and 9000 are open to incoming traffic.",
      },
      {
        orderIndex: 1,
        title: "Generate Engine API Authentication Secret (JWT)",
        explanation: "Generate a cryptographically secure 32-byte hexadecimal secret shared between Geth and Lighthouse to secure inter-process communication.",
        command: `sudo mkdir -p /var/lib/ethereum/jwt
openssl rand -hex 32 | sudo tee /var/lib/ethereum/jwt/jwt.hex > /dev/null
sudo chmod 600 /var/lib/ethereum/jwt/jwt.hex`,
        expectedOutput: "(Command outputs nothing on success)",
        warning: "If permissions are wrong, Geth or Lighthouse will refuse to start for security.",
        verificationInstructions: "Verify file presence and permissions with 'ls -la /var/lib/ethereum/jwt/jwt.hex'. It should show -rw-------.",
      },
      {
        orderIndex: 2,
        title: "Install and Configure Go-Ethereum (Geth)",
        explanation: "Install Geth using the official Ethereum PPA and create a dedicated systemd service.",
        command: `sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt update && sudo apt install -y geth`,
        expectedOutput: "Setting up geth ...",
        verificationInstructions: "Run 'geth version' and verify version >= 1.14.0.",
      },
      {
        orderIndex: 3,
        title: "Launch Sepolia Sync and Verify Logs",
        explanation: "Start the execution client on the Sepolia network and inspect peer discovery logs.",
        command: `geth --sepolia --datadir /var/lib/ethereum/geth --authrpc.jwtsecret /var/lib/ethereum/jwt/jwt.hex --http --http.api eth,net,web3`,
        expectedOutput: `INFO [03-18|10:14:02.124] Starting Geth on Sepolia testnet...
INFO [03-18|10:14:04.912] Looking for peers...`,
        verificationInstructions: "Look for 'Looking for peers' followed by peer connection notifications and block header sync.",
      },
    ],
  },
  {
    id: "guide-celestia-light",
    title: "Setting Up a Celestia Light Node on Mocha Testnet",
    slug: "setting-up-celestia-light-node-mocha",
    excerpt: "Deploy and run a lightweight Data Availability Sampling (DAS) node for Celestia with low hardware overhead.",
    content: `Celestia light nodes ensure data availability by conducting Data Availability Sampling over the libp2p network without storing the entire chain state.

### Why Run a Light Node?
- Verify block data availability directly from your terminal.
- Support network decentralization with under 2GB RAM.
- No validator stake or high-bandwidth requirement needed.`,
    status: "PUBLISHED",
    difficulty: "BEGINNER",
    estimatedMinutes: 20,
    authorName: "NodeDrops Infrastructure Team",
    reviewerName: "Elena Rostova",
    publishedAt: "2026-03-22T14:00:00Z",
    lastVerifiedAt: "2026-03-22T14:00:00Z",
    category: "Modular Blockchains",
    networkSlug: "celestia",
    tags: ["Celestia", "Modular", "Light Node", "DAS", "Beginner"],
    steps: [
      {
        orderIndex: 0,
        title: "Install Celestia Node Binary",
        explanation: "Download the prebuilt celestia node binary from the official Celestia GitHub release.",
        command: `cd $HOME
wget https://github.com/celestiaorg/celestia-node/releases/download/v0.18.2/celestia-node_Linux_x86_64.tar.gz
tar -xvf celestia-node_Linux_x86_64.tar.gz
sudo mv celestia /usr/local/bin/`,
        expectedOutput: `celestia`,
        verificationInstructions: "Execute 'celestia version' to confirm version 0.18.2 or later is installed.",
      },
      {
        orderIndex: 1,
        title: "Initialize the Light Node Store",
        explanation: "Initialize the light node configuration directory for the Mocha testnet network.",
        command: `celestia light init --p2p.network mocha`,
        expectedOutput: `Node store initialized at ~/.celestia-light-mocha-4`,
        verificationInstructions: "Check directory contents with 'ls -la ~/.celestia-light-mocha-4'.",
      },
      {
        orderIndex: 2,
        title: "Start Light Node and Sample Blocks",
        explanation: "Start the light node service and connect to trusted core gRPC endpoints.",
        command: `celestia light start --core.ip rpc-mocha.celestia.net --p2p.network mocha`,
        expectedOutput: `INFO header/sync: sync complete to head block`,
        verificationInstructions: "Observe the log messages showing sampled headers and sampling success rates.",
      },
    ],
  },
  {
    id: "guide-berachain-bartio",
    title: "Berachain bArtio Testnet Full Node Deployment Guide",
    slug: "berachain-bartio-testnet-full-node-guide",
    excerpt: "Step-by-step instructions for running a Berachain bArtio node using Docker and systemd.",
    content: `Berachain uses the Polaris EVM modular execution environment on top of CometBFT consensus. This guide covers deploying a full synchronized node on the bArtio testnet.`,
    status: "PUBLISHED",
    difficulty: "ADVANCED",
    estimatedMinutes: 60,
    authorName: "NodeDrops Infrastructure Team",
    publishedAt: "2026-04-02T09:00:00Z",
    lastVerifiedAt: "2026-04-02T09:00:00Z",
    category: "Proof of Liquidity",
    networkSlug: "berachain-bartio",
    tags: ["Berachain", "bArtio", "Polaris", "EVM", "Validator"],
    steps: [
      {
        orderIndex: 0,
        title: "Hardware Benchmark Verification",
        explanation: "Verify your server meets the 8-core CPU and high NVMe IOPS threshold before initializing the state database.",
        command: `lscpu | grep "CPU(s):"
free -h
df -h /`,
        expectedOutput: `CPU(s): 8 or 16
Mem: 32Gi`,
        verificationInstructions: "Ensure available disk space on root mount is at least 800GB.",
      },
    ],
  },
  {
    id: "guide-linux-hardening",
    title: "Linux Security Hardening for Blockchain Node Operators",
    slug: "linux-security-hardening-node-operators",
    excerpt: "Essential security configurations: SSH key authentication, disabling root login, Fail2ban, UFW, automatic updates, and systemd sandboxing.",
    content: `Security is the foremost responsibility of any node operator or validator. An insecure node can lead to unauthorized private key extraction, slashing, or distributed denial-of-service vulnerability.

### Core Hardening Pillars
1. **Disable Password Authentication:** Use modern Ed25519 SSH keys.
2. **Restrict Port Exposure:** RPC ports (e.g. 8545, 26657) must never be open to the public internet without mutual TLS or VPN.
3. **Fail2ban:** Block brute-force authentication scans.`,
    status: "PUBLISHED",
    difficulty: "BEGINNER",
    estimatedMinutes: 30,
    authorName: "Security Engineering Guild",
    reviewerName: "Alex Vance",
    publishedAt: "2026-03-01T12:00:00Z",
    lastVerifiedAt: "2026-03-01T12:00:00Z",
    category: "Security & Infrastructure",
    tags: ["Security", "Linux", "Hardening", "UFW", "SSH", "Fail2ban"],
    steps: [
      {
        orderIndex: 0,
        title: "Create Dedicated Non-Root Service User",
        explanation: "Run node software under an unprivileged system user without sudo permissions.",
        command: `sudo useradd -r -s /usr/sbin/nologin -d /var/lib/node nodeoperator
sudo mkdir -p /var/lib/node
sudo chown -R nodeoperator:nodeoperator /var/lib/node`,
        expectedOutput: "(No output on success)",
        verificationInstructions: "Verify with 'id nodeoperator'.",
      },
    ],
  },
];

export const SEED_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-berachain-bartio",
    projectName: "Berachain bArtio Testnet",
    slug: "berachain-bartio-testnet-program",
    description: "Public validator and node testing campaign for the bArtio testnet prior to mainnet deployment.",
    campaignType: "Public Node Operator Campaign",
    networkSlug: "berachain-bartio",
    officialAnnouncementUrl: "https://blog.berachain.com",
    officialDocumentationUrl: "https://docs.berachain.com",
    startsAt: "2026-03-01T00:00:00Z",
    endsAt: "2026-11-30T23:59:59Z",
    eligibility: "Open to community participants who run compliant nodes and report performance telemetry.",
    rewardStatus: "POTENTIAL",
    campaignStatus: "ACTIVE",
    verificationStatus: "VERIFIED",
    lastCheckedAt: "2026-04-10T12:00:00Z",
  },
  {
    id: "opp-celestia-incentivized",
    projectName: "Celestia Blockspace Race (Historical Archive)",
    slug: "celestia-blockspace-race-archive",
    description: "The official incentivized testnet for Celestia node operators that concluded prior to Mainnet Beta launch.",
    campaignType: "Incentivized Testnet",
    networkSlug: "celestia",
    officialAnnouncementUrl: "https://blog.celestia.org",
    officialDocumentationUrl: "https://docs.celestia.org",
    startsAt: "2023-03-15T00:00:00Z",
    endsAt: "2023-05-15T23:59:59Z",
    eligibility: "Past registered participants only. Kept for historical reference and benchmark data.",
    rewardStatus: "CONFIRMED",
    campaignStatus: "ENDED",
    verificationStatus: "VERIFIED",
    lastCheckedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "opp-monad-early-infra",
    projectName: "Monad Early Infrastructure Preview",
    slug: "monad-early-infrastructure-preview",
    description: "Research tracking for upcoming high-throughput EVM node operator requirements and devnet tooling.",
    campaignType: "Research Tracking",
    officialAnnouncementUrl: "https://monad.xyz",
    officialDocumentationUrl: "https://docs.monad.xyz",
    eligibility: "Hardware qualification criteria currently under active research. No official public campaign announced yet.",
    rewardStatus: "UNKNOWN",
    campaignStatus: "UPCOMING",
    verificationStatus: "RESEARCH_ONLY",
    lastCheckedAt: "2026-04-05T00:00:00Z",
  },
  {
    id: "opp-eigenlayer-operator",
    projectName: "EigenLayer Operator Registration",
    slug: "eigenlayer-operator-registration",
    description: "Permissionless registration for node operators opting in to validate Actively Validated Services (AVSs).",
    campaignType: "Validator / Operator Program",
    officialAnnouncementUrl: "https://docs.eigenlayer.xyz/eigenlayer/overview",
    officialDocumentationUrl: "https://docs.eigenlayer.xyz/eigenlayer/operator-guides/operator-installation",
    eligibility: "Requires running an Ethereum validator or dedicated AVS container runner with minimum performance SLA.",
    rewardStatus: "POTENTIAL",
    campaignStatus: "ACTIVE",
    verificationStatus: "VERIFIED",
    lastCheckedAt: "2026-04-08T00:00:00Z",
  },
];

export const SEED_TROUBLESHOOTING: TroubleshootingItem[] = [
  {
    id: "trouble-disk-exhaustion",
    slug: "node-disk-space-exhaustion-pruning",
    title: "Resolving Node Disk Space Exhaustion & Safe Pruning",
    symptoms: "Node service stops abruptly; error message 'no space left on device'; state database corruption warning in system logs.",
    likelyCauses: "Ancient block headers, debug traces, or state trie accumulation filled available disk volume.",
    diagnosticCommands: `df -h /
du -sh /var/lib/* 2>/dev/null | sort -h`,
    correctiveSteps: `1. Stop the node daemon cleanly using systemctl:
   sudo systemctl stop geth
2. Check if client supports online or offline snapshot pruning.
3. For Geth: execute prune-state:
   geth snapshot prune-state --datadir /var/lib/ethereum/geth
4. Restart service and monitor free disk:
   sudo systemctl start geth && df -h`,
    riskWarnings: "NEVER run 'rm -rf' on client data directories while the process is running. State pruning can take 3 to 10 hours; do not interrupt it.",
    verificationInstructions: "Run 'df -h' and confirm at least 20% free space on the data volume. Verify node resumes sync from previous block height.",
    tags: ["Disk", "Pruning", "Storage", "Geth", "Systemd"],
  },
  {
    id: "trouble-zero-peers",
    slug: "zero-peers-connected-p2p-discovery-failure",
    title: "Zero Peers Connected: P2P Discovery and Port Forwarding Failure",
    symptoms: "Node boots but peer count stays at 0; block height does not advance; 'no suitable peers found' in logs.",
    likelyCauses: "Inbound P2P ports blocked by VPS firewall, missing bootnodes in config, or clock skew on the host machine.",
    diagnosticCommands: `sudo ufw status
timedatectl status
curl -s http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}'`,
    correctiveSteps: `1. Verify system clock is synchronized via NTP:
   sudo timedatectl set-ntp true
2. Confirm P2P ports (e.g. 30303 or 26656) allow both TCP and UDP:
   sudo ufw allow 30303/tcp && sudo ufw allow 30303/udp
3. Append official static bootnodes to client configuration file.
4. Restart node service and tail logs for peer handshakes.`,
    riskWarnings: "Ensure you do not accidentally open RPC ports (8545, 8551, 26657) while modifying firewall rules.",
    verificationInstructions: "Query peer count via RPC or CLI and verify count is > 10 within 3 minutes.",
    tags: ["P2P", "Peers", "Firewall", "NTP", "Networking"],
  },
  {
    id: "trouble-beacon-jwt-mismatch",
    slug: "beacon-execution-engine-jwt-mismatch",
    title: "Consensus & Execution Engine API JWT Authentication Failure",
    symptoms: "Lighthouse/Prysm logs: 'HTTP error 401 Unauthorized from execution client' or 'Invalid JWT token'.",
    likelyCauses: "Geth and Lighthouse point to different JWT secret files, or file permissions prevent one daemon from reading it.",
    diagnosticCommands: `ls -la /var/lib/ethereum/jwt/jwt.hex
sudo diff <(sudo cat /var/lib/ethereum/jwt/jwt.hex) <(sudo cat /var/lib/consensus/jwt.hex)`,
    correctiveSteps: `1. Ensure both clients point to the EXACT same path: /var/lib/ethereum/jwt/jwt.hex.
2. Grant read permissions to both service accounts or shared group:
   sudo chmod 644 /var/lib/ethereum/jwt/jwt.hex
3. Restart both services:
   sudo systemctl restart geth && sudo systemctl restart lighthouse-beacon`,
    riskWarnings: "Do not leave JWT directory world-writable (777).",
    verificationInstructions: "Inspect consensus client logs with 'journalctl -u lighthouse-beacon -f' and verify 'Engine API connection established'.",
    tags: ["Ethereum", "Consensus", "JWT", "Engine API", "Auth"],
  },
];

export const SEED_COMMAND_TEMPLATES: CommandTemplateItem[] = [
  {
    id: "cmd-geth-systemd",
    name: "Geth Sepolia Systemd Service Unit",
    slug: "geth-sepolia-systemd",
    networkSlug: "ethereum-sepolia",
    client: "Go-Ethereum (Geth)",
    operatingSystem: "Ubuntu 24.04 LTS",
    installationMethod: "Systemd",
    version: "1.14.0",
    templateContent: `[Unit]
Description=Go Ethereum Client - Sepolia
After=network.target
Wants=network.target

[Service]
User=ethereum
Group=ethereum
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/bin/geth \\
  --sepolia \\
  --datadir /var/lib/ethereum/geth \\
  --authrpc.jwtsecret /var/lib/ethereum/jwt/jwt.hex \\
  --authrpc.addr 127.0.0.1 \\
  --authrpc.port 8551 \\
  --http \\
  --http.addr 127.0.0.1 \\
  --http.port 8545 \\
  --http.api eth,net,web3 \\
  --metrics \\
  --metrics.addr 127.0.0.1

[Install]
WantedBy=multi-user.target`,
    validationNotes: "Production tested. Ensures HTTP and Engine RPC are bound only to localhost loopback.",
    riskLevel: "SAFE",
    lastVerifiedAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "cmd-celestia-docker",
    name: "Celestia Mocha Light Node Docker Compose",
    slug: "celestia-mocha-docker",
    networkSlug: "celestia",
    client: "celestia-node",
    operatingSystem: "Linux (Docker)",
    installationMethod: "Docker",
    version: "0.18.2",
    templateContent: `services:
  celestia-light:
    image: ghcr.io/celestiaorg/celestia-node:v0.18.2
    container_name: celestia-light-mocha
    restart: unless-stopped
    command: celestia light start --core.ip rpc-mocha.celestia.net --p2p.network mocha
    volumes:
      - celestia_data:/home/celestia/.celestia-light-mocha-4
    ports:
      - "2121:2121"
    environment:
      - NODE_TYPE=light
      - P2P_NETWORK=mocha

volumes:
  celestia_data:`,
    validationNotes: "Uses official Celestia container repository with named volume persistence.",
    riskLevel: "SAFE",
    lastVerifiedAt: "2026-03-22T00:00:00Z",
  },
];
