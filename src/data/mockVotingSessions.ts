export interface VotingSession {
  id: string;
  name: string;
  ballotId: string;
  teamId: string;
  auditorId: string;
  level: "QUOCHOI" | "THANHPHO" | "XA";
  votes: Record<string, number>;
  startTime: Date;
  endTime?: Date;
  status: "ACTIVE" | "COMPLETED";
  totalVotes: number;
}

export const mockVotingSessions: VotingSession[] = [
  {
    id: "vs1",
    name: "Phiên 1",
    ballotId: "ballot-1",
    teamId: "t1",
    auditorId: "2",
    level: "QUOCHOI",
    votes: {
      c1: 450,
      c2: 320,
      c3: 200,
      c4: 150,
      c5: 100,
    },
    startTime: new Date("2026-03-01"),
    endTime: new Date("2026-03-01"),
    status: "COMPLETED",
    totalVotes: 1220,
  },
  {
    id: "vs2",
    name: "Phiên 2",
    ballotId: "ballot-1",
    teamId: "t1",
    auditorId: "3",
    level: "QUOCHOI",
    votes: {
      c1: 380,
      c2: 290,
      c3: 180,
      c4: 140,
      c5: 90,
    },
    startTime: new Date("2026-03-01"),
    endTime: new Date("2026-03-01"),
    status: "COMPLETED",
    totalVotes: 1080,
  },
  {
    id: "vs3",
    name: "Phiên 1",
    ballotId: "ballot-2",
    teamId: "t1",
    auditorId: "2",
    level: "THANHPHO",
    votes: {
      c6: 400,
      c7: 350,
      c8: 280,
      c9: 200,
      c10: 170,
    },
    startTime: new Date("2026-03-02"),
    endTime: new Date("2026-03-02"),
    status: "COMPLETED",
    totalVotes: 1400,
  },
];
