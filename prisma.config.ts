import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// Lệnh này ép hệ thống phải đọc bằng được file .env ở thư mục gốc
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Dùng process.env thay vì env() để tránh Prisma kiểm tra quá gắt
    url: process.env.DATABASE_URL_UNPOOLED as string,
  },
});
