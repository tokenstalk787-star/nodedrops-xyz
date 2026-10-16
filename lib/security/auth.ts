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

/**
 * Create a new user session in database and return session token
 */
export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  try {
    await prisma.session.create({
      data: {
        sessionTokenHash: tokenHash,
        userId,
        expiresAt,
      },
    });
  } catch (error) {
    console.warn("Could not create DB session (DB might be in demo mode):", error);
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
    try {
      const tokenHash = hashToken(sessionToken);
      await prisma.session.deleteMany({
        where: { sessionTokenHash: tokenHash },
      });
    } catch (e) {
      console.warn("Failed to delete session record:", e);
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

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    if (session.user.status === "SUSPENDED") {
      return null;
    }

    return session.user;
  } catch (error) {
    console.warn("Session check error (database may not be ready):", error);
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
