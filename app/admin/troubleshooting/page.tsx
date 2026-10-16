import Link from "next/link";
import { HelpCircle, Plus } from "lucide-react";
import { getTroubleshooting } from "@/lib/services/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Troubleshooting Admin — Admin",
};

export default async function AdminTroubleshootingPage() {
  const items = await getTroubleshooting({});

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Troubleshooting Solutions</h1>
        <p className="text-xs text-text-secondary mt-1">
          Maintain diagnostic runbooks, error symptom patterns, and safe recovery procedures.
        </p>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Issue Title</th>
                <th className="py-3 px-4 font-normal">Symptoms</th>
                <th className="py-3 px-4 font-normal">Tags</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-text-secondary max-w-md truncate">
                    {item.symptoms}
                  </td>
                  <td className="py-3 px-4 text-brand-cyan">
                    {item.tags.slice(0, 3).join(", ")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href="/troubleshooting" target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        View Public
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
