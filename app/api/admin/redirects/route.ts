import { NextRequest, NextResponse } from "next/server";
import { getRedirectRules, saveRedirectRule, deleteRedirectRule } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isInternal = req.headers.get("x-internal-middleware") === "true";
    if (!isInternal) {
      const user = await getCurrentUser();
      if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
        return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
      }
    }

    const rules = await getRedirectRules();
    return NextResponse.json({ rules });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch redirects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.sourcePath || !body.targetPath) {
      return NextResponse.json({ error: "Source and target paths are required." }, { status: 400 });
    }

    const result = await saveRedirectRule({
      id: body.id,
      sourcePath: body.sourcePath,
      targetPath: body.targetPath,
      statusCode: Number(body.statusCode) || 301,
      isActive: body.isActive ?? true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save redirect rule." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "REDIRECT_SAVED",
        "REDIRECT_RULE",
        body.sourcePath,
        { targetPath: body.targetPath, statusCode: body.statusCode },
        user.id
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save redirect" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can delete redirects." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Rule ID required." }, { status: 400 });
    }

    const result = await deleteRedirectRule(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete redirect rule." }, { status: 500 });
    }

    if (user) {
      await createAuditLog("REDIRECT_DELETED", "REDIRECT_RULE", id, {}, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete redirect" }, { status: 500 });
  }
}
