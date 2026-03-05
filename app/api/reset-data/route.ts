import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    // Xóa theo thứ tự: Xóa dữ liệu con (Kết quả, Ứng viên) trước, rồi xóa Tổ và Hòm phiếu
    await prisma.votingSession.deleteMany({});
    await prisma.candidate.deleteMany({});
    await prisma.voter.deleteMany({});

    // Cuối cùng xóa Danh sách và Tổ
    await prisma.ballot.deleteMany({});
    await prisma.team.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "ĐÃ XÓA SẠCH DỮ LIỆU BẦU CỬ! (Vẫn giữ lại tài khoản User)",
    });
  } catch (error) {
    console.error("Lỗi xóa dữ liệu:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 },
    );
  }
}
