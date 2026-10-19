import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/security/auth";
import { AdminShell } from "@/components/layout/admin-shell";

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
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
