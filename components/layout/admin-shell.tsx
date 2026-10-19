"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  FileText,
  Menu as MenuIcon,
  PanelBottom,
  Sparkles,
  Image as ImageIcon,
  Wrench,
  BookOpen,
  Layers,
  Search,
  Users,
  BarChart3,
  History,
  Shield,
  ArrowLeft,
  LogOut,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Eye,
  Terminal,
  HelpCircle,
  X,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface AdminShellProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  } | null;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // Close mobile drawer when route changes
  React.useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const navSections = [
    {
      group: "WEBSITE BUILDER",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/builder", label: "Visual Page Builder", icon: Palette },
        { href: "/admin/pages", label: "Pages & Sections", icon: FileText },
        { href: "/admin/header", label: "Header & Navigation", icon: MenuIcon },
        { href: "/admin/footer", label: "Footer Layout", icon: PanelBottom },
        { href: "/admin/appearance", label: "Theme & Branding", icon: Sparkles },
        { href: "/admin/media", label: "Media Library", icon: ImageIcon },
      ],
    },
    {
      group: "NODE PLATFORM & TOOLS",
      items: [
        { href: "/admin/networks", label: "Networks Registry", icon: Layers },
        { href: "/admin/guides", label: "Node Guides", icon: BookOpen },
        { href: "/admin/opportunities", label: "Opportunities", icon: Sparkles },
        { href: "/admin/tools", label: "Hardware Rules Config", icon: Cpu },
        { href: "/admin/command-templates", label: "Command Templates", icon: Terminal },
        { href: "/admin/troubleshooting", label: "Troubleshooting Hub", icon: HelpCircle },
      ],
    },
    {
      group: "SYSTEM CONTROL",
      items: [
        { href: "/admin/seo", label: "SEO & Redirects", icon: Search },
        { href: "/admin/users", label: "Users & Permissions", icon: Users },
        { href: "/admin/analytics", label: "Analytics & Telemetry", icon: BarChart3 },
        { href: "/admin/versions", label: "Versions & Rollback", icon: History },
        { href: "/admin/settings", label: "Security & Settings", icon: Shield },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-x-hidden w-full max-w-[100vw]">
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (Visible on md and above)                              */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border bg-[#070a13] sticky top-0 h-screen transition-all duration-300 z-30 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-border/80 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img
                src="/brand/logo-icon.png"
                alt="NodeDrops"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate justify-center">
                <div className="flex items-center text-sm font-black tracking-tight leading-none">
                  <span className="text-white">NODE</span>
                  <span className="bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
                    DROPS
                  </span>
                </div>
                <span className="text-[9px] text-brand-cyan font-mono tracking-widest mt-0.5">
                  CONTROL CENTER
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-text-muted hover:text-white p-1 rounded hover:bg-background-secondary transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto scrollbar-thin">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[10px] font-mono text-text-muted tracking-widest uppercase">
                  {sec.group}
                </span>
              )}
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-medium text-xs ${
                        isActive
                          ? "bg-brand-purple/20 text-brand-purple-light border border-brand-purple/40 font-semibold"
                          : "text-text-secondary hover:text-text-primary hover:bg-background-secondary/60"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop Bottom Actions */}
        <div className="p-3 border-t border-border/80 space-y-1 shrink-0 text-xs font-mono">
          <Link
            href="/"
            target="_blank"
            title="Preview public site"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-secondary transition-colors"
          >
            <Eye className="w-4 h-4 shrink-0 text-brand-cyan" />
            {!collapsed && <span>Preview Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-status-error/80 hover:text-status-error hover:bg-status-error/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE OFF-CANVAS DRAWER (< md screens)                                */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-[#070a13] border-r border-border h-full flex flex-col z-10 shadow-2xl animate-slide-right">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border/80 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img
                  src="/brand/logo-icon.png"
                  alt="NodeDrops"
                  className="w-7 h-7 object-contain"
                />
                <div>
                  <div className="flex items-center text-sm font-black tracking-tight leading-none text-white">
                    <span>NODE</span>
                    <span className="text-brand-cyan">DROPS</span>
                  </div>
                  <span className="text-[9px] text-brand-purple-light font-mono">
                    CONTROL CENTER
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:text-white hover:bg-white/5"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
              {navSections.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="px-3 text-[10px] font-mono text-text-muted tracking-widest uppercase">
                    {sec.group}
                  </span>
                  <div className="space-y-0.5 pt-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname?.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-xs font-medium ${
                            isActive
                              ? "bg-brand-purple/20 text-brand-purple-light border border-brand-purple/40 font-semibold"
                              : "text-text-secondary hover:text-text-primary hover:bg-background-secondary/60"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-brand-cyan" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile Drawer Footer */}
            <div className="p-3 border-t border-border/80 space-y-2 bg-[#05070e]">
              <div className="px-3 py-1.5 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300 truncate">
                User: {user ? user.email : "Demo Admin"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-text-secondary hover:text-white text-center"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Public Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 text-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT COLUMN                                                    */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navbar */}
        <header className="h-14 border-b border-border bg-[#070b14]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border bg-[#0b1020] text-text-secondary hover:text-white transition-colors"
              aria-label="Open Admin Menu"
            >
              <MenuIcon className="w-5 h-5 text-brand-cyan" />
            </button>

            {/* Mobile Brand Title */}
            <div className="md:hidden flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">
                ADMIN <span className="text-brand-purple-light">PANEL</span>
              </span>
            </div>

            {/* Desktop User Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="truncate max-w-[280px]">
                AUTHENTICATED AS: {user ? `${user.name} (${user.role})` : "DEMO ADMINISTRATOR"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="hidden lg:inline text-[11px] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30 px-2 py-0.5 rounded-full">
              CLUSTER: HEALTHY
            </span>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-card-border bg-[#0d1428] text-slate-300 hover:text-white hover:border-brand-purple text-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Preview Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
