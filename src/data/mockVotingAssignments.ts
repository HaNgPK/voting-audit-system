export type AssignmentMode = "FIXED_QUOTA" | "UNLIMITED";

export interface VotingPhase {
  id: string;
  teamId: string;
  auditorId: string;
  level: "QUOCHOI" | "THANHPHO" | "XA";
  ballotId: string;
  votes: Record<string, number>; // candidateId => tổng số phiếu bầu
  totalVotes: number; // tổng số lượt bầu tất cả ứng viên
  ballotCount: number; // số tờ phiếu đã hoàn tất
  currentTicketVotes: Record<string, number>; // ứng viên đang chọn trong phiếu hiện tại
  startTime: Date;
  endTime?: Date;
  status: "ACTIVE" | "COMPLETED";
  mode: AssignmentMode;
  quota?: number; // Nếu FIXED_QUOTA: số tờ phiếu cần kiểm
}

export const mockVotingPhases: VotingPhase[] = [
  {
    id: "phase-1",
    teamId: "t1",
    auditorId: "2",
    level: "QUOCHOI",
    ballotId: "ballot-1",
    votes: {
      c1: 10,
      c2: 8,
      c3: 5,
    },
    totalVotes: 23,
    ballotCount: 5,
    currentTicketVotes: {},
    startTime: new Date("2026-03-01 08:00"),
    endTime: new Date("2026-03-01 12:00"),
    status: "COMPLETED",
    mode: "UNLIMITED",
  },
];
