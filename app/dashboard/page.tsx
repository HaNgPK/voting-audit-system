"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/common";
import { OverviewCard } from "@/src/components/common/OverviewCard";
import { FileText, TrendingUp, Users, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0f3a5c", "#fbbf24", "#dc2626", "#10b981", "#8b5cf6"];

const barChartData = [
  { name: "Tổ 1", Bình: 450, An: 320, Cường: 200 },
  { name: "Tổ 2", Bình: 380, An: 490, Cường: 350 },
  { name: "Tổ 3", Bình: 200, An: 450, Cường: 320 },
  { name: "Tổ 4", Bình: 390, An: 380, Cường: 310 },
  { name: "Tổ 5", Bình: 490, An: 430, Cường: 250 },
  { name: "Tổ 6", Bình: 350, An: 520, Cường: 410 },
  { name: "Tổ 7", Bình: 520, An: 390, Cường: 480 },
  { name: "Tổ 8", Bình: 410, An: 340, Cường: 220 },
];

const pieChartData = [
  { name: "Bình", value: 33 },
  { name: "An", value: 30 },
  { name: "Hoa", value: 21 },
  { name: "Độc", value: 9 },
  { name: "Cương", value: 7 },
];

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tổng quan kiểm phiếu
        </h1>
        <p className="text-gray-600 mt-2">
          Theo dõi tiến độ kiểm phiếu bầu cử 3 cấp
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          icon={<FileText className="w-6 h-6" />}
          label="Tổng phiếu đã kiểm"
          value="10,431"
          color="blue"
        />
        <OverviewCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Tiến độ tổng"
          value="25%"
          color="amber"
        />
        <OverviewCard
          icon={<Users className="w-6 h-6" />}
          label="Tổng cử tri"
          value="14,185"
          color="green"
        />
        <OverviewCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Tổ kiểm phiếu"
          value="8"
          color="red"
        />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { name: "Quốc hội", progress: 26, count: "3,636 / 14,185" },
          { name: "Thành phố", progress: 26, count: "3,759 / 14,185" },
          { name: "Xã", progress: 21, count: "3,036 / 14,185" },
        ].map((level) => (
          <Card key={level.name}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {level.name}
              </h3>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                {level.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${level.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{level.count} phiếu</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Tiến độ theo tổ kiểm phiếu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Bình" fill="#0f3a5c" />
              <Bar dataKey="An" fill="#3b82f6" />
              <Bar dataKey="Cường" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Kết quả sơ bộ - Quốc hội
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-center gap-2 text-green-600 text-sm py-6">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Đã nhập thành công!</span>
      </div>
    </div>
  );
}
