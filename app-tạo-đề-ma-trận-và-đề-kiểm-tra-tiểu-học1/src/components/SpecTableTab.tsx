import React from 'react';
import { ExamData } from '../types/exam';
import { FileSpreadsheet, Download, Info, Check, ShieldCheck } from 'lucide-react';

interface SpecTableTabProps {
  exam: ExamData;
  onExportExcel: () => void;
}

export const SpecTableTab: React.FC<SpecTableTabProps> = ({ exam, onExportExcel }) => {
  // Compute aggregated stats
  let sumTN_NLC_B = 0, sumTN_NLC_H = 0, sumTN_NLC_V = 0;
  let sumTN_DS_B = 0, sumTN_DS_H = 0, sumTN_DS_V = 0;
  let sumTN_NOI_B = 0, sumTN_NOI_H = 0, sumTN_NOI_V = 0;
  let sumTN_DIEN_B = 0, sumTN_DIEN_H = 0, sumTN_DIEN_V = 0;
  let sumTL1_B = 0, sumTL1_H = 0, sumTL1_V = 0;
  let sumTL2_B = 0, sumTL2_H = 0, sumTL2_V = 0;
  let sumTL3_B = 0, sumTL3_H = 0, sumTL3_V = 0;

  exam.specRows.forEach((r) => {
    sumTN_NLC_B += r.tnNlc.biet;
    sumTN_NLC_H += r.tnNlc.hieu;
    sumTN_NLC_V += r.tnNlc.vd;

    sumTN_DS_B += r.tnDs.biet;
    sumTN_DS_H += r.tnDs.hieu;
    sumTN_DS_V += r.tnDs.vd;

    sumTN_NOI_B += r.tnNoi.biet;
    sumTN_NOI_H += r.tnNoi.hieu;
    sumTN_NOI_V += r.tnNoi.vd;

    sumTN_DIEN_B += r.tnDien.biet;
    sumTN_DIEN_H += r.tnDien.hieu;
    sumTN_DIEN_V += r.tnDien.vd;

    sumTL1_B += r.tl1.biet;
    sumTL1_H += r.tl1.hieu;
    sumTL1_V += r.tl1.vd;

    sumTL2_B += r.tl2.biet;
    sumTL2_H += r.tl2.hieu;
    sumTL2_V += r.tl2.vd;

    sumTL3_B += r.tl3.biet;
    sumTL3_H += r.tl3.hieu;
    sumTL3_V += r.tl3.vd;
  });

  // Calculate scores per level
  let scoreBiet = 0, scoreHieu = 0, scoreVd = 0;
  let countBiet = 0, countHieu = 0, countVd = 0;

  exam.questions.forEach((q) => {
    if (q.level === 'biet') {
      scoreBiet += q.score;
      countBiet++;
    } else if (q.level === 'hieu') {
      scoreHieu += q.score;
      countHieu++;
    } else if (q.level === 'vd') {
      scoreVd += q.score;
      countVd++;
    }
  });

  const totalExamScore = scoreBiet + scoreHieu + scoreVd || 10;
  const pctBiet = Math.round((scoreBiet / totalExamScore) * 100);
  const pctHieu = Math.round((scoreHieu / totalExamScore) * 100);
  const pctVd = 100 - pctBiet - pctHieu;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-emerald-950">
              BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ (CHƯƠNG TRÌNH GDPT 2018)
            </h2>
          </div>
          <p className="text-xs text-emerald-800 mt-1">
            Đúng mẫu chuẩn quy cách Bộ GD&ĐT: Môn {exam.subject} Lớp {exam.grade} ({exam.semester}) • Bộ sách Kết nối tri thức với cuộc sống.
          </p>
        </div>

        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          XUẤT FILE EXCEL (.XLSX)
        </button>
      </div>

      {/* Compliance Notice */}
      <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Quy chuẩn xây dựng đặc tả:</span> Mỗi câu hỏi trong đề ứng với một dòng đặc tả. 
          <strong> KHÔNG tạo câu trắc nghiệm ở mức Vận dụng</strong> (trắc nghiệm chỉ có Biết và Hiểu; Vận dụng chỉ ở Tự luận). Trắc nghiệm nhiều lựa chọn gồm {exam.grade <= 3 ? '3 phương án (A, B, C)' : '4 phương án (A, B, C, D)'}.
        </div>
      </div>

      {/* Specification Table - Exactly structured as required */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              {/* Row 1 */}
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th rowSpan={3} className="p-2 border border-slate-300 w-10">TT</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-36">Mạch kiến thức</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-44">Nội dung/đơn vị kiến thức</th>
                <th rowSpan={3} className="p-2 border border-slate-300 min-w-56 text-left">Yêu cầu cần đạt</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-14">Số tiết</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-14">Tỉ lệ (%)</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-16">Số điểm cần đạt</th>
                <th colSpan={12} className="p-2 border border-slate-300 bg-sky-50 text-sky-950 font-bold">
                  Trắc nghiệm
                </th>
                <th colSpan={9} className="p-2 border border-slate-300 bg-indigo-50 text-indigo-950 font-bold">
                  Tự luận
                </th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-14 bg-slate-50">Tổng số câu/ý</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-16 bg-slate-50">Điểm từng bài</th>
                <th rowSpan={3} className="p-2 border border-slate-300 w-24">Câu số</th>
              </tr>

              {/* Row 2 */}
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                {/* Trắc nghiệm types */}
                <th colSpan={3} className="p-1 border border-slate-300 bg-sky-50/60">Nhiều lựa chọn</th>
                <th colSpan={3} className="p-1 border border-slate-300 bg-sky-50/60">Đúng-Sai</th>
                <th colSpan={3} className="p-1 border border-slate-300 bg-sky-50/60">Nối cột</th>
                <th colSpan={3} className="p-1 border border-slate-300 bg-sky-50/60">Điền khuyết</th>
                {/* Tự luận types */}
                <th colSpan={3} className="p-1 border border-slate-300 bg-indigo-50/60">Tự luận 1</th>
                <th colSpan={3} className="p-1 border border-slate-300 bg-indigo-50/60">Tự luận 2</th>
                <th colSpan={3} className="p-1 border border-slate-300 bg-indigo-50/60">Tự luận 3</th>
              </tr>

              {/* Row 3: Levels */}
              <tr className="bg-slate-100 text-slate-600 text-[11px] font-medium border-b border-slate-300">
                {/* Nhiều lựa chọn */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8 bg-slate-200/50 text-slate-400">VD</th>
                {/* Đúng sai */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8 bg-slate-200/50 text-slate-400">VD</th>
                {/* Nối cột */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8 bg-slate-200/50 text-slate-400">VD</th>
                {/* Điền khuyết */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8 bg-slate-200/50 text-slate-400">VD</th>
                {/* Tự luận 1 */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8">VD</th>
                {/* Tự luận 2 */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8">VD</th>
                {/* Tự luận 3 */}
                <th className="p-1 border border-slate-300 w-8">Biết</th>
                <th className="p-1 border border-slate-300 w-8">Hiểu</th>
                <th className="p-1 border border-slate-300 w-8">VD</th>
              </tr>
            </thead>

            <tbody>
              {exam.specRows.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-slate-50 transition border-b border-slate-200">
                  <td className="p-2 border border-slate-300 font-semibold text-slate-700">{idx + 1}</td>
                  <td className="p-2 border border-slate-300 text-left font-medium text-slate-900">{r.strand}</td>
                  <td className="p-2 border border-slate-300 text-left text-slate-800">{r.topic}</td>
                  <td className="p-2 border border-slate-300 text-left text-slate-700 leading-snug">{r.requiredCompetencies}</td>
                  <td className="p-2 border border-slate-300 font-medium">{r.periods}</td>
                  <td className="p-2 border border-slate-300 font-medium">{r.percentage}%</td>
                  <td className="p-2 border border-slate-300 font-semibold text-emerald-800">{r.targetScore.toFixed(1).replace('.', ',')}</td>
                  
                  {/* Trắc nghiệm Nhiều lựa chọn */}
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnNlc.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnNlc.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 bg-slate-100/70 text-slate-400">-</td>

                  {/* Trắc nghiệm Đúng Sai */}
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnDs.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnDs.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 bg-slate-100/70 text-slate-400">-</td>

                  {/* Trắc nghiệm Nối cột */}
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnNoi.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnNoi.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 bg-slate-100/70 text-slate-400">-</td>

                  {/* Trắc nghiệm Điền khuyết */}
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnDien.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-sky-800 font-bold">{r.tnDien.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 bg-slate-100/70 text-slate-400">-</td>

                  {/* Tự luận 1 */}
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl1.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl1.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl1.vd || ''}</td>

                  {/* Tự luận 2 */}
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl2.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl2.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl2.vd || ''}</td>

                  {/* Tự luận 3 */}
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl3.biet || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl3.hieu || ''}</td>
                  <td className="p-1 border border-slate-300 text-indigo-800 font-bold">{r.tl3.vd || ''}</td>

                  {/* Tổng câu, điểm, câu số */}
                  <td className="p-2 border border-slate-300 font-bold bg-slate-50 text-slate-900">{r.totalQuestions}</td>
                  <td className="p-2 border border-slate-300 font-bold bg-emerald-50 text-emerald-900">{r.itemScore.toFixed(1).replace('.', ',')} đ</td>
                  <td className="p-2 border border-slate-300 text-xs font-semibold text-slate-700">{r.questionNumbers}</td>
                </tr>
              ))}

              {/* DÒNG: TỔNG SỐ CÂU */}
              <tr className="bg-slate-200/80 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={7} className="p-2 border border-slate-300 text-right pr-4 font-bold text-slate-900">
                  Tổng số câu
                </td>
                <td className="p-1 border border-slate-300">{sumTN_NLC_B}</td>
                <td className="p-1 border border-slate-300">{sumTN_NLC_H}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{sumTN_DS_B}</td>
                <td className="p-1 border border-slate-300">{sumTN_DS_H}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{sumTN_NOI_B}</td>
                <td className="p-1 border border-slate-300">{sumTN_NOI_H}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{sumTN_DIEN_B}</td>
                <td className="p-1 border border-slate-300">{sumTN_DIEN_H}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{sumTL1_B}</td>
                <td className="p-1 border border-slate-300">{sumTL1_H}</td>
                <td className="p-1 border border-slate-300">{sumTL1_V}</td>

                <td className="p-1 border border-slate-300">{sumTL2_B}</td>
                <td className="p-1 border border-slate-300">{sumTL2_H}</td>
                <td className="p-1 border border-slate-300">{sumTL2_V}</td>

                <td className="p-1 border border-slate-300">{sumTL3_B}</td>
                <td className="p-1 border border-slate-300">{sumTL3_H}</td>
                <td className="p-1 border border-slate-300">{sumTL3_V}</td>

                <td className="p-2 border border-slate-300 bg-slate-300 font-bold">{exam.questions.length}</td>
                <td className="p-2 border border-slate-300 bg-emerald-100 text-emerald-950 font-bold">{totalExamScore.toFixed(1).replace('.', ',')} đ</td>
                <td className="p-2 border border-slate-300"></td>
              </tr>

              {/* DÒNG: ĐIỂM TỪNG MỨC ĐỘ */}
              <tr className="bg-slate-100 font-semibold text-slate-800 border-b border-slate-300">
                <td colSpan={7} className="p-2 border border-slate-300 text-right pr-4">
                  Điểm từng mức độ
                </td>
                <td className="p-1 border border-slate-300">{(sumTN_NLC_B * 0.5).toFixed(1).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">{(sumTN_NLC_H * 0.5).toFixed(1).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{(sumTN_DS_B * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">{(sumTN_DS_H * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{(sumTN_NOI_B * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">{(sumTN_NOI_H * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{(sumTN_DIEN_B * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">{(sumTN_DIEN_H * 0.25).toFixed(2).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300 text-slate-400">0</td>

                <td className="p-1 border border-slate-300">{(sumTL1_B * 0.5).toFixed(1).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">0</td>
                <td className="p-1 border border-slate-300">0</td>

                <td className="p-1 border border-slate-300">0</td>
                <td className="p-1 border border-slate-300">{(sumTL2_H * 1.0).toFixed(1).replace('.', ',')}</td>
                <td className="p-1 border border-slate-300">0</td>

                <td className="p-1 border border-slate-300">0</td>
                <td className="p-1 border border-slate-300">0</td>
                <td className="p-1 border border-slate-300">{scoreVd.toFixed(1).replace('.', ',')}</td>

                <td className="p-2 border border-slate-300 font-bold"></td>
                <td className="p-2 border border-slate-300 font-bold bg-emerald-100 text-emerald-950">{totalExamScore.toFixed(1).replace('.', ',')} đ</td>
                <td className="p-2 border border-slate-300"></td>
              </tr>

              {/* DÒNG: TỈ LỆ */}
              <tr className="bg-slate-50 font-medium text-slate-700 border-b border-slate-300">
                <td colSpan={7} className="p-2 border border-slate-300 text-right pr-4 font-semibold">
                  Tỉ lệ (%)
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-sky-900">
                  {Math.round(((sumTN_NLC_B * 0.5 + sumTN_NLC_H * 0.5) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-sky-900">
                  {Math.round(((sumTN_DS_B * 0.25 + sumTN_DS_H * 0.25) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-sky-900">
                  {Math.round(((sumTN_NOI_B * 0.25 + sumTN_NOI_H * 0.25) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-sky-900">
                  {Math.round(((sumTN_DIEN_B * 0.25 + sumTN_DIEN_H * 0.25) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-indigo-900">
                  {Math.round(((sumTL1_B * 0.5) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-indigo-900">
                  {Math.round(((sumTL2_H * 1.0) / totalExamScore) * 100)}%
                </td>
                <td colSpan={3} className="p-1 border border-slate-300 font-bold text-indigo-900">
                  {pctVd}%
                </td>
                <td className="p-2 border border-slate-300 font-bold">100%</td>
                <td className="p-2 border border-slate-300"></td>
                <td className="p-2 border border-slate-300"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Tables: Points Rubric and Evaluation Levels Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quy định điểm từng dạng câu */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            QUY ĐỊNH ĐIỂM TỪNG DẠNG CÂU HỎI (CHUẨN GDPT 2018)
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu nhiều lựa chọn:</span>
              <span className="font-semibold text-slate-900">0,5 điểm / ý hoặc câu</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu đúng sai:</span>
              <span className="font-semibold text-slate-900">0,25 điểm / ý</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu nối cột:</span>
              <span className="font-semibold text-slate-900">0,25 điểm / ý</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu điền khuyết:</span>
              <span className="font-semibold text-slate-900">0,25 điểm / ý</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu tự luận 1 (Mức 1):</span>
              <span className="font-semibold text-slate-900">0,5 điểm / câu</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu tự luận 2 (Mức 2):</span>
              <span className="font-semibold text-slate-900">1,0 điểm / câu</span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-slate-600">Điểm 1 câu tự luận 3 (Mức 3 - Vận dụng):</span>
              <span className="font-semibold text-slate-900">1,0 – 3,0 điểm / câu</span>
            </div>
          </div>
        </div>

        {/* Bảng thống kê Mức độ đánh giá */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            THỐNG KÊ MỨC ĐỘ ĐÁNH GIÁ (BIẾT - HIỂU - VẬN DỤNG)
          </h3>
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <th className="p-2 border border-slate-200 text-left">Mức độ đánh giá</th>
                <th className="p-2 border border-slate-200">Biết (M1)</th>
                <th className="p-2 border border-slate-200">Hiểu (M2)</th>
                <th className="p-2 border border-slate-200">Vận dụng (M3)</th>
                <th className="p-2 border border-slate-200 bg-slate-200 font-bold">Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 border border-slate-200 text-left font-medium text-slate-700">Số câu / ý</td>
                <td className="p-2 border border-slate-200 font-bold text-slate-900">{countBiet}</td>
                <td className="p-2 border border-slate-200 font-bold text-slate-900">{countHieu}</td>
                <td className="p-2 border border-slate-200 font-bold text-slate-900">{countVd}</td>
                <td className="p-2 border border-slate-200 font-bold bg-slate-100">{exam.questions.length}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 border border-slate-200 text-left font-medium text-slate-700">Điểm từng phần</td>
                <td className="p-2 border border-slate-200 font-bold text-emerald-800">{scoreBiet.toFixed(1).replace('.', ',')} đ</td>
                <td className="p-2 border border-slate-200 font-bold text-blue-800">{scoreHieu.toFixed(1).replace('.', ',')} đ</td>
                <td className="p-2 border border-slate-200 font-bold text-purple-800">{scoreVd.toFixed(1).replace('.', ',')} đ</td>
                <td className="p-2 border border-slate-200 font-bold bg-emerald-50 text-emerald-950">{totalExamScore.toFixed(1).replace('.', ',')} đ</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="p-2 border border-slate-200 text-left font-semibold text-slate-800">Tỉ lệ (%)</td>
                <td className="p-2 border border-slate-200 text-emerald-700">{pctBiet}%</td>
                <td className="p-2 border border-slate-200 text-blue-700">{pctHieu}%</td>
                <td className="p-2 border border-slate-200 text-purple-700">{pctVd}%</td>
                <td className="p-2 border border-slate-200 bg-slate-200">100%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] text-slate-500 mt-2 italic">
            * Tiêu chuẩn GDPT 2018: Tỉ lệ Biết - Hiểu - Vận dụng thông thường đạt xấp xỉ 50% - 30% - 20% (hoặc 40% - 30% - 30%).
          </p>
        </div>
      </div>
    </div>
  );
};
