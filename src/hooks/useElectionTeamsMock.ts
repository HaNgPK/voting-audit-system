import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  mockElectionTeams,
  type ElectionTeam,
  type Ballot,
  type Candidate,
  type ElectionLevel,
} from "@/src/data/mockElectionTeams";

// Tạo type linh hoạt cho việc thêm/sửa, cho phép id và candidates có thể bị khuyết từ Form
export interface CreateTeamPayload {
  name: string;
  auditorIds: string[];
  ballots: {
    id?: string;
    name: string;
    level: ElectionLevel;
    candidates?: Candidate[];
  }[];
}

export const useElectionTeamsMock = () => {
  const [teams, setTeams] = useState<ElectionTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeams = useCallback(() => {
    setIsLoading(true);
    // Giả lập delay API
    setTimeout(() => {
      setTeams([...mockElectionTeams]);
      setIsLoading(false);
    }, 300);
  }, []);

  const createTeam = useCallback((teamData: CreateTeamPayload) => {
    return new Promise<ElectionTeam>((resolve) => {
      setTimeout(() => {
        const newTeam: ElectionTeam = {
          id: `team-${Date.now()}`,
          name: teamData.name,
          auditorIds: teamData.auditorIds || [], // Đảm bảo luôn là mảng
          // Chuẩn hóa ballots: tự sinh id và mảng candidates rỗng nếu chưa có
          ballots: teamData.ballots.map((b) => ({
            id: b.id || `ballot-${Date.now()}-${Math.random()}`,
            name: b.name,
            level: b.level,
            candidates: b.candidates || [],
          })),
          createdAt: new Date(),
        };

        setTeams((prev) => [newTeam, ...prev]);
        toast.success("✅ Tạo tổ bầu cử thành công!");
        resolve(newTeam);
      }, 300);
    });
  }, []);

  const updateTeam = useCallback(
    (id: string, teamData: Partial<CreateTeamPayload>) => {
      return new Promise<ElectionTeam | null>((resolve) => {
        setTimeout(() => {
          setTeams((prev) =>
            prev.map((team) => {
              if (team.id === id) {
                return {
                  ...team,
                  name: teamData.name || team.name,
                  auditorIds: teamData.auditorIds || team.auditorIds,
                  // Tương tự, chuẩn hóa lại danh sách ballot nếu có cập nhật
                  ballots: teamData.ballots
                    ? teamData.ballots.map((b) => ({
                        id: b.id || `ballot-${Date.now()}-${Math.random()}`,
                        name: b.name,
                        level: b.level,
                        candidates: b.candidates || [],
                      }))
                    : team.ballots,
                };
              }
              return team;
            }),
          );

          const updated = teams.find((t) => t.id === id);
          toast.success("✅ Cập nhật tổ bầu cử thành công!");
          resolve(updated || null);
        }, 300);
      });
    },
    [teams],
  );

  const deleteTeam = useCallback((id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTeams((prev) => prev.filter((team) => team.id !== id));
        toast.success("✅ Xóa tổ bầu cử thành công!");
        resolve();
      }, 300);
    });
  }, []);

  // Add ballot to team
  const addBallotToTeam = useCallback((teamId: string, ballot: Ballot) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTeams((prev) =>
          prev.map((team) =>
            team.id === teamId
              ? { ...team, ballots: [...team.ballots, ballot] }
              : team,
          ),
        );
        toast.success("✅ Thêm danh sách bầu cử thành công!");
        resolve();
      }, 300);
    });
  }, []);

  // Remove ballot from team
  const removeBallotFromTeam = useCallback(
    (teamId: string, ballotId: string) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setTeams((prev) =>
            prev.map((team) =>
              team.id === teamId
                ? {
                    ...team,
                    ballots: team.ballots.filter((b) => b.id !== ballotId),
                  }
                : team,
            ),
          );
          toast.success("✅ Xóa danh sách bầu cử thành công!");
          resolve();
        }, 300);
      });
    },
    [],
  );

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    createTeam,
    updateTeam,
    deleteTeam,
    addBallotToTeam,
    removeBallotFromTeam,
  };
};
