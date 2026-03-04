"use client";

import React, { useMemo } from "react";
import { Card, Button } from "@/src/components/common";
import { CandidateListItem } from "./CandidateListItem";
import { CheckCircle, Pause, Play, X } from "lucide-react";
import type { Ballot, Candidate } from "@/src/data/mockElectionTeams";

interface ActiveVotingPhaseProps {
  phase: {
    id: string;
    totalVotes: number;
    votes: Record<string, number>;
    status: "ACTIVE" | "PAUSED" | "COMPLETED";
  };
  ballot: Ballot;
  assignment: {
    mode: "FIXED_QUOTA" | "UNLIMITED";
    quota?: number;
  };
  onVote: (candidateId: string) => void;
  onCompletePhase: () => void;
  onPausePhase: () => void;
  onResumePhase: () => void;
  onCancelPhase: () => void;
  isSubmitting?: boolean;
}

export const ActiveVotingPhase: React.FC<ActiveVotingPhaseProps> = ({
  phase,
  ballot,
  assignment,
  onVote,
  onCompletePhase,
  onPausePhase,
  onResumePhase,
  onCancelPhase,
  isSubmitting = false,
}) => {
  const candidates = ballot.candidates || [];
  const isQuotaMode = assignment.mode === "FIXED_QUOTA";
  const quota = assignment.quota || 0;
  const progress = isQuotaMode ? (phase.totalVotes / quota) * 100 : 0;
  const canComplete = !isQuotaMode || phase.totalVotes === quota;

  const votingStats = useMemo(() => {
    return candidates.map((c) => ({
      id: c.id,
      name: c.name,
      index: c.index,
      votes: phase.votes[c.id] || 0,
    }));
  }, [candidates, phase.votes]);

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              📋 Phiên kiểm phiếu
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isQuotaMode
                ? `Quota: ${quota} phiếu`
                : "Không giới hạn số lượng"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">
              {phase.totalVotes}
            </p>
            <p className="text-xs text-gray-600">phiếu đã kiểm</p>
          </div>
        </div>

        {/* Progress Bar (Quota Mode Only) */}
        {isQuotaMode && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600">
              {phase.totalVotes} / {quota} phiếu ({progress.toFixed(0)}%)
            </p>
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              phase.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : phase.status === "PAUSED"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {phase.status === "ACTIVE"
              ? "🟢 Đang kiểm phiếu"
              : phase.status === "PAUSED"
                ? "⏸️ Tạm dừng"
                : "✅ Đã hoàn thành"}
          </span>
        </div>
      </Card>

      {/* Candidate List */}
      {phase.status !== "COMPLETED" && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách ứng cử viên
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => onVote(candidate.id)}
                disabled={phase.status !== "ACTIVE" || isSubmitting}
                className="w-full text-left flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {candidate.index}. {candidate.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                    {phase.votes[candidate.id] || 0}
                  </span>
                  {phase.votes[candidate.id] ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Vote Summary */}
      {Object.keys(phase.votes).length > 0 && phase.status !== "COMPLETED" && (
        <Card className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-900">
            <span className="font-bold">{Object.keys(phase.votes).length}</span>{" "}
            ứng cử viên được bầu,{" "}
            <span className="font-bold">{phase.totalVotes}</span> phiếu tổng
            cộng
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      {phase.status !== "COMPLETED" && (
        <div className="flex gap-3 flex-wrap">
          {phase.status === "ACTIVE" ? (
            <>
              <Button
                onClick={onPausePhase}
                variant="secondary"
                disabled={isSubmitting}
              >
                <Pause className="w-4 h-4" />
                Tạm dừng
              </Button>
            </>
          ) : (
            <Button
              onClick={onResumePhase}
              variant="secondary"
              disabled={isSubmitting}
            >
              <Play className="w-4 h-4" />
              Tiếp tục
            </Button>
          )}

          <Button
            onClick={onCancelPhase}
            variant="danger"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
            Hủy phiên
          </Button>

          {canComplete && phase.status === "ACTIVE" && (
            <Button
              onClick={onCompletePhase}
              variant="success"
              disabled={isSubmitting || !canComplete}
              isLoading={isSubmitting}
              className="ml-auto"
            >
              ✅ Hoàn thành phiên
            </Button>
          )}

          {!canComplete && isQuotaMode && (
            <div className="ml-auto px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Phải kiểm đủ {quota} phiếu ({quota - phase.totalVotes} còn lại)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
