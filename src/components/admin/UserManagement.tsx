"use client";

import { useState } from "react";
import { Card, Modal, Input, Select, Button } from "@/src/components/common";
import { useUsers } from "@/src/hooks/useUsers";
import { mockElectionTeams } from "@/src/data/mockElectionTeams";
import type { MockUser } from "@/src/data/mockUsers";
import { Pencil, Trash2, Settings, Search } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Quản trị viên", color: "bg-[#1a3a5c] text-white" },
  {
    value: "AUDITOR",
    label: "Kiểm phiếu viên",
    color: "bg-amber-500 text-white",
  },
  { value: "VIEWER", label: "Xem kết quả", color: "bg-emerald-500 text-white" },
];

const TEAM_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  ...mockElectionTeams.map((t) => ({ value: t.id, label: t.name })),
];

export const UserManagement: React.FC = () => {
  const { users, isLoading, createUser, updateUser, deleteUser } =
    useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    password: "",
    role: "AUDITOR",
    teamId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!editingUser && !formData.password)
      newErrors.password = "Mật khẩu không được để trống";
    else if (formData.password && formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (user?: MockUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name || "",
        address: user.address || "",
        password: "",
        role: user.role,
        teamId: user.teamId || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        name: "",
        address: "",
        password: "",
        role: "AUDITOR",
        teamId: "",
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          address: formData.address,
          role: formData.role,
          teamId: formData.teamId || undefined,
        };
        if (formData.password) updateData.password = formData.password;
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser({
          ...formData,
          teamId: formData.teamId || undefined,
        } as any);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tìm tổ kiểm phiếu của user
  const getUserTeam = (user: MockUser): string => {
    if (user.teamId) {
      const team = mockElectionTeams.find((t) => t.id === user.teamId);
      if (team) return team.name;
    }
    // Fallback: tra ngược qua auditorIds
    const team = mockElectionTeams.find((t) => t.auditorIds.includes(user.id));
    return team ? team.name : "—";
  };

  const getRoleBadge = (role: string) => {
    const opt = ROLE_OPTIONS.find((r) => r.value === role);
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${opt?.color || "bg-gray-200 text-gray-700"}`}
      >
        {opt?.label || role}
      </span>
    );
  };

  // Lọc users theo từ khóa
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="p-0 overflow-hidden animate-fadeInUp animation-delay-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý tài khoản
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tạo và phân quyền tài khoản kiểm phiếu
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
              <Settings className="w-4 h-4" />
              Tạo tài khoản
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 animate-pulse">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {[
                  "Họ tên",
                  "Email",
                  "Vai trò",
                  "Tổ kiểm phiếu",
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
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50/40 transition-colors duration-150 animate-fadeInUp"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {getUserTeam(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-90"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          window.confirm("Xóa tài khoản này?") &&
                          deleteUser(user.id)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tạo/Sửa */}
      <Modal
        isOpen={isModalOpen}
        title={editingUser ? "📝 Chỉnh sửa tài khoản" : "✨ Thêm tài khoản mới"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isSubmitting}
            placeholder="Nguyễn Văn A"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            disabled={isSubmitting}
            placeholder="email@baicu.vn"
          />
          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            disabled={isSubmitting}
            placeholder="Nhập địa chỉ"
          />
          <Input
            label={
              editingUser ? "Mật khẩu (để trống để giữ nguyên)" : "Mật khẩu"
            }
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            disabled={isSubmitting}
          />
          <Select
            label="Vai trò"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={ROLE_OPTIONS.map((r) => ({
              value: r.value,
              label: r.label,
            }))}
            disabled={isSubmitting}
          />
          <Select
            label="Tổ kiểm phiếu (không bắt buộc)"
            value={formData.teamId}
            onChange={(e) =>
              setFormData({ ...formData, teamId: e.target.value })
            }
            options={TEAM_OPTIONS}
            disabled={isSubmitting}
          />

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
              {editingUser ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
