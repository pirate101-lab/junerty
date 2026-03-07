import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { AppHeader } from "@/components/app-header";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex">
          <AppSidebarWrapper />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
}
