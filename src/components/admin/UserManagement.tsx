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
import { useUsersMock } from "@/src/hooks/useUsersMock";
import type { MockUser } from "@/src/data/mockUsers";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "AUDITOR", label: "Kiểm phiếu" },
  { value: "VIEWER", label: "Xem báo cáo" },
];

export const UserManagement: React.FC = () => {
  const { users, isLoading, createUser, updateUser, deleteUser } =
    useUsersMock();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    password: "",
    role: "AUDITOR",
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
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        name: "",
        address: "",
        password: "",
        role: "AUDITOR",
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
        };
        if (formData.password) updateData.password = formData.password;
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          👥 Quản lý tài khoản
        </h2>
        <Button onClick={() => handleOpenModal()} variant="success">
          ➕ Thêm tài khoản
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">⏳ Đang tải...</div>
        ) : (
          <Table
            headers={[
              "Email",
              "Tên",
              "Địa chỉ",
              "Quyền hạn",
              "Ngày tạo",
              "Hành động",
            ]}
            rows={users.map((user) => [
              <span key={user.id} className="font-medium text-gray-800">
                {user.email}
              </span>,
              user.name || "-",
              user.address || "-",
              <span
                key={`role-${user.id}`}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold"
              >
                {ROLE_OPTIONS.find((opt) => opt.value === user.role)?.label ||
                  user.role}
              </span>,
              new Date(user.createdAt).toLocaleDateString("vi-VN"),
            ])}
            actions={(rowIdx) => (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenModal(users[rowIdx])}
                >
                  ✏️ Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    window.confirm("Xóa tài khoản này?") &&
                    deleteUser(users[rowIdx].id)
                  }
                >
                  🗑️ Xóa
                </Button>
              </div>
            )}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        title={editingUser ? "📝 Chỉnh sửa tài khoản" : "✨ Thêm tài khoản mới"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            disabled={isSubmitting}
          />
          <Input
            label="Họ và Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isSubmitting}
          />
          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            disabled={isSubmitting}
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
            label="Quyền hạn"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={ROLE_OPTIONS}
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
    </div>
  );
};
