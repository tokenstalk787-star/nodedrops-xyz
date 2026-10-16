import { NextRequest, NextResponse } from "next/server";
import { getPages, savePage } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const pages = await getPages();
    return NextResponse.json({ pages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Page title and slug are required." }, { status: 400 });
    }

    const result = await savePage(body, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save page." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "PAGE_SAVED",
        "CUSTOM_PAGE",
        result.id,
        { title: body.title, slug: body.slug, status: body.status || "DRAFT" },
        user.id
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create page" }, { status: 500 });
  }
}
