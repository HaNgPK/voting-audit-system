import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { ballots: true },
    });
    const ballots = await prisma.ballot.findMany();
    const sessions = await prisma.votingSession.findMany({
      where: { status: "COMPLETED" },
    });

    const teamsCount = teams.length;
    const totalBallots = sessions.reduce((sum, s) => sum + s.totalBallots, 0);
    const validBallots = sessions.reduce((sum, s) => sum + s.validBallots, 0);
    const invalidBallots = sessions.reduce(
      (sum, s) => sum + s.invalidBallots,
      0,
    );

    const levelStats = {
      QUOCHOI: { count: 0 },
      THANHPHO: { count: 0 },
      XA: { count: 0 },
    };

    const teamStatsMap: Record<string, number> = {};

    sessions.forEach((s) => {
      const matchedBallot = ballots.find((b) => b.id === s.ballotId);
      const matchedTeam = teams.find((t) => t.id === s.teamId);

      if (matchedBallot?.level) {
        levelStats[matchedBallot.level as keyof typeof levelStats].count +=
          s.totalBallots;
      }

      if (matchedTeam?.name) {
        teamStatsMap[matchedTeam.name] =
          (teamStatsMap[matchedTeam.name] || 0) + s.totalBallots;
      }
    });

    const barChartData = Object.keys(teamStatsMap).map((name) => ({
      name,
      "Số phiếu": teamStatsMap[name],
    }));

    const pieChartData = [
      { name: "🏛️ Quốc hội", value: levelStats.QUOCHOI.count },
      { name: "🏢 Thành phố", value: levelStats.THANHPHO.count },
      { name: "🏘️ Xã", value: levelStats.XA.count },
    ].filter((d) => d.value > 0);

    // Lấy toàn bộ ứng viên và gán Tổ cho họ
    const candidates = await prisma.candidate.findMany({
      include: { ballot: true },
      orderBy: { index: "asc" }, // Sắp xếp theo số thứ tự (STT) trong phiếu
    });

    const candidateResults = candidates.map((c) => {
      const assignedTeam = teams.find((t) =>
        t.ballots.some((b) => b.id === c.ballotId),
      );
      return {
        ...c,
        teamName: assignedTeam?.name || "Chưa phân công tổ",
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        teamsCount,
        totalBallots,
        validBallots,
        invalidBallots,
        levelStats,
        barChartData,
        pieChartData,
        teamNames: teams.map((t) => t.name), // Danh sách tên tổ cho Dropdown
        candidateResults: candidateResults, // Lấy toàn bộ (kể cả 0 phiếu)
      },
    });
  } catch (error) {
    console.error("Lỗi Dashboard API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
