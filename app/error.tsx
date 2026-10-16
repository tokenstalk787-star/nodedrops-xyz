"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Runtime exception captured:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 max-w-xl text-center flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-status-error/10 border border-status-error/40 flex items-center justify-center text-status-error">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-status-error uppercase tracking-widest">
          APPLICATION ERROR
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
          A client-side or database communication fault occurred. If you are operating without a configured TiDB cluster, verify your database connection string in your environment.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={() => reset()}
          className="gap-2 text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" size="md" className="gap-2 text-xs">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
