import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { mockUsers, type MockUser } from "@/src/data/mockUsers";

export const useUsersMock = () => {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách users
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers([...mockUsers]);
      setIsLoading(false);
    }, 300);
  }, []);

  // Tạo user mới
  const createUser = useCallback(
    (userData: {
      email: string;
      name: string;
      password: string;
      role: string;
      teamId?: string;
    }) => {
      return new Promise<MockUser>((resolve) => {
        setTimeout(() => {
          const newUser: MockUser = {
            id: String(Math.max(...users.map((u) => parseInt(u.id) || 0)) + 1),
            email: userData.email,
            name: userData.name,
            role: userData.role as "ADMIN" | "AUDITOR" | "VIEWER",
            teamId: userData.teamId || undefined,
            createdAt: new Date(),
          };
          setUsers((prev) => [newUser, ...prev]);
          toast.success("Tạo tài khoản thành công");
          resolve(newUser);
        }, 300);
      });
    },
    [users],
  );

  // Cập nhật user
  const updateUser = useCallback(
    (
      id: string,
      userData: Partial<{
        email: string;
        name: string;
        password: string;
        role: string;
        teamId: string;
      }>,
    ) => {
      return new Promise<MockUser>((resolve) => {
        setTimeout(() => {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === id
                ? {
                    ...user,
                    email: userData.email || user.email,
                    name: userData.name || user.name,
                    role: (userData.role as any) || user.role,
                    teamId:
                      userData.teamId !== undefined
                        ? userData.teamId || undefined
                        : user.teamId,
                  }
                : user,
            ),
          );
          const updated = users.find((u) => u.id === id)!;
          toast.success("Cập nhật tài khoản thành công");
          resolve(updated);
        }, 300);
      });
    },
    [users],
  );

  // Xóa user
  const deleteUser = useCallback((id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("Xóa tài khoản thành công");
        resolve();
      }, 300);
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
