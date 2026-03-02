"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Input,
  Table,
  Select,
} from "@/src/components/common";
import { useElectionTeamsMock } from "@/src/hooks/useElectionTeamsMock";
import {
  mockAvailableBallots,
  type ElectionTeam,
} from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";

const AUDITOR_OPTIONS = [
  { value: "2", label: "Trần Văn Kiểm phiếu 1" },
  { value: "3", label: "Phạm Văn Kiểm phiếu 2" },
  { value: "5", label: "Võ Văn Kiểm phiếu 3" },
  { value: "6", label: "Lê Văn Kiểm phiếu 4" },
  { value: "7", label: "Nguyễn Thị Kiểm phiếu 5" },
];

export const TeamManagement: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { teams, isLoading, createTeam, updateTeam, deleteTeam } =
    useElectionTeamsMock();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ElectionTeam | null>(null);

  const [name, setName] = useState("");
  const [auditorIds, setAuditorIds] = useState<string[]>([]);
  const [quocHoiId, setQuocHoiId] = useState("");
  const [thanhPhoId, setThanhPhoId] = useState("");
  const [xaId, setXaId] = useState("");

  const [searchAuditor, setSearchAuditor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quocHoiOptions = [
    { value: "", label: "-- Chọn danh sách Quốc Hội --" },
    ...mockAvailableBallots
      .filter((b) => b.level === "QUOCHOI")
      .map((b) => ({ value: b.id, label: b.name })),
  ];
  const thanhPhoOptions = [
    { value: "", label: "-- Chọn danh sách Thành Phố --" },
    ...mockAvailableBallots
      .filter((b) => b.level === "THANHPHO")
      .map((b) => ({ value: b.id, label: b.name })),
  ];
  const xaOptions = [
    { value: "", label: "-- Chọn danh sách Xã --" },
    ...mockAvailableBallots
      .filter((b) => b.level === "XA")
      .map((b) => ({ value: b.id, label: b.name })),
  ];

  const handleOpenModal = (team?: ElectionTeam) => {
    if (team) {
      setEditingTeam(team);
      setName(team.name);
      setAuditorIds([...team.auditorIds]);
      setQuocHoiId(team.ballots.find((b) => b.level === "QUOCHOI")?.id || "");
      setThanhPhoId(team.ballots.find((b) => b.level === "THANHPHO")?.id || "");
      setXaId(team.ballots.find((b) => b.level === "XA")?.id || "");
    } else {
      setEditingTeam(null);
      setName("");
      setAuditorIds([]);
      setQuocHoiId("");
      setThanhPhoId("");
      setXaId("");
    }
    setSearchAuditor("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || auditorIds.length === 0)
      return toast.error(
        "Vui lòng điền tên tổ và chọn ít nhất 1 người kiểm phiếu!",
      );

    setIsSubmitting(true);
    try {
      const selectedBallots = [
        mockAvailableBallots.find((b) => b.id === quocHoiId),
        mockAvailableBallots.find((b) => b.id === thanhPhoId),
        mockAvailableBallots.find((b) => b.id === xaId),
      ].filter(Boolean) as any[];

      const payload = { name, auditorIds, ballots: selectedBallots };
      if (editingTeam) await updateTeam(editingTeam.id, payload);
      else await createTeam(payload);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🧑‍🤝‍🧑 Quản lý tổ bầu cử
        </h2>
        <Button onClick={() => handleOpenModal()} variant="success">
          ➕ Thêm tổ mới
        </Button>
      </div>

      <Table
        headers={["Tên tổ", "Người phụ trách", "Nhiệm vụ bầu cử", "Thao tác"]}
        rows={teams.map((team) => [
          <span key={team.id} className="font-medium text-gray-800">
            {team.name}
          </span>,
          `${team.auditorIds.length} người`,
          team.ballots.map((b) => b.name).join(" | ") || "Chưa gán",
        ])}
        actions={(rowIdx) => (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenModal(teams[rowIdx])}
            >
              ✏️ Sửa
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                window.confirm("Xóa tổ này?") && deleteTeam(teams[rowIdx].id)
              }
            >
              🗑️ Xóa
            </Button>
          </div>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        title={editingTeam ? "📝 Cập nhật tổ bầu cử" : "✨ Tạo tổ bầu cử mới"}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Tên tổ bầu cử"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">
              🎯 Gán nhiệm vụ kiểm phiếu (3 Cấp)
            </h3>
            <div className="space-y-3">
              <Select
                label="1. Cấp Quốc Hội"
                value={quocHoiId}
                onChange={(e) => setQuocHoiId(e.target.value)}
                options={quocHoiOptions}
              />
              <Select
                label="2. Cấp Thành Phố"
                value={thanhPhoId}
                onChange={(e) => setThanhPhoId(e.target.value)}
                options={thanhPhoOptions}
              />
              <Select
                label="3. Cấp Xã/Phường"
                value={xaId}
                onChange={(e) => setXaId(e.target.value)}
                options={xaOptions}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">
              👥 Phân công Người kiểm phiếu
            </h3>

            {/* SỬ DỤNG COMPONENT INPUT CÓ ICON CHO SEARCH */}
            <div className="mb-3">
              <Input
                icon={<span className="text-gray-400">🔍</span>}
                placeholder="Tìm kiếm tên người kiểm phiếu..."
                value={searchAuditor}
                onChange={(e) => setSearchAuditor(e.target.value)}
              />
            </div>

            <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AUDITOR_OPTIONS.filter((a) =>
                a.label.toLowerCase().includes(searchAuditor.toLowerCase()),
              ).map((auditor) => (
                <label
                  key={auditor.value}
                  className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-blue-100 rounded"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded"
                    checked={auditorIds.includes(auditor.value)}
                    onChange={(e) => {
                      const ids = new Set(auditorIds);
                      e.target.checked
                        ? ids.add(auditor.value)
                        : ids.delete(auditor.value);
                      setAuditorIds(Array.from(ids));
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {auditor.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingTeam ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
