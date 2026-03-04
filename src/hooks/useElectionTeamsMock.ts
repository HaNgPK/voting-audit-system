import { useState, useEffect, useCallback } from "react";
import {
  mockElectionTeams,
  type ElectionTeam,
} from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";

export const useElectionTeamsMock = () => {
  const [teams, setTeams] = useState<ElectionTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeams = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTeams([...mockElectionTeams]);
      setIsLoading(false);
    }, 300);
  }, []);

  const createTeam = useCallback(
    (teamData: Omit<ElectionTeam, "id" | "createdAt">) => {
      return new Promise<ElectionTeam>((resolve) => {
        setTimeout(() => {
          const newTeam: ElectionTeam = {
            ...teamData,
            id: `t${Date.now()}`,
            createdAt: new Date(),
          };
          setTeams((prev) => [newTeam, ...prev]);
          toast.success("Tạo tổ kiểm phiếu thành công");
          resolve(newTeam);
        }, 300);
      });
    },
    [],
  );

  const updateTeam = useCallback(
    (id: string, teamData: Partial<ElectionTeam>) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setTeams((prev) =>
            prev.map((team) =>
              team.id === id ? { ...team, ...teamData } : team,
            ),
          );
          toast.success("Cập nhật tổ kiểm phiếu thành công");
          resolve();
        }, 300);
      });
    },
    [],
  );

  const deleteTeam = useCallback((id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTeams((prev) => prev.filter((team) => team.id !== id));
        toast.success("Xóa tổ kiểm phiếu thành công");
        resolve();
      }, 300);
    });
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};
