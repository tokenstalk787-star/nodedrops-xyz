"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TelemetryTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    // Send anonymous telemetry event to /api/telemetry
    try {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
        }),
      }).catch(() => {});
    } catch {
      // Ignore background telemetry errors
    }
  }, [pathname]);

  return null;
}
