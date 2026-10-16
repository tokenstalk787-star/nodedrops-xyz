import * as React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  className?: string;
  useImageOnly?: boolean;
}

export function Logo({
  href = "/",
  size = "md",
  showSubtitle = true,
  className,
  useImageOnly = false,
}: LogoProps) {
  // Height configurations
  const heightClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-xl tracking-tight",
    xl: "text-2xl tracking-tight",
  };

  const subtitleSizes = {
    sm: "text-[8px] tracking-widest",
    md: "text-[9px] tracking-widest",
    lg: "text-[10px] tracking-widest",
    xl: "text-[11px] tracking-widest",
  };

  const content = useImageOnly ? (
    <div className={twMerge(clsx("relative inline-flex items-center", heightClasses[size], className))}>
      <img
        src="/brand/logo-horizontal.png"
        alt="NodeDrops - Incentives Nodes Guide"
        className={twMerge(clsx("h-full w-auto object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]"))}
      />
    </div>
  ) : (
    <div className={twMerge(clsx("flex items-center gap-3 group", className))}>
      {/* 1. Design Mark: Interlocking Hexagonal Chain Emblem */}
      <div
        className={twMerge(
          clsx(
            "relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            iconSizes[size]
          )
        )}
      >
        <img
          src="/brand/logo-icon.png"
          alt="NodeDrops Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]"
        />
      </div>

      {/* 2. Brand Name in front of it */}
      <div className="flex flex-col justify-center">
        <div
          className={twMerge(
            clsx(
              "font-black leading-none font-sans flex items-center select-none",
              textSizes[size]
            )
          )}
        >
          {/* Metallic Silver NODE */}
          <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            NODE
          </span>
          {/* Glowing Neon Cyan-Purple DROPS */}
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            DROPS
          </span>
          <span className="text-brand-cyan text-xs font-mono ml-0.5">.xyz</span>
        </div>

        {showSubtitle && (
          <span
            className={twMerge(
              clsx(
                "text-slate-400 font-mono uppercase mt-0.5 select-none leading-none opacity-90",
                subtitleSizes[size]
              )
            )}
          >
            INCENTIVES NODES GUIDE
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
