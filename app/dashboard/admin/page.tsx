"use client";

import { UserManagement } from "@/src/components/admin/UserManagement";

export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <UserManagement />
    </div>
  );
}
