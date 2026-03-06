"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";

interface AppSidebarWrapperClientProps {
  isAdmin: boolean;
}

export function AppSidebarWrapperClient({ isAdmin }: AppSidebarWrapperClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AppSidebar
        isAdmin={isAdmin}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Hidden state holder for header to read */}
      <button
        id="sidebar-toggle-hidden"
        className="hidden"
        data-sidebar-open={sidebarOpen ? "true" : "false"}
        onClick={() => setSidebarOpen((o) => !o)}
      />
    </>
  );
}
