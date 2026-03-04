"use client";

import { useState } from "react";
import { Card, Modal, Input, Button } from "@/src/components/common";
import {
  mockElectionTeams,
  mockAvailableBallots,
  type ElectionTeam,
  type Voter,
} from "@/src/data/mockElectionTeams";
import { mockUsers } from "@/src/data/mockUsers";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ClipboardList,
  Users,
  UserPlus,
  Settings,
} from "lucide-react";

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<ElectionTeam[]>([...mockElectionTeams]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ElectionTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    auditorIds: [] as string[],
    ballotIds: [] as string[],
  });

  // Quản lý cử tri
  const [voterModalOpen, setVoterModalOpen] = useState(false);
  const [managingTeamId, setManagingTeamId] = useState<string | null>(null);
  const [voterForm, setVoterForm] = useState({
    name: "",
    address: "",
    idNumber: "",
  });

  const handleOpenModal = (team?: ElectionTeam) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        auditorIds: [...team.auditorIds],
        ballotIds: [...(team.ballotIds || [])],
      });
    } else {
      setEditingTeam(null);
      setFormData({ name: "", auditorIds: [], ballotIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error("Tên tổ không được để trống!");
    }

    const selectedBallots = mockAvailableBallots.filter((b) =>
      formData.ballotIds.includes(b.id),
    );

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                name: formData.name,
                auditorIds: formData.auditorIds,
                ballotIds: formData.ballotIds,
                ballots: selectedBallots,
              }
            : t,
        ),
      );
      toast.success("Cập nhật tổ kiểm phiếu thành công!");
    } else {
      const newTeam: ElectionTeam = {
        id: `t${Date.now()}`,
        name: formData.name,
        auditorIds: formData.auditorIds,
        ballotIds: formData.ballotIds,
        ballots: selectedBallots,
        voters: [],
        createdAt: new Date(),
      };
      setTeams((prev) => [newTeam, ...prev]);
      toast.success("Tạo tổ kiểm phiếu thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm("Xóa tổ kiểm phiếu này?")) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
      toast.success("Xóa tổ thành công!");
    }
  };

  // --- Voter logic ---
  const openVoterModal = (teamId: string) => {
    setManagingTeamId(teamId);
    setVoterForm({ name: "", address: "", idNumber: "" });
    setVoterModalOpen(true);
  };

  const handleAddVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterForm.name.trim())
      return toast.error("Tên cử tri không được để trống!");

    const newVoter: Voter = {
      id: `voter-${Date.now()}`,
      name: voterForm.name,
      address: voterForm.address,
      idNumber: voterForm.idNumber,
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === managingTeamId
          ? { ...t, voters: [...(t.voters || []), newVoter] }
          : t,
      ),
    );
    toast.success("Thêm cử tri thành công!");
    setVoterForm({ name: "", address: "", idNumber: "" });
  };

  const handleDeleteVoter = (teamId: string, voterId: string) => {
    if (!confirm("Xóa cử tri này?")) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, voters: (t.voters || []).filter((v) => v.id !== voterId) }
          : t,
      ),
    );
    toast.success("Xóa cử tri thành công!");
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const managingTeam = teams.find((t) => t.id === managingTeamId);

  return (
    <Card className="p-0 overflow-hidden animate-fadeInUp animation-delay-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý Tổ kiểm phiếu
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý tổ kiểm phiếu, kiểm phiếu viên, danh sách bầu cử và cử tri
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
              Thêm tổ
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              {[
                "Tên tổ",
                "Kiểm phiếu viên",
                "DS bầu cử",
                "Cử tri",
                "Ngày tạo",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTeams.map((team, idx) => {
              const members = team.auditorIds
                .map((id) => mockUsers.find((u) => u.id === id))
                .filter(Boolean);
              const ballotCount = (team.ballotIds || team.ballots || []).length;
              const voterCount = (team.voters || []).length;

              return (
                <tr
                  key={team.id}
                  className="hover:bg-blue-50/40 transition-colors duration-150 animate-fadeInUp"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {team.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {members.map((m) => (
                        <span
                          key={m!.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {m!.name}
                        </span>
                      ))}
                      {members.length === 0 && (
                        <span className="text-xs text-gray-400">Chưa có</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                      {ballotCount} danh sách
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openVoterModal(team.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <ClipboardList className="w-3 h-3" />
                      {voterCount} cử tri
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(team.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openVoterModal(team.id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 active:scale-90"
                        title="Quản lý cử tri"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(team)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-90"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTeams.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  Không tìm thấy tổ kiểm phiếu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tạo/Sửa Tổ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? "📝 Sửa tổ kiểm phiếu" : "✨ Tạo tổ kiểm phiếu"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên tổ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Tổ kiểm phiếu số 1"
          />

          {/* Chọn kiểm phiếu viên */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Chọn kiểm phiếu viên
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {mockUsers
                .filter((u) => u.role === "AUDITOR" || u.role === "ADMIN")
                .map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
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
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {user.email}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          {/* Chọn danh sách bầu cử */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phân danh sách bầu cử cho tổ
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {mockAvailableBallots.map((ballot) => (
                <label
                  key={ballot.id}
                  className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.ballotIds.includes(ballot.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          ballotIds: [...formData.ballotIds, ballot.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          ballotIds: formData.ballotIds.filter(
                            (id) => id !== ballot.id,
                          ),
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{ballot.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {ballot.candidates?.length || 0} ứng viên
                  </span>
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

      {/* Modal Quản lý Cử tri */}
      <Modal
        isOpen={voterModalOpen}
        onClose={() => setVoterModalOpen(false)}
        title={`📋 Cử tri — ${managingTeam?.name || ""}`}
        size="lg"
      >
        <div className="space-y-5">
          {/* Form thêm cử tri */}
          <form
            onSubmit={handleAddVoter}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
          >
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-500" />
              Thêm cử tri mới
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Họ và tên"
                value={voterForm.name}
                onChange={(e) =>
                  setVoterForm({ ...voterForm, name: e.target.value })
                }
                placeholder="Nguyễn Văn B"
              />
              <Input
                label="Địa chỉ"
                value={voterForm.address}
                onChange={(e) =>
                  setVoterForm({ ...voterForm, address: e.target.value })
                }
                placeholder="Phường X, Quận Y"
              />
              <Input
                label="CMND/CCCD"
                value={voterForm.idNumber}
                onChange={(e) =>
                  setVoterForm({ ...voterForm, idNumber: e.target.value })
                }
                placeholder="0123456789"
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

          {/* Danh sách cử tri */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Danh sách ({(managingTeam?.voters || []).length} cử tri)
            </p>
            {(managingTeam?.voters || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có cử tri nào. Hãy thêm ở trên.
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {["STT", "Họ tên", "Địa chỉ", "CMND/CCCD", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-2 text-left text-xs font-semibold text-gray-500"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(managingTeam?.voters || []).map((voter, i) => (
                      <tr
                        key={voter.id}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-4 py-2 text-sm font-medium text-gray-600">
                          {i + 1}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-800">
                          {voter.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {voter.address || "—"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {voter.idNumber || "—"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() =>
                              handleDeleteVoter(managingTeam!.id, voter.id)
                            }
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                            title="Xóa cử tri"
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
        </div>
      </Modal>
    </Card>
  );
};
