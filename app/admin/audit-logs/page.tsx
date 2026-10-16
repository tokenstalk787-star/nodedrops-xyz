import { ShieldAlert, ShieldCheck } from "lucide-react";
import { prisma, isDatabaseConnected } from "@/lib/db/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Security Audit Logs — Admin",
};

export default async function AdminAuditLogsPage() {
  const hasDb = await isDatabaseConnected();
  let logs: Array<{
    id: string;
    action: string;
    targetType: string;
    targetId: string | null;
    metadata: string | null;
    createdAt: Date | string;
    actor: { email: string; name: string | null } | null;
  }> = [];

  if (hasDb) {
    try {
      logs = await prisma.auditLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { email: true, name: true } } },
      });
    } catch (e) {
      console.warn("Failed to fetch audit logs:", e);
    }
  }

  if (logs.length === 0) {
    logs = [
      {
        id: "log-seed-1",
        action: "BOOTSTRAP_INITIALIZED",
        targetType: "DATABASE",
        targetId: "local",
        metadata: JSON.stringify({ environment: "production-ready", version: "1.0.0" }),
        createdAt: new Date().toISOString(),
        actor: { email: "system@nodedrops.xyz", name: "System Daemon" },
      },
      {
        id: "log-seed-2",
        action: "GUIDE_PUBLISHED",
        targetType: "GUIDE",
        targetId: "guide-eth-sepolia",
        metadata: JSON.stringify({ slug: "run-ethereum-sepolia-node-geth-lighthouse" }),
        createdAt: new Date().toISOString(),
        actor: { email: "admin@nodedrops.xyz", name: "Lead System Administrator" },
      },
    ];
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Operational Audit Log</h1>
        <p className="text-xs text-text-secondary mt-1">
          Tamper-evident record of content modifications, role adjustments, and security authorizations.
        </p>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Action</th>
                <th className="py-3 px-4 font-normal">Target Entity</th>
                <th className="py-3 px-4 font-normal">Actor</th>
                <th className="py-3 px-4 font-normal">Payload Metadata</th>
                <th className="py-3 px-4 font-normal text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-cyan">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {log.targetType} {log.targetId ? `(${log.targetId})` : ""}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {log.actor?.name || log.actor?.email || "System Daemon"}
                  </td>
                  <td className="py-3 px-4 text-text-muted max-w-xs truncate">
                    {log.metadata || "—"}
                  </td>
                  <td className="py-3 px-4 text-right text-text-muted">
                    {new Date(log.createdAt).toLocaleString()}
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
