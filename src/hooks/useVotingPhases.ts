import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { VotingPhase } from "@/src/data/mockVotingAssignments";

// Mở rộng thêm 2 trường cho Phase để đếm phiếu Hợp lệ / Hỏng
export interface ActiveVotingPhase extends VotingPhase {
  validBallots: number;
  invalidBallots: number;
}

export const useVotingPhases = () => {
  const [phases, setPhases] = useState<ActiveVotingPhase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Bắt đầu phiên
  const createPhase = useCallback((data: any): ActiveVotingPhase => {
    const newPhase: ActiveVotingPhase = {
      id: `phase-${Date.now()}`,
      teamId: data.teamId,
      auditorId: data.auditorId,
      level: data.level,
      ballotId: data.ballotId,
      votes: {},
      totalVotes: 0,
      ballotCount: 0,
      validBallots: 0,
      invalidBallots: 0,
      currentTicketVotes: {},
      startTime: new Date(),
      status: "ACTIVE",
      mode: data.mode,
      quota: data.quota,
    };
    setPhases((prev) => [newPhase, ...prev]);
    toast.success("Bắt đầu phiên kiểm phiếu");
    return newPhase;
  }, []);

  // 2. Tick chọn ứng viên trên 1 tờ phiếu
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

  // 3. Bấm xác nhận 1 tờ phiếu (Hợp lệ HOẶC Không hợp lệ)
  const completeTicket = useCallback((phaseId: string, isValid: boolean) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id === phaseId && phase.status === "ACTIVE") {
          const currentTicket = phase.currentTicketVotes || {};
          const newVotes = { ...phase.votes };

          // CHỈ CỘNG ĐIỂM NẾU PHIẾU HỢP LỆ
          if (isValid) {
            Object.keys(currentTicket).forEach((candidateId) => {
              newVotes[candidateId] = (newVotes[candidateId] || 0) + 1;
            });
          }

          const totalVotes = Object.values(newVotes).reduce((a, b) => a + b, 0);

          return {
            ...phase,
            votes: newVotes,
            totalVotes,
            ballotCount: phase.ballotCount + 1,
            validBallots: isValid ? phase.validBallots + 1 : phase.validBallots,
            invalidBallots: !isValid
              ? phase.invalidBallots + 1
              : phase.invalidBallots,
            currentTicketVotes: {}, // Reset tờ mới
          };
        }
        return phase;
      }),
    );
    toast.success(
      isValid ? "✅ Ghi nhận Phiếu Hợp Lệ" : "❌ Ghi nhận Phiếu Hỏng/Trắng",
    );
  }, []);

  // 4. Kết thúc và LƯU LÊN DATABASE
  const completePhase = useCallback(
    async (phaseId: string): Promise<boolean> => {
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return false;

      if (phase.mode === "FIXED_QUOTA" && phase.quota) {
        if (phase.ballotCount !== phase.quota) {
          toast.error(
            `Phải đếm đủ ${phase.quota} phiếu! Hiện tại: ${phase.ballotCount}`,
          );
          return false;
        }
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/voting/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: phase.teamId,
            auditorId: phase.auditorId,
            ballotId: phase.ballotId,
            mode: phase.mode,
            quota: phase.quota,
            totalBallots: phase.ballotCount,
            validBallots: phase.validBallots,
            invalidBallots: phase.invalidBallots,
            candidateVotes: phase.votes,
            startTime: phase.startTime.toISOString(),
          }),
        });

        const data = await res.json();

        if (data.success) {
          setPhases((prev) =>
            prev.map((p) =>
              p.id === phaseId
                ? { ...p, status: "COMPLETED", endTime: new Date() }
                : p,
            ),
          );
          toast.success("Đã lưu kết quả thành công lên máy chủ!");
          return true;
        } else {
          toast.error(data.message || "Lỗi lưu dữ liệu!");
          return false;
        }
      } catch (error) {
        toast.error("Mất kết nối máy chủ");
        return false;
      } finally {
        setIsLoading(false);
      }
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
