import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/auth";

// GET: Lấy danh sách tất cả user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }, // Sắp xếp mới nhất lên đầu
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}

// POST: Admin tạo user mới
export async function POST(req: NextRequest) {
  try {
    const { email, name, password, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    // Kiểm tra email trùng lặp
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email này đã được sử dụng" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || "AUDITOR",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ success: true, message: "Tạo tài khoản thành công", data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi server khi tạo user" }, { status: 500 });
  }
}