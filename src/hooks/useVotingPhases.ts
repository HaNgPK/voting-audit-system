import { useState, useEffect, useCallback } from "react";
import {
  mockVotingPhases,
  type VotingPhase,
} from "@/src/data/mockVotingAssignments";
import toast from "react-hot-toast";

export const useVotingPhases = () => {
  const [phases, setPhases] = useState<VotingPhase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPhases([...mockVotingPhases]);
      setIsLoading(false);
    }, 300);
  }, []);

  // Tạo phiên kiểm phiếu mới
  const createPhase = useCallback(
    (data: {
      teamId: string;
      auditorId: string;
      level: "QUOCHOI" | "THANHPHO" | "XA";
      ballotId: string;
      mode: "FIXED_QUOTA" | "UNLIMITED";
      quota?: number;
    }): VotingPhase => {
      const newPhase: VotingPhase = {
        id: `phase-${Date.now()}`,
        teamId: data.teamId,
        auditorId: data.auditorId,
        level: data.level,
        ballotId: data.ballotId,
        votes: {},
        totalVotes: 0,
        startTime: new Date(),
        status: "ACTIVE",
        mode: data.mode,
        quota: data.quota,
      };
      setPhases((prev) => [newPhase, ...prev]);
      toast.success("Bắt đầu phiên kiểm phiếu");
      return newPhase;
    },
    [],
  );

  // Tích chọn ứng viên = tăng 1 phiếu
  const recordVote = useCallback((phaseId: string, candidateId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id === phaseId && phase.status === "ACTIVE") {
          const newVotes = { ...phase.votes };
          newVotes[candidateId] = (newVotes[candidateId] || 0) + 1;
          const totalVotes = Object.values(newVotes).reduce((a, b) => a + b, 0);
          return {
            ...phase,
            votes: newVotes,
            totalVotes,
          };
        }
        return phase;
      }),
    );
  }, []);

  // Hoàn thành phiên
  const completePhase = useCallback(
    (phaseId: string): boolean => {
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return false;

      // FIXED_QUOTA: phải kiểm đủ số lượng
      if (phase.mode === "FIXED_QUOTA" && phase.quota) {
        if (phase.totalVotes !== phase.quota) {
          toast.error(
            `Phải kiểm đủ ${phase.quota} phiếu. Hiện tại: ${phase.totalVotes}`,
          );
          return false;
        }
      }

      // UNLIMITED: có thể hoàn thành bất kỳ lúc nào
      setPhases((prev) =>
        prev.map((p) =>
          p.id === phaseId
            ? { ...p, status: "COMPLETED", endTime: new Date() }
            : p,
        ),
      );
      toast.success("Hoàn thành phiên kiểm phiếu");
      return true;
    },
    [phases],
  );

  return {
    phases,
    isLoading,
    createPhase,
    recordVote,
    completePhase,
  };
};
