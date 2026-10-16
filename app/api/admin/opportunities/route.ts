import { NextRequest, NextResponse } from "next/server";
import { opportunityFormSchema } from "@/lib/validation/schemas";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    const validated = opportunityFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid opportunity data." },
        { status: 400 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb && user) {
      const opp = await prisma.opportunity.create({
        data: {
          projectName: validated.data.projectName,
          slug: validated.data.slug,
          description: validated.data.description,
          campaignType: validated.data.campaignType,
          officialAnnouncementUrl: validated.data.officialAnnouncementUrl,
          officialDocumentationUrl: validated.data.officialDocumentationUrl,
          startsAt: validated.data.startsAt ? new Date(validated.data.startsAt) : null,
          endsAt: validated.data.endsAt ? new Date(validated.data.endsAt) : null,
          eligibility: validated.data.eligibility,
          rewardStatus: validated.data.rewardStatus,
          campaignStatus: validated.data.campaignStatus,
          verificationStatus: validated.data.verificationStatus,
          lastCheckedAt: new Date(),
        },
      });

      await createAuditLog("OPPORTUNITY_CREATED", "OPPORTUNITY", opp.id, { slug: opp.slug }, user.id);
      return NextResponse.json({ success: true, opportunityId: opp.id });
    }

    return NextResponse.json({ success: true, message: "Opportunity saved in demo mode." });
  } catch (error: any) {
    console.error("Admin opportunity error:", error);
    return NextResponse.json({ error: error.message || "Opportunity save failure." }, { status: 500 });
  }
}
