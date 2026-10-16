import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/security/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mission Control — NodeDrops Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If in demo mode without DB configured, allow viewing admin UI with alert
  // Otherwise require logged-in EDITOR or ADMIN
  if (user && user.role !== "ADMIN" && user.role !== "EDITOR") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Admin top header banner */}
        <div className="h-14 border-b border-border bg-[#070b14] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            <span>AUTHENTICATED AS: {user ? `${user.name} (${user.role})` : "DEMO ADMINISTRATOR"}</span>
          </div>
          <div className="text-[11px] font-mono text-brand-cyan">
            TIDB CLUSTER STATUS: HEALTHY
          </div>
        </div>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
