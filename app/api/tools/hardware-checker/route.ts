import { NextRequest, NextResponse } from "next/server";
import { evaluateHardware } from "@/lib/services/data-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await evaluateHardware({
      networkSlug: body.networkSlug || "ethereum-sepolia",
      nodeType: body.nodeType || "Full Node",
      cpuCores: Number(body.cpuCores) || 4,
      ramGb: Number(body.ramGb) || 16,
      ssdGb: Number(body.ssdGb) || 500,
      bandwidthMbps: Number(body.bandwidthMbps) || 100,
      operatingSystem: body.operatingSystem || "Ubuntu 24.04 LTS",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Hardware evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate hardware requirements" },
      { status: 500 }
    );
  }
}
