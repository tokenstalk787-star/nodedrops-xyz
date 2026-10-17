"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Activity,
  Check,
} from "lucide-react";
import { GoogleIcon, XIcon, GithubIcon } from "./social-icons";
import { Logo } from "@/components/ui/logo";

interface AuthCardProps {
  initialMode?: "login" | "register";
}

export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [mode, setMode] = React.useState<"login" | "register">(initialMode);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(true);
  const [rememberMe, setRememberMe] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotSent, setForgotSent] = React.useState(false);

  // Social SSO Modal preview
  const [socialDialog, setSocialDialog] = React.useState<{
    provider: "google" | "x" | "github";
    accountName: string;
    accountEmail: string;
    avatar: string;
  } | null>(null);

  // Calculate password strength
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    return Math.min(100, score);
  }, [password]);

  const strengthLabel = React.useMemo(() => {
    if (passwordStrength === 0) return "";
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 75) return "Good";
    return "Strong (Enterprise Grade)";
  }, [passwordStrength]);

  const strengthColor = React.useMemo(() => {
    if (passwordStrength < 40) return "bg-rose-500";
    if (passwordStrength < 75) return "bg-amber-400";
    return "bg-emerald-400";
  }, [passwordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === "register" && !agreeTerms) {
      setError("Please agree to the Operator Terms of Service.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setSuccessMessage(
        mode === "login"
          ? "Welcome back! Redirecting to your dashboard..."
          : "Account registered successfully! Redirecting..."
      );

      // Redirect after 700ms
      setTimeout(() => {
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push(redirectUrl);
        }
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (provider: "google" | "x" | "github") => {
    setError(null);
    setSocialLoading(provider);

    // Provide friendly simulated accounts for instant testing
    const providerProfiles = {
      google: {
        name: "Alex Vance",
        email: "alex.validator@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      },
      x: {
        name: "@NodeMasterX",
        email: "nodemaster@x.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      github: {
        name: "dev-operator",
        email: "dev.operator@github.com",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      },
    };

    const profile = providerProfiles[provider];

    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to sign in with ${provider}.`);
      }

      setSuccessMessage(`Authenticated via ${provider.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 600);
    } catch (err: any) {
      setError(err.message || "Social login failed.");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFillDemoAdmin = () => {
    setMode("login");
    setEmail("admin@nodedrops.xyz");
    setPassword("NodeDrops2026!Admin");
    setError(null);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotPassword(false);
      setForgotEmail("");
    }, 3000);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Background Radial Glow Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-brand-purple/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[400px] bg-brand-cyan/15 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-blue/15 blur-[140px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Web3 Operator Showcase & Value Proposition */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6 lg:pr-4 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-brand-purple-light text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>ZERO-WALLET PRIVACY GUARANTEE</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Production Web3 Infrastructure & Validator Runbooks
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Join verified node operators running consensus, light nodes, and RPC infrastructure across Ethereum Sepolia, Celestia, Berachain, and Monad.
            </p>
          </div>

          {/* 4 Glowing Benefit Pillars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0b1020]/70 border border-dark-card-border hover:border-brand-purple/40 transition-colors">
              <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-purple-light shrink-0 border border-brand-purple/30">
                <Zap className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white font-sans">Verified Testnet Monitoring</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Real-time synchronization alerts, hardware benchmarks, and official airdrop token allocations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0b1020]/70 border border-dark-card-border hover:border-brand-purple/40 transition-colors">
              <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue-light shrink-0 border border-brand-blue/30">
                <Activity className="w-4 h-4 text-brand-blue-light" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white font-sans">Personalized Operator Watchlist</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Bookmark high-probability testnets, track VPS server costs, and keep deployment logs in sync.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0b1020]/70 border border-dark-card-border hover:border-brand-purple/40 transition-colors">
              <div className="p-2 rounded-xl bg-brand-cyan/20 text-brand-cyan shrink-0 border border-brand-cyan/30">
                <Cpu className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white font-sans">1-Click Command Generator</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Generate pre-configured systemd service daemons, firewall rules (UFW), and automated state-sync scripts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0b1020]/70 border border-dark-card-border hover:border-brand-purple/40 transition-colors">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white font-sans">Zero Wallet Connection Risk</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  We never ask for your seed phrases, private keys, or wallet signatures. 100% educational & open tooling.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Metric Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/15 to-transparent border border-brand-purple/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-brand-purple border border-white/30 flex items-center justify-center text-[10px] font-bold text-white">OP</div>
                <div className="w-7 h-7 rounded-full bg-brand-blue border border-white/30 flex items-center justify-center text-[10px] font-bold text-white">ETH</div>
                <div className="w-7 h-7 rounded-full bg-brand-cyan border border-white/30 flex items-center justify-center text-[10px] font-bold text-black font-mono">TIA</div>
              </div>
              <div className="text-xs text-slate-300 font-sans pl-1">
                <span className="font-bold text-white">1,248+ Operators</span> active
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.98% Uptime</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: The High-End Glassmorphism Auth Card */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative rounded-3xl bg-[#0B1020]/90 backdrop-blur-2xl border border-brand-purple/30 shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden">
            {/* Top Multi-color Gradient Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan" />

            <div className="p-6 sm:p-9 space-y-6">
              {/* Header Branding */}
              <div className="flex items-center justify-between">
                <Logo size="md" href="/" />
                <span className="px-2.5 py-1 rounded-full bg-[#070b16] border border-dark-card-border text-[10px] font-mono text-brand-cyan">
                  v2.4 Production
                </span>
              </div>

              {/* Mode Toggle Tabs (Sign In vs Create Account) */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#070b16] border border-dark-card-border">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center justify-center gap-2 ${
                    mode === "login"
                      ? "bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-lg"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center justify-center gap-2 ${
                    mode === "register"
                      ? "bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-lg"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {mode === "login" ? "Welcome back, Operator" : "Start Your Node Journey"}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary font-sans">
                  {mode === "login"
                    ? "Access your saved runbooks, telemetry bookmarks, and API credentials."
                    : "Create your verified operator identity in under 30 seconds."}
                </p>
              </div>

              {/* Alert Feedback Messages */}
              {error && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* THE 4 AUTHENTICATION METHODS: 1. Google 2. X 3. GitHub    */}
              {/* ======================================================== */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  Quick Social Authorization
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* METHOD 1: GOOGLE */}
                  <button
                    type="button"
                    disabled={loading || socialLoading !== null}
                    onClick={() => handleSocialClick("google")}
                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] hover:bg-[#0f172a] hover:border-slate-500 text-white text-xs font-semibold font-sans transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50"
                  >
                    {socialLoading === "google" ? (
                      <span className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon className="w-4 h-4" />
                    )}
                    <span>Google</span>
                  </button>

                  {/* METHOD 2: X (TWITTER) */}
                  <button
                    type="button"
                    disabled={loading || socialLoading !== null}
                    onClick={() => handleSocialClick("x")}
                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] hover:bg-[#0f172a] hover:border-slate-500 text-white text-xs font-semibold font-sans transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50"
                  >
                    {socialLoading === "x" ? (
                      <span className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XIcon className="w-3.5 h-3.5 text-white" />
                    )}
                    <span>X (Twitter)</span>
                  </button>

                  {/* METHOD 3: GITHUB */}
                  <button
                    type="button"
                    disabled={loading || socialLoading !== null}
                    onClick={() => handleSocialClick("github")}
                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] hover:bg-[#0f172a] hover:border-slate-500 text-white text-xs font-semibold font-sans transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50"
                  >
                    {socialLoading === "github" ? (
                      <span className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <GithubIcon className="w-4 h-4 text-white" />
                    )}
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-dark-card-border/80" />
                <span className="absolute px-3 bg-[#0B1020] text-[11px] font-mono text-text-muted">
                  or continue with email
                </span>
              </div>

              {/* ======================================================== */}
              {/* METHOD 4: EMAIL & PASSWORD FORM                         */}
              {/* ======================================================== */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Register Mode Only) */}
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-text-muted">
                      Full Operator Name / Handle
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Satoshi Nakamoto"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-text-muted">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@nodedrops.xyz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-text-muted">
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[11px] font-mono text-brand-cyan hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-text-muted hover:text-white"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter (Register Mode) */}
                  {mode === "register" && password && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-text-muted">Password Security:</span>
                        <span className={strengthColor.replace("bg-", "text-")}>
                          {strengthLabel}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#070b16] rounded-full overflow-hidden border border-dark-card-border">
                        <div
                          className={`h-full ${strengthColor} transition-all duration-300`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                {mode === "register" ? (
                  <div className="pt-1 space-y-2">
                    <label className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-dark-card-border bg-[#070b16] text-brand-purple focus:ring-brand-purple"
                      />
                      <span className="leading-snug">
                        I agree to the{" "}
                        <Link href="/terms" className="text-brand-cyan hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-brand-cyan hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between text-xs font-mono">
                    <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-dark-card-border bg-[#070b16] text-brand-purple focus:ring-brand-purple"
                      />
                      <span>Remember this browser</span>
                    </label>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-blue hover:from-brand-purple-light hover:to-brand-blue-light text-white font-bold text-xs sm:text-sm font-sans flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-cyan transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "login" ? "Sign In to NodeDrops" : "Create Free Operator Account"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Admin Quick Shortcut */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[11px] font-mono text-text-muted hover:text-brand-cyan transition-colors underline decoration-dotted"
                >
                  Click to pre-fill Demo Administrator credentials (admin@nodedrops.xyz)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#0B1020] border border-brand-purple/40 p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <h3 className="text-lg font-bold text-white">Reset Operator Password</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Enter the verified email address linked to your NodeDrops operator account. We will dispatch a cryptographic reset token.
            </p>

            {forgotSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Password reset instructions dispatched to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="operator@nodedrops.xyz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-dark-card-border bg-[#070b16] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 rounded-xl border border-dark-card-border text-xs text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-purple text-xs font-bold text-white hover:bg-brand-purple-light shadow-md"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
