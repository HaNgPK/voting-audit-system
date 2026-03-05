"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/common";
import { CancelPhaseModal } from "./CancelPhaseModal";
import { Check, AlertCircle, XCircle } from "lucide-react";
import type { VotingPhase } from "@/src/data/mockVotingAssignments";
import type { Ballot } from "@/src/data/mockElectionTeams";

interface ActivePhaseVotingProps {
  phase: any;
  ballot: Ballot;
  onToggleCandidate: (candidateId: string) => void;
  onCompleteTicket: (phaseId: string, isValid: boolean) => void;
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
  const selectedCount = selectedInTicket.length;

  // NGHIỆP VỤ MAX SELECT
  const maxSelect = (ballot as any).maxSelect || 1;
  const isOverSelect = selectedCount > maxSelect;
  const isBlank = selectedCount === 0;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Đang trong phiên đếm, thoát sẽ mất dữ liệu!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        {/* Phase Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              📋 Đang kiểm phiếu
            </h3>
            <p className="text-gray-500 font-medium">{ballot.name}</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-3xl font-black text-blue-600">{ballotCount}</p>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              phiếu đã hoàn tất
            </p>
            {isFixedQuota && (
              <p className="text-xs text-gray-500 mt-1">
                Được giao: {quota} phiếu
              </p>
            )}
          </div>
        </div>

        {/* Khối Ticket (Tờ phiếu đang đếm) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border-2 border-blue-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h4 className="text-lg font-bold text-gray-900">
              🗳️ Đang nhập phiếu số #{ballotCount + 1}
            </h4>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-xs sm:text-sm">
              Chỉ tiêu: Chọn tối đa {maxSelect} người
            </span>
          </div>

          {/* Cảnh báo Phiếu Hỏng */}
          {isOverSelect && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm font-medium animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>
                Phiếu này tích chọn <strong>{selectedCount}</strong> người (vượt
                quá {maxSelect}). Đây là <strong>PHIẾU HỎNG</strong>.
              </p>
            </div>
          )}

          {/* Danh sách Ứng viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {candidates.map((candidate: any) => {
              const isSelected = !!currentTicket[candidate.id];
              return (
                <button
                  key={candidate.id}
                  onClick={() => onToggleCandidate(candidate.id)}
                  disabled={isSubmitting}
                  className={`w-full text-left flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? isOverSelect
                        ? "border-red-500 bg-red-50 text-red-900 shadow-sm"
                        : "border-blue-500 bg-blue-50 text-blue-900 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded border ${
                      isSelected
                        ? isOverSelect
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    )}
                  </div>
                  <span className="font-bold flex-1 text-sm sm:text-base">
                    {candidate.index}. {candidate.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2 Nút Xác nhận tờ phiếu */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => onCompleteTicket(phase.id, true)}
              disabled={isSubmitting || isOverSelect || isBlank}
              className="flex-1 py-3.5 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm sm:text-base shadow-sm"
            >
              <Check className="w-5 h-5" />
              {isBlank ? "Hãy chọn ứng viên" : "Xác nhận Phiếu Hợp Lệ"}
            </button>

            <button
              onClick={() => onCompleteTicket(phase.id, false)}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200 text-sm sm:text-base"
            >
              <XCircle className="w-5 h-5" />
              Đánh dấu Phiếu Hỏng / Trắng
            </button>
          </div>
        </div>

        {/* Nút Kết Thúc Phiên */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
          <Button
            variant="danger"
            onClick={() => setShowCancelModal(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Hủy bỏ phiên
          </Button>

          <Button
            onClick={() => onComplete()}
            disabled={!canComplete || isSubmitting}
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-8 bg-gray-900 hover:bg-black text-white"
          >
            Lưu & Kết thúc phiên
          </Button>
        </div>
      </div>

      <CancelPhaseModal
        isOpen={showCancelModal}
        mode={phase.mode}
        ballotCount={ballotCount}
        quota={quota}
        onClose={() => setShowCancelModal(false)}
        onForceCancel={() => {
          setShowCancelModal(false);
          onCancel();
        }}
        onComplete={() => {
          setShowCancelModal(false);
          onComplete();
        }}
      />
    </>
  );
};
