"use client";

import { useState } from "react";
import { Card, Table, Button } from "@/src/components/common";
import { useElectionTeamsMock } from "@/src/hooks/useElectionTeamsMock";
import { useSession } from "@/src/hooks/useSession";
import { VotingModal } from "@/src/components/voting/VotingModal"; // Đảm bảo đường dẫn này đúng
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

  if (sessionLoading || isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>
      </Card>
    );
  }

  const myTeams = teams.filter((team) =>
    team.auditorIds.includes(user?.id || ""),
  );

  if (myTeams.length === 0) {
    return (
      <Card className="p-6 bg-blue-50 border-l-4 border-blue-500">
        <p className="text-blue-700 font-semibold">
          ℹ️ Bạn chưa được gán phụ trách tổ bầu cử nào. Vui lòng liên hệ Admin.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📋 Bảng điều khiển kiểm phiếu</h2>

      {myTeams.map((team) => {
        const ballotRows = team.ballots.map((ballot) => [
          ballot.name,
          LEVEL_LABELS[ballot.level],
          `${ballot.candidates?.length || 0} người`,
        ]);

        return (
          <Card
            key={team.id}
            className="p-4 sm:p-6 border-t-4 border-t-blue-500 shadow-md"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  🏢 {team.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Bạn đang cùng {team.auditorIds.length - 1} người khác phụ
                  trách tổ này
                </p>
              </div>

              <Button
                onClick={() => setActiveVotingTeam(team)}
                className="bg-green-600 hover:bg-green-700 shadow-lg px-6 py-2 text-white font-bold animate-pulse"
                size="lg"
              >
                ➕ THÊM PHIẾU BẦU
              </Button>
            </div>

            <Table
              headers={["Danh sách bầu cử", "Cấp độ", "Số ứng viên"]}
              rows={ballotRows}
            />
          </Card>
        );
      })}

      {/* Tích hợp Modal nhập phiếu */}
      {activeVotingTeam && (
        <VotingModal
          isOpen={!!activeVotingTeam}
          onClose={() => setActiveVotingTeam(null)}
          ballots={activeVotingTeam.ballots}
        />
      )}
    </div>
  );
};
