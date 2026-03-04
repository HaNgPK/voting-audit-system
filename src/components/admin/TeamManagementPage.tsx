"use client";

import { useState, useMemo } from "react";
import { Card, Modal, Input, Button } from "@/src/components/common";
import {
  mockElectionTeams,
  type ElectionTeam,
} from "@/src/data/mockElectionTeams";
import { mockUsers } from "@/src/data/mockUsers";
import toast from "react-hot-toast";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
  ClipboardList,
} from "lucide-react";

// Cử tri (voter) type
interface Voter {
  id: string;
  name: string;
  address?: string;
  idNumber?: string; // CMND/CCCD
}

export const TeamManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<(ElectionTeam & { voters?: Voter[] })[]>(
    mockElectionTeams.map((t) => ({
      ...t,
      voters: [], // Khởi tạo danh sách cử tri rỗng
    })),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    auditorIds: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Quản lý cử tri
  const [voterModalOpen, setVoterModalOpen] = useState(false);
  const [managingTeamId, setManagingTeamId] = useState<string | null>(null);
  const [voterForm, setVoterForm] = useState({
    name: "",
    address: "",
    idNumber: "",
  });

  // Expand row - xem chi tiết
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const handleOpenModal = (team?: any) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ name: team.name, auditorIds: team.auditorIds });
    } else {
      setEditingTeam(null);
      setFormData({ name: "", auditorIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim())
      return toast.error("Tên tổ không được để trống!");

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? { ...t, ...formData } : t)),
      );
      toast.success("Cập nhật tổ kiểm phiếu thành công!");
    } else {
      setTeams((prev) => [
        {
          id: `t${Date.now()}`,
          name: formData.name,
          auditorIds: formData.auditorIds,
          ballotIds: [],
          ballots: [],
          voters: [],
          createdAt: new Date(),
        },
        ...prev,
      ]);
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Quản lý Tổ kiểm phiếu
          </h1>
          <p className="text-gray-500 mt-2 ml-[52px]">
            Quản lý tổ kiểm phiếu, thành viên và danh sách cử tri
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp animation-delay-100">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tổ kiểm phiếu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Thêm tổ kiểm phiếu
        </button>
      </div>

      {/* Team Cards */}
      <div className="space-y-4">
        {filteredTeams.map((team, idx) => {
          const isExpanded = expandedTeamId === team.id;
          const members = team.auditorIds
            .map((id) => mockUsers.find((u) => u.id === id))
            .filter(Boolean);

          return (
            <div style={{ animationDelay: `${(idx + 1) * 80}ms` }}>
              <Card
                key={team.id}
                className="p-0 overflow-hidden animate-fadeInUp"
              >
                {/* Team Header Row */}
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md text-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {team.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {members.length} thành viên •{" "}
                        {(team.voters || []).length} cử tri • Tạo ngày{" "}
                        {new Date(team.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quản lý cử tri */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVoterModal(team.id);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Quản lý cử tri"
                    >
                      <ClipboardList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(team);
                      }}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 animate-fadeInDown">
                    {/* Kiểm phiếu viên */}
                    <div className="px-6 py-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Kiểm phiếu viên ({members.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                          <span
                            key={m!.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                              {m!.name.charAt(0)}
                            </div>
                            {m!.name}
                          </span>
                        ))}
                        {members.length === 0 && (
                          <span className="text-xs text-gray-400">
                            Chưa có thành viên
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Danh sách cử tri */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-emerald-500" />
                          Danh sách cử tri ({(team.voters || []).length})
                        </h4>
                        <button
                          onClick={() => openVoterModal(team.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Thêm cử tri
                        </button>
                      </div>
                      {(team.voters || []).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {(team.voters || []).map((voter) => (
                            <div
                              key={voter.id}
                              className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {voter.name}
                                </p>
                                {voter.address && (
                                  <p className="text-xs text-gray-400">
                                    {voter.address}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteVoter(team.id, voter.id)
                                }
                                className="p-1 text-gray-300 hover:text-red-500 transition"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          Chưa có cử tri. Nhấn "Thêm cử tri" để bắt đầu.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })}

        {filteredTeams.length === 0 && (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            Không tìm thấy tổ kiểm phiếu nào
          </div>
        )}
      </div>

      {/* Modal Tạo/Sửa Tổ */}
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
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {mockUsers
                .filter((u) => u.role === "AUDITOR" || u.role === "ADMIN")
                .map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
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
        title={`📋 Cử tri: ${managingTeam?.name || ""}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Form thêm cử tri */}
          <form
            onSubmit={handleAddVoter}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
          >
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-500" />
              Thêm cử tri mới
            </h4>
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
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Danh sách ({(managingTeam?.voters || []).length} cử tri)
            </h4>
            {(managingTeam?.voters || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có cử tri nào. Hãy thêm ở trên.
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        STT
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        Họ tên
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        Địa chỉ
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        CMND/CCCD
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(managingTeam?.voters || []).map((voter, i) => (
                      <tr
                        key={voter.id}
                        className="hover:bg-blue-50/50 transition-colors"
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
    </div>
  );
};
