import { NextResponse } from "next/server";
import { destroySession } from "@/lib/security/auth";

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
