"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/hooks/useSession";
import { useElectionTeamsMock } from "@/src/hooks/useElectionTeamsMock";
import { useVotingPhases } from "@/src/hooks/useVotingPhases";
import { Card } from "@/src/components/common";
import { VotingInterface } from "./VotingInterface";
import { ActivePhaseVoting } from "./ActivePhaseVoting";

export const AuditorVoting: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const { teams } = useElectionTeamsMock();
  const { phases, isLoading, createPhase, recordVote, completePhase } =
    useVotingPhases();

  const [activePhaseId, setActivePhaseId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's team
  const myTeam = useMemo(() => {
    return teams.find((t) => t.auditorIds.includes(String(user?.id || "")));
  }, [teams, user]);

  const activePhase = useMemo(() => {
    return phases.find((p) => p.id === activePhaseId);
  }, [activePhaseId, phases]);

  const activeBallot = useMemo(() => {
    if (!activePhase || !myTeam) return null;
    return myTeam.ballots.find((b) => b.id === activePhase.ballotId);
  }, [activePhase, myTeam]);

  if (sessionLoading || isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">⏳ Đang tải...</p>
      </Card>
    );
  }

  if (!myTeam) {
    return (
      <Card className="p-6 bg-amber-50 border-l-4 border-amber-500">
        <p className="text-amber-700 font-semibold">
          ⚠️ Bạn chưa được gán tổ kiểm phiếu nào
        </p>
      </Card>
    );
  }

  // Handlers
  const handleStartPhase = async (
    level: "QUOCHOI" | "THANHPHO" | "XA",
    mode: "FIXED_QUOTA" | "UNLIMITED",
    quota?: number,
  ) => {
    const ballot = myTeam.ballots.find((b) => b.level === level);
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

  const handleVote = (candidateId: string) => {
    if (activePhaseId) {
      recordVote(activePhaseId, candidateId);
    }
  };

  const handleCompletePhase = async () => {
    if (!activePhaseId) return;

    setIsSubmitting(true);
    try {
      const success = completePhase(activePhaseId);
      if (success) {
        setActivePhaseId("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPhase = () => {
    setActivePhaseId("");
  };

  // View 1: Chọn loại & mode
  if (!activePhaseId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kiểm phiếu</h1>
          <p className="text-gray-600 mt-2">
            Chọn loại bầu cử để bắt đầu kiểm phiếu
          </p>
        </div>

        <VotingInterface
          team={myTeam}
          auditorId={String(user?.id || "")}
          onStartPhase={handleStartPhase}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  // View 2: Đang kiểm phiếu
  if (activePhase && activeBallot) {
    return (
      <ActivePhaseVoting
        phase={activePhase}
        ballot={activeBallot}
        onVote={handleVote}
        onComplete={handleCompletePhase}
        onCancel={handleCancelPhase}
        isSubmitting={isSubmitting}
      />
    );
  }

  return null;
};
