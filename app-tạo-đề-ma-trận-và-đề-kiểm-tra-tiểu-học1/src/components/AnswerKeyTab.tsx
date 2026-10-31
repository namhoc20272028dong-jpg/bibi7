import React from 'react';
import { ExamData } from '../types/exam';
import { CheckCircle2, Award, Printer, FileText } from 'lucide-react';

interface AnswerKeyTabProps {
  exam: ExamData;
  onPrint: () => void;
  onExportWord: () => void;
}

export const AnswerKeyTab: React.FC<AnswerKeyTabProps> = ({ exam, onPrint, onExportWord }) => {
  const multipleChoiceQuestions = exam.questions.filter((q) => q.type.startsWith('tn_'));
  const essayQuestions = exam.questions.filter((q) => q.type.startsWith('tu_luan'));

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              ĐÁP ÁN & HƯỚNG DẪN CHẤM CHI TIẾT
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Môn {exam.subject} - Lớp {exam.grade} ({exam.semester}) • Tổng điểm toàn bài: 10,0 điểm
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200" />
            Xuất Word
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-200" />
            In đáp án
          </button>
        </div>
      </div>

      {/* Main answer canvas */}
      <div className="bg-white p-8 md:p-10 border border-slate-300 rounded-lg shadow-sm font-serif max-w-4xl mx-auto text-slate-900">
        {/* Administrative Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300 mb-6 text-center">
          <div>
            <div className="text-xs uppercase">{exam.header.administrativeLevel}</div>
            <div className="font-bold text-sm uppercase">{exam.header.schoolName}</div>
          </div>
          <div>
            <div className="font-bold text-sm uppercase">HƯỚNG DẪN CHẤM & BIỂU ĐIỂM</div>
            <div className="font-bold text-xs uppercase">{exam.header.examTitle}</div>
            <div className="text-xs">NĂM HỌC: {exam.header.schoolYear} - MÔN: {exam.subject.toUpperCase()} LỚP {exam.grade}</div>
          </div>
        </div>

        {/* 1. Quick Multiple Choice Grid */}
        {multipleChoiceQuestions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              I. BẢNG ĐÁP ÁN TRẮC NGHIỆM
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-800">
                    {multipleChoiceQuestions.map((q) => (
                      <th key={q.id} className="p-2 border border-slate-400">
                        Câu {q.order}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {multipleChoiceQuestions.map((q) => (
                      <td key={q.id} className="p-2.5 border border-slate-400 font-bold text-sm text-red-600">
                        {q.correctAnswer}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50 text-[11px] font-medium text-slate-600">
                    {multipleChoiceQuestions.map((q) => (
                      <td key={q.id} className="p-1 border border-slate-400">
                        {q.score.toString().replace('.', ',')} đ
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Full detailed rubric table */}
        <div>
          <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            II. HƯỚNG DẪN CHẤM CHI TIẾT TỪNG CÂU & BIỂU ĐIỂM
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800 text-center">
                  <th className="p-2.5 border border-slate-400 w-16">Câu</th>
                  <th className="p-2.5 border border-slate-400 w-20">Điểm</th>
                  <th className="p-2.5 border border-slate-400 w-28">Đáp án</th>
                  <th className="p-2.5 border border-slate-400 text-left">Hướng dẫn chấm & Yêu cầu cần đạt</th>
                </tr>
              </thead>
              <tbody>
                {exam.questions.map((q) => (
                  <tr key={q.id} className="border-b border-slate-300 hover:bg-slate-50/50">
                    <td className="p-2.5 border border-slate-400 text-center font-bold">
                      Câu {q.order}
                    </td>
                    <td className="p-2.5 border border-slate-400 text-center font-semibold text-emerald-800">
                      {q.score.toString().replace('.', ',')} đ
                    </td>
                    <td className="p-2.5 border border-slate-400 text-center font-bold text-red-600">
                      {q.correctAnswer}
                    </td>
                    <td className="p-2.5 border border-slate-400 text-justify leading-relaxed whitespace-pre-line text-slate-800">
                      <div>{q.solution}</div>
                      <div className="mt-1 text-[11px] text-slate-500 font-sans italic">
                        (Mạch: {q.strand} • YCCĐ: {q.requiredCompetency})
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-4 mt-12 text-center text-xs font-serif pt-4">
          <div>
            <div className="font-bold">HIỆU TRƯỞNG / TỔ TRƯỞNG CHUYÊN MÔN</div>
            <div className="italic text-slate-500">(Ký và ghi rõ họ tên)</div>
            <div className="h-16"></div>
          </div>
          <div>
            <div className="italic text-slate-600">Chí Cà, ngày ...... tháng ...... năm 202...</div>
            <div className="font-bold">NGƯỜI RA ĐỀ KIỂM TRA</div>
            <div className="italic text-slate-500">(Ký và ghi rõ họ tên)</div>
            <div className="h-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
