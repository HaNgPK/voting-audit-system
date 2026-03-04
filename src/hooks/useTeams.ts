import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export function useTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (data.success) setTeams(data.data);
    } catch (error) {
      toast.error("Không thể tải danh sách tổ");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const saveTeam = async (formData: any, id?: string) => {
    try {
      const res = await fetch(id ? `/api/teams/${id}` : "/api/teams", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(id ? "Cập nhật tổ thành công" : "Tạo tổ mới thành công");
        fetchTeams();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Xóa tổ kiểm phiếu này?")) return;
    const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Đã xóa tổ");
      fetchTeams();
    }
  };

  const addVoter = async (voterData: any) => {
    const res = await fetch("/api/voters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voterData),
    });
    if (res.ok) {
      fetchTeams();
      return true;
    }
    return false;
  };

  return { teams, isLoading, saveTeam, deleteTeam, addVoter };
}
