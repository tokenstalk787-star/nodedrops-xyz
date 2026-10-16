import Link from "next/link";
import { BookOpen, Plus, Edit, Eye, CheckCircle2, Clock } from "lucide-react";
import { getGuides } from "@/lib/services/data-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Guide Management — Admin",
};

export default async function AdminGuidesPage() {
  const guidesRes = await getGuides({ limit: 50 });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Guide Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Author, edit, version, and publish technical node documentation.
          </p>
        </div>
        <Link href="/admin/guides/new">
          <Button variant="primary" size="sm" className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Guide</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border bg-background-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/80 text-text-muted bg-background-secondary/50">
                <th className="py-3 px-4 font-normal">Title</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Difficulty</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal">Last Verified</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {guidesRes.items.map((g) => (
                <tr key={g.id} className="hover:bg-background-hover/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white max-w-xs truncate">
                    {g.title}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="active">{g.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={g.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}>
                      {g.difficulty}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{g.category}</td>
                  <td className="py-3 px-4 text-text-muted">
                    {new Date(g.lastVerifiedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link href={`/guides/${g.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/admin/guides/new?edit=${g.slug}`}>
                      <Button variant="secondary" size="sm" className="h-7 px-2 text-xs">
                        <Edit className="w-3.5 h-3.5" />
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
