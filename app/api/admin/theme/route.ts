import { NextRequest, NextResponse } from "next/server";
import { getThemeConfig, saveThemeConfig } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const theme = await getThemeConfig();
    return NextResponse.json({ theme });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch theme" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    const result = await saveThemeConfig(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save theme." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "THEME_UPDATED",
        "THEME_CONFIG",
        "global-theme",
        { presetName: body.presetName, primaryColor: body.primaryColor },
        user.id
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save theme" }, { status: 500 });
  }
}
