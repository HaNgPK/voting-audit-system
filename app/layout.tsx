import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import HeaderMenu from "@/src/components/common/HeaderMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ thống kiểm phiếu bầu cử",
  description: "Ứng dụng quản lý kiểm phiếu bầu cử",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50">
        <HeaderMenu />
        <main className="min-h-screen">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
