import { useState, useCallback, useEffect } from "react";
import { mockVotingSessions, VotingSession } from "@/src/data/mockVotingSessions";
import toast from "react-hot-toast";

export const useVotingSessionsMock = () => {
  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSessions([...mockVotingSessions]);
      setIsLoading(false);
    }, 300);
  }, []);

  const createSession = useCallback(
    (sessionData: Omit<VotingSession, "id" | "totalVotes">) => {
      return new Promise<VotingSession>((resolve) => {
        setTimeout(() => {
          const newSession: VotingSession = {
            ...sessionData,
            id: `vs${Date.now()}`,
            totalVotes: Object.values(sessionData.votes).reduce((a, b) => a + b, 0),
          };
          setSessions((prev) => [newSession, ...prev]);
          toast.success("Tạo phiên kiểm phiếu thành công");
          resolve(newSession);
        }, 300);
      });
    },
    []
  );

  const updateSession = useCallback(
    (id: string, sessionData: Partial<VotingSession>) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    ...sessionData,
                    totalVotes: Object.values(sessionData.votes || s.votes).reduce(
                      (a, b) => a + b,
                      0
                    ),
                  }
                : s
            )
          );
          toast.success("Cập nhật phiên kiểm phiếu thành công");
          resolve();
        }, 300);
      });
    },
    []
  );

  const endSession = useCallback((id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: "COMPLETED", endTime: new Date() } : s
          )
        );
        toast.success("Kết thúc phiên kiểm phiếu");
        resolve();
      }, 300);
    });
  }, []);

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
    endSession,
  };
};