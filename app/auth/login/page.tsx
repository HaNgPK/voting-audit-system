"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/src/components/common";
import toast from "react-hot-toast";
import { Vote, Shield, Users, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  // Đã làm trống email/password thay vì để sẵn text
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API thật thay vì dùng giả lập
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Lưu thông tin user thật từ Database vào localStorage
        localStorage.setItem("user", JSON.stringify(data.data));
        toast.success("Đăng nhập thành công!");
        router.push("/dashboard");
      } else {
        // Bắt lỗi từ server (sai email, sai mật khẩu...)
        toast.error(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server!");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Vote, title: "Kiểm phiếu số", desc: "Số hóa quy trình kiểm phiếu" },
    {
      icon: Shield,
      title: "Bảo mật cao",
      desc: "Phân quyền theo tổ kiểm phiếu",
    },
    {
      icon: Users,
      title: "Đa người dùng",
      desc: "Nhiều người kiểm phiếu đồng thời",
    },
    {
      icon: BarChart3,
      title: "Thống kê trực tiếp",
      desc: "Biểu đồ kết quả realtime",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f4f7f] via-[#1a3a5c] to-[#c41e3a]">
      {/* Nửa bên trái - Phần giới thiệu (Ẩn trên thiết bị di động) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Hiệu ứng ánh sáng nền */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8 animate-fadeInDown">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
              <Vote className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Kiểm Phiếu Bầu Cử
            </h1>
          </div>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed animate-fadeInUp animation-delay-100">
            Hệ thống kiểm phiếu bầu cử điện tử - Quản lý kiểm phiếu 3 cấp: Quốc
            hội, Thành phố và Xã với độ chính xác cao.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition hover:bg-white/10 animate-fadeInUp"
                style={{
                  animationDelay: `${(i + 2) * 100}ms`,
                }}
              >
                <f.icon className="w-6 h-6 text-amber-500 mb-2" />
                <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nửa bên phải - Form đăng nhập */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Header hiển thị logo khi ở chế độ mobile */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-8 animate-fadeInDown">
            <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Kiểm Phiếu Bầu Cử
            </h1>
          </div>

          <Card className="border-gray-200 shadow-xl p-2 sm:p-4 animate-fadeInUp animation-delay-200">
            <div className="text-center pb-6 pt-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
              <p className="text-sm text-gray-500 mt-2">
                Nhập thông tin tài khoản được cấp
              </p>
            </div>

            <div className="pt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="animate-fadeInUp animation-delay-300">
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="animate-fadeInUp animation-delay-400">
                  <Input
                    label="Mật khẩu"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-2 animate-fadeInUp animation-delay-500">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 animate-fadeInUp animation-delay-600">
                <p className="text-xs text-gray-500 text-center mb-3">
                  Tài khoản do quản trị viên cấp. Liên hệ admin nếu cần hỗ trợ.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-gray-600 font-medium bg-gray-50 p-3 rounded-lg">
                  <span>Admin: admin@test.com</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Auditor: auditor1@test.com</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
