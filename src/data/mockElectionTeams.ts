export type ElectionLevel = "QUOCHOI" | "THANHPHO" | "XA";

export interface Candidate {
  id: string;
  name: string;
  birthYear?: number;
  gender?: "Nam" | "Nữ";
  index: number;
}

export interface Ballot {
  id: string;
  name: string;
  level: ElectionLevel;
  candidates?: Candidate[];
}

export interface Voter {
  id: string;
  name: string;
  address?: string;
  idNumber?: string; // CMND/CCCD
}

export interface ElectionTeam {
  id: string;
  name: string;
  auditorIds: string[];
  ballotIds: string[]; // danh sách id ballot được phân
  ballots: Ballot[];
  voters: Voter[];
  createdAt: Date;
}

// ✅ Danh sách bầu cử (Ballots)
export const mockAvailableBallots: Ballot[] = [
  {
    id: "ballot-1",
    name: "Danh sách bầu cử Quốc hội 2026",
    level: "QUOCHOI",
    candidates: [
      {
        id: "c1",
        name: "Nguyễn Văn An",
        birthYear: 1975,
        gender: "Nam",
        index: 1,
      },
      {
        id: "c2",
        name: "Trần Thị Bình",
        birthYear: 1980,
        gender: "Nữ",
        index: 2,
      },
      {
        id: "c3",
        name: "Lê Hoàng Cường",
        birthYear: 1978,
        gender: "Nam",
        index: 3,
      },
      {
        id: "c4",
        name: "Phạm Minh Đức",
        birthYear: 1982,
        gender: "Nam",
        index: 4,
      },
      { id: "c5", name: "Vũ Thị Hoa", birthYear: 1979, gender: "Nữ", index: 5 },
    ],
  },
  {
    id: "ballot-2",
    name: "Danh sách bầu cử Thành phố 2026",
    level: "THANHPHO",
    candidates: [
      {
        id: "c6",
        name: "Đỗ Quang Hải",
        birthYear: 1976,
        gender: "Nam",
        index: 1,
      },
      {
        id: "c7",
        name: "Hoàng Thị Lan",
        birthYear: 1981,
        gender: "Nữ",
        index: 2,
      },
      {
        id: "c8",
        name: "Bùi Văn Minh",
        birthYear: 1977,
        gender: "Nam",
        index: 3,
      },
      {
        id: "c9",
        name: "Ngô Thị Nga",
        birthYear: 1983,
        gender: "Nữ",
        index: 4,
      },
      {
        id: "c10",
        name: "Trịnh Xuân Phong",
        birthYear: 1980,
        gender: "Nam",
        index: 5,
      },
    ],
  },
  {
    id: "ballot-3",
    name: "Danh sách bầu cử Xã 2026",
    level: "XA",
    candidates: [
      {
        id: "c11",
        name: "Đinh Thế Anh",
        birthYear: 1974,
        gender: "Nam",
        index: 1,
      },
      {
        id: "c12",
        name: "Ưu Quỳnh Như",
        birthYear: 1979,
        gender: "Nữ",
        index: 2,
      },
      {
        id: "c13",
        name: "Chu Văn Long",
        birthYear: 1975,
        gender: "Nam",
        index: 3,
      },
      {
        id: "c14",
        name: "Hồ Thị Mai",
        birthYear: 1981,
        gender: "Nữ",
        index: 4,
      },
      {
        id: "c15",
        name: "Vương Tấn Phúc",
        birthYear: 1978,
        gender: "Nam",
        index: 5,
      },
    ],
  },
];

// ✅ Election Teams
export const mockElectionTeams: ElectionTeam[] = [
  {
    id: "t1",
    name: "Tổ kiểm phiếu số 1",
    auditorIds: ["1", "2", "3"],
    ballotIds: ["ballot-1", "ballot-2", "ballot-3"],
    ballots: [
      mockAvailableBallots[0],
      mockAvailableBallots[1],
      mockAvailableBallots[2],
    ],
    voters: [
      {
        id: "v1",
        name: "Nguyễn Văn Hùng",
        address: "Phường 1, Quận 1",
        idNumber: "012345678901",
      },
      {
        id: "v2",
        name: "Trần Thị Hồng",
        address: "Phường 2, Quận 1",
        idNumber: "012345678902",
      },
    ],
    createdAt: new Date("2026-02-01"),
  },
  {
    id: "t2",
    name: "Tổ kiểm phiếu số 2",
    auditorIds: ["1", "2"],
    ballotIds: ["ballot-1", "ballot-2"],
    ballots: [mockAvailableBallots[0], mockAvailableBallots[1]],
    voters: [
      {
        id: "v3",
        name: "Lê Minh Tuấn",
        address: "Phường 3, Quận 2",
        idNumber: "012345678903",
      },
    ],
    createdAt: new Date("2026-02-05"),
  },
  {
    id: "t3",
    name: "Tổ kiểm phiếu số 3",
    auditorIds: ["1", "3", "5"],
    ballotIds: ["ballot-1", "ballot-3"],
    ballots: [mockAvailableBallots[0], mockAvailableBallots[2]],
    voters: [],
    createdAt: new Date("2026-02-10"),
  },
];
