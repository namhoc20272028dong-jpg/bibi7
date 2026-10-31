import React, { useState } from 'react';
import { SchoolHeader } from '../types/exam';
import { X, Building2, Save } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: SchoolHeader;
  onSave: (updated: SchoolHeader) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  header,
  onSave,
}) => {
  const [adminLevel, setAdminLevel] = useState(header.administrativeLevel);
  const [schoolName, setSchoolName] = useState(header.schoolName);
  const [schoolYear, setSchoolYear] = useState(header.schoolYear);
  const [examTitle, setExamTitle] = useState(header.examTitle);
  const [duration, setDuration] = useState(header.durationMinutes);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      administrativeLevel: adminLevel.trim() || 'UBND XÃ XÍN MẦN',
      schoolName: schoolName.trim() || 'TRƯỜNG PTDTBT TH CHÍ CÀ',
      schoolYear: schoolYear.trim() || '2026 - 2027',
      examTitle: examTitle.trim() || 'ĐỀ KIỂM TRA ĐỊNH KÌ',
      durationMinutes: duration || 40,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">CẤU HÌNH THÔNG TIN TRƯỜNG & ĐỀ THI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Cơ quan quản lý cấp trên (Dòng trên cùng bên trái):
            </label>
            <input
              type="text"
              value={adminLevel}
              onChange={(e) => setAdminLevel(e.target.value)}
              placeholder="VD: UBND XÃ XÍN MẦN hoặc PHÒNG GD&ĐT HUYỆN XÍN MẦN"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tên trường học:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="VD: TRƯỜNG PTDTBT TH CHÍ CÀ"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Năm học:
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="2026 - 2027"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Thời gian làm bài (phút):
              </label>
              <input
                type="number"
                min="15"
                max="120"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 40)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề đề thi:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="VD: ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
