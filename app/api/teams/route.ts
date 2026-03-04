import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Lấy danh sách tổ kèm Kiểm phiếu viên và các Danh sách đã gán
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        auditors: { select: { id: true, name: true, email: true } },
        ballots: { select: { id: true, name: true, level: true } },
        voters: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Tạo tổ mới và kết nối với các danh sách bầu cử
export async function POST(req: NextRequest) {
  try {
    const { name, auditorIds, ballotIds } = await req.json();

    const newTeam = await prisma.team.create({
      data: {
        name,
        auditors: {
          connect: auditorIds.map((id: string) => ({ id })),
        },
        ballots: {
          connect: ballotIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json({ success: true, data: newTeam });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi tạo tổ" },
      { status: 500 },
    );
  }
}
