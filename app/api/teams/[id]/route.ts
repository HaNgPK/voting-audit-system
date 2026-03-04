import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { name, auditorIds, ballotIds } = await req.json();
    const { id } = await params;

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        auditors: {
          set: auditorIds.map((id: string) => ({ id })), // Ghi đè danh sách người mới
        },
        ballots: {
          set: ballotIds.map((id: string) => ({ id })), // Ghi đè danh sách bầu cử mới
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedTeam });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
