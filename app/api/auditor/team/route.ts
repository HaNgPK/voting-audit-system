import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Lấy userId từ query params (vd: /api/auditor/team?userId=123)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin người dùng (userId)" },
        { status: 400 },
      );
    }

    // Tìm tổ kiểm phiếu mà user này được phân công (nằm trong mảng auditors)
    const myTeam = await prisma.team.findFirst({
      where: {
        auditors: {
          some: { id: userId },
        },
      },
      include: {
        // Lấy luôn danh sách bầu cử được gán cho tổ này
        ballots: {
          include: {
            // Lấy luôn ứng cử viên của từng danh sách, sắp xếp theo số thứ tự
            candidates: {
              orderBy: { index: "asc" },
            },
          },
        },
      },
    });

    if (!myTeam) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Bạn chưa được gán vào tổ kiểm phiếu nào",
      });
    }

    return NextResponse.json({ success: true, data: myTeam });
  } catch (error) {
    console.error("Lỗi lấy tổ kiểm phiếu:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ" },
      { status: 500 },
    );
  }
}
