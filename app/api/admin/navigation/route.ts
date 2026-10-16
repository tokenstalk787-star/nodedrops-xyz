import { NextRequest, NextResponse } from "next/server";
import { getNavigationMenu, saveNavigationMenu } from "@/lib/services/data-service";
import { getCurrentUser, createAuditLog } from "@/lib/security/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const location = (searchParams.get("location") || "HEADER").toUpperCase() as "HEADER" | "FOOTER";

    const menu = await getNavigationMenu(location);
    return NextResponse.json({ menu });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch navigation" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await req.json();
    const location = (body.location || "HEADER").toUpperCase() as "HEADER" | "FOOTER";

    const result = await saveNavigationMenu(location, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update navigation." }, { status: 500 });
    }

    if (user) {
      await createAuditLog(
        "NAVIGATION_UPDATED",
        "NAVIGATION_MENU",
        location,
        { location, itemCount: body.items?.length || 0 },
        user.id
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save navigation" }, { status: 500 });
  }
}
