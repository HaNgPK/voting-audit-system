"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/src/components/common";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock login - chỉ cần bất kỳ email/password nào
      if (email && password) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("user", JSON.stringify({ email, role: "ADMIN" }));
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🗳️
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Hệ thống kiểm phiếu
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Đăng nhập để bắt đầu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              error={errors.email}
              placeholder="your@email.com"
              disabled={isLoading}
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: "" });
                }
              }}
              error={errors.password}
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs md:text-sm text-gray-600">
            <p className="font-semibold mb-2">📝 Tài khoản Demo:</p>
            <p>
              Email:{" "}
              <span className="font-mono text-gray-900">admin@test.com</span>
            </p>
            <p>
              Mật khẩu: <span className="font-mono text-gray-900">123456</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
