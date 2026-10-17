import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { createSession, createAuditLog } from "@/lib/security/auth";
import { getStore, saveStore, StoredUser } from "@/lib/services/data-store";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`oauth_${ip}`, 10, 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many authentication requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { provider, email, name, avatarUrl, providerId } = body || {};

    if (!provider || !["google", "x", "github"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid OAuth provider specified." },
        { status: 400 }
      );
    }

    const store = getStore();
    store.users = store.users || [];

    const effectiveEmail = (email && typeof email === "string" && email.includes("@"))
      ? email.toLowerCase().trim()
      : `${provider}_operator_${(providerId || Math.random().toString(36).slice(2, 8))}@nodedrops.social`;

    const effectiveName = (name && typeof name === "string")
      ? name.trim()
      : `${provider.toUpperCase()} Operator`;

    // 1. Look for existing user by email or provider + providerId
    let user = store.users.find(
      (u) =>
        u.email.toLowerCase() === effectiveEmail ||
        (u.provider === provider && providerId && u.providerId === providerId)
    );

    const now = new Date().toISOString();

    if (!user) {
      // Create new user
      const userId = `usr-${provider}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      user = {
        id: userId,
        email: effectiveEmail,
        name: effectiveName,
        role: "USER",
        status: "ACTIVE",
        provider: provider as "google" | "x" | "github",
        providerId: providerId || userId,
        avatarUrl: avatarUrl || undefined,
        createdAt: now,
        updatedAt: now,
      };

      store.users.push(user);
      saveStore(store);

      const hasDb = await isDatabaseConnected();
      if (hasDb) {
        try {
          await prisma.user.create({
            data: {
              id: userId,
              email: effectiveEmail,
              name: effectiveName,
              passwordHash: "oauth-managed-identity",
              role: "USER",
              status: "ACTIVE",
            },
          });
        } catch (e) {
          console.warn("DB user creation error during OAuth:", e);
        }
      }
    } else {
      // Update existing user profile if needed
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      user.updatedAt = now;
      saveStore(store);
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "This operator account is currently suspended." },
        { status: 403 }
      );
    }

    // Create session and set cookie
    await createSession(user.id);
    await createAuditLog(`OAUTH_LOGIN_${provider.toUpperCase()}`, "USER", user.id, { provider, ip }, user.id);

    return NextResponse.json({
      success: true,
      provider,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("OAuth API error:", error);
    return NextResponse.json(
      { error: "OAuth authentication failed." },
      { status: 500 }
    );
  }
}
