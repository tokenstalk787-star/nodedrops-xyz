import { NextResponse } from "next/server";
import { isDatabaseConnected } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbConnected = await isDatabaseConnected();

  return NextResponse.json(
    {
      status: "ok",
      platform: "NodeDrops.xyz",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      services: {
        application: "operational",
        database: dbConnected ? "connected" : "fallback_mode",
      },
    },
    { status: 200 }
  );
}
