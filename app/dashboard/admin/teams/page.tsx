"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/hooks/useSession";
import { TeamManagement } from "@/src/components/admin/TeamManagement";
import { BallotManagement } from "@/src/components/admin/BallotManagement";

export default function AdminTeamsPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fadeInDown">
        <h1 className="text-3xl font-bold text-gray-900">🏛️ Tổ kiểm phiếu</h1>
        <p className="text-gray-600 mt-2">
          Quản lý tổ kiểm phiếu, kiểm phiếu viên và danh sách cử tri
        </p>
      </div>
      {/* Quản lý Danh sách bầu cử */}
      <BallotManagement />
      {/* Quản lý Tổ kiểm phiếu */}
      <TeamManagement />
    </div>
  );
}
