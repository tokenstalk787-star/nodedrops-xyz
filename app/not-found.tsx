import Link from "next/link";
import { Cpu, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-xl text-center flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      {/* Visual glowing icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-purple/40 to-brand-blue/30 border border-brand-purple/60 flex items-center justify-center shadow-glow-purple">
          <Cpu className="w-12 h-12 text-brand-cyan animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-brand-purple-light uppercase tracking-widest">
          ERROR 404 • UNREACHABLE PEER
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
          The requested route, network specification, or node guide does not exist or has been relocated to another peer.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="primary" size="md" className="gap-2 text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back Home</span>
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" size="md" className="gap-2 text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Search Documentation</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
