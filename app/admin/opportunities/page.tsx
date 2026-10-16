import Link from "next/link";
import { Sparkles, Plus, ExternalLink, Calendar } from "lucide-react";
import { getOpportunities } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Opportunities Management — Admin",
};

export default async function AdminOpportunitiesPage() {
  const opps = await getOpportunities({ limit: 50 });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Opportunities & Campaigns</h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain validator programs, incentivized testnet campaigns, and verification statuses.
          </p>
        </div>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Project</th>
                <th className="py-3 px-4 font-normal">Campaign Type</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Reward Status</th>
                <th className="py-3 px-4 font-normal">Verification</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {opps.items.map((opp) => (
                <tr key={opp.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {opp.projectName}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{opp.campaignType}</td>
                  <td className="py-3 px-4">
                    <Badge variant={opp.campaignStatus.toLowerCase() as "active" | "upcoming" | "ended"}>
                      {opp.campaignStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className={opp.rewardStatus === "CONFIRMED" ? "text-status-success" : "text-amber-400"}>
                      {opp.rewardStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-brand-cyan">{opp.verificationStatus}</td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/opportunities/${opp.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
