import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// GET: Lấy toàn bộ danh sách bầu cử (kèm theo ứng cử viên bên trong)
export async function GET() {
  try {
    const ballots = await prisma.ballot.findMany({
      include: {
        candidates: {
          orderBy: { index: "asc" }, // Sắp xếp ứng viên theo số thứ tự
        },
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

// POST: Tạo danh sách bầu cử mới
export async function POST(req: NextRequest) {
  try {
    const { name, level } = await req.json();

    if (!name || !level) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin" },
        { status: 400 },
      );
    }

    const newBallot = await prisma.ballot.create({
      data: { name, level },
      include: { candidates: true },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo danh sách thành công",
      data: newBallot,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi tạo danh sách" },
      { status: 500 },
    );
  }
}
