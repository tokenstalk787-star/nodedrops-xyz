import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { getOpportunities, getGuides, getNetworks, getPageBySlug } from "@/lib/services/data-service";
import { NodeDashboardContainer } from "@/components/home/node-dashboard-container";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { PageRenderer } from "@/components/builder/page-renderer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [oppsRes, guidesRes, networksRes, homePage] = await Promise.all([
    getOpportunities({ limit: 50 }),
    getGuides({ limit: 50 }),
    getNetworks({ limit: 50 }),
    getPageBySlug("home"),
  ]);

  // If a published home page exists in the Visual Page Builder, render it dynamically in real time!
  if (homePage && homePage.status === "PUBLISHED" && homePage.sections && homePage.sections.length > 0) {
    return (
      <div className="flex flex-col min-h-screen text-text-primary selection:bg-brand-purple/40">
        {/* Background Radial Glow Effects */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-brand-purple/15 via-brand-blue/10 to-transparent blur-3xl opacity-80" />
          <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <PageRenderer
            sections={homePage.sections}
            networks={networksRes.items}
            guides={guidesRes.items}
            opportunities={oppsRes.items}
          />
        </div>
      </div>
    );
  }

  // Fallback to default layout if no published page exists
  return (
    <div className="flex flex-col min-h-screen text-text-primary selection:bg-brand-purple/40">
      {/* Background Radial Glow Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-brand-purple/15 via-brand-blue/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-3xl" />
      </div>

      {/* PART 1 & 2: POTENTIAL AIRDROPS & TESTNET DASHBOARD */}
      <section className="py-6 sm:py-8 border-b border-border/80">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <NodeDashboardContainer
            initialOpportunities={oppsRes.items}
            totalRunbooks={guidesRes.total || guidesRes.items.length || 28}
          />
        </div>
      </section>

      {/* PART 3: FREQUENTLY ASKED QUESTIONS */}
      <HomeFaqSection />

      {/* PART 4: SECURITY PROTOCOL */}
      <section className="py-12 bg-[#090d18] border-b border-border/80">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="rounded-2xl border border-brand-purple/40 bg-gradient-to-r from-brand-purple/10 via-dark-card to-brand-blue/10 p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-5 shadow-xl">
            <div className="p-3 rounded-xl bg-brand-purple/20 text-brand-purple-light shrink-0 border border-brand-purple/30">
              <ShieldCheck className="w-7 h-7 text-brand-cyan" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  NodeDrops.xyz Operator Security Protocol
                </h3>
                <span className="px-2 py-0.5 rounded bg-status-success/20 text-status-success text-[10px] font-mono border border-status-success/40">
                  ZERO-WALLET GUARANTEE
                </span>
              </div>
              <p>
                <strong>Never share your mnemonic seed phrase or private keys.</strong>{" "}
                NodeDrops.xyz will never request your wallet connection merely to view
                opportunities, benchmark hardware, or read runbooks.
              </p>
              <div className="pt-2">
                <Link
                  href="/security"
                  className="text-brand-cyan hover:underline font-mono text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>Read complete Security & Slashing Prevention Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
