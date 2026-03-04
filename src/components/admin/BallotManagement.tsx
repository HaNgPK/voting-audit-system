"use client";

import { useState } from "react";
import { Card, Modal, Input, Select, Button } from "@/src/components/common";
import { type Ballot, type ElectionLevel } from "@/src/data/mockElectionTeams";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Users,
  FileSpreadsheet,
  Zap,
  Download,
  CheckSquare,
  Square,
} from "lucide-react";
import { useBallots } from "@/src/hooks/useBallots";
import * as XLSX from "xlsx";

const LEVEL_OPTIONS = [
  { value: "QUOCHOI", label: "🏛️ Quốc Hội" },
  { value: "THANHPHO", label: "🏢 Thành Phố" },
  { value: "XA", label: "🏘️ Xã" },
];

export const BallotManagement: React.FC = () => {
  // ✅ Đã bổ sung importCandidates vào destructuring để tránh lỗi "không tìm thấy"
  const {
    ballots,
    isLoading,
    saveBallot,
    deleteBallot,
    addCandidate,
    removeCandidate,
    importCandidates,
  } = useBallots();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickConfigOpen, setIsQuickConfigOpen] = useState(false);
  const [editingBallot, setEditingBallot] = useState<Ballot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // ✅ State quản lý danh sách chọn

  const [formData, setFormData] = useState({
    name: "",
    level: "QUOCHOI" as ElectionLevel,
  });

  const [quickConfigData, setQuickConfigData] = useState({
    level: "XA" as ElectionLevel,
    quantity: "8",
    baseName: "Đơn vị bầu cử Xã",
  });

  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [managingBallot, setManagingBallot] = useState<Ballot | null>(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    birthYear: "",
    gender: "Nam" as "Nam" | "Nữ",
    index: 1,
  });

  // --- ✅ 1. Logic Tải File Excel Mẫu ---
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        STT: 1,
        "Họ và tên": "Trần Đức Hải",
        "Năm sinh": 1990,
        "Giới tính": "Nam",
      },
      {
        STT: 2,
        "Họ và tên": "Nguyễn Thị Hoa",
        "Năm sinh": 1988,
        "Giới tính": "Nữ",
      },
      {
        STT: 3,
        "Họ và tên": "Nguyễn Thị Mai Hương",
        "Năm sinh": 1990,
        "Giới tính": "Nữ",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_Sach_Ung_Vien");
    XLSX.writeFile(workbook, "Mau_Danh_Sach_Ung_Vien.xlsx");
    toast.success("Đã tải file mẫu thành công!");
  };

  // --- ✅ 2. Logic Chọn Checkbox ---
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBallots.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBallots.map((b) => b.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // --- ✅ 3. Logic Xóa hàng loạt có điều kiện ---
  const handleBulkDelete = async () => {
    const selectedBallots = ballots.filter((b) => selectedIds.includes(b.id));

    // Điều kiện: Chỉ cho phép xóa nếu danh sách có 0 ứng viên
    const hasCandidates = selectedBallots.some(
      (b) => (b.candidates?.length || 0) > 0,
    );

    if (hasCandidates) {
      return toast.error(
        "Chặn xóa hàng loạt: Một số danh sách đã chọn có chứa ứng viên. Vui lòng xóa thủ công để tránh mất dữ liệu!",
      );
    }

    if (!confirm(`Xóa ${selectedIds.length} đơn vị bầu cử đã chọn?`)) return;

    try {
      // Xóa lần lượt qua API (Có thể nâng cấp API deleteMany sau này)
      await Promise.all(selectedIds.map((id) => deleteBallot(id)));
      setSelectedIds([]);
      toast.success("Đã xóa các danh sách trống thành công!");
      window.location.reload();
    } catch (error) {
      toast.error("Lỗi khi xóa hàng loạt.");
    }
  };

  // --- Logic Xử lý Import Excel ---
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !managingBallot) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        const formattedCandidates = jsonData.map((row) => ({
          name: row["Họ và tên"] || row["name"],
          birthYear: Number(row["Năm sinh"] || row["birthYear"]),
          gender: row["Giới tính"] || "Nam",
          index: Number(row["STT"] || row["index"]),
          ballotId: managingBallot.id,
        }));

        const success = await importCandidates(
          managingBallot.id,
          formattedCandidates,
        );

        if (success) {
          toast.success(
            `Đã nhập thành công ${formattedCandidates.length} ứng viên!`,
          );
          window.location.reload();
        }
      } catch (err) {
        toast.error("Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // --- Logic Cấu hình nhanh ---
  const handleQuickConfig = async () => {
    try {
      const res = await fetch("/api/ballots/quick-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quickConfigData),
      });
      if (res.ok) {
        toast.success("Cấu hình nhanh hoàn tất!");
        setIsQuickConfigOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Lỗi cấu hình nhanh");
    }
  };

  const handleOpenModal = (ballot?: Ballot) => {
    if (ballot) {
      setEditingBallot(ballot);
      setFormData({ name: ballot.name, level: ballot.level as ElectionLevel });
    } else {
      setEditingBallot(null);
      setFormData({ name: "", level: "XA" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim())
      return toast.error("Tên danh sách không được để trống!");

    const result = await saveBallot(formData, editingBallot?.id);
    if (result) setIsModalOpen(false);
  };

  const handleOpenCandidateModal = (ballot: Ballot) => {
    setManagingBallot(ballot);
    const nextIndex = (ballot.candidates?.length || 0) + 1;
    setCandidateForm({
      name: "",
      birthYear: "",
      gender: "Nam",
      index: nextIndex,
    });
    setCandidateModalOpen(true);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.birthYear)
      return toast.error("Vui lòng nhập đủ thông tin!");

    const success = await addCandidate({
      ...candidateForm,
      ballotId: managingBallot?.id,
    });

    if (success) {
      setCandidateForm({
        ...candidateForm,
        name: "",
        birthYear: "",
        index: candidateForm.index + 1,
      });
    }
  };

  const filteredBallots = ballots.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="p-0 overflow-hidden animate-fadeInUp">
      {/* Header & Toolbar */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý Danh sách bầu cử
            </h2>
            <p className="text-sm text-gray-500 mt-1">Hệ thống bầu cử 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-44"
              />
            </div>

            {/* ✅ Nút Xóa hàng loạt - Chỉ hiện khi có chọn */}
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-semibold border border-red-200"
              >
                <Trash2 className="w-4 h-4" /> Xóa ({selectedIds.length})
              </button>
            )}

            <Button
              onClick={() => setIsQuickConfigOpen(true)}
              variant="secondary"
              className="gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" /> Cấu hình nhanh
            </Button>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="w-4 h-4" /> Thêm đơn vị
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400 animate-pulse">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto shadow-inner relative">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-left w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    {selectedIds.length === filteredBallots.length &&
                    filteredBallots.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                {["Tên danh sách", "Cấp độ", "Ứng cử viên", "Thao tác"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBallots.map((ballot) => {
                const isSelected = selectedIds.includes(ballot.id);
                return (
                  <tr
                    key={ballot.id}
                    className={`${isSelected ? "bg-blue-50/50" : "hover:bg-gray-50"} transition-colors duration-150`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleSelectItem(ballot.id)}
                        className="text-gray-400 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {ballot.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {LEVEL_OPTIONS.find((l) => l.value === ballot.level)
                          ?.label || ballot.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenCandidateModal(ballot)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        {ballot.candidates?.length || 0} người
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenCandidateModal(ballot)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="Quản lý ứng viên"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(ballot)}
                          className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBallot(ballot.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Cấu hình nhanh */}
      <Modal
        isOpen={isQuickConfigOpen}
        onClose={() => setIsQuickConfigOpen(false)}
        title="⚡ Cấu hình nhanh Đơn vị bầu cử"
      >
        <div className="space-y-4">
          <Select
            label="Cấp độ bầu cử"
            value={quickConfigData.level}
            options={LEVEL_OPTIONS}
            onChange={(e) =>
              setQuickConfigData({
                ...quickConfigData,
                level: e.target.value as any,
              })
            }
          />
          <Input
            label="Tên gốc của đơn vị"
            value={quickConfigData.baseName}
            onChange={(e) =>
              setQuickConfigData({
                ...quickConfigData,
                baseName: e.target.value,
              })
            }
          />
          <Input
            label="Số lượng đơn vị cần tạo"
            type="number"
            value={quickConfigData.quantity}
            onChange={(e) =>
              setQuickConfigData({
                ...quickConfigData,
                quantity: e.target.value,
              })
            }
          />
          <div className="pt-4 border-t flex justify-end gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsQuickConfigOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleQuickConfig}>Bắt đầu tạo</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Tạo/Sửa Đơn vị */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBallot ? "📝 Sửa danh sách" : "✨ Tạo danh sách bầu cử"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh sách"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Danh sách đơn vị bầu cử số 01"
          />
          <Select
            label="Cấp độ"
            value={formData.level}
            onChange={(e) =>
              setFormData({
                ...formData,
                level: e.target.value as ElectionLevel,
              })
            }
            options={LEVEL_OPTIONS}
          />
          <div className="flex gap-3 justify-end pt-4 border-t mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              {editingBallot ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Quản lý Ứng viên (Excel Tools) */}
      <Modal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        title={`👥 Ứng viên: ${managingBallot?.name}`}
        size="lg"
      >
        <div className="space-y-5">
          {/* ✅ Section: Import & Download Mẫu Excel */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
            <div>
              <p className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Công cụ Excel
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Sử dụng file Excel để nhập liệu nhiều người một cách thần tốc.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadTemplate}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Tải mẫu
              </button>
              <label className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all">
                Chọn file .xlsx
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleImportExcel}
                />
              </label>
            </div>
          </div>

          {/* Form Thêm Thủ Công */}
          <form
            onSubmit={handleAddCandidate}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
          >
            <p className="text-sm font-semibold text-gray-700">
              Thêm ứng cử viên mới (Nhập tay)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Họ và tên"
                value={candidateForm.name}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, name: e.target.value })
                }
                placeholder="Nhập tên"
              />
              <Input
                label="Năm sinh"
                type="number"
                value={candidateForm.birthYear}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    birthYear: e.target.value,
                  })
                }
                placeholder="1980"
              />
              <Input
                label="Số thứ tự"
                type="number"
                value={candidateForm.index}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    index: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Thêm
              </Button>
            </div>
          </form>

          {/* Table Ứng viên */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Danh sách ứng viên hiện tại
            </p>
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg shadow-inner bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {["STT", "Họ và tên", "Năm sinh", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(
                    ballots.find((b) => b.id === managingBallot?.id)
                      ?.candidates || []
                  ).map((c: any) => (
                    <tr
                      key={c.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-sm font-bold text-gray-600">
                        {c.index}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-800">
                        {c.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {c.birthYear}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeCandidate(c.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-all"
                          title="Xóa ứng viên"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!managingBallot?.candidates ||
                    managingBallot.candidates.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-400 text-xs italic"
                      >
                        Chưa có ứng viên nào trong danh sách
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              variant="primary"
              onClick={() => setCandidateModalOpen(false)}
            >
              ✅ Hoàn thành & Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
