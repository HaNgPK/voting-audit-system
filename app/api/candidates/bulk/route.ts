import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { candidates, ballotId } = await req.json();

    if (!candidates || !ballotId) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu" },
        { status: 400 },
      );
    }

    // Dùng createMany để đẩy toàn bộ danh sách vào Database trong 1 câu lệnh SQL
    const result = await prisma.candidate.createMany({
      data: candidates.map((c: any) => ({
        name: c.name,
        birthYear: Number(c.birthYear),
        gender: c.gender || "Nam",
        index: Number(c.index),
        ballotId: ballotId,
      })),
      skipDuplicates: true, // Bỏ qua nếu trùng (dựa trên unique index)
    });

    return NextResponse.json({
      success: true,
      message: `Đã nhập thành công ${result.count} ứng viên vào hệ thống!`,
    });
  } catch (error) {
    console.error("Lỗi Bulk Insert:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lưu danh sách" },
      { status: 500 },
    );
  }
}
