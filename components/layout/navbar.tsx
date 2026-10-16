"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  BookOpen,
  Wrench,
  Sparkles,
  Search,
  Menu,
  X,
  ShieldCheck,
  Cpu,
  LogIn,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/networks", label: "Networks", icon: Layers },
    { href: "/guides", label: "Guides", icon: BookOpen },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/opportunities", label: "Opportunities", icon: Sparkles },
    { href: "/learn", label: "Learn", icon: GraduationCap },
  ];

  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) {
    return null; // Admin has its own dedicated sidebar layout
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              NodeDrops<span className="text-brand-cyan">.xyz</span>
            </span>
            <span className="text-[10px] text-text-muted font-mono tracking-wider -mt-1 hidden sm:block">
              RUN NODES • WEB3 INFRA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-background-hover text-brand-cyan font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search guides, networks, and tools"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background-secondary/80 text-text-muted hover:text-text-primary hover:border-brand-blue transition-colors text-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-background-card rounded border border-border text-slate-400">
              Ctrl+K
            </kbd>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>Operator Login</span>
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background-secondary px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? "bg-brand-purple/20 text-brand-purple-light font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
                }`}
              >
                <Icon className="w-5 h-5 text-brand-blue" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border/60">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-background-hover"
            >
              <LogIn className="w-4 h-4 text-brand-cyan" />
              <span>Operator Login / Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
