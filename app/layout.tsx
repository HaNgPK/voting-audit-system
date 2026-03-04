import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { DashboardLayout } from "@/src/components/layouts/DashboardLayout";
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
      <body>
        <DashboardLayout>{children}</DashboardLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
