"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/hooks/useSession";
import { useVotingPhases } from "@/src/hooks/useVotingPhases";
import { VotingInterface } from "./VotingInterface";
import { ActivePhaseVoting } from "./ActivePhaseVoting";

export const AuditorVoting: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const {
    phases,
    isLoading: phaseLoading,
    createPhase,
    toggleCandidateInTicket,
    completeTicket,
    completePhase,
  } = useVotingPhases();

  // State lưu dữ liệu THẬT từ database
  const [myTeam, setMyTeam] = useState<any>(null);
  const [historySessions, setHistorySessions] = useState<any[]>([]); // Lưu lịch sử đếm
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  const [activePhaseId, setActivePhaseId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gọi API lấy Tổ kiểm phiếu & Lịch sử
  const loadAssignmentData = useCallback(() => {
    if (!user?.id) return;
    fetch(`/api/voting/my-assignment?auditorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMyTeam(data.data.team);
          setHistorySessions(data.data.sessions || []); // Nạp lịch sử từ DB vào đây
        } else {
          setMyTeam(null);
        }
        setIsLoadingTeam(false);
      })
      .catch(() => setIsLoadingTeam(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id && !sessionLoading) {
      setIsLoadingTeam(false);
    } else if (user?.id) {
      loadAssignmentData();
    }
  }, [user?.id, sessionLoading, loadAssignmentData]);

  // Map dữ liệu từ Database sang định dạng hiển thị biểu đồ
  const completedMappedPhases: any[] = useMemo(() => {
    if (!myTeam) return [];
    return historySessions.map((session) => {
      const ballot = myTeam.ballots.find((b: any) => b.id === session.ballotId);
      return {
        id: session.id,
        auditorId: session.auditorId,
        status: "COMPLETED",
        level: ballot?.level || "XA",
        ballotCount: session.totalBallots,
      };
    });
  }, [historySessions, myTeam]);

  // Tính tổng số tờ phiếu từ dữ liệu DB
  const myTotalBallotCount = useMemo(() => {
    return completedMappedPhases.reduce(
      (sum, p) => sum + (p.ballotCount || 0),
      0,
    );
  }, [completedMappedPhases]);

  const activePhase = useMemo(() => {
    return phases.find((p) => p.id === activePhaseId);
  }, [activePhaseId, phases]);

  const activeBallot = useMemo(() => {
    if (!activePhase || !myTeam) return null;
    return myTeam.ballots.find((b: any) => b.id === activePhase.ballotId);
  }, [activePhase, myTeam]);

  // Loading States
  if (sessionLoading || phaseLoading || isLoadingTeam) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">
          ⏳ Đang tải dữ liệu từ máy chủ...
        </p>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto mt-10 shadow-sm animate-fadeInDown">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-xl font-bold text-red-700 mb-2">
          Chưa được phân công
        </h3>
        <p className="text-red-600 text-sm">
          Tài khoản của bạn hiện chưa được gán vào Tổ kiểm phiếu nào. <br />
          Vui lòng liên hệ Admin để cấu hình!
        </p>
      </div>
    );
  }

  // Handlers
  const handleStartPhase = async (
    level: "QUOCHOI" | "THANHPHO" | "XA",
    mode: "FIXED_QUOTA" | "UNLIMITED",
    quota?: number,
  ) => {
    const ballot = myTeam.ballots.find((b: any) => b.level === level);
    if (!ballot) return;

    setIsSubmitting(true);
    try {
      const newPhase = createPhase({
        teamId: myTeam.id,
        auditorId: String(user?.id || ""),
        level,
        ballotId: ballot.id,
        mode,
        quota,
      });
      setActivePhaseId(newPhase.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCandidate = (candidateId: string) => {
    if (activePhaseId) {
      toggleCandidateInTicket(activePhaseId, candidateId);
    }
  };

  const handleCompleteTicket = (phaseId: string, isValid: boolean) => {
    if (activePhaseId) {
      completeTicket(activePhaseId, isValid);
    }
  };

  const handleCompletePhase = async () => {
    if (!activePhaseId) return;

    setIsSubmitting(true);
    try {
      const success = await completePhase(activePhaseId);
      if (success) {
        setActivePhaseId("");
        // ✅ CẬP NHẬT QUAN TRỌNG: Gọi lại API để tải số liệu mới nhất về màn hình ngoài
        loadAssignmentData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPhase = () => {
    setActivePhaseId("");
  };

  // View 1: Màn hình chọn danh sách
  if (!activePhaseId) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Khu vực Kiểm phiếu
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Xác nhận thông tin tổ và chọn danh sách để bắt đầu đếm
          </p>
        </div>
        <VotingInterface
          team={myTeam}
          auditorId={user?.name || user?.email || "Người kiểm phiếu"}
          onStartPhase={handleStartPhase}
          isLoading={isSubmitting}
          completedPhasesCount={completedMappedPhases.length}
          totalBallotCount={myTotalBallotCount}
          phases={completedMappedPhases} // Truyền dữ liệu thật từ DB vào đây
        />
      </div>
    );
  }

  // View 2: Màn hình Đang đếm phiếu (Active Phase)
  if (activePhase && activeBallot) {
    return (
      <div className="max-w-4xl mx-auto">
        <ActivePhaseVoting
          phase={activePhase}
          ballot={activeBallot}
          onToggleCandidate={handleToggleCandidate}
          onCompleteTicket={handleCompleteTicket}
          onComplete={handleCompletePhase}
          onCancel={handleCancelPhase}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return null;
};
