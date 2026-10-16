import { NextRequest, NextResponse } from "next/server";
import { getNetworks, saveNetwork, deleteNetwork } from "@/lib/services/data-service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const type = (searchParams.get("type") as "MAINNET" | "TESTNET") || undefined;
    const res = await getNetworks({ search, type, limit: 100 });
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Network name is required." }, { status: 400 });
    }
    const result = await saveNetwork(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.slug && !body.id) {
      return NextResponse.json({ error: "Network ID or slug is required for updating." }, { status: 400 });
    }
    const result = await saveNetwork(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const target = id || slug;
    if (!target) {
      return NextResponse.json({ error: "Target ID or slug is required for deletion." }, { status: 400 });
    }
    const result = await deleteNetwork(target);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
