import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { verifyPassword, createSession, createAuditLog } from "@/lib/security/auth";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`login_${ip}`, 5, 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid credentials format." },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const hasDb = await isDatabaseConnected();

    // 1. Check demo administrative fallback
    if (email.toLowerCase() === "admin@nodedrops.xyz" && password === "NodeDrops2026!Admin") {
      await createSession("admin-default");
      return NextResponse.json({
        success: true,
        user: {
          id: "admin-default",
          email: "admin@nodedrops.xyz",
          name: "Lead System Admin",
          role: "ADMIN",
          status: "ACTIVE",
          provider: "email",
        },
      });
    }

    // 2. Check store users
    const { getStore } = await import("@/lib/services/data-store");
    const store = getStore();
    const storedUser = (store.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (storedUser && storedUser.passwordHash) {
      if (storedUser.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "This operator account is suspended. Contact security@nodedrops.xyz." },
          { status: 403 }
        );
      }

      const isValid = await verifyPassword(password, storedUser.passwordHash);
      if (isValid) {
        await createSession(storedUser.id);
        return NextResponse.json({
          success: true,
          user: {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            role: storedUser.role,
            status: storedUser.status,
            provider: storedUser.provider,
            avatarUrl: storedUser.avatarUrl,
          },
        });
      }
    }

    if (!hasDb) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      await createAuditLog("LOGIN_FAILED", "USER", user.id, { ip });
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session & set cookie
    await createSession(user.id);
    await createAuditLog("LOGIN_SUCCESS", "USER", user.id, { ip }, user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Authentication system error." },
      { status: 500 }
    );
  }
}
