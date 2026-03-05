import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useAuditorTeam(userId: string | undefined) {
  const [myTeam, setMyTeam] = useState<any | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoadingTeam(false);
      return;
    }

    const fetchTeam = async () => {
      setIsLoadingTeam(true);
      try {
        const res = await fetch(`/api/auditor/team?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setMyTeam(data.data); // Sẽ là null nếu chưa được gán tổ
        } else {
          toast.error(data.message || "Lỗi lấy dữ liệu tổ");
        }
      } catch (error) {
        toast.error("Không thể kết nối đến máy chủ");
      } finally {
        setIsLoadingTeam(false);
      }
    };

    fetchTeam();
  }, [userId]);

  return { myTeam, isLoadingTeam };
}
