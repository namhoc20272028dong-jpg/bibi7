import React from 'react';
import { Grade, Subject, Semester, ExamData } from '../types/exam';
import { 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  PlusCircle, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  Edit3, 
  AlertCircle,
  CheckCircle2,
  Building2,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  exam: ExamData;
  activeTab: 'preview' | 'spec' | 'answers' | 'editor' | 'curriculum';
  setActiveTab: (tab: 'preview' | 'spec' | 'answers' | 'editor' | 'curriculum') => void;
  onGradeChange: (grade: Grade) => void;
  onSubjectChange: (subject: Subject) => void;
  onSemesterChange: (semester: Semester) => void;
  onOpenNewExamModal: () => void;
  onOpenSchoolModal: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
  onPrint: () => void;
  onAutoRebalanceScore: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  exam,
  activeTab,
  setActiveTab,
  onGradeChange,
  onSubjectChange,
  onSemesterChange,
  onOpenNewExamModal,
  onOpenSchoolModal,
  onExportExcel,
  onExportWord,
  onPrint,
  onAutoRebalanceScore,
}) => {
  const currentTotalScore = exam.questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const isScoreValid = Math.abs(currentTotalScore - 10) < 0.05;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      {/* Top Banner: Administrative identity */}
      <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-400">{exam.header.administrativeLevel}</span>
          <span className="text-slate-500">|</span>
          <span className="font-medium">{exam.header.schoolName}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Năm học: {exam.header.schoolYear}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSchoolModal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 cursor-pointer"
            title="Đổi tên trường, xã, năm học, thời gian làm bài"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            Cấu hình trường / năm học
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-medium text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Chuẩn GDPT 2018 • Sách Kết nối tri thức Lớp 1 - 5
          </div>
        </div>
      </div>

      {/* Main Bar: Selectors and Actions */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: App Logo & Subject Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ĐM
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">
                APP TẠO ĐỀ MA TRẬN & ĐỀ KIỂM TRA TIỂU HỌC
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Ma trận • Bản đặc tả • Đề & Đáp án chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* Controls: Grade, Subject, Semester */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              {([1, 2, 3, 4, 5] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => onGradeChange(g)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                    exam.grade === g
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>

            {/* Subject */}
            <select
              value={exam.subject}
              onChange={(e) => onSubjectChange(e.target.value as Subject)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-emerald-600 cursor-pointer"
            >
              <option value="Toán">Toán (10 câu, 10đ)</option>
              <option value="Tiếng Việt">Tiếng Việt (Đọc hiểu + Viết)</option>
              <option value="Tin học">Tin học (Lý thuyết + TH)</option>
              <option value="Khoa học">Khoa học (Lớp 4 - 5)</option>
              <option value="Lịch sử & Địa lí">Lịch sử & Địa lí (Lớp 4 - 5)</option>
              <option value="Công nghệ">Công nghệ (Lớp 3 - 5)</option>
            </select>

            {/* Semester */}
            <select
              value={exam.semester}
              onChange={(e) => onSemesterChange(e.target.value as Semester)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-emerald-600 cursor-pointer"
            >
              <option value="Giữa học kì 1">Giữa HK I</option>
              <option value="Cuối học kì 1">Cuối HK I</option>
              <option value="Giữa học kì 2">Giữa HK II</option>
              <option value="Cuối năm">Cuối năm</option>
            </select>
          </div>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Score Validation Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition ${
              isScoreValid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
            }`}
          >
            {isScoreValid ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Điểm: {currentTotalScore.toFixed(1).replace('.', ',')} / 10,0đ</span>
            {!isScoreValid && (
              <button
                onClick={onAutoRebalanceScore}
                className="ml-1 text-[11px] underline font-semibold text-amber-900 hover:text-black cursor-pointer"
                title="Cân bằng lại thang điểm tự động về đúng 10,0 điểm"
              >
                (Cân bằng 10đ)
              </button>
            )}
          </div>

          {/* New Exam Button */}
          <button
            onClick={onOpenNewExamModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Tạo đề mới
          </button>

          {/* Excel Export Button - Requirement 6 */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Xuất Bản đặc tả và Ma trận chuẩn file Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            Xuất File Excel
          </button>

          {/* Word Export Button */}
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Tải về file Microsoft Word (.doc) căn lề chuẩn in ấn"
          >
            <FileText className="w-4 h-4 text-blue-200" />
            Xuất Word
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-300 transition cursor-pointer"
            title="In đề thi ngay theo khổ giấy A4"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            In đề
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'preview'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          1. Đề kiểm tra (Chuẩn BGD)
        </button>

        <button
          onClick={() => setActiveTab('spec')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'spec'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          2. Bản đặc tả & Ma trận (Excel)
        </button>

        <button
          onClick={() => setActiveTab('answers')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'answers'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          3. Đáp án & Hướng dẫn chấm
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'editor'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          4. Chỉnh sửa đề & Sửa điểm
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'curriculum'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          5. Danh sách bài học & YCCĐ (Sách Kết nối Lớp 1-5)
        </button>
      </div>
    </header>
  );
};
