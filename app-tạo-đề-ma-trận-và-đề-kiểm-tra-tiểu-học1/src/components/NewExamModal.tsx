import React, { useState } from 'react';
import { Grade, Subject, Semester, ExamData } from '../types/exam';
import { getBaselineExam } from '../data/curriculumData';
import { X, Sparkles, Wand2, CheckCircle2, BookOpen, Clock, ShieldCheck, Loader2 } from 'lucide-react';

interface NewExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExam: (exam: ExamData) => void;
  currentGrade: Grade;
  currentSubject: Subject;
  currentSemester: Semester;
}

export const NewExamModal: React.FC<NewExamModalProps> = ({
  isOpen,
  onClose,
  onApplyExam,
  currentGrade,
  currentSubject,
  currentSemester,
}) => {
  const [grade, setGrade] = useState<Grade>(currentGrade);
  const [subject, setSubject] = useState<Subject>(currentSubject);
  const [semester, setSemester] = useState<Semester>(currentSemester);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mode, setMode] = useState<'expert' | 'ai'>('expert');

  if (!isOpen) return null;

  const handleCreateExam = async () => {
    if (mode === 'expert') {
      const standardExam = getBaselineExam(grade, subject, semester);
      onApplyExam(standardExam);
      onClose();
      return;
    }

    // AI Mode
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          semester,
          customPrompt: customPrompt || 'Tạo đề thi chuẩn 10 câu 10 điểm, bộ sách Kết nối tri thức',
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const aiData = json.data;
        const newExam: ExamData = {
          id: `ai-exam-${Date.now()}`,
          grade,
          subject,
          semester,
          header: {
            administrativeLevel: 'UBND XÃ XÍN MẦN',
            schoolName: 'TRƯỜNG PTDTBT TH CHÍ CÀ',
            schoolYear: '2026 - 2027',
            examTitle: aiData.title || `ĐỀ KIỂM TRA ĐỊNH KÌ ${semester.toUpperCase()}`,
            durationMinutes: aiData.timeMinutes || (subject === 'Tiếng Việt' ? 60 : 40),
          },
          questions: aiData.questions || [],
          specRows: aiData.specificationTable || [],
          readingPassage: aiData.readingPassage,
          createdAt: new Date().toISOString(),
        };

        onApplyExam(newExam);
        onClose();
      } else {
        // Fallback to built-in expert generator
        const standardExam = getBaselineExam(grade, subject, semester);
        onApplyExam(standardExam);
        onClose();
      }
    } catch (err) {
      console.error('AI generation error, falling back to expert exam:', err);
      const standardExam = getBaselineExam(grade, subject, semester);
      onApplyExam(standardExam);
      onClose();
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/40 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">TẠO ĐỀ KIỂM TRA & MA TRẬN MỚI</h3>
              <p className="text-xs text-emerald-100">Chuẩn Chương trình GDPT 2018 - Sách Kết nối tri thức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Select Mode */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Chọn phương thức tạo đề:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('expert')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  mode === 'expert'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Chuyên gia chuẩn (Khuyên dùng)
                  </span>
                  {mode === 'expert' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Đảm bảo 100% chuẩn quy định, 10 câu 10đ, đúng ma trận và đặc tả ngay lập tức, không lỗi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  mode === 'ai'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Gemini sáng tạo
                  </span>
                  {mode === 'ai' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Sinh đề mới theo yêu cầu riêng (ngữ liệu địa phương, đề mở, chủ đề tuỳ chọn).
                </p>
              </button>
            </div>
          </div>

          {/* Controls: Grade, Subject, Semester */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value) as Grade)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                <option value={1}>Lớp 1</option>
                <option value={2}>Lớp 2</option>
                <option value={3}>Lớp 3</option>
                <option value={4}>Lớp 4</option>
                <option value={5}>Lớp 5</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Tin học">Tin học</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
                <option value="Công nghệ">Công nghệ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kỳ kiểm tra:</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="Giữa học kì 1">Giữa HK I</option>
                <option value="Cuối học kì 1">Cuối HK I</option>
                <option value="Giữa học kì 2">Giữa HK II</option>
                <option value="Cuối năm">Cuối năm</option>
              </select>
            </div>
          </div>

          {/* Rule Highlights */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
            <div className="font-semibold text-slate-800 mb-1">Các quy chuẩn được hệ thống tự động thiết lập:</div>
            <div>• Tổng số câu: 10 câu (Toán, Tin, KH, LS&ĐL, CN), tổng điểm: 10,0 điểm.</div>
            <div>• Trắc nghiệm {grade <= 3 ? '3 phương án (A, B, C)' : '4 phương án (A, B, C, D)'}. KHÔNG có trắc nghiệm ở mức Vận dụng.</div>
            <div>• Thứ tự câu: Trắc nghiệm (Biết &rarr; Hiểu) rồi đến Tự luận (Biết &rarr; Hiểu &rarr; Vận dụng).</div>
          </div>

          {/* Custom prompt if AI mode is selected */}
          {mode === 'ai' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Yêu cầu riêng gửi cho AI (Tùy chọn):
              </label>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Đề thi toán chú trọng về phân số và diện tích hình thoi; hoặc Tiếng Việt bài đọc về tấm lòng hiếu thảo..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-emerald-600 text-xs text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleCreateExam}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang khởi tạo đề thi & ma trận...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Khởi tạo đề thi ngay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
