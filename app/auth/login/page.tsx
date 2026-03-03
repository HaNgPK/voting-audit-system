"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/src/components/common";
import { mockUsers } from "@/src/data/mockUsers"; // Import data giả lập
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@test.com"); // Để sẵn email test cho tiện
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Giả lập API gọi lên server mất 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TÌM USER TRONG KHO DỮ LIỆU
      const user = mockUsers.find((u) => u.email === email);

      if (user) {
        // LƯU Ý QUAN TRỌNG: Lưu TOÀN BỘ thông tin (có cả id là "1", "2"...) vào localStorage
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Đăng nhập thành công!");

        // Đăng nhập xong đẩy vào dashboard
        router.push("/dashboard");
      } else {
        toast.error("Tài khoản không tồn tại trong hệ thống!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f4f7f] via-[#1a3a5c] to-[#c41e3a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="mx-auto h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow">
            <span className="text-3xl">🗳️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Hệ thống kiểm phiếu
          </h2>
          <p className="mt-2 text-sm text-gray-500">Đăng nhập để bắt đầu</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Input
                label="Mật khẩu"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Đăng nhập
            </Button>
          </div>

          {/* Hướng dẫn test nhanh */}
          <div
            className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="font-semibold text-gray-700 mb-2">Tài khoản Demo:</p>
            <p>Admin: admin@test.com</p>
            <p>Kiểm phiếu: auditor1@test.com</p>
            <p>(Mật khẩu nhập bừa vì đang test)</p>
          </div>
        </form>
      </div>
    </div>
  );
}
