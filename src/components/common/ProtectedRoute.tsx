"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Lấy thông tin vé (user) từ bộ nhớ trình duyệt
    const user = localStorage.getItem("user");

    // 2. Nếu không có vé -> Đá về trang đăng nhập
    if (!user) {
      router.push("/auth/login");
    } else {
      // 3. Nếu có vé -> Mở cổng cho vào
      setIsAuthorized(true);
    }
  }, [router]);

  // Trong lúc trình duyệt đang kiểm tra vé (mất khoảng vài mili-giây), hiện chữ Loading
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f4f7f]"></div>
      </div>
    );
  }

  // Nếu hợp lệ, hiển thị nội dung bên trong (trang Dashboard)
  return <>{children}</>;
}
