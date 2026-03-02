export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "AUDITOR" | "VIEWER";
  createdAt: Date;
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "admin@test.com",
    name: "Nguyễn Văn Admin",
    role: "ADMIN",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    email: "auditor1@test.com",
    name: "Trần Văn Kiểm phiếu 1",
    role: "AUDITOR",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "3",
    email: "auditor2@test.com",
    name: "Phạm Văn Kiểm phiếu 2",
    role: "AUDITOR",
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "4",
    email: "viewer@test.com",
    name: "Lê Thị Báo cáo",
    role: "VIEWER",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "5",
    email: "auditor3@test.com",
    name: "Võ Văn Kiểm phiếu 3",
    role: "AUDITOR",
    createdAt: new Date("2026-01-20"),
  },
];
