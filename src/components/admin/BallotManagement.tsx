"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Input,
  Select,
  Table,
} from "@/src/components/common";
import {
  mockAvailableBallots,
  type Ballot,
  type ElectionLevel,
  type Candidate,
} from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";

const LEVEL_OPTIONS = [
  { value: "QUOCHOI", label: "🏛️ Quốc Hội" },
  { value: "THANHPHO", label: "🏢 Thành Phố" },
  { value: "XA", label: "🏘️ Xã" },
];

export const BallotManagement: React.FC = () => {
  const [ballots, setBallots] = useState<Ballot[]>([...mockAvailableBallots]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBallot, setEditingBallot] = useState<Ballot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: "QUOCHOI" as ElectionLevel,
  });

  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [managingBallot, setManagingBallot] = useState<Ballot | null>(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    birthYear: "",
    gender: "Nam" as "Nam" | "Nữ",
  });

  const handleOpenModal = (ballot?: Ballot) => {
    if (ballot) {
      setEditingBallot(ballot);
      setFormData({ name: ballot.name, level: ballot.level });
    } else {
      setEditingBallot(null);
      setFormData({ name: "", level: "QUOCHOI" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim())
      return toast.error("Tên danh sách không được để trống!");
    if (editingBallot) {
      setBallots((prev) =>
        prev.map((b) =>
          b.id === editingBallot.id ? { ...b, ...formData } : b,
        ),
      );
      toast.success("Cập nhật danh sách thành công!");
    } else {
      setBallots([
        {
          id: `ballot-${Date.now()}`,
          name: formData.name,
          level: formData.level,
          candidates: [],
        },
        ...ballots,
      ]);
      toast.success("Tạo danh sách mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleOpenCandidateModal = (ballot: Ballot) => {
    setManagingBallot(ballot);
    setCandidateForm({ name: "", birthYear: "", gender: "Nam" });
    setCandidateModalOpen(true);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.birthYear)
      return toast.error("Vui lòng nhập đủ thông tin!");
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: candidateForm.name,
      birthYear: parseInt(candidateForm.birthYear),
      gender: candidateForm.gender,
    };

    setBallots((prev) =>
      prev.map((b) => {
        if (b.id === managingBallot?.id) {
          const updatedCandidates = [...(b.candidates || []), newCandidate];
          setManagingBallot({ ...b, candidates: updatedCandidates });
          return { ...b, candidates: updatedCandidates };
        }
        return b;
      }),
    );
    setCandidateForm({ name: "", birthYear: "", gender: "Nam" });
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (!confirm("Xóa ứng cử viên này?")) return;
    setBallots((prev) =>
      prev.map((b) => {
        if (b.id === managingBallot?.id) {
          const updatedCandidates = (b.candidates || []).filter(
            (c) => c.id !== candidateId,
          );
          setManagingBallot({ ...b, candidates: updatedCandidates });
          return { ...b, candidates: updatedCandidates };
        }
        return b;
      }),
    );
  };

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          📋 Quản lý Danh sách bầu cử
        </h2>
        <Button onClick={() => handleOpenModal()} variant="success">
          ➕ Thêm danh sách
        </Button>
      </div>

      <Table
        headers={["Tên danh sách", "Cấp độ", "Số ứng cử viên", "Thao tác"]}
        rows={ballots.map((b) => [
          <span key={b.id} className="font-medium text-gray-800">
            {b.name}
          </span>,
          LEVEL_OPTIONS.find((l) => l.value === b.level)?.label || b.level,
          <span
            key={`count-${b.id}`}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-semibold"
          >
            {b.candidates?.length || 0} người
          </span>,
        ])}
        actions={(rowIdx) => (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCandidateModal(ballots[rowIdx])}
            >
              👥 Ứng viên
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenModal(ballots[rowIdx])}
            >
              ✏️ Sửa
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                confirm("Xóa danh sách này?") &&
                setBallots((prev) =>
                  prev.filter((b) => b.id !== ballots[rowIdx].id),
                )
              }
            >
              🗑️ Xóa
            </Button>
          </div>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBallot ? "📝 Sửa danh sách" : "✨ Tạo danh sách bầu cử"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh sách"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Cấp độ"
            value={formData.level}
            onChange={(e) =>
              setFormData({
                ...formData,
                level: e.target.value as ElectionLevel,
              })
            }
            options={LEVEL_OPTIONS}
          />
          <div className="flex gap-3 justify-end pt-4 border-t mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              {editingBallot ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        title={`👥 Ứng viên: ${managingBallot?.name}`}
        size="lg"
      >
        <div className="space-y-6">
          <form
            onSubmit={handleAddCandidate}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <Input
                label="Họ và tên"
                value={candidateForm.name}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="Năm sinh"
                type="number"
                value={candidateForm.birthYear}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    birthYear: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Select
                label="Giới tính"
                value={candidateForm.gender}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    gender: e.target.value as any,
                  })
                }
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                ]}
              />
            </div>
            <div className="sm:col-span-4 mt-2 flex justify-end">
              <Button type="submit" variant="primary">
                ➕ Thêm vào danh sách
              </Button>
            </div>
          </form>

          <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
            <Table
              headers={["Họ và tên", "Năm sinh", "Giới tính", "Hành động"]}
              rows={(managingBallot?.candidates || []).map((c) => [
                <span key={c.id} className="font-semibold text-gray-800">
                  {c.name}
                </span>,
                c.birthYear,
                c.gender,
              ])}
              actions={(rowIdx) => (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleDeleteCandidate(
                      (managingBallot?.candidates || [])[rowIdx].id,
                    )
                  }
                >
                  🗑️ Xóa
                </Button>
              )}
            />
          </div>

          <div className="flex justify-end pt-4 border-t mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCandidateModalOpen(false)}
            >
              ✅ Hoàn thành & Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
