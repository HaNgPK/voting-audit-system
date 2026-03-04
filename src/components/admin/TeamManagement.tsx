"use client";

import { useState, useMemo } from "react";
import { Card, Modal, Input, Button } from "@/src/components/common";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Settings,
  CheckSquare,
  Square,
  UserCheck,
  Vote,
} from "lucide-react";
import { useUsers } from "@/src/hooks/useUsers";
import { useBallots } from "@/src/hooks/useBallots";
import { useTeams } from "@/src/hooks/useTeams";

export const TeamManagement: React.FC = () => {
  const { teams, isLoading: teamsLoading, saveTeam, deleteTeam } = useTeams();
  const { users } = useUsers();
  const { ballots } = useBallots(); // Đã chứa danh sách ứng viên đầy đủ

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [ballotSearch, setBallotSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    auditorIds: [] as string[],
    ballotIds: [] as string[],
  });

  const filteredUsers = users.filter(
    (u) =>
      u.role !== "VIEWER" &&
      u.name?.toLowerCase().includes(userSearch.toLowerCase()),
  );
  const filteredBallotsInModal = ballots.filter((b) =>
    b.name.toLowerCase().includes(ballotSearch.toLowerCase()),
  );

  const handleOpenModal = (team?: any) => {
    setUserSearch("");
    setBallotSearch("");
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        auditorIds: team.auditors?.map((a: any) => a.id) || [],
        ballotIds: team.ballots?.map((b: any) => b.id) || [],
      });
    } else {
      setEditingTeam(null);
      setFormData({ name: "", auditorIds: [], ballotIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleToggleBallot = (ballotId: string, level: string) => {
    setFormData((prev) => {
      const isSelected = prev.ballotIds.includes(ballotId);
      if (isSelected)
        return {
          ...prev,
          ballotIds: prev.ballotIds.filter((id) => id !== ballotId),
        };
      const otherLevels = prev.ballotIds.filter(
        (id) => ballots.find((b) => b.id === id)?.level !== level,
      );
      return { ...prev, ballotIds: [...otherLevels, ballotId] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Vui lòng nhập tên tổ!");
    if (formData.ballotIds.length === 0)
      return toast.error("Phải gán ít nhất 1 danh sách bầu cử!");
    if (formData.auditorIds.length === 0)
      return toast.error("Phải phân công ít nhất 1 kiểm phiếu viên!");

    const success = await saveTeam(formData, editingTeam?.id);
    if (success) setIsModalOpen(false);
  };

  return (
    <Card className="p-0 overflow-hidden animate-fadeInUp shadow-md border-gray-200 mt-6">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> Quản lý Tổ kiểm phiếu
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gán người kiểm phiếu vào các đơn vị bầu cử tương ứng
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm tổ mới
        </button>
      </div>

      {/* Table Section */}
      {teamsLoading ? (
        <div className="p-12 text-center text-gray-400 animate-pulse font-medium">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                {[
                  "Tên tổ",
                  "Người kiểm phiếu",
                  "Hòm phiếu & Ứng viên",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs font-black text-gray-500 uppercase bg-gray-50 border-b"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {teams
                .filter((t: any) =>
                  t.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((team: any) => {
                  return (
                    <tr
                      key={team.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm align-top">
                        {team.name}
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {team.auditors?.map((m: any) => (
                            <span
                              key={m.id}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-100"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* ✅ LOGIC MATCH: Trích xuất số ứng viên từ hook useBallots */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-2">
                          {team.ballots?.map((tb: any) => {
                            const fullBallot = ballots.find(
                              (b) => b.id === tb.id,
                            );
                            const candidateCount =
                              fullBallot?.candidates?.length || 0;

                            return (
                              <div
                                key={tb.id}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${tb.level === "XA" ? "bg-orange-50 text-orange-600 border-orange-200" : tb.level === "THANHPHO" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-red-50 text-red-600 border-red-200"}`}
                                >
                                  {tb.level}
                                </span>
                                <span className="text-xs font-semibold text-gray-700">
                                  {tb.name}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                  {candidateCount} ứng viên
                                </span>
                              </div>
                            );
                          })}
                          {(!team.ballots || team.ballots.length === 0) && (
                            <span className="text-xs text-gray-400 italic">
                              Chưa gán hòm phiếu nào
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(team)}
                            className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                            title="Sửa tổ"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Xóa tổ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Cấu hình Tổ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingTeam ? "📝 Cập nhật Tổ kiểm phiếu" : "✨ Tạo Tổ kiểm phiếu mới"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Tên tổ kiểm phiếu"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Tổ số 01 - Thôn Phương Viên"
          />

          {/* Phân công nhân sự */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-black text-gray-700 uppercase flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" /> Phân công người
                kiểm phiếu
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tìm tên..."
                  className="pl-6 pr-2 py-1 text-xs border rounded-full w-28 bg-gray-50 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-xl p-3 bg-gray-50/50 shadow-inner">
              {filteredUsers.map((u) => (
                <label
                  key={u.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${formData.auditorIds.includes(u.id) ? "bg-blue-600 text-white shadow-md" : "bg-white hover:border-blue-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.auditorIds.includes(u.id)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        auditorIds: e.target.checked
                          ? [...formData.auditorIds, u.id]
                          : formData.auditorIds.filter((id) => id !== u.id),
                      })
                    }
                    className="hidden"
                  />
                  {formData.auditorIds.includes(u.id) ? (
                    <CheckSquare className="w-4 h-4 text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                  <span className="text-xs font-bold">{u.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gán Hòm phiếu */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-black text-gray-700 uppercase flex items-center gap-2">
                <Vote className="w-4 h-4 text-orange-600" /> Gán hòm phiếu (Tối
                đa 1 đơn vị/cấp)
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  value={ballotSearch}
                  onChange={(e) => setBallotSearch(e.target.value)}
                  placeholder="Tìm đơn vị..."
                  className="pl-6 pr-2 py-1 text-xs border rounded-full w-28 bg-gray-50 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-xl p-3 bg-blue-50/30 shadow-inner">
              {filteredBallotsInModal.map((b) => (
                <label
                  key={b.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.ballotIds.includes(b.id) ? "bg-white ring-2 ring-blue-500 shadow-md" : "bg-white border-gray-100 hover:border-blue-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.ballotIds.includes(b.id)}
                      onChange={() => handleToggleBallot(b.id, b.level)}
                      className="hidden"
                    />
                    {formData.ballotIds.includes(b.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-200" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-800">
                        {b.name}
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold">
                        {b.candidates?.length || 0} ứng viên
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${b.level === "XA" ? "bg-orange-100 text-orange-700 border-orange-200" : b.level === "THANHPHO" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-red-100 text-red-700 border-red-200"}`}
                  >
                    {b.level}
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
              Đóng
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="shadow-lg shadow-blue-600/30"
            >
              Xác nhận cấu hình
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
