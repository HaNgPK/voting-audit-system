export interface Candidate {
  id: string;
  name: string;
  level: "QUOCHOI" | "THANHPHO" | "XA";
  index: number; // Số thứ tự
  teamId: string;
}

export const mockCandidates: Candidate[] = [
  // Quốc hội - Team 1
  { id: "c1", name: "Nguyễn Văn An", level: "QUOCHOI", index: 1, teamId: "t1" },
  { id: "c2", name: "Trần Thị Bình", level: "QUOCHOI", index: 2, teamId: "t1" },
  {
    id: "c3",
    name: "Lê Hoàng Cường",
    level: "QUOCHOI",
    index: 3,
    teamId: "t1",
  },
  { id: "c4", name: "Phạm Minh Đức", level: "QUOCHOI", index: 4, teamId: "t1" },
  { id: "c5", name: "Vũ Thị Hoa", level: "QUOCHOI", index: 5, teamId: "t1" },

  // Thành phố - Team 1
  { id: "c6", name: "Đỗ Quang Hải", level: "THANHPHO", index: 1, teamId: "t1" },
  {
    id: "c7",
    name: "Hoàng Thị Lan",
    level: "THANHPHO",
    index: 2,
    teamId: "t1",
  },
  { id: "c8", name: "Bùi Văn Minh", level: "THANHPHO", index: 3, teamId: "t1" },
  { id: "c9", name: "Ngô Thị Nga", level: "THANHPHO", index: 4, teamId: "t1" },
  {
    id: "c10",
    name: "Trịnh Xuân Phong",
    level: "THANHPHO",
    index: 5,
    teamId: "t1",
  },

  // Xã - Team 1
  { id: "c11", name: "Đinh Thế Anh", level: "XA", index: 1, teamId: "t1" },
  { id: "c12", name: "Ưu Quỳnh Như", level: "XA", index: 2, teamId: "t1" },
  { id: "c13", name: "Chu Văn Long", level: "XA", index: 3, teamId: "t1" },
  { id: "c14", name: "Hồ Thị Mai", level: "XA", index: 4, teamId: "t1" },
  { id: "c15", name: "Vương Tấn Phúc", level: "XA", index: 5, teamId: "t1" },
];
