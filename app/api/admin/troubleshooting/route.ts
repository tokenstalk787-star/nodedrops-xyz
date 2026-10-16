import { NextRequest, NextResponse } from "next/server";
import {
  getTroubleshooting,
  saveTroubleshooting,
  deleteTroubleshooting,
} from "@/lib/services/data-service";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const tag = req.nextUrl.searchParams.get("tag") || undefined;
    let items = await getTroubleshooting({ search });
    if (tag) {
      items = items.filter((item) => item.tags && item.tags.includes(tag));
    }
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Solution title is required." }, { status: 400 });
    }
    const result = await saveTroubleshooting(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "Solution ID or slug is required." }, { status: 400 });
    }
    const result = await saveTroubleshooting(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const slug = req.nextUrl.searchParams.get("slug");
    const target = id || slug;
    if (!target) {
      return NextResponse.json({ error: "Target ID or slug is required." }, { status: 400 });
    }
    const result = await deleteTroubleshooting(target);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
