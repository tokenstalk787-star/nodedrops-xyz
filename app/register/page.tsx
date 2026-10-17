import * as React from "react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Create Account — NodeDrops.xyz Operator Portal",
  description:
    "Register for a free NodeDrops.xyz account using Email, Google, X (Twitter), or GitHub to unlock verified testnet runbooks, telemetry alerts, and validator tooling.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <React.Suspense fallback={<div className="text-center text-xs font-mono text-text-muted py-20">Loading Registration Portal...</div>}>
        <AuthCard initialMode="register" />
      </React.Suspense>
    </div>
  );
}
