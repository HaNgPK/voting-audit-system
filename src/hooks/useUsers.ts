import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API lấy danh sách
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Gọi API tạo mới
  const createUser = async (userData: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tạo tài khoản thành công!");
        fetchUsers(); // Tải lại danh sách
        return true;
      } else {
        toast.error(data.message || "Tạo thất bại");
        return false;
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
      return false;
    }
  };

  // Gọi API cập nhật
  const updateUser = async (id: string, userData: any) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Cập nhật thành công!");
        fetchUsers();
        return true;
      } else {
        toast.error(data.message || "Cập nhật thất bại");
        return false;
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
      return false;
    }
  };

  // Gọi API xóa
  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Xóa tài khoản thành công!");
        fetchUsers();
        return true;
      } else {
        toast.error("Xóa thất bại");
        return false;
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
      return false;
    }
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };
}
    