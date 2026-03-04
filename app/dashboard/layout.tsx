import ProtectedRoute from "@/src/components/common/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Bọc toàn bộ nội dung của Dashboard bằng Trạm kiểm soát
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Sau này bạn có thể thêm Sidebar và Header dùng chung ở đây */}

        <main className="p-4 sm:p-8">
          {children} {/* Nơi render ra các trang con của dashboard */}
        </main>
      </div>
    </ProtectedRoute>
  );
}
