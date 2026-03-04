import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, birthYear, gender, index, ballotId } = await req.json();

    if (!name || !birthYear || !ballotId) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin ứng viên" },
        { status: 400 },
      );
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        birthYear: Number(birthYear),
        gender,
        index: Number(index),
        ballotId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thêm ứng viên thành công",
      data: newCandidate,
    });
  } catch (error) {
    console.error(error);
    // Bắt lỗi trùng số thứ tự (index) trong cùng 1 danh sách
    return NextResponse.json(
      { success: false, message: "Lỗi: Số thứ tự có thể đã bị trùng!" },
      { status: 500 },
    );
  }
}
