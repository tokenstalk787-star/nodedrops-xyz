import { NextRequest, NextResponse } from "next/server";
import {
  saveToolConfig,
  getCommandTemplates,
  getTroubleshooting,
  getNetworks,
} from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const toolType = searchParams.get("toolType");

    const hasDb = await isDatabaseConnected();
    if (hasDb && toolType) {
      const config = await prisma.toolConfig.findUnique({
        where: { toolType },
      });
      return NextResponse.json({ config });
    }

    // Default response with command templates & troubleshooting counts
    const [templates, trouble, networks] = await Promise.all([
      getCommandTemplates(),
      getTroubleshooting({}),
      getNetworks({ limit: 100 }),
    ]);

    return NextResponse.json({
      config: null,
      summary: {
        commandTemplatesCount: templates.length,
        troubleshootingCount: trouble.length,
        networksCount: networks.total,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch tool config" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.toolType || !body.title) {
      return NextResponse.json({ error: "toolType and title are required." }, { status: 400 });
    }

    const result = await saveToolConfig(body.toolType, {
      title: body.title,
      description: body.description || "",
      rulesConfig: body.rulesConfig || {},
      version: body.version || "1.0.0",
      status: body.status || "PUBLISHED",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save tool config." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "TOOL_CONFIG_UPDATED",
        "TOOL_CONFIG",
        body.toolType,
        { version: body.version },
        user.id
      );
    }

    return NextResponse.json({ success: true, message: "Tool configuration saved." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save tool config" }, { status: 500 });
  }
}
