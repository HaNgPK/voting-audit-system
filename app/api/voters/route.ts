import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, address, idNumber, teamId } = await req.json();

    if (!name || !teamId) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu" },
        { status: 400 },
      );
    }

    const voter = await prisma.voter.create({
      data: { name, address, idNumber, teamId },
    });

    return NextResponse.json({ success: true, data: voter });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
