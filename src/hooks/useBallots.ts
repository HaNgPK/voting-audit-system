import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export function useBallots() {
  const [ballots, setBallots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy danh sách
  const fetchBallots = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ballots");
      const data = await res.json();
      if (data.success) setBallots(data.data);
    } catch (error) {
      toast.error("Không thể tải danh sách bầu cử");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBallots();
  }, [fetchBallots]);

  // 2. Tạo/Sửa danh sách
  const saveBallot = async (formData: any, id?: string) => {
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/ballots/${id}` : "/api/ballots";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(id ? "Cập nhật thành công" : "Tạo mới thành công");
      fetchBallots();
      return data.data;
    }
    return null;
  };

  // 3. Xóa danh sách
  const deleteBallot = async (id: string) => {
    const res = await fetch(`/api/ballots/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã xóa danh sách");
      fetchBallots();
    }
  };

  // 4. Quản lý ứng cử viên (Candidate)
  const addCandidate = async (candidateData: any) => {
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidateData),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã thêm ứng viên");
      fetchBallots(); // Refresh để cập nhật danh sách ứng viên trong Ballot
      return true;
    }
    toast.error(data.message);
    return false;
  };

  const removeCandidate = async (id: string) => {
    const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Đã xóa ứng viên");
      fetchBallots();
    }
  };
  const importCandidates = async (ballotId: string, candidates: any[]) => {
    try {
      const res = await fetch("/api/candidates/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ballotId, candidates }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchBallots(); // Tải lại dữ liệu mới nhất
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
      return false;
    }
  };

  return {
    ballots,
    isLoading,
    saveBallot,
    deleteBallot,
    addCandidate,
    removeCandidate,
    importCandidates,
  };
}
