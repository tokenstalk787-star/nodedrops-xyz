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
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState<{ show: boolean; text: string; link: string } | null>(null);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings && data.settings.showAnnouncement && data.settings.announcementText) {
          setAnnouncement({
            show: true,
            text: data.settings.announcementText,
            link: data.settings.announcementLink || "/tools/hardware-checker",
          });
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setUserDropdownOpen(false);
      window.location.href = "/";
    } catch {
      // ignore
    }
  };

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
      {announcement?.show && (
        <div className="bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-cyan text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-brand-purple/40 shadow-sm animate-fade-in">
          <span>{announcement.text}</span>
          {announcement.link && (
            <Link href={announcement.link} className="underline hover:text-white font-bold ml-1 inline-flex items-center gap-0.5">
              <span>Explore</span>
              <span>&rarr;</span>
            </Link>
          )}
        </div>
      )}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo: Design Mark on left, Name in front */}
        <Logo size="md" href="/" />

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
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* User Account / Auth Actions */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-dark-card-border bg-[#0B1020] hover:border-brand-purple/60 transition-all text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center font-bold text-white text-xs shadow-sm">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "OP"}
                </div>
                <span className="hidden sm:inline font-sans font-medium text-white max-w-[110px] truncate">
                  {currentUser.name || currentUser.email?.split("@")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0B1020] border border-brand-purple/40 shadow-2xl p-2 z-50 animate-scale-in space-y-1">
                  <div className="p-3 border-b border-dark-card-border space-y-0.5">
                    <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
                    <div className="font-mono text-[10px] text-text-muted truncate">{currentUser.email}</div>
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {currentUser.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-brand-cyan hover:bg-white/5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Control Center</span>
                    </Link>
                  )}

                  <Link
                    href="/#watchlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>My Node Watchlist</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs font-semibold px-3.5 bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple-light hover:to-indigo-500 shadow-sm"
                >
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}

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
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs font-mono text-brand-cyan">
                  Signed in as: {currentUser.name || currentUser.email}
                </div>
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-background-hover"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                    <span>Admin Control Center</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border border-dark-card-border text-white hover:bg-background-hover text-center"
                >
                  <LogIn className="w-4 h-4 text-brand-cyan" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-brand-purple text-white hover:bg-brand-purple-light text-center font-semibold"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

