"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  Users,
  Settings,
  Vote,
  X,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface NavGroup {
  icon: React.ReactNode;
  label: string;
  basePath: string; // để check active group
  children: NavItem[];
}

// Menu đơn
const SINGLE_ITEMS: NavItem[] = [
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    label: "Tổng quan",
    href: "/dashboard",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Kiểm phiếu",
    href: "/dashboard/auditor",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Kết quả",
    href: "/dashboard/viewer",
  },
];

// Menu nhóm (collapsible)
const ADMIN_GROUP: NavGroup = {
  icon: <ShieldCheck className="w-5 h-5" />,
  label: "Quản trị",
  basePath: "/dashboard/admin",
  children: [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Quản lý TK",
      href: "/dashboard/admin",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Tổ kiểm phiếu",
      href: "/dashboard/admin/teams",
    },
  ],
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Auto-open group nếu đang ở trang admin
  const isInAdminGroup = pathname?.startsWith(ADMIN_GROUP.basePath) || false;
  const [isAdminOpen, setIsAdminOpen] = useState(isInAdminGroup);

  // Sync mở group khi navigate
  useEffect(() => {
    if (isInAdminGroup) {
      setIsAdminOpen(true);
    }
  }, [isInAdminGroup]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Active check chính xác
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    // Exact match cho /dashboard/admin (không match /dashboard/admin/teams)
    if (href === "/dashboard/admin") {
      return pathname === "/dashboard/admin";
    }
    return pathname?.startsWith(href) || false;
  };

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="p-4 border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-lg shadow-lg">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-white text-base">Kiểm Phiếu</h1>
            <p className="text-xs text-blue-200">Bầu cử 2026</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 px-3 space-y-1 overflow-y-auto">
        {/* Single items */}
        {SINGLE_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onClose?.()}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              isActive(item.href)
                ? "bg-blue-600/40 text-white border-l-4 border-amber-500"
                : "text-blue-100 hover:bg-blue-900/30 hover:text-white",
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Divider */}
        <div className="!my-3 border-t border-blue-900/30" />

        {/* Admin Group - Collapsible */}
        <div>
          {/* Group Header — click để toggle */}
          <button
            onClick={() => setIsAdminOpen((prev) => !prev)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              isInAdminGroup
                ? "bg-blue-600/20 text-white"
                : "text-blue-100 hover:bg-blue-900/30 hover:text-white",
            )}
          >
            <span className="flex-shrink-0">{ADMIN_GROUP.icon}</span>
            <span className="text-sm font-medium flex-1 text-left">
              {ADMIN_GROUP.label}
            </span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform duration-200",
                isAdminOpen && "rotate-180",
              )}
            />
          </button>

          {/* Sub items — animation slide */}
          <div
            className={clsx(
              "overflow-hidden transition-all duration-200 ease-in-out",
              isAdminOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0",
            )}
          >
            <div className="ml-3 pl-3 border-l border-blue-800/50 space-y-1">
              {ADMIN_GROUP.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => onClose?.()}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                    isActive(child.href)
                      ? "bg-blue-600/40 text-white font-medium border-l-2 border-amber-500"
                      : "text-blue-200 hover:bg-blue-900/30 hover:text-white",
                  )}
                >
                  <span className="flex-shrink-0">{child.icon}</span>
                  <span>{child.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-900/30">
        <p className="text-xs text-blue-200 text-center">v1.0.0</p>
      </div>
    </>
  );

  // Mobile - Drawer
  if (isMobile && isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#0f3a5c] to-[#0a2a42] shadow-lg z-50 flex flex-col lg:hidden overflow-y-auto">
          <div className="p-4 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col">{sidebarContent}</div>
        </aside>
      </>
    );
  }

  // Desktop - Sidebar
  return (
    <aside
      className={clsx(
        "hidden lg:flex lg:flex-col h-screen w-64 bg-gradient-to-b from-[#0f3a5c] to-[#0a2a42] shadow-lg fixed left-0 top-0",
      )}
    >
      {sidebarContent}
    </aside>
  );
};
