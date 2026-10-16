import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";
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

  const tagline = footerNav?.logoText || siteSettings?.tagline || "Run Nodes. Learn Web3. Build Resilient Blockchain Infrastructure.";
  const copyright = siteSettings?.siteTitle ? `© ${new Date().getFullYear()} ${siteSettings.siteTitle.split("—")[0].trim()}. All rights reserved.` : `© ${new Date().getFullYear()} NodeDrops.xyz. All rights reserved.`;

  return (
    <footer className="border-t border-border/80 bg-[#06080f] text-text-secondary text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand description */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" href="/" />
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-status-success font-mono">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span>TiDB Cloud Serverless Engine Active</span>
            </div>
          </div>

          {/* Dynamic Navigation Columns */}
          {sortedColumns.slice(0, 3).map((colName) => (
            <div key={colName} className="space-y-3">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                {colName}
              </h4>
              <ul className="space-y-2 text-xs">
                {columnsMap[colName].map((linkItem) => {
                  const isExternal = linkItem.isExternal || linkItem.link.startsWith("http");
                  return (
                    <li key={linkItem.id || linkItem.link}>
                      {isExternal ? (
                        <a
                          href={linkItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span>{linkItem.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ) : (
                        <Link
                          href={linkItem.link}
                          className="hover:text-text-primary transition-colors"
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

          {/* If there are more columns, render the rest or standard fallback */}
          {sortedColumns.length > 3 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                {sortedColumns[3]}
              </h4>
              <ul className="space-y-2 text-xs">
                {columnsMap[sortedColumns[3]].map((linkItem) => (
                  <li key={linkItem.id || linkItem.link}>
                    <Link
                      href={linkItem.link}
                      className="hover:text-text-primary transition-colors"
                    >
                      {linkItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Educational Disclaimer Warning */}
        <div className="mt-10 pt-6 border-t border-border/40 text-[11px] text-text-muted leading-relaxed space-y-2">
          <p>
            <strong>Educational Disclaimer:</strong> NodeDrops.xyz is an independent educational and tooling
            resource. Node validation, testnet participation, and blockchain software execution involve technical
            and financial risks. We never request private keys, seed phrases, or require wallet connections for reading
            educational content. We do not guarantee airdrops, token distributions, or financial returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-text-secondary">
            <span>{copyright}</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              Built with Next.js App Router, Prisma, TiDB Cloud & Vercel
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
