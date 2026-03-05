import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      teamId,
      auditorId,
      ballotId,
      mode,
      quota,
      totalBallots,
      validBallots,
      invalidBallots,
      candidateVotes, // Object: { "id_ung_vien_1": 10, "id_ung_vien_2": 5 }
      startTime,
    } = body;

    if (!teamId || !auditorId || !ballotId || !candidateVotes) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu" },
        { status: 400 },
      );
    }

    // Dùng Transaction để đảm bảo tính toàn vẹn (Lưu lịch sử + Cộng điểm diễn ra đồng thời)
    await prisma.$transaction(async (tx) => {
      // 1. Lưu Biên bản Phiên kiểm phiếu
      await tx.votingSession.create({
        data: {
          teamId,
          auditorId,
          ballotId,
          mode,
          quota: quota || null,
          totalBallots,
          validBallots: validBallots || 0,
          invalidBallots: invalidBallots || 0,
          startTime: new Date(startTime),
          status: "COMPLETED",
        },
      });

      // 2. Cộng dồn số phiếu cho từng ứng cử viên
      for (const [candidateId, addedVotes] of Object.entries(candidateVotes)) {
        if (typeof addedVotes === "number" && addedVotes > 0) {
          await tx.candidate.update({
            where: { id: candidateId },
            data: { votesCount: { increment: addedVotes } },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Lưu kết quả thành công!",
    });
  } catch (error) {
    console.error("Lỗi hoàn thành phiên:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi lưu máy chủ" },
      { status: 500 },
    );
  }
}
