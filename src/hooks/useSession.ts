import { useEffect, useState } from "react";
import type { MockUser } from "@/src/data/mockUsers";

export const useSession = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy user từ localStorage (giả lập session)
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading };
};
