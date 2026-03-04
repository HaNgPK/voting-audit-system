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
        ballotCount: 0, // số phiếu (tờ phiếu) đã hoàn tất
        currentTicketVotes: {}, // các ứng viên đang được chọn trong phiếu hiện tại
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

  // Toggle chọn/bỏ chọn ứng viên trong phiếu hiện tại
  const toggleCandidateInTicket = useCallback(
    (phaseId: string, candidateId: string) => {
      setPhases((prev) =>
        prev.map((phase) => {
          if (phase.id === phaseId && phase.status === "ACTIVE") {
            const currentTicket = { ...(phase.currentTicketVotes || {}) };
            if (currentTicket[candidateId]) {
              delete currentTicket[candidateId];
            } else {
              currentTicket[candidateId] = 1;
            }
            return { ...phase, currentTicketVotes: currentTicket };
          }
          return phase;
        }),
      );
    },
    [],
  );

  // Hoàn tất 1 phiếu (tờ phiếu) — cộng phiếu vào tổng, reset phiếu hiện tại
  const completeTicket = useCallback((phaseId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id === phaseId && phase.status === "ACTIVE") {
          const currentTicket = phase.currentTicketVotes || {};
          const newVotes = { ...phase.votes };
          Object.keys(currentTicket).forEach((candidateId) => {
            newVotes[candidateId] = (newVotes[candidateId] || 0) + 1;
          });
          const totalVotes = Object.values(newVotes).reduce((a, b) => a + b, 0);
          return {
            ...phase,
            votes: newVotes,
            totalVotes,
            ballotCount: (phase.ballotCount || 0) + 1,
            currentTicketVotes: {}, // reset phiếu hiện tại
          };
        }
        return phase;
      }),
    );
    toast.success("Đã hoàn tất phiếu");
  }, []);

  // Hoàn thành phiên
  const completePhase = useCallback(
    (phaseId: string): boolean => {
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return false;

      // FIXED_QUOTA: phải kiểm đủ số phiếu (tờ)
      if (phase.mode === "FIXED_QUOTA" && phase.quota) {
        if ((phase.ballotCount || 0) !== phase.quota) {
          toast.error(
            `Phải kiểm đủ ${phase.quota} phiếu. Hiện tại: ${phase.ballotCount || 0}`,
          );
          return false;
        }
      }

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
    toggleCandidateInTicket,
    completeTicket,
    completePhase,
  };
};
