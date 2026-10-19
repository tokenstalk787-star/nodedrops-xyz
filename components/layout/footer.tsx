import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "../ui/logo";
import { getNavigationMenu, getSiteSettings } from "@/lib/services/data-service";

export async function Footer() {
  const [footerNav, siteSettings] = await Promise.all([
    getNavigationMenu("FOOTER"),
    getSiteSettings(),
  ]);

  // Group active items by columnName
  const enabledItems = (footerNav?.items || []).filter((i) => i.isEnabled);
  const columnOrder = ["Platform", "Directory", "Tools", "Community", "Legal", "Trust & Legal"];
  const columnsMap: Record<string, typeof enabledItems> = {};

  enabledItems.forEach((item) => {
    const col = item.columnName || "Platform";
    if (!columnsMap[col]) columnsMap[col] = [];
    columnsMap[col].push(item);
  });

  // Unique columns sorted
  const sortedColumns = Object.keys(columnsMap).sort((a, b) => {
    const idxA = columnOrder.indexOf(a);
    const idxB = columnOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const tagline =
    footerNav?.logoText ||
    siteSettings?.tagline ||
    "Run Nodes. Learn Web3. Build Resilient Blockchain Infrastructure.";
  const copyright = siteSettings?.siteTitle
    ? `© ${new Date().getFullYear()} ${siteSettings.siteTitle.split("—")[0].trim()}. All rights reserved.`
    : `© ${new Date().getFullYear()} NodeDrops.xyz. All rights reserved.`;

  return (
    <footer className="border-t border-border/80 bg-[#06080f] text-text-secondary text-sm overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand description */}
          <div className="md:col-span-4 lg:col-span-5 space-y-4">
            <Logo size="md" href="/" />
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-status-success/10 border border-status-success/20 text-[11px] text-status-success font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span>TiDB Cloud Serverless Engine Active</span>
            </div>
          </div>

          {/* Dynamic Navigation Columns: 2 cols on mobile, 3 cols on sm+, grid inside md:col-span-8 lg:col-span-7 */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {sortedColumns.map((colName) => (
              <div key={colName} className="space-y-3">
                <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                  {colName}
                </h4>
                <ul className="space-y-2.5 text-xs">
                  {columnsMap[colName].map((linkItem) => {
                    const isExternal =
                      linkItem.isExternal || linkItem.link.startsWith("http");
                    return (
                      <li key={linkItem.id || linkItem.link}>
                        {isExternal ? (
                          <a
                            href={linkItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-text-primary transition-colors inline-flex items-center gap-1.5 py-0.5"
                          >
                            <span>{linkItem.label}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ) : (
                          <Link
                            href={linkItem.link}
                            className="hover:text-text-primary transition-colors inline-block py-0.5"
                          >
                            {linkItem.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Disclaimer Warning */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/40 space-y-4">
          <p className="text-[11px] sm:text-xs text-text-muted/80 leading-relaxed">
            <strong className="text-text-secondary font-medium">Educational Disclaimer:</strong> NodeDrops.xyz is an independent educational and tooling
            resource. Node validation, testnet participation, and blockchain software execution involve technical
            and financial risks. We never request private keys, seed phrases, or require wallet connections for reading
            educational content. We do not guarantee airdrops, token distributions, or financial returns.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border/20 text-[11px] sm:text-xs text-text-muted">
            <span>{copyright}</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-text-muted/80">
              Built with Next.js App Router, Prisma, TiDB Cloud & Vercel
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
