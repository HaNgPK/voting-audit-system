import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    await prisma.candidate.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa ứng cử viên" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi xóa ứng viên" },
      { status: 500 },
    );
  }
}
