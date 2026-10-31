import React, { useState } from 'react';
import { LESSON_DATABASE } from '../data/curriculumData';
import { Grade, Subject, Semester, LessonInfo } from '../types/exam';
import { BookOpen, Search, Sparkles, PlusCircle, CheckCircle, Clock, Award } from 'lucide-react';

interface CurriculumBrowserTabProps {
  currentGrade: Grade;
  currentSubject: Subject;
  currentSemester: Semester;
  onSelectLessonForExam: (lesson: LessonInfo) => void;
  onAddLessonToSpec: (lesson: LessonInfo) => void;
}

export const CurriculumBrowserTab: React.FC<CurriculumBrowserTabProps> = ({
  currentGrade,
  currentSubject,
  currentSemester,
  onSelectLessonForExam,
  onAddLessonToSpec,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(currentGrade);
  const [selectedSubject, setSelectedSubject] = useState<Subject>(currentSubject);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter lessons
  const filteredLessons = LESSON_DATABASE.filter((lesson) => {
    if (lesson.grade !== selectedGrade) return false;
    if (lesson.subject !== selectedSubject) return false;
    if (selectedSemester !== 'all' && lesson.semester !== selectedSemester) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lesson.lessonName.toLowerCase().includes(q) ||
        lesson.coreKnowledge.toLowerCase().includes(q) ||
        lesson.competencyRequired.toLowerCase().includes(q) ||
        lesson.strand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600">
            <BookOpen className="w-3.5 h-3.5" />
            Cơ sở dữ liệu Chương trình GDPT 2018
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            DANH MỤC BÀI HỌC, KIẾN THỨC TRỌNG TÂM & YÊU CẦU CẦN ĐẠT
          </h2>
          <p className="text-emerald-100 text-xs md:text-sm mt-1.5 leading-relaxed">
            Hệ thống dữ liệu chuẩn hóa bộ sách <strong>Kết nối tri thức với cuộc sống</strong> từ Lớp 1 đến Lớp 5. Hỗ trợ tra cứu nhanh, tạo ma trận và bản đặc tả tự động chỉ với 1 cú nhấp chuột.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Grade tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {([1, 2, 3, 4, 5] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer shadow-2xs"
          >
            <option value="Toán">Môn Toán</option>
            <option value="Tiếng Việt">Môn Tiếng Việt</option>
            <option value="Tin học">Môn Tin học</option>
            <option value="Khoa học">Môn Khoa học</option>
            <option value="Lịch sử & Địa lí">Môn Lịch sử & Địa lí</option>
            <option value="Công nghệ">Môn Công nghệ</option>
          </select>

          {/* Semester selector */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer shadow-2xs"
          >
            <option value="all">Tất cả các kỳ kiểm tra</option>
            <option value="Giữa học kì 1">Giữa học kì 1 (GK I)</option>
            <option value="Cuối học kì 1">Cuối học kì 1 (CK I)</option>
            <option value="Giữa học kì 2">Giữa học kì 2 (GK II)</option>
            <option value="Cuối năm">Cuối năm (CN)</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài học, mạch kiến thức, từ khóa (VD: Phân số, Góc nhọn, Số thập phân, Danh từ...)"
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Lesson cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {lesson.strand}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {lesson.periods} tiết • {lesson.semester}
                </span>
              </div>

              {/* Lesson Name */}
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                {lesson.lessonName}
              </h3>

              {/* Core Knowledge */}
              <div className="mb-3 p-3 bg-slate-50 rounded-lg text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Kiến thức trọng tâm:
                </span>
                <p className="text-slate-600 leading-relaxed m-0">
                  {lesson.coreKnowledge}
                </p>
              </div>

              {/* Competency */}
              <div className="mb-4 p-3 bg-blue-50/60 rounded-lg text-xs border border-blue-100">
                <span className="font-semibold text-blue-900 block mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  Yêu cầu cần đạt (YCCĐ):
                </span>
                <p className="text-blue-950 leading-relaxed m-0">
                  {lesson.competencyRequired}
                </p>
              </div>
            </div>

            {/* Actions on this lesson */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectLessonForExam(lesson)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Tạo đề từ bài này
              </button>

              <button
                onClick={() => onAddLessonToSpec(lesson)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                title="Đưa bài học này vào Bản đặc tả đề thi"
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                Thêm vào đặc tả
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-6">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy bài học phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
};
