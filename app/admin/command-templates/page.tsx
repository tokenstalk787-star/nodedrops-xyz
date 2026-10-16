import Link from "next/link";
import { Terminal, ShieldCheck } from "lucide-react";
import { getCommandTemplates } from "@/lib/services/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Command Templates — Admin",
};

export default async function AdminCommandTemplatesPage() {
  const templates = await getCommandTemplates();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Node Command Templates</h1>
        <p className="text-xs text-text-secondary mt-1">
          Reviewed, parameterized bash, docker-compose, and systemd units for the Command Builder.
        </p>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Template Name</th>
                <th className="py-3 px-4 font-normal">Network</th>
                <th className="py-3 px-4 font-normal">Method</th>
                <th className="py-3 px-4 font-normal">Version</th>
                <th className="py-3 px-4 font-normal">Risk Level</th>
                <th className="py-3 px-4 font-normal text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white">{t.name}</td>
                  <td className="py-3 px-4 text-text-secondary">{t.networkSlug}</td>
                  <td className="py-3 px-4 text-brand-cyan">{t.installationMethod}</td>
                  <td className="py-3 px-4 text-text-muted">{t.version}</td>
                  <td className="py-3 px-4">
                    <Badge variant="safe">{t.riskLevel}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-text-muted">
                    {new Date(t.lastVerifiedAt).toLocaleDateString()}
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
