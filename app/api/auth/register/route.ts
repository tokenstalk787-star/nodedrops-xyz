import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { hashPassword, createSession, createAuditLog } from "@/lib/security/auth";
import { getStore, saveStore, StoredUser } from "@/lib/services/data-store";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`register_${ip}`, 5, 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (name && typeof name === "string") ? name.trim() : cleanEmail.split("@")[0];

    // Check store users first
    const store = getStore();
    store.users = store.users || [];

    const existingInStore = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingInStore) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb) {
      try {
        const existingInDb = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (existingInDb) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please sign in instead." },
            { status: 409 }
          );
        }
      } catch (err) {
        console.warn("DB check error during registration:", err);
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: userId,
      email: cleanEmail,
      name: cleanName,
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      provider: "email",
      createdAt: now,
      updatedAt: now,
    };

    // Save to store
    store.users.push(newUser);
    saveStore(store);

    // Save to DB if available
    if (hasDb) {
      try {
        await prisma.user.create({
          data: {
            id: userId,
            email: cleanEmail,
            name: cleanName,
            passwordHash,
            role: "USER",
            status: "ACTIVE",
          },
        });
      } catch (err) {
        console.warn("Could not write user to database:", err);
      }
    }

    // Create session and set HTTP-only cookie
    await createSession(userId);
    await createAuditLog("REGISTER_SUCCESS", "USER", userId, { email: cleanEmail, ip }, userId);

    return NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        provider: newUser.provider,
      },
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Registration service error. Please try again." },
      { status: 500 }
    );
  }
}
