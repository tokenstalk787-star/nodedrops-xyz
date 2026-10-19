import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error"]
        : ["error"],
  });
};

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

let cachedDbConnected: boolean | null = null;
let lastDbCheckTime = 0;
const DB_CHECK_INTERVAL = 30000; // 30s cache

/**
 * Checks if the database is accessible.
 * Returns true if a simple query succeeds, false otherwise.
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
    // Quick probe query with short timeout
    await prisma.$queryRaw`SELECT 1`;
    cachedDbConnected = true;
    lastDbCheckTime = now;
    return true;
  } catch {
    cachedDbConnected = false;
    lastDbCheckTime = now;
    return false;
  }
}
