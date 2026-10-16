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
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

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
    <aside
      className={`border-r border-border bg-[#070a13] flex flex-col shrink-0 min-h-screen text-xs transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
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

      {/* Navigation Sections */}
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
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-medium ${
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

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/80 space-y-1">
        <Link
          href="/"
          target="_blank"
          title="Preview public site"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-secondary transition-colors"
        >
          <Eye className="w-4 h-4 shrink-0 text-brand-cyan" />
          {!collapsed && <span>Preview Public Site</span>}
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
  );
}
