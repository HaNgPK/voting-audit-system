"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/hooks/useSession";
import { UserManagement } from "@/src/components/admin/UserManagement";
import { BallotManagement } from "@/src/components/admin/BallotManagement";
import { TeamManagement } from "@/src/components/admin/TeamManagement";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          👨‍💼 Bảng điều khiển Admin
        </h1>
        <p className="text-gray-600 mt-2">Quản lý hệ thống kiểm phiếu</p>
      </div>

      {/* Quản lý Danh sách bầu cử */}
      <BallotManagement />

      {/* Quản lý Tổ kiểm phiếu */}
      <TeamManagement />

      {/* Quản lý Tài khoản */}
      <UserManagement />
    </div>
  );
}
