"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User, Settings, ChevronDown, Menu } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage khi component mount
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Xử lý responsive
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Logic Đăng xuất chuẩn xác: Xóa vé -> Thông báo -> Đá về Login
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    router.push("/auth/login");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      ADMIN: { label: "👨‍💼 Admin", color: "text-red-600" },
      AUDITOR: { label: "📋 Kiểm phiếu", color: "text-blue-600" },
      VIEWER: { label: "📊 Báo cáo", color: "text-green-600" },
    };
    return labels[role] || { label: role, color: "text-gray-600" };
  };

  const roleInfo = getRoleLabel(user?.role);

  return (
    <header className="h-full px-4 sm:px-6 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      {/* Left Section - Mobile Menu & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger Menu - Mobile Only */}
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Title */}
        <div className="text-white hidden sm:block">
          <h2 className="text-sm sm:text-lg font-semibold truncate">
            🗳️ Hệ thống kiểm phiếu
          </h2>
        </div>
      </div>

      {/* Right Section - Notifications & User Menu */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Icon */}
        <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-md flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            {/* User Info - Hidden on very small screens */}
            <div className="hidden sm:block text-left">
              <p className="text-xs sm:text-sm font-medium text-white truncate max-w-[100px] sm:max-w-none">
                {user?.name || "Đang tải..."}
              </p>
              <p className={`text-xs font-semibold ${roleInfo.color}`}>
                {roleInfo.label}
              </p>
            </div>

            <ChevronDown
              className={clsx(
                "w-3 h-3 sm:w-4 sm:h-4 text-gray-300 transition-transform duration-200 hidden sm:block",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
              {/* User Info */}
              <div className="px-4 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {user?.email || "..."}
                </p>
                <p className={`text-xs font-bold mt-2 ${roleInfo.color}`}>
                  {roleInfo.label}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
                  <User className="w-4 h-4" />
                  <span>Hồ sơ</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
                  <Settings className="w-4 h-4" />
                  <span>Cài đặt</span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-gray-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
