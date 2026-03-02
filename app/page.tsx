import { redirect } from "next/navigation";

export default function Home() {
  // Tự động chuyển hướng về trang Đăng nhập khi ai đó truy cập localhost:3000
  redirect("/auth/login");
}
