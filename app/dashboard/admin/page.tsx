// File tổng của trang Admin (VD: src/app/admin/page.tsx)
import { TeamManagement } from "@/src/components/admin/TeamManagement";
import { UserManagement } from "@/src/components/admin/UserManagement";
import { BallotManagement } from "@/src/components/admin/BallotManagement"; // Import file mới

export default function AdminDashboard() {
  const isAdmin = true; // Biến kiểm tra quyền của bạn

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bảng điều khiển Admin
      </h1>

      {/* Bảng 1: Quản lý người dùng */}
      <UserManagement />

      {/* Bảng 2: QUẢN LÝ DANH SÁCH BẦU CỬ (Vừa tạo) */}
      <BallotManagement />

      {/* Bảng 3: Quản lý tổ bầu cử (Đã làm ở bước trước) */}
      <TeamManagement isAdmin={isAdmin} />
    </div>
  );
}
