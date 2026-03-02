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
  // Thêm dấu "?" ở đây để TypeScript hiểu rằng lúc khởi tạo có thể chưa có ứng viên ngay
  candidates?: Candidate[]; 
}

export interface ElectionTeam {
  id: string;
  name: string;
  ballots: Ballot[];
  auditorIds: string[]; // ID của các auditor phụ trách
  createdAt: Date;
}

// 1. KHO DANH SÁCH BẦU CỬ (Có sẵn dữ liệu ứng viên cực chuẩn để test)
export const mockAvailableBallots: Ballot[] = [
  {
    id: "ballot-qh",
    name: "Bầu cử Quốc Hội 2026",
    level: "QUOCHOI",
    candidates: [
      { id: "c1", name: "Nguyễn Phú Trọng", birthYear: 1944, gender: "Nam" },
      { id: "c2", name: "Tô Lâm", birthYear: 1957, gender: "Nam" },
      { id: "c3", name: "Võ Thị Ánh Xuân", birthYear: 1970, gender: "Nữ" },
    ],
  },
  {
    id: "ballot-tp",
    name: "Bầu cử HĐND TP Hà Nội khoá XVI",
    level: "THANHPHO",
    candidates: [
      { id: "c4", name: "Trần Sỹ Thanh", birthYear: 1971, gender: "Nam" },
      { id: "c5", name: "Nguyễn Thị Tuyến", birthYear: 1971, gender: "Nữ" },
    ],
  },
  {
    id: "ballot-xa",
    name: "Bầu cử HĐND Xã Phương Viên",
    level: "XA",
    candidates: [
      { id: "c6", name: "Nguyễn Phạm Khắc Hà", birthYear: 2000, gender: "Nam" },
      { id: "c7", name: "Trần Văn A", birthYear: 1985, gender: "Nam" },
    ],
  },
];

// 2. KHO TỔ BẦU CỬ (Đã đặc cách thêm ID "1" của Admin để bạn xem được luôn)
export const mockElectionTeams: ElectionTeam[] = [
  {
    id: "team-1",
    name: "Tổ bầu cử số 1 - Xã Phương Viên",
    ballots: [
      mockAvailableBallots[0], // Tự động lấy phiếu Quốc hội
      mockAvailableBallots[1], // Tự động lấy phiếu TP
      mockAvailableBallots[2], // Tự động lấy phiếu Xã
    ],
    auditorIds: ["1", "2", "3"], // ID "1" là của admin@test.com
    createdAt: new Date("2026-02-01"),
  }
];