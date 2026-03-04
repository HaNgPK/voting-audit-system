import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    // 1. Kiểm tra đầu vào
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    // 2. Kiểm tra email trùng
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã tồn tại" },
        { status: 409 },
      );
    }

    // 3. Mã hoá mật khẩu và lưu vào DB
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || "AUDITOR",
      },
      select: { id: true, email: true, name: true, role: true }, // Không trả về password
    });

    return NextResponse.json(
      { success: true, message: "Tạo tài khoản thành công", data: user },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 },
    );
  }
}
