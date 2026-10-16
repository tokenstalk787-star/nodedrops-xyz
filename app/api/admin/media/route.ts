import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (Real File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const category = (formData.get("category") as any) || "image";
      const altText = (formData.get("altText") as string) || "";

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.name) || ".png";
      const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueFilename = `${sanitizedBase}-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFilename}`;
      const fileSizeKb = Math.round(buffer.length / 1024);

      const result = await addMediaAsset(
        {
          filename: file.name,
          url: publicUrl,
          fileType: file.type || "image/png",
          fileSizeKb,
          dimensions: "Uploaded File",
          altText: altText || file.name,
          category,
        },
        user?.id
      );

      if (user) {
        await createAuditLog(
          "MEDIA_UPLOADED",
          "MEDIA_ASSET",
          result.id,
          { filename: file.name, url: publicUrl, sizeKb: fileSizeKb },
          user.id
        );
      }

      return NextResponse.json({ success: true, id: result.id, url: publicUrl });
    }

    // 2. JSON Body (URL reference)
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

    return NextResponse.json({ success: true, id: result.id, url: body.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process media upload" }, { status: 500 });
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

    // Check if file is in public/uploads/ and remove it
    const assets = await getMediaAssets();
    const asset = assets.find((a) => a.id === id);
    if (asset && asset.url.startsWith("/uploads/")) {
      try {
        const localPath = path.join(process.cwd(), "public", asset.url);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (err) {
        console.warn("Could not delete file from disk:", err);
      }
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
