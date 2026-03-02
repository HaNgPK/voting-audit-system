"use client";

import { useState, useMemo } from "react";
import { Card, Table, Button } from "@/src/components/common";
import { useElectionTeamsMock } from "@/src/hooks/useElectionTeamsMock";
import { useSession } from "@/src/hooks/useSession";
import { VotingModal } from "@/src/components/voting/VotingModal";
import type { ElectionTeam } from "@/src/data/mockElectionTeams";

const LEVEL_LABELS: Record<string, string> = {
  QUOCHOI: "🏛️ Quốc Hội",
  THANHPHO: "🏢 Thành Phố",
  XA: "🏘️ Xã",
};

export const TeamView: React.FC = () => {
  const { user, isLoading: sessionLoading } = useSession();
  const { teams, isLoading } = useElectionTeamsMock();

  const [activeVotingTeam, setActiveVotingTeam] = useState<ElectionTeam | null>(
    null,
  );
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});

  // 1. TÍNH TOÁN THỐNG KÊ (Dùng useMemo để tự động tính lại mỗi khi voteCounts thay đổi)
  const stats = useMemo(() => {
    let total = 0;
    let quocHoi = 0;
    let thanhPho = 0;
    let xa = 0;

    // Lọc ra các tổ của user này trước
    const myTeams = teams.filter((team) =>
      team.auditorIds.includes(String(user?.id || "")),
    );

    // Quét qua từng lá phiếu trong tổ để cộng dồn số liệu
    myTeams.forEach((team) => {
      team.ballots.forEach((ballot) => {
        const count = voteCounts[ballot.id] || 0;
        total += count;
        if (ballot.level === "QUOCHOI") quocHoi += count;
        if (ballot.level === "THANHPHO") thanhPho += count;
        if (ballot.level === "XA") xa += count;
      });
    });

    return { total, quocHoi, thanhPho, xa };
  }, [teams, user, voteCounts]);

  if (sessionLoading || isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>
      </Card>
    );
  }

  const myTeams = teams.filter((team) =>
    team.auditorIds.includes(String(user?.id || "")),
  );

  if (myTeams.length === 0) {
    return (
      <Card className="p-6 bg-blue-50 border-l-4 border-blue-500 shadow-sm">
        <p className="text-blue-700 font-semibold flex items-center gap-2">
          <span>ℹ️</span> Bạn chưa được gán phụ trách tổ bầu cử nào. Vui lòng
          liên hệ Admin.
        </p>
      </Card>
    );
  }

  const handleVoteSubmitted = (ballotId: string) => {
    setVoteCounts((prev) => ({
      ...prev,
      [ballotId]: (prev[ballotId] || 0) + 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* ========================================== */}
      {/* KHỐI THỐNG KÊ TỔNG QUAN (MỚI THÊM)         */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Tổng */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-blue-800 font-semibold text-sm">
              📊 TỔNG PHIẾU ĐÃ KIỂM
            </span>
            <span className="text-4xl font-extrabold text-blue-600 mt-2">
              {stats.total}
            </span>
          </div>
        </Card>

        {/* Card Quốc Hội */}
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-red-800 font-semibold text-sm">
              🏛️ Cấp Quốc Hội
            </span>
            <span className="text-3xl font-bold text-red-600 mt-2">
              {stats.quocHoi}
            </span>
          </div>
        </Card>

        {/* Card Thành Phố */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-amber-800 font-semibold text-sm">
              🏢 Cấp Thành Phố
            </span>
            <span className="text-3xl font-bold text-amber-600 mt-2">
              {stats.thanhPho}
            </span>
          </div>
        </Card>

        {/* Card Xã */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-emerald-800 font-semibold text-sm">
              🏘️ Cấp Xã/Phường
            </span>
            <span className="text-3xl font-bold text-emerald-600 mt-2">
              {stats.xa}
            </span>
          </div>
        </Card>
      </div>

      {/* ========================================== */}
      {/* KHỐI DANH SÁCH TỔ BẦU CỬ VÀ NÚT THÊM PHIẾU */}
      {/* ========================================== */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8">
        📋 Tổ bầu cử của tôi
      </h2>

      {myTeams.map((team) => {
        const ballotRows = team.ballots.map((ballot) => [
          <span key={`name-${ballot.id}`} className="font-medium text-gray-800">
            {ballot.name}
          </span>,
          LEVEL_LABELS[ballot.level],
          new Date().toLocaleDateString("vi-VN"),
          <span
            key={`count-${ballot.id}`}
            className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm"
          >
            {voteCounts[ballot.id] || 0} phiếu
          </span>,
        ]);

        return (
          <Card
            key={team.id}
            className="p-4 sm:p-6 border-t-4 border-t-blue-500 shadow-md"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  🏢 {team.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Được phân công kiểm {team.ballots.length} loại phiếu
                </p>
              </div>

              <Button
                onClick={() => setActiveVotingTeam(team)}
                variant="success"
                className="shadow-md animate-pulse min-w-[180px]"
                size="lg"
              >
                ➕ THÊM PHIẾU BẦU
              </Button>
            </div>

            <Table
              headers={[
                "Danh sách bầu cử",
                "Cấp độ",
                "Ngày gán",
                "Tiến độ (Đã kiểm)",
              ]}
              rows={ballotRows}
            />
          </Card>
        );
      })}

      {activeVotingTeam && (
        <VotingModal
          isOpen={!!activeVotingTeam}
          onClose={() => setActiveVotingTeam(null)}
          ballots={activeVotingTeam.ballots}
          onVoteSubmitted={handleVoteSubmitted}
        />
      )}
    </div>
  );
};
