"use client";

import React, { useState } from "react";
import { Card, Button, Modal } from "@/src/components/common";
import clsx from "clsx";

interface VotingModalProps {
  isOpen: boolean;
  ballots: Array<{
    id: string;
    name: string;
    level: "QUOCHOI" | "THANHPHO" | "XA";
    candidates?: Array<{
      id: string;
      name: string;
      index: number;
      birthYear?: number;
      gender?: "Nam" | "Nữ";
    }>;
  }>;
  onClose: () => void;
  onVoteSubmitted: (ballotId: string) => void;
}

const LEVEL_LABELS: Record<string, string> = {
  QUOCHOI: "🏛️ Quốc Hội",
  THANHPHO: "🏢 Thành Phố",
  XA: "🏘️ Xã",
};

export const VotingModal: React.FC<VotingModalProps> = ({
  isOpen,
  ballots,
  onClose,
  onVoteSubmitted,
}) => {
  const [selectedBallotId, setSelectedBallotId] = useState<string>(
    ballots[0]?.id || "",
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBallot = ballots.find((b) => b.id === selectedBallotId);
  const candidates = selectedBallot?.candidates || [];

  const handleToggleCandidate = (candidateId: string) => {
    const newSelected = new Set(selectedCandidateIds);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidateIds(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedCandidateIds.size === 0) {
      alert("Vui lòng chọn ít nhất một ứng cử viên");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onVoteSubmitted(selectedBallotId);
      setSelectedCandidateIds(new Set());
      setSelectedBallotId(ballots[0]?.id || "");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="📋 Thêm phiếu bầu"
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-4 sm:space-y-6 max-h-96 overflow-y-auto">
        {/* Ballot Selector */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Chọn cuộc bầu cử
          </h3>

          <div className="space-y-2">
            {ballots.map((ballot) => (
              <button
                key={ballot.id}
                onClick={() => {
                  setSelectedBallotId(ballot.id);
                  setSelectedCandidateIds(new Set());
                }}
                className={clsx(
                  "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all",
                  selectedBallotId === ballot.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {LEVEL_LABELS[ballot.level]}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {ballot.name}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Candidates Selection */}
        {selectedBallot && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Chọn ứng cử viên
            </h3>

            {candidates.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Không có ứng cử viên nào
              </p>
            ) : (
              <div className="space-y-2">
                {candidates.map((candidate) => (
                  <label
                    key={candidate.id}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCandidateIds.has(candidate.id)}
                      onChange={() => handleToggleCandidate(candidate.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {candidate.index}. {candidate.name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-900">
                <span className="font-semibold">
                  {selectedCandidateIds.size}
                </span>{" "}
                ứng cử viên được chọn
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            disabled={isSubmitting}
          >
            Xóa chọn
          </Button>

          <Button
            onClick={handleSubmit}
            variant="success"
            fullWidth
            isLoading={isSubmitting}
            disabled={selectedCandidateIds.size === 0}
          >
            📤 Ghi nhận phiếu ({selectedCandidateIds.size})
          </Button>
        </div>
      </div>
    </Modal>
  );
};
