import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarServerWrapper } from "@/components/sidebar-server-wrapper";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider } from "@/components/sidebar-context";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <SidebarServerWrapper />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 pb-8 md:p-6 md:pb-10">{children}</main>
        </div>
      </div>
      <WhatsAppButton />
    </SidebarProvider>
  );
}
