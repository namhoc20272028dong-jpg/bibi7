import React, { useState } from 'react';
import { ExamData, QuestionItem } from '../types/exam';
import { Eye, EyeOff, Printer, FileText, Download, CheckCircle, Sparkles } from 'lucide-react';

interface ExamPreviewTabProps {
  exam: ExamData;
  onExportWord: () => void;
  onPrint: () => void;
}

export const ExamPreviewTab: React.FC<ExamPreviewTabProps> = ({ exam, onExportWord, onPrint }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  return (
    <div className="space-y-4">
      {/* Controls bar above paper */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              showAnswers
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {showAnswers ? <EyeOff className="w-3.5 h-3.5 text-amber-700" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnswers ? 'Ẩn đáp án & lời giải' : 'Hiện đáp án & lời giải'}
          </button>

          <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
            <span>Cỡ chữ học sinh:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tiêu chuẩn (13pt)
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cỡ lớn (15pt cho Lớp 1-2)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200" />
            Tải File Word (.doc)
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-200" />
            In đề thi (A4)
          </button>
        </div>
      </div>

      {/* PAPER CANVAS - Format strictly per user brief */}
      <div 
        className={`max-w-4xl mx-auto bg-white p-8 md:p-12 border border-slate-300 shadow-md rounded-lg font-serif print:p-0 print:border-none print:shadow-none print:max-w-full ${
          fontSize === 'large' ? 'text-[15.5px] leading-relaxed' : 'text-[14px] leading-normal'
        } text-slate-950`}
      >
        {/* Administrative Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-900/10 mb-4">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide">{exam.header.administrativeLevel}</div>
            <div className="font-bold text-sm uppercase">{exam.header.schoolName}</div>
            <div className="w-24 h-px bg-slate-900 mx-auto mt-1"></div>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm uppercase">{exam.header.examTitle}</div>
            <div className="font-bold text-xs uppercase">NĂM HỌC {exam.header.schoolYear}</div>
            <div className="font-medium text-xs mt-0.5">MÔN: {exam.subject.toUpperCase()} - LỚP {exam.grade}</div>
            <div className="italic text-xs text-slate-600">(Thời gian làm bài: {exam.header.durationMinutes} phút)</div>
          </div>
        </div>

        {/* Student identification box */}
        <div className="border border-slate-900 rounded-sm p-3 mb-6 bg-slate-50/40 text-xs">
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-8 flex items-end">
              <span>Họ và tên học sinh:</span>
              <span className="flex-1 border-b border-dotted border-slate-800 ml-2"></span>
            </div>
            <div className="col-span-4 flex items-end">
              <span>Lớp:</span>
              <span className="flex-1 border-b border-dotted border-slate-800 ml-2"></span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 mb-3">
            <div className="col-span-8 flex items-end">
              <span>Trường:</span>
              <span className="font-semibold ml-1">{exam.header.schoolName}</span>
            </div>
            <div className="col-span-4 flex items-end">
              <span>Ngày kiểm tra:</span>
              <span className="flex-1 border-b border-dotted border-slate-800 ml-2"></span>
            </div>
          </div>

          <div className="grid grid-cols-12 border border-slate-900 text-center font-sans">
            <div className="col-span-4 border-r border-slate-900 p-1 font-bold bg-slate-100">Điểm</div>
            <div className="col-span-8 p-1 font-bold bg-slate-100">Nhận xét của thầy cô giáo</div>
            <div className="col-span-4 border-r border-slate-900 h-14"></div>
            <div className="col-span-8 h-14 text-left p-1 text-[11px] text-slate-400 font-serif">
              ...........................................................................................................................
            </div>
          </div>
        </div>

        {/* Reading passage section for Vietnamese */}
        {exam.readingPassage && (
          <div className="mb-6 p-4 border border-blue-900/40 rounded bg-blue-50/30">
            <div className="text-center font-bold text-base uppercase text-blue-950 mb-2">
              {exam.readingPassage.title}
            </div>
            <div className="text-justify leading-relaxed whitespace-pre-line text-slate-900 indent-6">
              {exam.readingPassage.content}
            </div>
            <div className="text-right italic text-xs text-slate-600 mt-2">
              ({exam.readingPassage.author || 'Sưu tầm'} - Số lượng: {exam.readingPassage.wordCount} chữ)
            </div>
          </div>
        )}

        {/* QUESTIONS CONTAINER:
            Strict layout rule:
            - Câu số (chữ đậm), điểm (chữ nghiêng và không đậm) liền câu số, câu hỏi (Chữ không đậm)
              VD: Câu 1 (0,5 điểm): CÂU HỎI ĐỂ C KO ĐẬM
            - Câu số và ý (a,b,…) bằng lề - không tab
            - Phương án (A, B, C, D) lùi vào 1 tab (1cm / ml-8)
            - Không ghi phần trắc nghiệm, tự luận trong đề kiểm tra
            - Các câu hỏi sắp xếp từ Trắc nghiệm đến tự luận (M1 trước, M2 sau; Tự luận M1 -> M2 -> M3).
        */}
        <div className="space-y-4">
          {exam.questions.map((q) => (
            <div key={q.id} className="group">
              {/* Question prompt header */}
              <p className="text-justify m-0">
                <strong className="font-bold">Câu {q.order}</strong>{' '}
                <em className="italic font-normal">({q.score.toString().replace('.', ',')} điểm)</em>: <span>{q.prompt}</span>
              </p>

              {/* Options: Multiple choice (Indented 1 tab = ml-8) */}
              {q.options && q.options.length > 0 && (
                <div className="ml-8 mt-1.5 space-y-1">
                  {q.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isCorrect = showAnswers && q.correctAnswer.trim().toUpperCase().startsWith(letter);

                    return (
                      <div
                        key={oIdx}
                        className={`flex items-start gap-2 ${
                          isCorrect ? 'text-emerald-700 font-semibold bg-emerald-50/60 px-1.5 py-0.5 rounded' : ''
                        }`}
                      >
                        <span className="font-bold">{letter}.</span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True - False items */}
              {q.trueFalseItems && q.trueFalseItems.length > 0 && (
                <div className="ml-8 mt-1.5 space-y-1">
                  {q.trueFalseItems.map((item, iIdx) => {
                    const letter = String.fromCharCode(97 + iIdx);
                    return (
                      <div key={iIdx} className="flex items-center justify-between py-0.5 max-w-lg">
                        <span>
                          <strong>{letter})</strong> {item.text}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-8 h-6 border border-slate-800 text-center text-xs font-bold leading-6">
                            {showAnswers ? (item.answer ? 'Đ' : 'S') : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Matching pairs */}
              {q.matchingPairs && q.matchingPairs.length > 0 && (
                <div className="ml-8 mt-2 max-w-xl">
                  <div className="grid grid-cols-2 gap-4 border border-dashed border-slate-400 p-2 rounded bg-slate-50/50 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-700 text-center border-b pb-1">Cột A</div>
                      {q.matchingPairs.map((pair, idx) => (
                        <div key={idx} className="p-1 bg-white border border-slate-200 rounded">
                          {pair.left}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-700 text-center border-b pb-1">Cột B</div>
                      {q.matchingPairs.map((pair, idx) => (
                        <div key={idx} className="p-1 bg-white border border-slate-200 rounded">
                          {pair.right}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fill in the blank text */}
              {q.fillBlankText && (
                <div className="ml-8 mt-1.5 whitespace-pre-line leading-relaxed text-slate-800 italic">
                  {q.fillBlankText}
                </div>
              )}

              {/* Lời giải / Đáp án / Hướng dẫn chấm (chỉ hiển thị khi bấm Hiện đáp án) */}
              {showAnswers && (
                <div className="ml-8 mt-2 p-2.5 rounded bg-amber-50/80 border border-amber-300 text-xs text-amber-950 font-sans">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Đáp án đúng: <span className="text-emerald-700 underline">{q.correctAnswer}</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-800">
                    <strong>Hướng dẫn chấm:</strong> {q.solution}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vietnamese Writing Section if applicable */}
        {exam.writingSection && (
          <div className="mt-8 pt-6 border-t-2 border-slate-800">
            <h3 className="font-bold text-center text-sm uppercase mb-3">PHẦN KIỂM TRA VIẾT (10 ĐIỂM)</h3>

            {exam.writingSection.listeningWriting && (
              <div className="mb-4">
                <p className="font-bold m-0">1. Nghe - viết ({exam.writingSection.listeningWriting.score} điểm):</p>
                <div className="ml-8 mt-1 p-3 border border-slate-300 rounded bg-slate-50/50">
                  <div className="text-center font-bold mb-1">{exam.writingSection.listeningWriting.title}</div>
                  <div className="italic text-justify">{exam.writingSection.listeningWriting.content}</div>
                </div>
              </div>
            )}

            {exam.writingSection.essayPrompt && (
              <div>
                <p className="font-bold m-0">2. Tập làm văn ({exam.writingSection.essayPrompt.score} điểm):</p>
                <div className="ml-8 mt-1">
                  <p className="m-0 font-medium">{exam.writingSection.essayPrompt.topic}</p>
                  <p className="m-0 text-xs italic text-slate-600">Yêu cầu: {exam.writingSection.essayPrompt.requirement}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practical task for Informatics */}
        {exam.practicalTask && (
          <div className="mt-6 pt-4 border-t border-slate-400">
            <p className="font-bold m-0">PHẦN THỰC HÀNH ({exam.practicalTask.score} điểm):</p>
            <div className="ml-8 mt-1 p-3 border border-slate-300 rounded bg-slate-50 text-xs">
              <p className="font-semibold text-slate-900 m-0">{exam.practicalTask.prompt}</p>
              <p className="italic text-slate-600 mt-1 m-0">Tiêu chí đánh giá: {exam.practicalTask.criteria}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center font-bold italic mt-8 pt-4 border-t border-slate-200 text-xs">
          ---------- HẾT ----------<br/>
          <span className="font-normal">(Cán bộ coi thi không giải thích gì thêm)</span>
        </div>
      </div>
    </div>
  );
};
