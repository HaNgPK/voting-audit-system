import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { name, level, maxSelect } = await req.json(); // LẤY THÊM maxSelect
    const resolvedParams = await params;

    const updatedBallot = await prisma.ballot.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        level,
        maxSelect: maxSelect ? Number(maxSelect) : 1, // CẬP NHẬT DB
      },
      include: { candidates: { orderBy: { index: "asc" } } },
    });

    return NextResponse.json({ success: true, data: updatedBallot });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi cập nhật" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    await prisma.ballot.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true, message: "Đã xóa danh sách" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi xóa danh sách" },
      { status: 500 },
    );
  }
}
