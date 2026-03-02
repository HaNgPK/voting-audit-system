"use client";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🗳️ Hệ thống kiểm phiếu bầu cử
        </h1>
        <p className="text-gray-600 mb-6">
          Chào mừng bạn đến với hệ thống quản lý kiểm phiếu bầu cử
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard/admin"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              👨‍💼 Admin
            </h2>
            <p className="text-sm text-gray-600">
              Quản lý tài khoản và tổ kiểm phiếu
            </p>
          </a>

          <a
            href="/dashboard/auditor"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              📋 Kiểm phiếu
            </h2>
            <p className="text-sm text-gray-600">Nhập liệu kiểm phiếu</p>
          </a>

          <a
            href="/dashboard/viewer"
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              📊 Báo cáo
            </h2>
            <p className="text-sm text-gray-600">Xem thống kê kết quả</p>
          </a>
        </div>
      </div>
    </div>
  );
}
