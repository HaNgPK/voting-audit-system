"use client";

import { Card } from "@/src/components/common";

export const ReportView: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Báo cáo kết quả bầu cử</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Tổng số tổ bầu cử</p>
            <p className="text-4xl font-bold text-blue-600">0</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Tổng phiếu bầu</p>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Tỷ lệ hoàn thành</p>
            <p className="text-4xl font-bold text-purple-600">0%</p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">📈 Chi tiết theo cấp độ</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold">🏛️ Quốc Hội</p>
            <p className="text-sm text-gray-600">Chưa có dữ liệu</p>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold">🏢 Thành Phố</p>
            <p className="text-sm text-gray-600">Chưa có dữ liệu</p>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold">🏘️ Xã</p>
            <p className="text-sm text-gray-600">Chưa có dữ liệu</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
