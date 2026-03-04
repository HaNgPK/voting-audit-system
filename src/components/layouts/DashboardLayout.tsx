"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/src/components/common/Sidebar";
import { Header } from "@/src/components/common/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Kiểm tra có phải trang dashboard không
  const isDashboard = pathname?.startsWith("/dashboard");

  if (!isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop Fixed */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#0f3a5c] to-[#0a2a42] shadow-lg">
        <Sidebar isOpen={true} />
      </div>

      {/* Sidebar - Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header - Fixed */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white shadow-md z-30 border-b border-gray-200">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto mt-16 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
