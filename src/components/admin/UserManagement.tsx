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
    password: "",
    role: "AUDITOR",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    if (!editingUser && !formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (user?: MockUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name || "",
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "AUDITOR",
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      email: "",
      name: "",
      password: "",
      role: "AUDITOR",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingUser) {
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser(formData);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) {
      await deleteUser(id);
    }
  };

  const tableRows = users.map((user) => [
    user.email,
    user.name || "(Chưa cập nhật)",
    ROLE_OPTIONS.find((opt) => opt.value === user.role)?.label || user.role,
    new Date(user.createdAt).toLocaleDateString("vi-VN"),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          👥 Quản lý tài khoản
        </h2>
        <Button onClick={() => handleOpenModal()} size="md">
          + Thêm tài khoản
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Chưa có tài khoản nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              headers={["Email", "Tên", "Quyền hạn", "Ngày tạo"]}
              rows={tableRows}
              actions={(rowIdx) => (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenModal(users[rowIdx])}
                  >
                    ✏️ Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteUser(users[rowIdx].id)}
                  >
                    🗑️ Xóa
                  </Button>
                </div>
              )}
            />
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        title={editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
        onClose={handleCloseModal}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
            error={errors.email}
            disabled={isSubmitting}
            placeholder="user@example.com"
          />

          <Input
            label="Tên"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) {
                setErrors({ ...errors, name: "" });
              }
            }}
            error={errors.name}
            disabled={isSubmitting}
            placeholder="Họ và tên"
          />

          <Input
            label={
              editingUser ? "Mật khẩu (để trống để giữ nguyên)" : "Mật khẩu"
            }
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
            error={errors.password}
            disabled={isSubmitting}
            placeholder="••••••••"
          />

          <Select
            label="Quyền hạn"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={ROLE_OPTIONS}
            disabled={isSubmitting}
          />

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingUser ? "Cập nhật" : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
