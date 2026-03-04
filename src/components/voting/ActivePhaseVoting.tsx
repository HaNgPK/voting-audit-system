"use client";

import React, { useMemo } from "react";
import { Card, Button } from "@/src/components/common";
import { CandidateListItem } from "./CandidateListItem";
import { CheckCircle, StopCircle, RotateCcw } from "lucide-react";
import type { VotingPhase } from "@/src/data/mockVotingAssignments";
import type { Ballot } from "@/src/data/mockElectionTeams";

interface ActivePhaseVotingProps {
  phase: VotingPhase;
  ballot: Ballot;
  onVote: (candidateId: string) => void;
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ActivePhaseVoting: React.FC<ActivePhaseVotingProps> = ({
  phase,
  ballot,
  onVote,
  onComplete,
  onCancel,
  isSubmitting = false,
}) => {
  const candidates = ballot.candidates || [];
  const isFixedQuota = phase.mode === "FIXED_QUOTA";
  const quota = phase.quota || 0;
  const progress = isFixedQuota ? (phase.totalVotes / quota) * 100 : 0;
  const canComplete = !isFixedQuota || phase.totalVotes === quota;

  const votedCandidates = useMemo(() => {
    return candidates.filter((c) => phase.votes[c.id]);
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
            <p className="text-sm text-gray-600 mt-1">{ballot.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">
              {phase.totalVotes}
            </p>
            <p className="text-xs text-gray-600">phiếu</p>
          </div>
        </div>

        {/* Progress Bar (Fixed Quota) */}
        {isFixedQuota && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600">
              {phase.totalVotes} / {quota} phiếu
            </p>
          </div>
        )}

        {/* Mode Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              isFixedQuota
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isFixedQuota ? "📊 Được giao " + quota + " phiếu" : "♾️ Tự do đếm"}
          </span>
        </div>
      </Card>

      {/* Candidates List */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách ứng cử viên
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => onVote(candidate.id)}
              disabled={isSubmitting}
              className="w-full text-left flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {candidate.index}. {candidate.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                  {phase.votes[candidate.id] || 0}
                </span>
                {phase.votes[candidate.id] > 0 && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Vote Summary */}
      {votedCandidates.length > 0 && (
        <Card className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-900">
            <span className="font-bold">{votedCandidates.length}</span> ứng cử
            viên được bầu, <span className="font-bold">{phase.totalVotes}</span>{" "}
            phiếu tổng cộng
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={onCancel} variant="danger" disabled={isSubmitting}>
          <RotateCcw className="w-4 h-4" />
          Hủy phiên
        </Button>

        <Button
          onClick={onComplete}
          variant="success"
          disabled={isSubmitting || !canComplete}
          isLoading={isSubmitting}
          className="ml-auto"
        >
          <CheckCircle className="w-4 h-4" />
          Hoàn thành phiên
        </Button>

        {!canComplete && isFixedQuota && (
          <div className="ml-auto px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              Còn {quota - phase.totalVotes} phiếu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
