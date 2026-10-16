import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "testnet"
    | "mainnet"
    | "active"
    | "upcoming"
    | "ended"
    | "paused"
    | "unverified"
    | "beginner"
    | "intermediate"
    | "advanced"
    | "safe"
    | "caution"
    | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors border";

  const variants = {
    default: "bg-background-hover text-text-secondary border-border",
    outline: "bg-transparent text-text-secondary border-border",
    secondary: "bg-background-secondary text-text-primary border-border",
    testnet: "bg-brand-blue/15 text-brand-blue-light border-brand-blue/30",
    mainnet: "bg-brand-purple/15 text-brand-purple-light border-brand-purple/30",
    active: "bg-status-success/15 text-status-success border-status-success/30",
    upcoming: "bg-brand-cyan/15 text-brand-cyan-light border-brand-cyan/30",
    ended: "bg-text-muted/15 text-text-muted border-text-muted/30",
    paused: "bg-status-warning/15 text-status-warning border-status-warning/30",
    unverified: "bg-slate-800 text-slate-400 border-slate-700",
    beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    advanced: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    safe: "bg-status-success/15 text-status-success border-status-success/30",
    caution: "bg-status-warning/15 text-status-warning border-status-warning/30",
    destructive: "bg-status-error/15 text-status-error border-status-error/30",
  };

  return (
    <span
      className={twMerge(clsx(base, variants[variant], className))}
      {...props}
    />
  );
}
