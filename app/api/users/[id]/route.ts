import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/auth";

// PUT: Cập nhật thông tin User
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Thêm Promise vào type
) {
  try {
    const { email, name, password, role } = await req.json();

    // ⚠️ ĐIỂM QUAN TRỌNG: Phải await params ở Next.js 15+
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Chuẩn bị dữ liệu cập nhật
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { email, name, role };

    // Nếu admin có gõ mật khẩu mới thì mới tiến hành đổi mật khẩu
    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật user" },
      { status: 500 },
    );
  }
}

// DELETE: Xóa User
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Thêm Promise vào type
) {
  try {
    // ⚠️ ĐIỂM QUAN TRỌNG: Phải await params ở Next.js 15+
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa tài khoản" },
      { status: 500 },
    );
  }
}
