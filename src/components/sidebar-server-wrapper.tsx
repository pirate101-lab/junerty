import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebarWrapperClient } from "@/components/app-sidebar-wrapper";

export async function SidebarServerWrapper() {
  const session = await auth();
  let isAdmin = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    isAdmin = user?.role === "ADMIN";
  }
  return <AppSidebarWrapperClient isAdmin={isAdmin} />;
}
