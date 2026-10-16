import { NextRequest, NextResponse } from "next/server";
import { getPages, savePage, deletePage } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { id } = await params;
    const pages = await getPages();
    const page = pages.find((p) => p.id === id || p.slug === id);

    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const result = await savePage({ ...body, id }, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update page." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "PAGE_UPDATED",
        "CUSTOM_PAGE",
        id,
        { title: body.title, status: body.status },
        user.id
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can delete pages." }, { status: 403 });
    }

    const { id } = await params;
    const result = await deletePage(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete page." }, { status: 500 });
    }

    if (user) {
      await createAuditLog("PAGE_DELETED", "CUSTOM_PAGE", id, {}, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete page" }, { status: 500 });
  }
}
