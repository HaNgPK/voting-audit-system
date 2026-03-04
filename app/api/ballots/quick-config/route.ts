import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { level, quantity, baseName } = await req.json();

    if (!level || !quantity) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin cấu hình" },
        { status: 400 },
      );
    }

    // Tạo mảng các tên đơn vị: "Đơn vị bầu cử Xã số 01", "số 02"...
    const ballotsData = Array.from({ length: Number(quantity) }).map(
      (_, i) => ({
        name: `${baseName} số ${String(i + 1).padStart(2, "0")}`,
        level: level,
      }),
    );

    // Lưu hàng loạt vào Database
    await prisma.ballot.createMany({
      data: ballotsData,
    });

    return NextResponse.json({
      success: true,
      message: `Đã tạo nhanh ${quantity} đơn vị bầu cử!`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi cấu hình nhanh" },
      { status: 500 },
    );
  }
}
