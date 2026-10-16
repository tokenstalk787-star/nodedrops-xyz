import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/services/data-store";
import {
  getAdminMetrics,
  getNetworks,
  getGuides,
  getOpportunities,
  getTroubleshooting,
  getCommandTemplates,
  getPages,
} from "@/lib/services/data-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const store = getStore();
    store.telemetry.viewsByPath[path] = (store.telemetry.viewsByPath[path] || 0) + 1;
    store.telemetry.totalViews += 1;

    const event = {
      id: `tel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      path,
      referrer,
      userAgent: userAgent?.slice(0, 80),
      timestamp: new Date().toISOString(),
    };

    store.telemetry.events.unshift(event);
    if (store.telemetry.events.length > 200) {
      store.telemetry.events = store.telemetry.events.slice(0, 200);
    }

    saveStore(store);

    return NextResponse.json({ success: true, count: store.telemetry.viewsByPath[path] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const store = getStore();
    const [adminMetrics, networksRes, guidesRes, oppsRes, troubleRes, cmdRes, pagesRes] =
      await Promise.all([
        getAdminMetrics(),
        getNetworks({ limit: 1 }),
        getGuides({ limit: 1 }),
        getOpportunities({ limit: 1 }),
        getTroubleshooting({}),
        getCommandTemplates(),
        getPages(),
      ]);

    const topPages = Object.entries(store.telemetry.viewsByPath)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views);

    return NextResponse.json({
      telemetry: {
        totalViews: store.telemetry.totalViews,
        viewsByPath: store.telemetry.viewsByPath,
        topPages,
        recentEvents: store.telemetry.events.slice(0, 25),
      },
      platform: {
        totalNetworks: networksRes.total || store.networks.length,
        totalGuides: guidesRes.total || store.guides.length,
        totalOpportunities: oppsRes.total || store.opportunities.length,
        totalTroubleshooting: troubleRes.length || store.troubleshooting.length,
        totalCommandTemplates: cmdRes.length || store.commandTemplates.length,
        totalPages: pagesRes.length || store.pages.length,
        auditLogs: adminMetrics.recentLogs || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
