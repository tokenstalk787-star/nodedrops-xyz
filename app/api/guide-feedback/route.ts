import { NextRequest, NextResponse } from "next/server";
import { guideFeedbackSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`feedback_${ip}`, 10, 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = guideFeedbackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid feedback payload." },
        { status: 400 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb) {
      await prisma.guideFeedback.create({
        data: {
          guideId: validated.data.guideId,
          helpful: validated.data.helpful,
          message: validated.data.message || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to record feedback." }, { status: 500 });
  }
}
