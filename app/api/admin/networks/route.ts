import { NextRequest, NextResponse } from "next/server";
import { networkFormSchema } from "@/lib/validation/schemas";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can manage networks." }, { status: 403 });
    }

    const body = await req.json();
    const validated = networkFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid network data." },
        { status: 400 }
      );
    }

    const hasDb = await isDatabaseConnected();
    if (hasDb && user) {
      const net = await prisma.network.create({
        data: {
          name: validated.data.name,
          slug: validated.data.slug,
          description: validated.data.description,
          networkType: validated.data.networkType,
          chainId: validated.data.chainId || null,
          officialUrl: validated.data.officialUrl,
          documentationUrl: validated.data.documentationUrl,
          nodeTypes: validated.data.nodeTypes,
          hardwareRequirements: validated.data.hardwareRequirements,
          status: validated.data.status,
          lastVerifiedAt: new Date(),
        },
      });

      await createAuditLog("NETWORK_CREATED", "NETWORK", net.id, { slug: net.slug }, user.id);
      return NextResponse.json({ success: true, networkId: net.id });
    }

    return NextResponse.json({ success: true, message: "Network saved in demo mode." });
  } catch (error: any) {
    console.error("Admin network error:", error);
    return NextResponse.json({ error: error.message || "Network save failure." }, { status: 500 });
  }
}
