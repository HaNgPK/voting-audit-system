"use client";

import React, { useMemo } from "react";
import { Card, Button } from "@/src/components/common";
import { LevelTabs } from "./LevelTabs";
import { CandidateListItem } from "./CandidateListItem";
import { CheckCircle, Play, StopCircle } from "lucide-react";
import type { Ballot } from "@/src/data/mockElectionTeams";

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
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  team,
  auditorId,
  onStartPhase,
  isLoading = false,
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

  return (
    <div className="space-y-6">
      {/* Team Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
        <p className="text-gray-600 mt-1">Kiểm phiếu viên: {auditorId}</p>
      </Card>

      {/* Level Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chọn loại bầu cử
        </h3>
        <LevelTabs activeLevel={selectedLevel} onChange={setSelectedLevel} />
      </Card>

      {/* Ballot Info */}
      {selectedBallot && (
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900">
              📋 {selectedBallot.name}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {selectedBallot.candidates?.length || 0} ứng cử viên
            </p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
              onClick={() => setSelectedMode("UNLIMITED")}
            >
              <input
                type="radio"
                name="mode"
                checked={selectedMode === "UNLIMITED"}
                onChange={() => setSelectedMode("UNLIMITED")}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">♾️ Tự do đếm</p>
                <p className="text-sm text-gray-600">
                  Không giới hạn số lượng phiếu
                </p>
              </div>
            </label>

            <label
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all"
              onClick={() => setSelectedMode("FIXED_QUOTA")}
            >
              <input
                type="radio"
                name="mode"
                checked={selectedMode === "FIXED_QUOTA"}
                onChange={() => setSelectedMode("FIXED_QUOTA")}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  📊 Được giao số lượng
                </p>
                <p className="text-sm text-gray-600">
                  Kiểm đủ số lượng mới hoàn thành
                </p>
              </div>
            </label>

            {selectedMode === "FIXED_QUOTA" && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng phiếu được giao:
                </label>
                <input
                  type="number"
                  value={quota || ""}
                  onChange={(e) => setQuota(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số lượng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="1"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Start Button */}
      <Button
        onClick={handleStart}
        variant="success"
        size="lg"
        fullWidth
        disabled={!selectedMode || isLoading}
        isLoading={isLoading}
      >
        <Play className="w-5 h-5" />
        Bắt đầu kiểm phiếu
      </Button>
    </div>
  );
};
