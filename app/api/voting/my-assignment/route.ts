import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const auditorId = searchParams.get("auditorId");

    if (!auditorId) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID người dùng" },
        { status: 400 },
      );
    }

    // 1. Lấy thông tin Tổ kiểm phiếu và các Hòm phiếu
    const team = await prisma.team.findFirst({
      where: { auditors: { some: { id: auditorId } } },
      include: {
        ballots: {
          include: { candidates: { orderBy: { index: "asc" } } },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ success: true, data: null });
    }

    // 2. KÉO LỊCH SỬ CÁC PHIÊN ĐÃ KIỂM TỪ DATABASE
    const sessions = await prisma.votingSession.findMany({
      where: {
        auditorId: auditorId,
        teamId: team.id,
        status: "COMPLETED",
      },
      orderBy: { endTime: "desc" },
    });

    // Trả về cả team và sessions
    return NextResponse.json({
      success: true,
      data: { team, sessions },
    });
  } catch (error) {
    console.error("Lỗi lấy assignment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 },
    );
  }
}
