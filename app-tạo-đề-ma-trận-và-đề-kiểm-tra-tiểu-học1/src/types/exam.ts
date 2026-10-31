export type Subject = 
  | 'Toán' 
  | 'Tiếng Việt' 
  | 'Tin học' 
  | 'Khoa học' 
  | 'Lịch sử & Địa lí' 
  | 'Công nghệ';

export type Grade = 1 | 2 | 3 | 4 | 5;

export type Semester = 
  | 'Giữa học kì 1' 
  | 'Cuối học kì 1' 
  | 'Giữa học kì 2' 
  | 'Cuối năm';

export type QuestionType = 
  | 'tn_nlc'      // Trắc nghiệm nhiều lựa chọn
  | 'tn_ds'       // Trắc nghiệm đúng sai
  | 'tn_noi'      // Trắc nghiệm nối cột
  | 'tn_dien'     // Trắc nghiệm điền khuyết
  | 'tu_luan_1'   // Tự luận mức 1 (0.5đ)
  | 'tu_luan_2'   // Tự luận mức 2 (1.0đ)
  | 'tu_luan_3';  // Tự luận mức 3 (1.0 - 2.0đ)

export type QuestionLevel = 'biet' | 'hieu' | 'vd';

export interface QuestionItem {
  id: string;
  order: number;
  type: QuestionType;
  level: QuestionLevel; // 'biet', 'hieu', 'vd' (Note: trắc nghiệm cannot be 'vd')
  score: number;
  prompt: string;
  options?: string[]; // 3 options for grade 1-3 (A, B, C), 4 options for grade 4-5 (A, B, C, D)
  matchingPairs?: { left: string; right: string }[];
  trueFalseItems?: { text: string; answer: boolean }[];
  fillBlankText?: string;
  correctAnswer: string;
  solution: string;
  strand: string; // Mạch kiến thức (VD: Số và phép tính, Hình học và đo lường)
  topic: string;  // Tên bài học / nội dung kiến thức
  requiredCompetency: string; // Yêu cầu cần đạt
}

export interface SpecRow {
  id: number;
  strand: string; // Mạch kiến thức
  topic: string;  // Nội dung/đơn vị kiến thức
  requiredCompetencies: string; // Yêu cầu cần đạt
  periods: number; // Số tiết
  percentage: number; // Tỉ lệ %
  targetScore: number; // Số điểm cần đạt
  tnNlc: { biet: number; hieu: number; vd: number };
  tnDs: { biet: number; hieu: number; vd: number };
  tnNoi: { biet: number; hieu: number; vd: number };
  tnDien: { biet: number; hieu: number; vd: number };
  tl1: { biet: number; hieu: number; vd: number };
  tl2: { biet: number; hieu: number; vd: number };
  tl3: { biet: number; hieu: number; vd: number };
  totalQuestions: number;
  itemScore: number;
  questionNumbers: string;
}

export interface ReadingPassage {
  title: string;
  content: string;
  author?: string;
  genre?: string;
  wordCount: number;
}

export interface WritingSection {
  listeningWriting?: {
    title: string;
    content: string;
    score: number;
  };
  essayPrompt?: {
    topic: string;
    requirement: string;
    score: number;
  };
}

export interface SchoolHeader {
  administrativeLevel: string; // UBND XÃ XÍN MẦN
  schoolName: string;          // TRƯỜNG PTDTBT TH CHÍ CÀ
  schoolYear: string;          // 2026 - 2027
  examTitle: string;           // ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I
  durationMinutes: number;     // 40
}

export interface ExamData {
  id: string;
  grade: Grade;
  subject: Subject;
  semester: Semester;
  header: SchoolHeader;
  questions: QuestionItem[];
  specRows: SpecRow[];
  readingPassage?: ReadingPassage;
  writingSection?: WritingSection;
  practicalTask?: {
    prompt: string;
    criteria: string;
    score: number;
  };
  createdAt: string;
}

export interface LessonInfo {
  id: string;
  grade: Grade;
  subject: Subject;
  semester: Semester;
  strand: string;
  lessonName: string;
  periods: number;
  coreKnowledge: string;
  competencyRequired: string; // Yêu cầu cần đạt
}
