"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/common";
import { OverviewCard } from "@/src/components/common/OverviewCard";
import {
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Building2,
} from "lucide-react";
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
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
  "#ec4899",
  "#14b8a6",
];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State lưu Tổ kiểm phiếu đang được chọn trên Dropdown
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          // Gán giá trị mặc định cho Dropdown là Tổ đầu tiên
          if (res.data.teamNames && res.data.teamNames.length > 0) {
            setSelectedTeam(res.data.teamNames[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Lọc data cho Biểu đồ mới dựa theo Tổ đã chọn
  const teamChartData = useMemo(() => {
    if (!data || !selectedTeam) return [];
    return data.candidateResults
      .filter((c: any) => c.teamName === selectedTeam)
      .map((c: any) => ({
        name: c.name,
        "Số phiếu": c.votesCount,
        levelInfo:
          c.ballot?.level === "QUOCHOI"
            ? "QH"
            : c.ballot?.level === "THANHPHO"
              ? "TP"
              : "Xã",
      }));
  }, [data, selectedTeam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <p className="text-2xl animate-spin mb-4">⏳</p>
          <p className="text-gray-500 font-bold animate-pulse">
            Đang tổng hợp số liệu từ các tổ...
          </p>
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <p className="text-red-500 text-center mt-10">
        Lỗi không thể tải dữ liệu báo cáo
      </p>
    );

  // Lọc những ứng viên có phiếu để show dưới bảng (Table)
  const candidateResultsHasVotes = data.candidateResults.filter(
    (c: any) => c.votesCount > 0,
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📊 Tổng quan Bầu cử
          </h1>
          <p className="text-gray-500 mt-1">
            Cập nhật theo thời gian thực từ các Tổ kiểm phiếu
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors w-full sm:w-auto"
        >
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {/* 4 OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          icon={<FileText className="w-6 h-6" />}
          label="Tổng phiếu đã kiểm"
          value={data.totalBallots.toLocaleString()}
          color="blue"
        />
        <OverviewCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Phiếu Hợp Lệ"
          value={data.validBallots.toLocaleString()}
          color="green"
        />
        <OverviewCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Phiếu Hỏng / Trắng"
          value={data.invalidBallots.toLocaleString()}
          color="red"
        />
        <OverviewCard
          icon={<Users className="w-6 h-6" />}
          label="Tổ kiểm phiếu hđ"
          value={data.teamsCount}
          color="amber"
        />
      </div>

      {/* 3 LEVEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "🏛️ Quốc hội", count: data.levelStats.QUOCHOI.count },
          { name: "🏢 Thành phố", count: data.levelStats.THANHPHO.count },
          { name: "🏘️ Xã", count: data.levelStats.XA.count },
        ].map((level, i) => (
          <Card
            key={i}
            className="p-6 border-t-4 hover:-translate-y-1 transition-transform"
            style={{ borderTopColor: COLORS[i] }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {level.name}
            </h3>
            <p className="text-4xl font-black" style={{ color: COLORS[i] }}>
              {level.count.toLocaleString()}{" "}
              <span className="text-sm font-medium text-gray-400">phiếu</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ cột: Tốc độ theo tổ */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            📈 Tiến độ đếm phiếu chung các Tổ
          </h3>
          <div className="h-80">
            {data.barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.barChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="Số phiếu"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Chưa có tổ nào nộp phiếu
              </div>
            )}
          </div>
        </Card>

        {/* Biểu đồ tròn: Cấp độ */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            🎯 Phân bổ kiểm phiếu theo Cấp độ
          </h3>
          <div className="h-80">
            {data.pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    label={(props: any) =>
                      `${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {data.pieChartData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ✅ BIỂU ĐỒ MỚI: CHI TIẾT ỨNG VIÊN THEO TỔ CỤ THỂ */}
      <Card className="p-6 border-2 border-indigo-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-500" /> Kết quả ứng viên
              chi tiết
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Biểu đồ hiển thị chính xác kết quả của từng ứng viên theo Tổ phụ
              trách
            </p>
          </div>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2 border-2 border-indigo-200 rounded-xl text-sm font-bold text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 min-w-[200px]"
          >
            {data.teamNames.length > 0 ? (
              data.teamNames.map((name: string) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))
            ) : (
              <option value="">Chưa có tổ nào</option>
            )}
          </select>
        </div>

        <div className="h-96">
          {teamChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamChartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: "bold" }}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} phiếu`,
                    `(${props.payload.levelInfo})`,
                  ]}
                />
                <Bar
                  dataKey="Số phiếu"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                  animationDuration={1000}
                >
                  {teamChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Tổ này chưa được gán hòm phiếu hoặc chưa có ứng viên
            </div>
          )}
        </div>
      </Card>

      {/* BẢNG TỔNG HỢP CHI TIẾT */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          📑 Bảng thống kê người đạt điểm
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  Tổ phụ trách
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  Cấp độ
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  Danh sách bầu
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  Ứng cử viên
                </th>
                <th className="px-4 py-3 font-semibold text-gray-900 text-right whitespace-nowrap">
                  Số phiếu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidateResultsHasVotes.map((c: any) => (
                <tr
                  key={c.id}
                  className="hover:bg-indigo-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-indigo-700 whitespace-nowrap">
                    {c.teamName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">
                      {c.ballot?.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 min-w-[200px]">
                    {c.ballot?.name}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                    {c.gender === "Nữ" ? "Bà" : "Ông"} {c.name}
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-600 text-right text-lg whitespace-nowrap">
                    {c.votesCount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {candidateResultsHasVotes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Chưa có ứng viên nào được ghi nhận phiếu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
