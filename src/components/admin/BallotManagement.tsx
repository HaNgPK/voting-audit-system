"use client";

import { useState } from "react";
import { Card, Modal, Input, Select, Button } from "@/src/components/common";
import {
  mockAvailableBallots,
  type Ballot,
  type ElectionLevel,
  type Candidate,
} from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, Search, Users } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "QUOCHOI", label: "🏛️ Quốc Hội" },
  { value: "THANHPHO", label: "🏢 Thành Phố" },
  { value: "XA", label: "🏘️ Xã" },
];

export const BallotManagement: React.FC = () => {
  const [ballots, setBallots] = useState<Ballot[]>([...mockAvailableBallots]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBallot, setEditingBallot] = useState<Ballot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    index: 1,
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
      const newBallot: Ballot = {
        id: `ballot-${Date.now()}`,
        name: formData.name,
        level: formData.level,
        candidates: [],
      };
      setBallots([newBallot, ...ballots]);
      toast.success("Tạo danh sách mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleOpenCandidateModal = (ballot: Ballot) => {
    setManagingBallot(ballot);
    const nextIndex = ((ballot.candidates || []).length || 0) + 1;
    setCandidateForm({
      name: "",
      birthYear: "",
      gender: "Nam",
      index: nextIndex,
    });
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
      index: candidateForm.index,
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
    toast.success("Thêm ứng viên thành công!");
    const nextIndex = ((managingBallot?.candidates || []).length || 0) + 2;
    setCandidateForm({
      name: "",
      birthYear: "",
      gender: "Nam",
      index: nextIndex,
    });
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
    toast.success("Xóa ứng viên thành công!");
  };

  const handleDeleteBallot = (ballotId: string) => {
    if (!confirm("Xóa danh sách này?")) return;
    setBallots((prev) => prev.filter((b) => b.id !== ballotId));
    toast.success("Xóa danh sách thành công!");
  };

  const filteredBallots = ballots.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="p-0 overflow-hidden animate-fadeInUp">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý Danh sách bầu cử
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tạo và quản lý danh sách bầu cử, ứng cử viên
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-44"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Thêm danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              {["Tên danh sách", "Cấp độ", "Ứng cử viên", "Thao tác"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBallots.map((ballot, idx) => (
              <tr
                key={ballot.id}
                className="hover:bg-blue-50/40 transition-colors duration-150 animate-fadeInUp"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900 text-sm">
                    {ballot.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {LEVEL_OPTIONS.find((l) => l.value === ballot.level)
                      ?.label || ballot.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenCandidateModal(ballot)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Users className="w-3 h-3" />
                    {ballot.candidates?.length || 0} người
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenCandidateModal(ballot)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-90"
                      title="Quản lý ứng viên"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(ballot)}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-90"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBallot(ballot.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBallots.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  Không tìm thấy danh sách bầu cử nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tạo/Sửa Danh sách */}
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
            placeholder="Ví dụ: Danh sách bầu cử Quốc hội 2026"
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

      {/* Modal Quản lý Ứng viên */}
      <Modal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        title={`👥 Ứng viên: ${managingBallot?.name}`}
        size="lg"
      >
        <div className="space-y-5">
          {/* Form Thêm Ứng viên */}
          <form
            onSubmit={handleAddCandidate}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
          >
            <p className="text-sm font-semibold text-gray-700">
              Thêm ứng cử viên
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Họ và tên"
                value={candidateForm.name}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, name: e.target.value })
                }
                placeholder="Nhập tên ứng cử viên"
              />
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
                placeholder="1980"
              />
              <Input
                label="Số thứ tự"
                type="number"
                value={candidateForm.index}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    index: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <span className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Thêm
                </span>
              </Button>
            </div>
          </form>

          {/* Danh sách Ứng viên */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Danh sách ({(managingBallot?.candidates || []).length} ứng viên)
            </p>
            {(managingBallot?.candidates || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có ứng cử viên nào. Hãy thêm ở trên.
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {["STT", "Họ và tên", "Năm sinh", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left text-xs font-semibold text-gray-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(managingBallot?.candidates || []).map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-4 py-2 text-sm font-semibold text-gray-600">
                          {c.index}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-800">
                          {c.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {c.birthYear}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleDeleteCandidate(c.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              variant="primary"
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
