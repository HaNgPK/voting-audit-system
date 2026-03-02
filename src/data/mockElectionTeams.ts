export type ElectionLevel = "QUOCHOI" | "THANHPHO" | "XA";

export interface Candidate {
  id: string;
  name: string;
  birthYear: number;
  gender: "Nam" | "Nữ";
}

export interface Ballot {
  id: string;
  name: string;
  level: ElectionLevel;
  candidates: Candidate[];
}

export interface ElectionTeam {
  id: string;
  name: string;
  ballots: Ballot[];
  auditorIds: string[]; // ID của các auditor phụ trách
  createdAt: Date;
}

export const mockElectionTeams: ElectionTeam[] = [
  {
    id: "team-1",
    name: "Tổ bầu cử số 1 - Phường A, Quận Ba Đình",
    ballots: [
      {
        id: "ballot-1",
        name: "Bầu cử Quốc Hội 2026",
        level: "QUOCHOI",
        candidates: [
          { id: "c1", name: "Nguyễn Văn A", birthYear: 1975, gender: "Nam" },
          { id: "c2", name: "Trần Thị B", birthYear: 1980, gender: "Nữ" },
          { id: "c3", name: "Lê Văn C", birthYear: 1978, gender: "Nam" },
        ],
      },
      {
        id: "ballot-2",
        name: "Bầu cử HĐND TP Hà Nội khoá XVI",
        level: "THANHPHO",
        candidates: [
          { id: "c4", name: "Phạm Văn D", birthYear: 1985, gender: "Nam" },
          { id: "c5", name: "Hoàng Thị E", birthYear: 1990, gender: "Nữ" },
        ],
      },
    ],
    auditorIds: ["2", "3"],
    createdAt: new Date("2026-02-01"),
  },
  {
    id: "team-2",
    name: "Tổ bầu cử số 2 - Phường B, Quận Hoàn Kiếm",
    ballots: [
      {
        id: "ballot-3",
        name: "Bầu cử Quốc Hội 2026",
        level: "QUOCHOI",
        candidates: [
          { id: "c6", name: "Vũ Văn F", birthYear: 1970, gender: "Nam" },
          { id: "c7", name: "Đặng Thị G", birthYear: 1982, gender: "Nữ" },
        ],
      },
      {
        id: "ballot-4",
        name: "Bầu cử HĐND Xã Tây Hồ",
        level: "XA",
        candidates: [],
      },
    ],
    auditorIds: ["3", "5"],
    createdAt: new Date("2026-02-05"),
  },
];

export const mockAvailableBallots: Ballot[] = [
  {
    id: "ballot-1",
    name: "Bầu cử Quốc Hội 2026",
    level: "QUOCHOI",
    candidates: [
      { id: "c1", name: "Nguyễn Văn A", birthYear: 1975, gender: "Nam" },
      { id: "c2", name: "Trần Thị B", birthYear: 1980, gender: "Nữ" },
    ],
  },
  {
    id: "ballot-2",
    name: "Bầu cử HĐND TP Hà Nội khoá XVI",
    level: "THANHPHO",
    candidates: [
      { id: "c3", name: "Lê Văn C", birthYear: 1978, gender: "Nam" },
    ],
  },
  {
    id: "ballot-3",
    name: "Bầu cử HĐND Xã Tây Hồ",
    level: "XA",
    candidates: [],
  },
  {
    id: "ballot-4",
    name: "Bầu cử HĐND Huyện Hoài Đức",
    level: "THANHPHO",
    candidates: [],
  },
];
