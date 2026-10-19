import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.DEBUG_PRISMA === "true" ? ["error", "warn"] : [],
  });
};

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

let cachedDbConnected: boolean | null = null;
let lastDbCheckTime = 0;
const DB_CHECK_INTERVAL = 60000; // 60s cache

export function markDatabaseTablesMissing(): void {
  cachedDbConnected = false;
  lastDbCheckTime = Date.now();
}

/**
 * Checks if the database is accessible AND that the schema tables exist.
 * Returns true if both connection and table presence tests succeed, false otherwise.
 */
export async function isDatabaseConnected(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const now = Date.now();
  if (cachedDbConnected !== null && now - lastDbCheckTime < DB_CHECK_INTERVAL) {
    return cachedDbConnected;
  }

  try {
    // Quick connectivity probe
    await prisma.$queryRaw`SELECT 1`;
    // Probe whether schema tables are migrated (SiteSetting is a primary table)
    await prisma.siteSetting.count();
    cachedDbConnected = true;
    lastDbCheckTime = now;
    return true;
  } catch {
    // Graceful fallback to local JSON / memory store without spamming logs
    cachedDbConnected = false;
    lastDbCheckTime = now;
    return false;
  }
}

