import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Đang xoá toàn bộ user cũ...");

  // Xoá toàn bộ user
  await prisma.user.deleteMany({});

  console.log("🌱 Đang tạo dữ liệu mẫu...");

  const hashedPassword = await bcrypt.hash("123456", 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      name: "Quản Trị Viên",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Auditor
  const auditor = await prisma.user.create({
    data: {
      email: "auditor1@test.com",
      name: "Kiểm Phiếu Viên 1",
      password: hashedPassword,
      role: "AUDITOR",
    },
  });

  console.log("✅ Seed thành công!");
  console.log(`Admin: ${admin.email}`);
  console.log(`Auditor: ${auditor.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
