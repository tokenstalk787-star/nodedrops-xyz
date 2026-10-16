import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`contact_${ip}`, 5, 60 * 1000); // max 5 submissions per minute

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = contactFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid contact input." },
        { status: 400 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb) {
      await prisma.contactSubmission.create({
        data: {
          name: validated.data.name,
          email: validated.data.email,
          subject: validated.data.subject,
          message: validated.data.message,
          status: "UNREAD",
        },
      });
    } else {
      console.log("Contact submission received (demo mode):", validated.data);
    }

    return NextResponse.json({ success: true, message: "Message received." });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing your message." },
      { status: 500 }
    );
  }
}
