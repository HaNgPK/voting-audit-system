import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// PUT: Đổi tên hoặc đổi cấp độ danh sách
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { name, level } = await req.json();
    const resolvedParams = await params;

    const updatedBallot = await prisma.ballot.update({
      where: { id: resolvedParams.id },
      data: { name, level },
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

// DELETE: Xóa danh sách (Sẽ tự động xóa luôn các ứng viên bên trong nhờ onDelete: Cascade)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    await prisma.ballot.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa danh sách" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi xóa danh sách" },
      { status: 500 },
    );
  }
}
