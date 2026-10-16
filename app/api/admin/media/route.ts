import { NextRequest, NextResponse } from "next/server";
import { getMediaAssets, addMediaAsset, deleteMediaAsset } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const assets = await getMediaAssets(category);
    return NextResponse.json({ assets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.filename || !body.url) {
      return NextResponse.json({ error: "Filename and URL are required." }, { status: 400 });
    }

    const result = await addMediaAsset(
      {
        filename: body.filename,
        url: body.url,
        fileType: body.fileType || "image/png",
        fileSizeKb: body.fileSizeKb || 120,
        dimensions: body.dimensions || "1200x630",
        altText: body.altText || "",
        category: body.category || "image",
      },
      user?.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to add media asset." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "MEDIA_UPLOADED",
        "MEDIA_ASSET",
        result.id,
        { filename: body.filename, url: body.url },
        user.id
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can delete media assets." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Asset ID required." }, { status: 400 });
    }

    const result = await deleteMediaAsset(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete media asset." }, { status: 500 });
    }

    if (user) {
      await createAuditLog("MEDIA_DELETED", "MEDIA_ASSET", id, {}, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete media" }, { status: 500 });
  }
}
