"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, LogIn, AlertCircle, ShieldCheck, Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Successful login -> route to admin
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col justify-center min-h-[75vh]">
      <div className="text-center space-y-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center mx-auto shadow-glow-purple">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Operator Authentication</h1>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
          Sign in with your verified editor or administrator credentials.
        </p>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg border border-status-error/40 bg-status-error/10 text-xs text-status-error flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">Email Address</label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@nodedrops.xyz"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">Password</label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full text-xs font-semibold gap-2 mt-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Dashboard</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-text-muted space-y-2">
        <p className="flex items-center justify-center gap-1.5 text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Public admin registration is strictly disabled.</span>
        </p>
        <p>
          Need access? Use the secure CLI setup:{" "}
          <code className="text-brand-purple-light font-mono">npm run admin:create</code>
        </p>
      </div>
    </div>
  );
}
