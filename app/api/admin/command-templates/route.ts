import { NextRequest, NextResponse } from "next/server";
import {
  getCommandTemplates,
  saveCommandTemplate,
  deleteCommandTemplate,
} from "@/lib/services/data-service";

export async function GET() {
  try {
    const templates = await getCommandTemplates();
    return NextResponse.json({ items: templates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Template name is required." }, { status: 400 });
    }
    const result = await saveCommandTemplate(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "Template ID or slug is required." }, { status: 400 });
    }
    const result = await saveCommandTemplate(body);
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
    const result = await deleteCommandTemplate(target);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
