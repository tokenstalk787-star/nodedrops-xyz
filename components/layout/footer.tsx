import Link from "next/link";
import { Cpu, ShieldCheck, Terminal, Heart } from "lucide-react";
import { Logo } from "../ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[#06080f] text-text-secondary text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand description */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" href="/" />
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              Run Nodes. Learn Web3. Explore Opportunities. A community-first, production-oriented
              blockchain node education, discovery, and infrastructure tooling platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span>TiDB Cloud Serverless Engine Active</span>
            </div>
          </div>

          {/* Directory */}
          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
              Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/networks" className="hover:text-text-primary transition-colors">
                  Blockchain Networks
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-text-primary transition-colors">
                  Node Setup Guides
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-text-primary transition-colors">
                  Incentivized Programs
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-text-primary transition-colors">
                  Beginner Pathway
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
              Node Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools/hardware-checker" className="hover:text-text-primary transition-colors">
                  Hardware Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/command-builder" className="hover:text-text-primary transition-colors">
                  Command Builder
                </Link>
              </li>
              <li>
                <Link href="/tools/checklist" className="hover:text-text-primary transition-colors">
                  Node Setup Checklist
                </Link>
              </li>
              <li>
                <Link href="/troubleshooting" className="hover:text-text-primary transition-colors">
                  Troubleshooting Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Safety */}
          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/security" className="hover:text-text-primary transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Security & Scam Warning</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-text-primary transition-colors">
                  Risk Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Warning */}
        <div className="mt-10 pt-6 border-t border-border/40 text-[11px] text-text-muted leading-relaxed space-y-2">
          <p>
            <strong>Educational Disclaimer:</strong> NodeDrops.xyz is an independent educational and tooling
            resource. Node validation, testnet participation, and blockchain software execution involve technical
            and financial risks. We never request private keys, seed phrases, or require wallet connections for reading
            educational content. We do not guarantee airdrops, token distributions, or financial returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-text-secondary">
            <span>© {new Date().getFullYear()} NodeDrops.xyz. All rights reserved.</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              Built with Next.js, Prisma, TiDB Cloud & Vercel
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
