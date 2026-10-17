import * as React from "react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign In — NodeDrops.xyz Operator Portal",
  description:
    "Sign in to your NodeDrops.xyz account using Email, Google, X (Twitter), or GitHub to manage node runbooks, watchlists, and hardware benchmarks.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <React.Suspense fallback={<div className="text-center text-xs font-mono text-text-muted py-20">Loading Operator Portal...</div>}>
        <AuthCard initialMode="login" />
      </React.Suspense>
    </div>
  );
}
