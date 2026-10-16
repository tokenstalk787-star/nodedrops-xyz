import { NextRequest, NextResponse } from "next/server";
import { getPageRevisions, restorePageRevision } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId") || "page-home";

    const revisions = await getPageRevisions(pageId);
    return NextResponse.json({ revisions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch versions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can perform rollbacks." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.revisionId) {
      return NextResponse.json({ error: "Revision ID is required." }, { status: 400 });
    }

    const result = await restorePageRevision(body.revisionId, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to restore revision." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "PAGE_ROLLED_BACK",
        "PAGE_REVISION",
        body.revisionId,
        { revisionId: body.revisionId },
        user.id
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to restore version" }, { status: 500 });
  }
}
