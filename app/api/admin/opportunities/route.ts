import { NextRequest, NextResponse } from "next/server";
import {
  getOpportunities,
  saveOpportunity,
  deleteOpportunity,
} from "@/lib/services/data-service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const rewardStatus = searchParams.get("rewardStatus") || undefined;
    const opps = await getOpportunities({ search, status, rewardStatus, limit: 100 });
    return NextResponse.json(opps);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.projectName) {
      return NextResponse.json({ error: "Project name is required." }, { status: 400 });
    }
    const result = await saveOpportunity(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "Opportunity ID or slug is required." }, { status: 400 });
    }
    const result = await saveOpportunity(body);
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
    const result = await deleteOpportunity(target);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
