import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    const result = await saveSiteSettings(body, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save settings." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "SETTINGS_UPDATED",
        "SITE_SETTINGS",
        "global",
        { updatedKeys: Object.keys(body) },
        user.id
      );
    }

    const updatedSettings = await getSiteSettings();
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save settings" }, { status: 500 });
  }
}
