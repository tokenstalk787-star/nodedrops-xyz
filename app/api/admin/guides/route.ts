import { NextRequest, NextResponse } from "next/server";
import { guideFormSchema } from "@/lib/validation/schemas";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    const validated = guideFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid guide payload." },
        { status: 400 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb && user) {
      const created = await prisma.guide.create({
        data: {
          title: validated.data.title,
          slug: validated.data.slug,
          excerpt: validated.data.excerpt,
          content: validated.data.content,
          status: validated.data.status,
          difficulty: validated.data.difficulty,
          estimatedMinutes: validated.data.estimatedMinutes,
          authorId: user.id,
          publishedAt: validated.data.status === "PUBLISHED" ? new Date() : null,
          lastVerifiedAt: new Date(),
          steps: validated.data.steps
            ? {
                create: validated.data.steps.map((s, idx) => ({
                  orderIndex: idx,
                  title: s.title,
                  explanation: s.explanation,
                  command: s.command || null,
                  expectedOutput: s.expectedOutput || null,
                  warning: s.warning || null,
                  verificationInstructions: s.verificationInstructions || null,
                })),
              }
            : undefined,
        },
      });

      await createAuditLog(
        "GUIDE_CREATED",
        "GUIDE",
        created.id,
        { slug: created.slug, title: created.title },
        user.id
      );

      return NextResponse.json({ success: true, guideId: created.id });
    }

    return NextResponse.json({ success: true, message: "Saved in demo mode." });
  } catch (error: any) {
    console.error("Admin guide creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create guide." },
      { status: 500 }
    );
  }
}
