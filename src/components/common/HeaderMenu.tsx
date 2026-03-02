"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function HeaderMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 👇 LOGIC ẨN HEADER: Nếu đang ở trang login hoặc trang chủ gốc thì không render Header
  const hideHeaderRoutes = ["/auth/login", "/"];

  // FIX Ở ĐÂY: Thêm check !pathname hoặc dùng (pathname || "")
  if (!pathname || hideHeaderRoutes.includes(pathname)) {
    return null;
  }
  // Hiển thị nút Back nếu không ở trang chủ dashboard
  const showBack = pathname !== "/dashboard";

  // Logout
  const handleLogout = () => {
    if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  };

  return (
    <>
      {/* Header Desktop + Mobile */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Title */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition"
            >
              <span className="text-2xl sm:text-3xl">🗳️</span>
              <div className="hidden sm:block">
                <h1 className="font-bold text-sm sm:text-lg">
                  Hệ thống kiểm phiếu bầu cử
                </h1>
                <p className="text-xs opacity-75 hidden md:block">
                  Quản lý bầu cử
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-6">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded transition text-sm lg:text-base ${
                  pathname === "/dashboard"
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                🏠 Trang chủ
              </Link>
              <Link
                href="/dashboard/admin"
                className={`px-3 py-2 rounded transition text-sm lg:text-base ${
                  pathname?.includes("/admin")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                👨‍💼 Admin
              </Link>
              <Link
                href="/dashboard/auditor"
                className={`px-3 py-2 rounded transition text-sm lg:text-base ${
                  pathname?.includes("/auditor")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                📋 Kiểm phiếu
              </Link>
              <Link
                href="/dashboard/viewer"
                className={`px-3 py-2 rounded transition text-sm lg:text-base ${
                  pathname?.includes("/viewer")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                📊 Báo cáo
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {showBack && (
                <button
                  onClick={() => router.back()}
                  className="hidden sm:inline-block px-2 sm:px-3 py-2 bg-white/20 hover:bg-white/30 rounded transition text-sm"
                  title="Quay lại"
                >
                  ← Quay lại
                </button>
              )}

              <button
                onClick={handleLogout}
                className="hidden sm:inline-block px-2 sm:px-3 py-2 bg-white/20 hover:bg-white/30 rounded transition text-sm"
                title="Đăng xuất"
              >
                🚪 Thoát
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-white/20 rounded transition"
                aria-label="Menu"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 space-y-1">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                🏠 Trang chủ
              </Link>
              <Link
                href="/dashboard/admin"
                className="block px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                👨‍💼 Admin
              </Link>
              <Link
                href="/dashboard/auditor"
                className="block px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                📋 Kiểm phiếu
              </Link>
              <Link
                href="/dashboard/viewer"
                className="block px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                📊 Báo cáo
              </Link>
              {showBack && (
                <button
                  onClick={() => router.back()}
                  className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition text-sm"
                >
                  ← Quay lại
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition text-sm"
              >
                🚪 Đăng xuất
              </button>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
