import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings, getRedirectRules } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, redirects] = await Promise.all([
      getSiteSettings(),
      getRedirectRules(),
    ]);
    return NextResponse.json({ settings, redirects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    const allowedKeys = [
      "siteTitle",
      "siteDescription",
      "keywords",
      "ogImage",
      "robotsDirective",
      "googleVerification",
    ];

    const payload: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        payload[key] = body[key];
      }
    }

    const result = await saveSiteSettings(payload, user?.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save SEO settings." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "SEO_UPDATED",
        "SITE_SETTINGS",
        "seo-defaults",
        payload,
        user.id
      );
    }

    const updated = await getSiteSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
