import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const ballots = await prisma.ballot.findMany({
      include: {
        candidates: { orderBy: { index: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: ballots });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi lấy dữ liệu" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, level, maxSelect } = await req.json(); // LẤY THÊM maxSelect

    if (!name || !level) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin" },
        { status: 400 },
      );
    }

    const newBallot = await prisma.ballot.create({
      data: {
        name,
        level,
        maxSelect: maxSelect ? Number(maxSelect) : 1, // LƯU VÀO DB
      },
      include: { candidates: true },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo thành công",
      data: newBallot,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi tạo danh sách" },
      { status: 500 },
    );
  }
}
