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
import { mockElectionTeams } from "@/src/data/mockElectionTeams";
import { mockUsers } from "@/src/data/mockUsers";
import toast from "react-hot-toast";

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState([...mockElectionTeams]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    auditorIds: [] as string[],
  });

  const handleOpenModal = (team?: any) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        auditorIds: team.auditorIds,
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: "",
        auditorIds: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error("Tên tổ không được để trống!");
    }

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? { ...t, ...formData } : t)),
      );
      toast.success("Cập nhật tổ kiểm phiếu thành công!");
    } else {
      setTeams([
        {
          id: `t${Date.now()}`,
          name: formData.name,
          auditorIds: formData.auditorIds,
          ballots: [],
          createdAt: new Date(),
        },
        ...teams,
      ]);
      toast.success("Tạo tổ kiểm phiếu thành công!");
    }
    setIsModalOpen(false);
  };

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          👥 Quản lý Tổ kiểm phiếu
        </h2>
        <Button onClick={() => handleOpenModal()} variant="success">
          ➕ Thêm tổ
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          headers={[
            "Tên tổ",
            "Số thành viên",
            "Danh sách kiểm phiếu viên",
            "Ngày tạo",
          ]}
          rows={teams.map((t) => [
            <span key={t.id} className="font-medium text-gray-800">
              {t.name}
            </span>,
            <span
              key={`members-${t.id}`}
              className="font-semibold text-blue-600"
            >
              {t.auditorIds.length}
            </span>,
            <span key={`auditors-${t.id}`} className="text-sm text-gray-600">
              {t.auditorIds
                .map(
                  (id: string) =>
                    mockUsers.find((u) => u.id === id)?.name || `ID: ${id}`,
                )
                .join(", ")}
            </span>,
            <span key={`date-${t.id}`} className="text-sm text-gray-600">
              {new Date(t.createdAt).toLocaleDateString("vi-VN")}
            </span>,
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
                onClick={() => {
                  if (confirm("Xóa tổ này?")) {
                    setTeams((prev) =>
                      prev.filter((t) => t.id !== teams[rowIdx].id),
                    );
                    toast.success("Xóa tổ thành công!");
                  }
                }}
              >
                🗑️ Xóa
              </Button>
            </div>
          )}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? "📝 Sửa tổ kiểm phiếu" : "✨ Tạo tổ kiểm phiếu"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên tổ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Tổ kiểm phiếu số 1"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Chọn kiểm phiếu viên
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {mockUsers
                .filter((u) => u.role === "AUDITOR" || u.role === "ADMIN")
                .map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.auditorIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            auditorIds: [...formData.auditorIds, user.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            auditorIds: formData.auditorIds.filter(
                              (id) => id !== user.id,
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              {editingTeam ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
