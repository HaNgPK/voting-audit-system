"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "@/src/components/common";
import { CancelPhaseModal } from "./CancelPhaseModal";
import { CheckCircle, RotateCcw, Check } from "lucide-react";
import type { VotingPhase } from "@/src/data/mockVotingAssignments";
import type { Ballot } from "@/src/data/mockElectionTeams";

interface ActivePhaseVotingProps {
  phase: VotingPhase;
  ballot: Ballot;
  onToggleCandidate: (candidateId: string) => void;
  onCompleteTicket: () => void;
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ActivePhaseVoting: React.FC<ActivePhaseVotingProps> = ({
  phase,
  ballot,
  onToggleCandidate,
  onCompleteTicket,
  onComplete,
  onCancel,
  isSubmitting = false,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const candidates = ballot.candidates || [];
  const isFixedQuota = phase.mode === "FIXED_QUOTA";
  const quota = phase.quota || 0;
  const ballotCount = phase.ballotCount || 0;
  const progress = isFixedQuota ? (ballotCount / quota) * 100 : 0;
  const canComplete = !isFixedQuota || ballotCount === quota;
  const currentTicket = phase.currentTicketVotes || {};
  const selectedInTicket = Object.keys(currentTicket).filter(
    (id) => currentTicket[id],
  );

  // Chặn reload / đóng tab / navigate ra ngoài khi đang trong phiên
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Bạn đang trong phiên kiểm phiếu. Thoát ra sẽ làm mất dữ liệu!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handler: click nút Hủy → mở modal thay vì hủy thẳng
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // Handler: xác nhận hủy phiên (bỏ dữ liệu)
  const handleForceCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  // Handler: kết thúc & lưu (chỉ dùng cho UNLIMITED)
  const handleCompleteFromModal = () => {
    setShowCancelModal(false);
    onComplete();
  };

  return (
    <>
      <div className="space-y-4">
        {/* Phase Header */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                📋 Phiên kiểm phiếu
              </h3>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {ballot.name}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold text-blue-600">{ballotCount}</p>
              <p className="text-xs text-gray-600">phiếu đã hoàn tất</p>
            </div>
          </div>

          {isFixedQuota && (
            <div className="space-y-1.5 mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    progress >= 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-600">
                {ballotCount} / {quota} phiếu
              </p>
            </div>
          )}

          <div
            className={isFixedQuota ? "" : "mt-3 pt-3 border-t border-gray-100"}
          >
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                isFixedQuota
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isFixedQuota ? `📊 Được giao ${quota} phiếu` : "♾️ Tự do đếm"}
            </span>
          </div>
        </Card>

        {/* Current Ticket Card */}
        <Card className="p-4 sm:p-6 border-2 border-blue-300 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-blue-900">
                🗳️ Phiếu #{ballotCount + 1}
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 mt-0.5">
                Chọn ứng viên được bầu trong tờ phiếu này
              </p>
            </div>
            <span className="flex-shrink-0 ml-2 px-2.5 py-1 bg-blue-200 text-blue-900 rounded-full text-xs sm:text-sm font-semibold">
              {selectedInTicket.length} đã chọn
            </span>
          </div>

          {/* Candidate list */}
          <div className="space-y-2">
            {candidates.map((candidate) => {
              const isSelected = !!currentTicket[candidate.id];
              const accumulated = phase.votes[candidate.id] || 0;
              return (
                <button
                  key={candidate.id}
                  onClick={() => onToggleCandidate(candidate.id)}
                  disabled={isSubmitting}
                  className={`w-full text-left flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? "border-blue-500 bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                  <p className="flex-1 font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {candidate.index}. {candidate.name}
                  </p>
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    <span
                      className={`px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : accumulated > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {accumulated}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-xs sm:text-sm text-blue-800 flex-1">
                Sau khi chọn xong, nhấn <strong>Hoàn tất phiếu</strong> để ghi
                nhận và chuyển sang phiếu tiếp theo.
              </p>
              <Button
                onClick={onCompleteTicket}
                variant="primary"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-shrink-0"
              >
                <CheckCircle className="w-4 h-4" />
                Hoàn tất phiếu
              </Button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Nút Hủy → mở modal thay vì hủy thẳng */}
          <Button
            onClick={handleCancelClick}
            variant="danger"
            disabled={isSubmitting}
            className="flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Hủy phiên</span>
            <span className="sm:hidden">Hủy</span>
          </Button>

          {!canComplete && isFixedQuota && (
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs sm:text-sm text-amber-800 font-medium whitespace-nowrap">
                Còn {quota - ballotCount} phiếu nữa
              </p>
            </div>
          )}

          <Button
            onClick={onComplete}
            variant="success"
            disabled={isSubmitting || !canComplete}
            isLoading={isSubmitting}
            className="ml-auto flex-shrink-0"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hoàn thành phiên</span>
            <span className="sm:hidden">Hoàn thành</span>
          </Button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelPhaseModal
        isOpen={showCancelModal}
        mode={phase.mode}
        ballotCount={ballotCount}
        quota={quota}
        onClose={() => setShowCancelModal(false)}
        onForceCancel={handleForceCancel}
        onComplete={handleCompleteFromModal}
      />
    </>
  );
};
