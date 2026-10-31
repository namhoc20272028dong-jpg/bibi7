import React, { useState } from 'react';
import { ExamData, QuestionItem, QuestionType, QuestionLevel } from '../types/exam';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Edit2, 
  Coins, 
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface EditorTabProps {
  exam: ExamData;
  onUpdateQuestion: (index: number, updated: QuestionItem) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (index: number) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
  onAutoRebalanceScore: () => void;
}

export const EditorTab: React.FC<EditorTabProps> = ({
  exam,
  onUpdateQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onMoveQuestion,
  onAutoRebalanceScore,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiRefiningId, setAiRefiningId] = useState<string | null>(null);
  const [aiRequirement, setAiRequirement] = useState('');

  const totalScore = exam.questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const isValid10 = Math.abs(totalScore - 10) < 0.05;

  const handleScoreChange = (index: number, newScore: number) => {
    const q = exam.questions[index];
    onUpdateQuestion(index, {
      ...q,
      score: Math.max(0.25, Math.round(newScore * 100) / 100),
    });
  };

  const handleTypeChange = (index: number, newType: QuestionType) => {
    const q = exam.questions[index];
    let defaultScore = 0.5;
    let level = q.level;

    if (newType === 'tn_nlc') {
      defaultScore = 0.5;
      if (level === 'vd') level = 'hieu'; // Trắc nghiệm KHÔNG được ở mức Vận dụng
    } else if (newType === 'tn_ds' || newType === 'tn_noi' || newType === 'tn_dien') {
      defaultScore = 0.5;
      if (level === 'vd') level = 'hieu';
    } else if (newType === 'tu_luan_1') {
      defaultScore = 0.5;
      level = 'biet';
    } else if (newType === 'tu_luan_2') {
      defaultScore = 1.0;
      level = 'hieu';
    } else if (newType === 'tu_luan_3') {
      defaultScore = 2.0;
      level = 'vd';
    }

    onUpdateQuestion(index, {
      ...q,
      type: newType,
      score: defaultScore,
      level,
    });
  };

  const handleLevelChange = (index: number, newLevel: QuestionLevel) => {
    const q = exam.questions[index];
    // Check constraint: KHÔNG tạo câu trắc nghiệm ở mức Vận dụng
    const isMultipleChoice = q.type.startsWith('tn_');
    if (isMultipleChoice && newLevel === 'vd') {
      alert('Theo quy định chuyên môn: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG. Mức Vận dụng chỉ dành cho câu hỏi Tự luận!');
      return;
    }
    onUpdateQuestion(index, {
      ...q,
      level: newLevel,
    });
  };

  // AI Refine question call
  const handleRefineWithAI = async (index: number) => {
    const q = exam.questions[index];
    setAiRefiningId(q.id);

    try {
      const response = await fetch('/api/ai/refine-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: exam.grade,
          subject: exam.subject,
          currentQuestion: q,
          requirement: aiRequirement || 'Làm mới nội dung câu hỏi, đảm bảo đúng chuẩn ngữ liệu và yêu cầu cần đạt.',
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối với dịch vụ AI');
      }

      const resData = await response.json();
      if (resData.success && resData.question) {
        const refined = resData.question;
        onUpdateQuestion(index, {
          ...q,
          prompt: refined.prompt || q.prompt,
          options: refined.options || q.options,
          correctAnswer: refined.correctAnswer || q.correctAnswer,
          solution: refined.solution || q.solution,
          strand: refined.strand || q.strand,
          topic: refined.topic || q.topic,
          score: refined.score || q.score,
          level: refined.level || q.level,
        });
        setAiRequirement('');
        setEditingId(null);
      }
    } catch (err: any) {
      alert('Lưu ý: ' + err.message + '. Bạn có thể chỉnh sửa thủ công trực tiếp nội dung bên dưới.');
    } finally {
      setAiRefiningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Score Bar - "Có chỗ sửa điểm" */}
      <div
        className={`sticky top-28 z-20 p-4 rounded-xl border shadow-sm transition flex flex-wrap items-center justify-between gap-4 ${
          isValid10
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              isValid10 ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          >
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">
                Tổng điểm đề thi: {totalScore.toFixed(2).replace('.', ',')} / 10,0 điểm
              </span>
              {isValid10 ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn 10 điểm
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5" /> Lệch {Math.abs(totalScore - 10).toFixed(2).replace('.', ',')} điểm
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              {isValid10
                ? 'Đề thi đã đạt chuẩn thang điểm 10/10. Bạn có thể sửa điểm từng câu ở các ô bên dưới.'
                : 'Thang điểm chưa tròn 10. Nhấp vào nút "Cân bằng về 10,0đ" bên phải để tự động điều chỉnh nhanh.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isValid10 && (
            <button
              onClick={onAutoRebalanceScore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tự động cân bằng về 10,0đ
            </button>
          )}

          <button
            onClick={onAddQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm câu hỏi mới
          </button>
        </div>
      </div>

      {/* Question list for editing */}
      <div className="space-y-4">
        {exam.questions.map((q, idx) => {
          const isEditing = editingId === q.id;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border transition shadow-xs overflow-hidden ${
                isEditing ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question summary strip */}
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm bg-slate-200/80 px-2 py-0.5 rounded">
                    Câu {q.order}
                  </span>

                  {/* Level Badge */}
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                      q.level === 'biet'
                        ? 'bg-blue-100 text-blue-800'
                        : q.level === 'hieu'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {q.level === 'biet' ? 'Mức 1 (Biết)' : q.level === 'hieu' ? 'Mức 2 (Hiểu)' : 'Mức 3 (Vận dụng)'}
                  </span>

                  {/* Type Badge */}
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {q.type === 'tn_nlc' && 'TN Nhiều lựa chọn'}
                    {q.type === 'tn_ds' && 'TN Đúng - Sai'}
                    {q.type === 'tn_noi' && 'TN Nối cột'}
                    {q.type === 'tn_dien' && 'TN Điền khuyết'}
                    {q.type === 'tu_luan_1' && 'Tự luận Mức 1'}
                    {q.type === 'tu_luan_2' && 'Tự luận Mức 2'}
                    {q.type === 'tu_luan_3' && 'Tự luận Mức 3'}
                  </span>

                  <span className="text-xs text-slate-500 hidden sm:inline">
                    • Mạch: <strong className="text-slate-700">{q.strand}</strong>
                  </span>
                </div>

                {/* Score Modifier & Quick Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-600">Sửa điểm:</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="5.0"
                      value={q.score}
                      onChange={(e) => handleScoreChange(idx, parseFloat(e.target.value) || 0.25)}
                      className="w-16 px-1.5 py-0.5 text-xs font-bold text-emerald-700 border border-slate-200 rounded text-center focus:outline-emerald-600"
                    />
                    <span className="text-xs text-slate-500 font-medium">điểm</span>
                  </div>

                  {/* Move Up/Down */}
                  <button
                    onClick={() => onMoveQuestion(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Chuyển lên"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMoveQuestion(idx, 'down')}
                    disabled={idx === exam.questions.length - 1}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Chuyển xuống"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Edit Form */}
                  <button
                    onClick={() => setEditingId(isEditing ? null : q.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition ${
                      isEditing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {isEditing ? 'Đóng form' : 'Sửa câu hỏi'}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteQuestion(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Read-only Question Display when not editing */}
              {!isEditing && (
                <div className="p-4 text-xs space-y-2">
                  <p className="text-slate-900 font-medium text-sm leading-relaxed m-0">
                    {q.prompt}
                  </p>

                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 text-slate-700">
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isCorrect = q.correctAnswer.startsWith(letter);
                        return (
                          <div
                            key={oIdx}
                            className={`p-1 rounded ${
                              isCorrect ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' : ''
                            }`}
                          >
                            <span className="font-bold mr-1">{letter}.</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div>
                      Đáp án đúng: <strong className="text-emerald-700 font-bold">{q.correctAnswer}</strong>
                    </div>
                    <div>
                      Bài: <span className="text-slate-700">{q.topic}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Interactive Edit Form */}
              {isEditing && (
                <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs space-y-4">
                  {/* Row 1: Select Type, Level, Strand */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Dạng câu hỏi:</label>
                      <select
                        value={q.type}
                        onChange={(e) => handleTypeChange(idx, e.target.value as QuestionType)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                      >
                        <option value="tn_nlc">Trắc nghiệm Nhiều lựa chọn (0,5đ)</option>
                        <option value="tn_ds">Trắc nghiệm Đúng - Sai (0,25đ/ý)</option>
                        <option value="tn_noi">Trắc nghiệm Nối cột (0,25đ/ý)</option>
                        <option value="tn_dien">Trắc nghiệm Điền khuyết (0,25đ/ý)</option>
                        <option value="tu_luan_1">Tự luận Mức 1 - Biết (0,5đ)</option>
                        <option value="tu_luan_2">Tự luận Mức 2 - Hiểu (1,0đ)</option>
                        <option value="tu_luan_3">Tự luận Mức 3 - Vận dụng (1,0 - 3,0đ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mức độ nhận thức:</label>
                      <select
                        value={q.level}
                        onChange={(e) => handleLevelChange(idx, e.target.value as QuestionLevel)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                      >
                        <option value="biet">Mức 1: Biết</option>
                        <option value="hieu">Mức 2: Hiểu</option>
                        <option value="vd" disabled={q.type.startsWith('tn_')}>
                          Mức 3: Vận dụng {q.type.startsWith('tn_') ? '(Không áp dụng cho Trắc nghiệm)' : ''}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mạch kiến thức:</label>
                      <input
                        type="text"
                        value={q.strand}
                        onChange={(e) => onUpdateQuestion(idx, { ...q, strand: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                        placeholder="Số và phép tính / Hình học..."
                      />
                    </div>
                  </div>

                  {/* Prompt */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi (chữ không đậm):</label>
                    <textarea
                      rows={3}
                      value={q.prompt}
                      onChange={(e) => onUpdateQuestion(idx, { ...q, prompt: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Multiple Choice Options if type is tn_nlc */}
                  {q.type === 'tn_nlc' && q.options && (
                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                      <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Các phương án lựa chọn ({exam.grade <= 3 ? 'Lớp 1-3 có 3 phương án A, B, C' : 'Lớp 4-5 có 4 phương án A, B, C, D'}):</span>
                      </div>
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        return (
                          <div key={oIdx} className="flex items-center gap-2">
                            <span className="font-bold w-6 text-slate-700">{letter}.</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...(q.options || [])];
                                newOpts[oIdx] = e.target.value;
                                onUpdateQuestion(idx, { ...q, options: newOpts });
                              }}
                              className="flex-1 p-1.5 border border-slate-200 rounded text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateQuestion(idx, { ...q, correctAnswer: letter })}
                              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                q.correctAnswer === letter
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {q.correctAnswer === letter ? 'Đáp án đúng' : 'Chọn làm đáp án'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Answer & Rubric */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Đáp án đúng:</label>
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => onUpdateQuestion(idx, { ...q, correctAnswer: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-emerald-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bài học trong SGK Kết nối:</label>
                      <input
                        type="text"
                        value={q.topic}
                        onChange={(e) => onUpdateQuestion(idx, { ...q, topic: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hướng dẫn chấm & Barem điểm chi tiết:</label>
                    <textarea
                      rows={2}
                      value={q.solution}
                      onChange={(e) => onUpdateQuestion(idx, { ...q, solution: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800 leading-relaxed font-sans"
                    />
                  </div>

                  {/* AI Refine Feature */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        AI gợi ý đổi mới / tinh chỉnh câu hỏi này
                      </div>
                      <input
                        type="text"
                        value={aiRequirement}
                        onChange={(e) => setAiRequirement(e.target.value)}
                        placeholder="Nhập yêu cầu: ví dụ 'Thay đổi số liệu', 'Gắn với tình huống đi chợ', 'Hỏi về góc nhọn'..."
                        className="w-full p-1.5 bg-white border border-indigo-200 rounded text-xs text-slate-800 placeholder-slate-400"
                      />
                    </div>

                    <button
                      onClick={() => handleRefineWithAI(idx)}
                      disabled={aiRefiningId === q.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {aiRefiningId === q.id ? 'Đang tạo câu mới...' : 'AI Sinh câu mới'}
                    </button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Xong & Lưu câu này
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
