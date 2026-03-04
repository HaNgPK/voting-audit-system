"use client";

import React, { useMemo } from "react";
import { Card, Button } from "@/src/components/common";
import { LevelTabs } from "./LevelTabs";
import {
  Play,
  FileText,
  CheckSquare,
  Building2,
  Landmark,
  MapPin,
  TrendingUp,
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
  const [quota, setQuota] = React.useState<number>(0);

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
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      delay: "animation-delay-100",
    },
    {
      label: "Phiên đã hoàn tất",
      value: completedPhasesCount,
      bgGradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
      icon: <CheckSquare className="w-5 h-5 text-green-600" />,
      delay: "animation-delay-200",
    },
    {
      label: "Phiếu Quốc hội",
      value: statsByLevel["QUOCHOI"].ballotCount,
      sub: `${statsByLevel["QUOCHOI"].phaseCount} phiên`,
      bgGradient: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      textColor: "text-amber-600",
      iconBg: "bg-amber-100",
      icon: <Landmark className="w-5 h-5 text-amber-600" />,
      delay: "animation-delay-300",
    },
    {
      label: "Phiếu Thành phố",
      value: statsByLevel["THANHPHO"].ballotCount,
      sub: `${statsByLevel["THANHPHO"].phaseCount} phiên`,
      bgGradient: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      textColor: "text-purple-600",
      iconBg: "bg-purple-100",
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
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
      icon: <MapPin className="w-5 h-5 text-rose-600" />,
      delay: "animation-delay-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Team Info Banner */}
      <div className="animate-fadeInDown">
        <Card className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{team.name}</h2>
              <p className="text-blue-200 mt-1 text-sm flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Kiểm phiếu viên:{" "}
                <span className="text-white font-semibold ml-1">
                  {auditorId}
                </span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`animate-scaleIn ${card.delay} opacity-0-init`}
            style={{ animationFillMode: "forwards" }}
          >
            <Card
              className={`p-4 border ${card.border} bg-gradient-to-br ${card.bgGradient} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded-lg ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  {card.icon}
                </div>
                {card.sub && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 ${card.textColor}`}
                  >
                    {card.sub}
                  </span>
                )}
              </div>
              <p
                className={`text-3xl font-extrabold ${card.textColor} animate-countUp ${card.delay}`}
                style={{ animationFillMode: "forwards" }}
              >
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium leading-tight">
                {card.label}
              </p>
            </Card>
          </div>
        ))}
      </div>

      {/* Level Selection */}
      <div className="animate-fadeInUp animation-delay-300">
        <Card className="p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Chọn loại bầu cử
          </h3>
          <LevelTabs activeLevel={selectedLevel} onChange={setSelectedLevel} />
        </Card>
      </div>

      {/* Ballot Info + Mode Selection */}
      {selectedBallot && (
        <div className="animate-fadeInUp animation-delay-400">
          <Card className="p-5 shadow-sm">
            {/* Ballot header */}
            <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedBallot.name}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedBallot.candidates?.length || 0} ứng cử viên
                </p>
              </div>
            </div>

            {/* Mode Selection */}
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Chọn loại kiểm phiếu
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* UNLIMITED */}
              <label
                className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMode === "UNLIMITED"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                onClick={() => setSelectedMode("UNLIMITED")}
              >
                <input
                  type="radio"
                  name="mode"
                  checked={selectedMode === "UNLIMITED"}
                  onChange={() => setSelectedMode("UNLIMITED")}
                  className="mt-0.5 w-4 h-4 accent-blue-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    ♾️ Tự do đếm
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Không giới hạn số lượng phiếu
                  </p>
                </div>
                {selectedMode === "UNLIMITED" && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </label>

              {/* FIXED_QUOTA — input nhúng thẳng bên trong khi được chọn */}
              <label
                className={`relative flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMode === "FIXED_QUOTA"
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                }`}
                onClick={() => setSelectedMode("FIXED_QUOTA")}
              >
                {/* Row trên: radio + text */}
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="mode"
                    checked={selectedMode === "FIXED_QUOTA"}
                    onChange={() => setSelectedMode("FIXED_QUOTA")}
                    className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      📊 Được giao số lượng
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Kiểm đủ số lượng mới hoàn thành
                    </p>
                  </div>
                  {selectedMode === "FIXED_QUOTA" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0 mt-1" />
                  )}
                </div>

                {/* Input nhúng bên trong — chỉ hiện khi đang chọn mode này */}
                {selectedMode === "FIXED_QUOTA" && (
                  <div
                    className="animate-scaleIn"
                    style={{ animationFillMode: "forwards" }}
                    onClick={(e) => e.stopPropagation()} // tránh re-trigger label click
                  >
                    <div className="pt-1 border-t border-green-200">
                      <label className="block text-xs font-semibold text-green-700 mb-1.5">
                        🔢 Số lượng phiếu được giao:
                      </label>
                      <input
                        type="number"
                        value={quota || ""}
                        onChange={(e) =>
                          setQuota(parseInt(e.target.value) || 0)
                        }
                        placeholder="Nhập số lượng..."
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white"
                        min="1"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </label>
            </div>
          </Card>
        </div>
      )}

      {/* Start Button */}
      <div className="animate-fadeInUp animation-delay-500">
        <Button
          onClick={handleStart}
          variant="success"
          size="lg"
          fullWidth
          disabled={!selectedMode || isLoading}
          isLoading={isLoading}
          className={`shadow-lg transition-all duration-200 ${
            selectedMode && !isLoading
              ? "hover:shadow-green-300/50 hover:-translate-y-0.5 active:translate-y-0"
              : ""
          }`}
        >
          <Play className="w-5 h-5" />
          Bắt đầu kiểm phiếu
        </Button>
      </div>
    </div>
  );
};
