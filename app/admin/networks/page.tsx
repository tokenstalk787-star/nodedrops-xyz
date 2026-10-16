import Link from "next/link";
import { Layers, Plus, Edit, ExternalLink } from "lucide-react";
import { getNetworks } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Network Management — Admin",
};

export default async function AdminNetworksPage() {
  const data = await getNetworks({ limit: 50 });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Network Registry Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain blockchain hardware baselines, node types, documentation URLs, and verification dates.
          </p>
        </div>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Network Name</th>
                <th className="py-3 px-4 font-normal">Type</th>
                <th className="py-3 px-4 font-normal">Chain ID</th>
                <th className="py-3 px-4 font-normal">Min CPU/RAM</th>
                <th className="py-3 px-4 font-normal">Min Storage</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.items.map((net) => (
                <tr key={net.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {net.name}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={net.networkType === "MAINNET" ? "mainnet" : "testnet"}>
                      {net.networkType}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{net.chainId || "Non-EVM / Native"}</td>
                  <td className="py-3 px-4 text-text-secondary">
                    {net.hardwareRequirements.min.cpuCores}C / {net.hardwareRequirements.min.ramGb}GB
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {net.hardwareRequirements.min.ssdGb} GB NVMe
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link href={`/networks/${net.slug}`} target="_blank">
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
