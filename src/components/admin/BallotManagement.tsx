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
  const [editingBallot, setEditingBallot] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    level: "QUOCHOI" as ElectionLevel,
    maxSelect: 1,
  });

  const [quickConfigData, setQuickConfigData] = useState({
    level: "XA" as ElectionLevel,
    quantity: "8",
    baseName: "Đơn vị bầu cử Xã",
  });

  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [managingBallot, setManagingBallot] = useState<any>(null);
  // Đã có sẵn gender trong form
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    birthYear: "",
    gender: "Nam" as "Nam" | "Nữ",
    index: 1,
  });

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

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBallots.length) setSelectedIds([]);
    else setSelectedIds(filteredBallots.map((b) => b.id));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    const selectedBallots = ballots.filter((b) => selectedIds.includes(b.id));
    const hasCandidates = selectedBallots.some(
      (b: any) => (b.candidates?.length || 0) > 0,
    );

    if (hasCandidates)
      return toast.error(
        "Có danh sách đang chứa ứng viên. Vui lòng xóa thủ công để tránh mất dữ liệu!",
      );
    if (!confirm(`Xóa ${selectedIds.length} đơn vị bầu cử đã chọn?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteBallot(id)));
      setSelectedIds([]);
      toast.success("Đã xóa hàng loạt thành công!");
      window.location.reload();
    } catch (error) {
      toast.error("Lỗi khi xóa hàng loạt.");
    }
  };

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
          window.location.reload();
        }
      } catch (err) {
        toast.error("Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleOpenModal = (ballot?: any) => {
    if (ballot && !ballot.target && !ballot.nativeEvent) {
      setEditingBallot(ballot);
      setFormData({
        name: ballot.name,
        level: ballot.level as ElectionLevel,
        maxSelect: ballot.maxSelect || 1,
      });
    } else {
      setEditingBallot(null);
      setFormData({ name: "", level: "XA", maxSelect: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim())
      return toast.error("Tên danh sách không được để trống!");
    if (formData.maxSelect < 1)
      return toast.error("Số lượng chọn tối đa phải >= 1!");

    const result = await saveBallot(formData, editingBallot?.id);
    if (result) setIsModalOpen(false);
  };

  const handleOpenCandidateModal = (ballot: any) => {
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

  const filteredBallots = ballots.filter((b: any) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Quản lý Danh sách bầu cử
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Cấu hình Đơn vị bầu cử và Quy định bầu
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-44"
            />
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" /> Xóa ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" /> Thêm đơn vị
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-gray-500">
          ⏳ Đang tải dữ liệu...
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4 w-12 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {selectedIds.length === filteredBallots.length &&
                      filteredBallots.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  {[
                    "Tên danh sách",
                    "Cấp độ",
                    "Chỉ tiêu bầu (max)",
                    "Ứng cử viên",
                    "Thao tác",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBallots.map((ballot: any) => {
                  const isSelected = selectedIds.includes(ballot.id);
                  return (
                    <tr
                      key={ballot.id}
                      className={`hover:bg-gray-50/50 transition-colors ${isSelected ? "bg-blue-50/30" : ""}`}
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleSelectItem(ballot.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {ballot.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {LEVEL_OPTIONS.find((l) => l.value === ballot.level)
                          ?.label || ballot.level}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-xs">
                          Bầu tối đa: {ballot.maxSelect || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenCandidateModal(ballot)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {ballot.candidates?.length || 0} người
                        </button>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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

          <div className="bg-amber-50 p-3 border border-amber-200 rounded-lg">
            <label className="block text-sm font-bold text-amber-800 mb-1">
              Số lượng đại biểu được bầu (Bắt buộc)
            </label>
            <p className="text-xs text-amber-700 mb-2">
              Quy định mỗi tờ phiếu được phép tích chọn tối đa bao nhiêu người.
              Vượt quá số này sẽ bị tính là Phiếu Hỏng.
            </p>
            <input
              type="number"
              min="1"
              value={formData.maxSelect}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxSelect: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 border border-amber-300 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit">
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
        <div className="space-y-6">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-emerald-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" /> Import bằng file Excel
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadTemplate}
                className="flex-1 sm:flex-none bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-sm"
              >
                <Download className="w-4 h-4" /> Tải mẫu
              </Button>
              <label className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                Chọn file
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
              </label>
            </div>
          </div>

          <form
            onSubmit={handleAddCandidate}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
          >
            <p className="font-bold text-gray-700 text-sm mb-3">
              Hoặc thêm từng người:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Lựa chọn giới tính */}
              <div className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm h-10">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={candidateForm.gender === "Nam"}
                    onChange={(e) =>
                      setCandidateForm({ ...candidateForm, gender: "Nam" })
                    }
                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                  />
                  Ông
                </label>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={candidateForm.gender === "Nữ"}
                    onChange={(e) =>
                      setCandidateForm({ ...candidateForm, gender: "Nữ" })
                    }
                    className="accent-pink-500 w-4 h-4 cursor-pointer"
                  />
                  Bà
                </label>
              </div>

              {/* Tên và Năm sinh */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={candidateForm.name}
                  onChange={(e) =>
                    setCandidateForm({ ...candidateForm, name: e.target.value })
                  }
                  placeholder="Họ và tên..."
                />
              </div>
              <div className="w-full sm:w-28">
                <input
                  type="number"
                  className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={candidateForm.birthYear}
                  onChange={(e) =>
                    setCandidateForm({
                      ...candidateForm,
                      birthYear: e.target.value,
                    })
                  }
                  placeholder="Năm sinh"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto h-10">
                <Plus className="w-4 h-4" /> Thêm
              </Button>
            </div>
          </form>

          <div>
            <p className="font-bold text-gray-800 mb-3">
              Danh sách ứng viên hiện tại
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {["STT", "Họ và tên", "Năm sinh", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 font-semibold text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {(
                    ballots.find((b: any) => b.id === managingBallot?.id)
                      ?.candidates || []
                  ).map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-500">
                        {c.index}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {/* THÊM DANH XƯNG ÔNG/BÀ Ở ĐÂY */}
                        <span className="text-gray-500 font-normal mr-1">
                          {c.gender === "Nữ" ? "Bà" : "Ông"}
                        </span>
                        {c.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{c.birthYear}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeCandidate(c.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
