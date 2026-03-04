import "dotenv/config"; // Bổ sung dòng này để Prisma đọc được file .env
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // Bổ sung Adapter
import bcrypt from "bcryptjs";

// Khởi tạo Adapter cho Prisma 7
const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });

// Truyền adapter vào constructor
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("🌱 Đang tạo dữ liệu mẫu...");

  // Mã hoá mật khẩu "123456"
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Tạo tài khoản Admin (nếu chưa có thì tạo, có rồi thì bỏ qua)
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Quản Trị Viên",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Tạo tài khoản Kiểm phiếu viên
  const auditor = await prisma.user.upsert({
    where: { email: "auditor1@test.com" },
    update: {},
    create: {
      email: "auditor1@test.com",
      name: "Kiểm Phiếu Viên 1",
      password: hashedPassword,
      role: "AUDITOR",
    },
  });

  console.log("✅ Đã tạo tài khoản thành công!");
  console.log(`👉 Admin: ${admin.email}`);
  console.log(`👉 Auditor: ${auditor.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });