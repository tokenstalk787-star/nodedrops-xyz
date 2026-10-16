import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting safe database seeding for NodeDrops.xyz...");

  // Check if categories already exist
  const existingCategory = await prisma.category.findFirst();
  if (!existingCategory) {
    console.log("Creating default categories...");
    await prisma.category.createMany({
      data: [
        { name: "Execution & Consensus Clients", slug: "execution-consensus", description: "Guides for pairing execution and consensus layer daemons." },
        { name: "Modular Blockchains", slug: "modular-blockchains", description: "Data availability and rollup execution infrastructure." },
        { name: "Proof of Liquidity", slug: "proof-of-liquidity", description: "Polaris EVM and PoL consensus mechanics." },
        { name: "Security & Infrastructure", slug: "security-infrastructure", description: "Server hardening, monitoring, and validator key protection." },
      ],
      skipDuplicates: true,
    });
  }

  // Check if networks already exist
  const existingNetwork = await prisma.network.findFirst();
  if (!existingNetwork) {
    console.log("Creating baseline networks...");
    await prisma.network.createMany({
      data: [
        {
          name: "Ethereum Sepolia",
          slug: "ethereum-sepolia",
          description: "The primary proof-of-stake testnet for Ethereum protocol upgrades and application testing.",
          networkType: "TESTNET",
          chainId: "11155111",
          officialUrl: "https://ethereum.org",
          documentationUrl: "https://ethereum.org/en/developers/docs/nodes-and-clients/",
          nodeTypes: "Full Node, Archive Node, Validator",
          hardwareRequirements: JSON.stringify({
            min: { cpuCores: 4, ramGb: 16, ssdGb: 500, bandwidthMbps: 25 },
            recommended: { cpuCores: 8, ramGb: 32, ssdGb: 1000, bandwidthMbps: 100 },
            notes: "Requires fast NVMe SSD for state storage and continuous sync.",
          }),
          status: "ACTIVE",
          lastVerifiedAt: new Date(),
        },
        {
          name: "Celestia",
          slug: "celestia",
          description: "The first modular data availability network that securely scales with the number of users.",
          networkType: "MAINNET",
          chainId: "celestia",
          officialUrl: "https://celestia.org",
          documentationUrl: "https://docs.celestia.org/how-to-guides/light-node",
          nodeTypes: "Light Node, Bridge Node, Full Storage Node, Validator",
          hardwareRequirements: JSON.stringify({
            min: { cpuCores: 2, ramGb: 4, ssdGb: 50, bandwidthMbps: 10 },
            recommended: { cpuCores: 4, ramGb: 8, ssdGb: 100, bandwidthMbps: 50 },
            notes: "Light nodes sample data availability over P2P using minimal compute.",
          }),
          status: "ACTIVE",
          lastVerifiedAt: new Date(),
        },
      ],
      skipDuplicates: true,
    });
  }

  // Default site settings
  const siteTitle = await prisma.siteSetting.findUnique({ where: { key: "siteTitle" } });
  if (!siteTitle) {
    console.log("Initializing baseline site settings...");
    await prisma.siteSetting.createMany({
      data: [
        { key: "siteTitle", value: "NodeDrops.xyz — Blockchain Node Education & Discovery" },
        { key: "siteDescription", value: "Run Nodes. Learn Web3. Explore Opportunities. Production-ready node documentation and tooling." },
        { key: "announcementText", value: "Welcome to NodeDrops.xyz! Explore our interactive Node Hardware Checker and verified guides." },
        { key: "announcementLink", value: "/tools/hardware-checker" },
        { key: "contactEmail", value: "security@nodedrops.xyz" },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Database seeding complete without overwriting existing data.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
