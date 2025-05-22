import { getCurrentUser } from "@/lib/actions/user.actions";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={user.role} />
      <div className="flex-1">
        <div className="container mx-auto py-8">{children}</div>
      </div>
    </div>
  );
}
