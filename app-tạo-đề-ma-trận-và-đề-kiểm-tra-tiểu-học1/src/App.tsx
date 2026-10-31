import React, { useState } from 'react';
import { Grade, Subject, Semester, ExamData, QuestionItem, LessonInfo, SchoolHeader } from './types/exam';
import { getBaselineExam } from './data/curriculumData';
import { exportExamToExcel } from './utils/exportExcel';
import { exportExamToWord } from './utils/exportWord';
import { syncSpecWithQuestions } from './utils/syncSpecWithQuestions';

import { Header } from './components/Header';
import { ExamPreviewTab } from './components/ExamPreviewTab';
import { SpecTableTab } from './components/SpecTableTab';
import { AnswerKeyTab } from './components/AnswerKeyTab';
import { EditorTab } from './components/EditorTab';
import { CurriculumBrowserTab } from './components/CurriculumBrowserTab';
import { NewExamModal } from './components/NewExamModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';

export default function App() {
  const [exam, setExam] = useState<ExamData>(() => getBaselineExam(4, 'Toán', 'Giữa học kì 1'));
  const [activeTab, setActiveTab] = useState<'preview' | 'spec' | 'answers' | 'editor' | 'curriculum'>('preview');
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  // Switch Grade
  const handleGradeChange = (newGrade: Grade) => {
    const newExam = getBaselineExam(newGrade, exam.subject, exam.semester);
    newExam.header = { ...exam.header }; // Keep school settings
    setExam(newExam);
  };

  // Switch Subject
  const handleSubjectChange = (newSubject: Subject) => {
    const newExam = getBaselineExam(exam.grade, newSubject, exam.semester);
    newExam.header = { ...exam.header };
    setExam(newExam);
  };

  // Switch Semester
  const handleSemesterChange = (newSemester: Semester) => {
    const newExam = getBaselineExam(exam.grade, exam.subject, newSemester);
    newExam.header = { ...exam.header, examTitle: `ĐỀ KIỂM TRA ĐỊNH KÌ ${newSemester.toUpperCase()}` };
    setExam(newExam);
  };

  // Update a single question and resync specification
  const handleUpdateQuestion = (index: number, updated: QuestionItem) => {
    const newQuestions = [...exam.questions];
    newQuestions[index] = updated;

    const newSpecs = syncSpecWithQuestions(newQuestions, exam.specRows);
    setExam({
      ...exam,
      questions: newQuestions,
      specRows: newSpecs,
    });
  };

  // Add new question
  const handleAddQuestion = () => {
    const newOrder = exam.questions.length + 1;
    const isLower = exam.grade <= 3;

    const newQuestion: QuestionItem = {
      id: `q-${Date.now()}`,
      order: newOrder,
      type: 'tn_nlc',
      level: 'biet',
      score: 0.5,
      prompt: 'Nội dung câu hỏi mới...',
      options: isLower ? ['Phương án A', 'Phương án B', 'Phương án C'] : ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
      correctAnswer: 'A',
      solution: 'Chọn đúng phương án A. Cho 0,5 điểm.',
      strand: exam.specRows[0]?.strand || 'Số và phép tính',
      topic: exam.specRows[0]?.topic || 'Bài học mới',
      requiredCompetency: 'Nhận biết kiến thức cốt lõi.',
    };

    const newQuestions = [...exam.questions, newQuestion];
    const newSpecs = syncSpecWithQuestions(newQuestions, exam.specRows);

    setExam({
      ...exam,
      questions: newQuestions,
      specRows: newSpecs,
    });
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    if (exam.questions.length <= 1) {
      alert('Đề thi cần có ít nhất 1 câu hỏi.');
      return;
    }
    const filtered = exam.questions.filter((_, i) => i !== index);
    // Re-index order
    const reindexed = filtered.map((q, i) => ({ ...q, order: i + 1 }));
    const newSpecs = syncSpecWithQuestions(reindexed, exam.specRows);

    setExam({
      ...exam,
      questions: reindexed,
      specRows: newSpecs,
    });
  };

  // Move question up or down
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= exam.questions.length) return;

    const newQuestions = [...exam.questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;

    // Update order numbering
    const reordered = newQuestions.map((q, i) => ({ ...q, order: i + 1 }));
    const newSpecs = syncSpecWithQuestions(reordered, exam.specRows);

    setExam({
      ...exam,
      questions: reordered,
      specRows: newSpecs,
    });
  };

  // Auto-rebalance scores to exactly 10.0
  const handleAutoRebalanceScore = () => {
    const currentSum = exam.questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const diff = 10 - currentSum;
    if (Math.abs(diff) < 0.01) return;

    // Adjust the last question(s)
    const newQuestions = [...exam.questions];
    const lastIdx = newQuestions.length - 1;
    const newLastScore = Math.max(0.25, Math.round((newQuestions[lastIdx].score + diff) * 100) / 100);
    newQuestions[lastIdx] = {
      ...newQuestions[lastIdx],
      score: newLastScore,
    };

    const newSpecs = syncSpecWithQuestions(newQuestions, exam.specRows);
    setExam({
      ...exam,
      questions: newQuestions,
      specRows: newSpecs,
    });
  };

  // Select lesson from Curriculum Browser
  const handleSelectLessonForExam = (lesson: LessonInfo) => {
    const baseline = getBaselineExam(lesson.grade, lesson.subject, lesson.semester);
    baseline.header = { ...exam.header };
    // Set first question to focus on this lesson
    if (baseline.questions.length > 0) {
      baseline.questions[0].topic = lesson.lessonName;
      baseline.questions[0].strand = lesson.strand;
      baseline.questions[0].requiredCompetency = lesson.competencyRequired;
    }
    setExam(baseline);
    setActiveTab('preview');
  };

  // Add lesson to Specification table
  const handleAddLessonToSpec = (lesson: LessonInfo) => {
    const newRow = {
      id: exam.specRows.length + 1,
      strand: lesson.strand,
      topic: lesson.lessonName,
      requiredCompetencies: lesson.competencyRequired,
      periods: lesson.periods,
      percentage: 20,
      targetScore: 2.0,
      tnNlc: { biet: 1, hieu: 0, vd: 0 },
      tnDs: { biet: 0, hieu: 0, vd: 0 },
      tnNoi: { biet: 0, hieu: 0, vd: 0 },
      tnDien: { biet: 0, hieu: 0, vd: 0 },
      tl1: { biet: 0, hieu: 0, vd: 0 },
      tl2: { biet: 0, hieu: 1, vd: 0 },
      tl3: { biet: 0, hieu: 0, vd: 0 },
      totalQuestions: 2,
      itemScore: 1.5,
      questionNumbers: 'Bổ sung',
    };

    setExam({
      ...exam,
      specRows: [...exam.specRows, newRow],
    });
    setActiveTab('spec');
  };

  // Save school header configuration
  const handleSaveSchoolHeader = (updated: SchoolHeader) => {
    setExam({
      ...exam,
      header: updated,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* App Header */}
      <Header
        exam={exam}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGradeChange={handleGradeChange}
        onSubjectChange={handleSubjectChange}
        onSemesterChange={handleSemesterChange}
        onOpenNewExamModal={() => setIsNewExamModalOpen(true)}
        onOpenSchoolModal={() => setIsSchoolModalOpen(true)}
        onExportExcel={() => exportExamToExcel(exam)}
        onExportWord={() => exportExamToWord(exam)}
        onPrint={() => window.print()}
        onAutoRebalanceScore={handleAutoRebalanceScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'preview' && (
          <ExamPreviewTab
            exam={exam}
            onExportWord={() => exportExamToWord(exam)}
            onPrint={() => window.print()}
          />
        )}

        {activeTab === 'spec' && (
          <SpecTableTab
            exam={exam}
            onExportExcel={() => exportExamToExcel(exam)}
          />
        )}

        {activeTab === 'answers' && (
          <AnswerKeyTab
            exam={exam}
            onPrint={() => window.print()}
            onExportWord={() => exportExamToWord(exam)}
          />
        )}

        {activeTab === 'editor' && (
          <EditorTab
            exam={exam}
            onUpdateQuestion={handleUpdateQuestion}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onMoveQuestion={handleMoveQuestion}
            onAutoRebalanceScore={handleAutoRebalanceScore}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumBrowserTab
            currentGrade={exam.grade}
            currentSubject={exam.subject}
            currentSemester={exam.semester}
            onSelectLessonForExam={handleSelectLessonForExam}
            onAddLessonToSpec={handleAddLessonToSpec}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong>APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC</strong> • Chương trình GDPT 2018 (Sách Kết nối tri thức Lớp 1 - 5)
          </div>
          <div className="text-slate-400">
            {exam.header.administrativeLevel} • {exam.header.schoolName} • Năm học {exam.header.schoolYear}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewExamModal
        isOpen={isNewExamModalOpen}
        onClose={() => setIsNewExamModalOpen(false)}
        onApplyExam={(newExam) => {
          setExam(newExam);
          setActiveTab('preview');
        }}
        currentGrade={exam.grade}
        currentSubject={exam.subject}
        currentSemester={exam.semester}
      />

      <SchoolSettingsModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        header={exam.header}
        onSave={handleSaveSchoolHeader}
      />
    </div>
  );
}
