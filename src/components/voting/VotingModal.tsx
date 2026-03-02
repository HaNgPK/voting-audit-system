"use client";

import { useState } from "react";
import { Modal, Button } from "@/src/components/common";
import type { Ballot } from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballots: Ballot[];
}

export const VotingModal: React.FC<VotingModalProps> = ({
  isOpen,
  onClose,
  ballots,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedBallot, setSelectedBallot] = useState<Ballot | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectBallot = (ballot: Ballot) => {
    setSelectedBallot(ballot);
    setSelectedCandidateIds([]);
    setStep(2);
  };

  const handleToggleCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id],
    );
  };

  const handleSubmitVote = async () => {
    if (selectedCandidateIds.length === 0) {
      toast.error("Vui lòng tích chọn ít nhất 1 ứng cử viên!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Giả lập API lưu phiếu mất 0.3s
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success("✅ Đã ghi nhận 1 lá phiếu thành công!");

      // Hoàn thành 1 phiếu -> Reset để nhập tờ tiếp theo luôn (không đóng modal)
      setSelectedCandidateIds([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedBallot(null);
    setSelectedCandidateIds([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={
        step === 1
          ? "🗳️ BƯỚC 1: Chọn loại phiếu bầu"
          : `📝 BƯỚC 2: Kiểm phiếu - ${selectedBallot?.name}`
      }
      size="lg"
    >
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {ballots.map((ballot) => (
            <div
              key={ballot.id}
              onClick={() => handleSelectBallot(ballot)}
              className="border-2 border-blue-100 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 cursor-pointer rounded-xl p-6 text-center transition-all shadow-sm"
            >
              <div className="text-4xl mb-3">
                {ballot.level === "QUOCHOI"
                  ? "🏛️"
                  : ballot.level === "THANHPHO"
                    ? "🏢"
                    : "🏘️"}
              </div>
              <h4 className="font-bold text-gray-800">{ballot.name}</h4>
            </div>
          ))}
        </div>
      )}

      {step === 2 && selectedBallot && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Loại phiếu:</span>
            <span className="font-bold text-blue-600">
              {selectedBallot.name}
            </span>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left bg-white">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 w-16 text-center">Chọn</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Năm sinh</th>
                  <th className="p-3">Giới tính</th>
                </tr>
              </thead>
              <tbody>
                {(selectedBallot.candidates || []).map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleToggleCandidate(candidate.id)}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCandidateIds.includes(candidate.id)}
                        readOnly
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      {candidate.name}
                    </td>
                    <td className="p-3 text-gray-600">{candidate.birthYear}</td>
                    <td className="p-3 text-gray-600">{candidate.gender}</td>
                  </tr>
                ))}
                {(!selectedBallot.candidates ||
                  selectedBallot.candidates.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      Chưa có danh sách ứng cử viên. Vui lòng báo Admin thêm
                      danh sách!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              ⬅️ Chọn loại khác
            </Button>
            <div className="flex-1"></div>
            <Button
              type="button"
              onClick={handleSubmitVote}
              disabled={isSubmitting || selectedCandidateIds.length === 0}
              className="min-w-[150px] bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? "⏳ Đang xử lý..." : "✅ Submit phiếu"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
