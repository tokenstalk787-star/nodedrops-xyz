import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "../db/prisma";

export const SESSION_COOKIE_NAME = "nodedrops_session";
const SESSION_EXPIRY_DAYS = 7;

/**
 * Hash password securely using bcrypt with 12 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plaintext password with hashed password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a session token using SHA-256 for secure database storage
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

import { getStore, saveStore } from "../services/data-store";

/**
 * Create a new user session in database and return session token
 */
export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  let dbSaved = false;
  try {
    await prisma.session.create({
      data: {
        sessionTokenHash: tokenHash,
        userId,
        expiresAt,
      },
    });
    dbSaved = true;
  } catch (error) {
    // Database fallback to store
  }

  if (!dbSaved) {
    const store = getStore();
    store.sessions = store.sessions || [];
    // prune expired
    const now = new Date().toISOString();
    store.sessions = store.sessions.filter((s) => s.expiresAt > now);
    store.sessions.push({
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sessionTokenHash: tokenHash,
      userId,
      expiresAt: expiresAt.toISOString(),
    });
    saveStore(store);
  }

  // Set HTTP-only secure cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return sessionToken;
}

/**
 * Invalidate current session and clear cookie
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    const tokenHash = hashToken(sessionToken);
    try {
      await prisma.session.deleteMany({
        where: { sessionTokenHash: tokenHash },
      });
    } catch (e) {
      // ignore
    }

    const store = getStore();
    if (store.sessions) {
      store.sessions = store.sessions.filter((s) => s.sessionTokenHash !== tokenHash);
      saveStore(store);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "EDITOR" | "USER";
  status: "ACTIVE" | "SUSPENDED";
  provider?: string;
  avatarUrl?: string;
};

/**
 * Retrieve current authenticated user from session cookie
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    const tokenHash = hashToken(sessionToken);

    // Try DB first
    try {
      const session = await prisma.session.findUnique({
        where: { sessionTokenHash: tokenHash },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
            },
          },
        },
      });

      if (session) {
        if (session.expiresAt < new Date()) {
          await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
          return null;
        }

        if (session.user.status === "SUSPENDED") {
          return null;
        }

        return session.user;
      }
    } catch {
      // Fallback to store
    }

    // Check store sessions
    const store = getStore();
    const storedSession = (store.sessions || []).find((s) => s.sessionTokenHash === tokenHash);

    if (storedSession && new Date(storedSession.expiresAt) > new Date()) {
      if (storedSession.userId === "demo-admin" || storedSession.userId === "admin-default") {
        return {
          id: "admin-default",
          email: "admin@nodedrops.xyz",
          name: "Lead System Admin",
          role: "ADMIN",
          status: "ACTIVE",
          provider: "email",
        };
      }

      const storedUser = (store.users || []).find((u) => u.id === storedSession.userId);
      if (storedUser && storedUser.status !== "SUSPENDED") {
        return {
          id: storedUser.id,
          email: storedUser.email,
          name: storedUser.name,
          role: storedUser.role,
          status: storedUser.status,
          provider: storedUser.provider,
          avatarUrl: storedUser.avatarUrl,
        };
      }
    }

    return null;
  } catch (error) {
    console.warn("Session check error:", error);
    return null;
  }
}

/**
 * Auth guard: requires logged in user
 */
export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Auth guard: requires EDITOR or ADMIN role
 */
export async function requireEditor(): Promise<SafeUser> {
  const user = await requireAuth();
  if (user.role !== "EDITOR" && user.role !== "ADMIN") {
    throw new Error("FORBIDDEN_EDITOR_REQUIRED");
  }
  return user;
}

/**
 * Auth guard: requires ADMIN role
 */
export async function requireAdmin(): Promise<SafeUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN_ADMIN_REQUIRED");
  }
  return user;
}

/**
 * Record an audit log entry
 */
export async function createAuditLog(
  action: string,
  targetType: string,
  targetId?: string,
  metadata?: Record<string, unknown>,
  actorId?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        targetType,
        targetId: targetId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        actorId: actorId || null,
      },
    });
  } catch (e) {
    console.warn("Failed to write audit log:", e);
  }
}
