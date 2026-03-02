"use client";

import { useState } from "react";
import { Modal, Button } from "@/src/components/common";
import type { Ballot } from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballots: Ballot[];
  onVoteSubmitted?: (ballotId: string) => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  isOpen,
  onClose,
  ballots,
  onVoteSubmitted,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedBallot, setSelectedBallot] = useState<Ballot | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionVoteCount, setSessionVoteCount] = useState(0);

  // THÊM STATE ĐỂ QUẢN LÝ POPUP XÁC NHẬN
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelectBallot = (ballot: Ballot) => {
    setSelectedBallot(ballot);
    setSelectedCandidateIds([]);
    setSessionVoteCount(0);
    setStep(2);
  };

  const handleToggleCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id],
    );
  };

  // BƯỚC 1: Nút Hoàn thành ở form chính gọi hàm này để mở Popup
  const handleRequestSubmit = () => {
    if (selectedCandidateIds.length === 0) {
      return toast.error("Vui lòng tích chọn ít nhất 1 ứng cử viên!");
    }
    // Mở popup xác nhận
    setIsConfirming(true);
  };

  // BƯỚC 2: Nút Chắc chắn ở popup gọi hàm này để lưu thật
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Giả lập lưu API
      await new Promise((resolve) => setTimeout(resolve, 200));
      toast.success(`Đã ghi nhận 1 phiếu hợp lệ!`, {
        position: "bottom-center",
      });

      setSessionVoteCount((prev) => prev + 1);
      setSelectedCandidateIds([]);
      setIsConfirming(false); // Đóng popup xác nhận

      if (selectedBallot && onVoteSubmitted) {
        onVoteSubmitted(selectedBallot.id);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedBallot(null);
    setSelectedCandidateIds([]);
    setSessionVoteCount(0);
    setIsConfirming(false); // Reset luôn cả trạng thái xác nhận
    onClose();
  };

  return (
    <>
      {/* MODAL 1: MÀN HÌNH NHẬP PHIẾU CHÍNH */}
      <Modal
        isOpen={isOpen}
        onClose={resetAndClose}
        title={
          step === 1
            ? "🗳️ BƯỚC 1: Chọn loại phiếu bầu"
            : `📝 BƯỚC 2: Kiểm phiếu`
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
            {ballots.length === 0 && (
              <p className="col-span-3 text-center text-gray-500 py-4">
                Tổ này chưa được gán loại phiếu nào.
              </p>
            )}
          </div>
        )}

        {step === 2 && selectedBallot && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-sm text-gray-600 block">
                  Đang kiểm loại phiếu:
                </span>
                <span className="font-bold text-blue-700 text-lg">
                  {selectedBallot.name}
                </span>
              </div>
              <div className="text-right bg-green-100 border border-green-300 px-4 py-2 rounded-lg shadow-inner">
                <span className="text-xs text-green-800 block uppercase font-bold tracking-wider">
                  Phiếu vừa nhập
                </span>
                <span className="font-extrabold text-2xl text-green-700">
                  +{sessionVoteCount}
                </span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-[350px] overflow-y-auto">
              <table className="w-full text-left bg-white">
                <thead className="bg-gray-100 border-b sticky top-0 shadow-sm">
                  <tr>
                    <th className="p-3 w-16 text-center font-semibold">Chọn</th>
                    <th className="p-3 font-semibold">Họ và tên</th>
                    <th className="p-3 font-semibold">Năm sinh</th>
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
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        {candidate.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {candidate.birthYear}
                      </td>
                    </tr>
                  ))}
                  {(!selectedBallot.candidates ||
                    selectedBallot.candidates.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-gray-500 italic"
                      >
                        Danh sách này chưa có ứng cử viên.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 pt-4 border-t items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                ⬅️ Đổi loại phiếu
              </Button>
              <div className="flex-1"></div>
              {/* Nút Đóng thì thoát bình thường */}
              <Button
                type="button"
                variant="danger"
                onClick={resetAndClose}
                disabled={isSubmitting}
              >
                🚪 Đóng
              </Button>
              {/* Nút Hoàn Thành thì gọi popup */}
              <Button
                type="button"
                variant="success"
                onClick={handleRequestSubmit}
                disabled={isSubmitting || selectedCandidateIds.length === 0}
                className="min-w-[180px]"
              >
                ✅ Hoàn thành (Tiếp tục)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: POPUP XÁC NHẬN NHỎ HIỂN THỊ CHỒNG LÊN */}
      <Modal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        title="⚠️ Xác nhận phiếu bầu"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            <p className="mb-2">Bạn đang ghi nhận phiếu cho:</p>
            <p className="font-bold mb-3">{selectedBallot?.name}</p>
            <p className="text-sm">
              Số ứng viên đã chọn:{" "}
              <span className="font-bold text-xl text-blue-600 bg-white px-2 py-1 rounded mx-1">
                {selectedCandidateIds.length}
              </span>{" "}
              người
            </p>
          </div>

          <p className="text-sm text-gray-500 italic text-center">
            Hãy kiểm tra kỹ, thao tác này không thể hoàn tác.
          </p>

          <div className="flex gap-3 pt-4 border-t justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsConfirming(false)}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              variant="success"
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="min-w-[120px]"
            >
              ✅ Chắc chắn
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
