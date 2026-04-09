import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import SessionGuard from "@/components/dashboard/SessionGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionGuard>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <div className="ml-72 flex-1 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1">
            <div className="dashboard-content">{children}</div>
          </main>
        </div>
      </div>
    </SessionGuard>
  );
}
