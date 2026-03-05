"use client";

import React, { useMemo } from "react";
import { Button } from "@/src/components/common";
import { LevelTabs } from "./LevelTabs";
import {
  Play,
  FileText,
  CheckSquare,
  Building2,
  Landmark,
  MapPin,
  TrendingUp,
  Users,
  Inbox, // <-- Đã thêm icon Inbox cho Empty State
} from "lucide-react";
import type { Ballot } from "@/src/data/mockElectionTeams";
import type { VotingPhase } from "@/src/data/mockVotingAssignments";

interface VotingInterfaceProps {
  team: {
    id: string;
    name: string;
    ballots: Ballot[];
  };
  auditorId: string;
  onStartPhase: (
    level: "QUOCHOI" | "THANHPHO" | "XA",
    mode: "FIXED_QUOTA" | "UNLIMITED",
    quota?: number,
  ) => void;
  isLoading?: boolean;
  completedPhasesCount?: number;
  totalBallotCount?: number;
  phases?: VotingPhase[];
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  team,
  auditorId,
  onStartPhase,
  isLoading = false,
  completedPhasesCount = 0,
  totalBallotCount = 0,
  phases = [],
}) => {
  const [selectedLevel, setSelectedLevel] = React.useState<
    "QUOCHOI" | "THANHPHO" | "XA"
  >("QUOCHOI");
  const [selectedMode, setSelectedMode] = React.useState<
    "FIXED_QUOTA" | "UNLIMITED" | null
  >(null);
  const [quota, setQuota] = React.useState(0);

  const selectedBallot = useMemo(() => {
    return team.ballots.find((b) => b.level === selectedLevel);
  }, [team.ballots, selectedLevel]);

  const statsByLevel = useMemo(() => {
    const result: Record<string, { phaseCount: number; ballotCount: number }> =
      {
        QUOCHOI: { phaseCount: 0, ballotCount: 0 },
        THANHPHO: { phaseCount: 0, ballotCount: 0 },
        XA: { phaseCount: 0, ballotCount: 0 },
      };
    phases
      .filter((p) => p.status === "COMPLETED")
      .forEach((p) => {
        result[p.level].phaseCount += 1;
        result[p.level].ballotCount += p.ballotCount || 0;
      });
    return result;
  }, [phases]);

  const handleStart = () => {
    if (!selectedMode) {
      alert("Vui lòng chọn loại kiểm phiếu");
      return;
    }
    if (selectedMode === "FIXED_QUOTA" && !quota) {
      alert("Vui lòng nhập số lượng phiếu");
      return;
    }
    onStartPhase(
      selectedLevel,
      selectedMode,
      selectedMode === "FIXED_QUOTA" ? quota : undefined,
    );
  };

  const statCards = [
    {
      label: "Tổng phiếu đã kiểm",
      value: totalBallotCount,
      bgGradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      delay: "animation-delay-100",
    },
    {
      label: "Phiên hoàn tất",
      value: completedPhasesCount,
      bgGradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
      icon: <CheckSquare className="w-4 h-4 text-green-600" />,
      delay: "animation-delay-200",
    },
    {
      label: "Quốc hội",
      value: statsByLevel["QUOCHOI"].ballotCount,
      sub: `${statsByLevel["QUOCHOI"].phaseCount} phiên`,
      bgGradient: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      textColor: "text-amber-600",
      iconBg: "bg-amber-100",
      icon: <Landmark className="w-4 h-4 text-amber-600" />,
      delay: "animation-delay-300",
    },
    {
      label: "Thành phố",
      value: statsByLevel["THANHPHO"].ballotCount,
      sub: `${statsByLevel["THANHPHO"].phaseCount} phiên`,
      bgGradient: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      textColor: "text-purple-600",
      iconBg: "bg-purple-100",
      icon: <Building2 className="w-4 h-4 text-purple-600" />,
      delay: "animation-delay-400",
    },
    {
      label: "Phiếu Xã",
      value: statsByLevel["XA"].ballotCount,
      sub: `${statsByLevel["XA"].phaseCount} phiên`,
      bgGradient: "from-rose-50 to-pink-50",
      border: "border-rose-200",
      textColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      delay: "animation-delay-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeInUp">
      {/* 1. Team Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                Tổ đang hoạt động
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{team.name}</h2>
            <p className="text-blue-100 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Kiểm phiếu viên:{" "}
              <span className="font-semibold text-white">{auditorId}</span>
            </p>
          </div>
          <div className="hidden sm:flex p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <TrendingUp className="w-6 h-6 text-blue-100" />
          </div>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`p-3.5 rounded-xl border bg-gradient-to-br ${card.bgGradient} ${card.border} shadow-sm animate-fadeInUp ${card.delay} transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
              {card.sub && (
                <span
                  className={`text-[10px] font-semibold ${card.textColor} bg-white/50 px-1.5 py-0.5 rounded-full`}
                >
                  {card.sub}
                </span>
              )}
            </div>
            <p
              className={`text-xl sm:text-2xl font-bold mb-0.5 ${card.textColor}`}
            >
              {card.value}
            </p>
            <p className="text-gray-600 text-xs font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 3. Level Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Bước 1: Chọn loại bầu cử
          </h3>
        </div>
        <LevelTabs activeLevel={selectedLevel} onChange={setSelectedLevel} />
      </div>

      {/* 4. Ballot Details OR Empty State */}
      {selectedBallot ? (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* KHỐI 1: Thông tin hòm phiếu & Preview ứng viên */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header hòm phiếu */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {selectedBallot.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Danh sách gồm{" "}
                    <span className="font-bold text-blue-600">
                      {selectedBallot.candidates?.length || 0}
                    </span>{" "}
                    ứng cử viên
                  </p>
                </div>
              </div>
            </div>

            {/* Xem trước ứng cử viên (Dạng Chips hiển thị ngang) */}
            <div className="p-4 sm:p-5 bg-white">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Bảng xem trước ứng cử viên
              </p>
              {selectedBallot.candidates &&
              selectedBallot.candidates.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {selectedBallot.candidates.map((candidate: any) => (
                    <div
                      key={candidate.id}
                      className="inline-flex items-center gap-2 bg-gray-50 hover:bg-blue-50 transition-colors px-3 py-1.5 rounded-lg border border-gray-200"
                    >
                      <span className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold text-[10px] border border-gray-100">
                        {candidate.index}
                      </span>
                      <span className="font-semibold text-gray-700 text-sm">
                        {candidate.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-600">
                  Chưa có danh sách ứng cử viên nào trong hòm phiếu này.
                </div>
              )}
            </div>
          </div>

          {/* KHỐI 2: Chế độ kiểm phiếu */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Bước 2: Chọn chế độ kiểm phiếu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Mode: UNLIMITED */}
              <div
                role="button"
                className={`relative flex flex-col p-4 rounded-xl border-2 transition-all ${
                  selectedMode === "UNLIMITED"
                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedMode("UNLIMITED")}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    readOnly
                    checked={selectedMode === "UNLIMITED"}
                    className="mt-1 w-4 h-4 accent-blue-600 flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">
                      ♾️ Đếm tự do
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Đếm liên tục không giới hạn. Bạn có thể kết thúc phiên bất
                      kỳ lúc nào.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Mode: FIXED QUOTA */}
              <div
                role="button"
                className={`relative flex flex-col p-4 rounded-xl border-2 transition-all ${
                  selectedMode === "FIXED_QUOTA"
                    ? "border-green-500 bg-green-50/50 shadow-sm"
                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedMode("FIXED_QUOTA")}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    readOnly
                    checked={selectedMode === "FIXED_QUOTA"}
                    className="mt-1 w-4 h-4 accent-green-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base mb-1">
                      📊 Đếm theo tệp (Giao khoán)
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Khai báo trước số lượng. Hệ thống yêu cầu đếm đủ phiếu mới
                      cho phép hoàn thành.
                    </p>

                    {/* Form phụ hiện ra khi chọn mode này */}
                    {selectedMode === "FIXED_QUOTA" && (
                      <div
                        className="mt-4 animate-fadeInDown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-white p-3.5 rounded-lg border border-green-200 shadow-sm">
                          <label className="block text-[11px] font-bold text-green-700 mb-2 uppercase tracking-wide">
                            Số lượng phiếu trên tay bạn:
                          </label>
                          <input
                            type="number"
                            value={quota || ""}
                            onChange={(e) =>
                              setQuota(parseInt(e.target.value) || 0)
                            }
                            placeholder="Nhập số lượng. VD: 100"
                            className="w-full px-3 py-2 border border-green-300 rounded-md text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            min="1"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ✅ TRẠNG THÁI KHÔNG CÓ DỮ LIỆU (EMPTY STATE) */
        <div className="bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-fadeIn min-h-[250px]">
          <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-900 font-bold text-lg mb-2">
            Chưa có dữ liệu bầu cử
          </h4>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
            Tổ của bạn hiện <strong>chưa được phân công</strong> hòm phiếu cho
            cấp độ này. <br />
            Vui lòng chọn cấp độ khác hoặc liên hệ Quản trị viên để được hỗ trợ.
          </p>
        </div>
      )}

      {/* Nút Bắt Đầu Cuối Cùng */}
      <div className="flex justify-end pt-2 border-t border-gray-200 mt-2">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={
            !selectedBallot ||
            !selectedMode ||
            (selectedMode === "FIXED_QUOTA" && !quota) ||
            isLoading
          }
          isLoading={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          <Play className="w-5 h-5 mr-2" fill="currentColor" />
          Bắt đầu phiên kiểm phiếu
        </Button>
      </div>
    </div>
  );
};
