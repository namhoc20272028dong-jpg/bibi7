import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI-assisted Exam & Matrix Generation
app.post('/api/ai/generate-exam', async (req: Request, res: Response) => {
  try {
    const { grade, subject, semester, topics, customPrompt, schoolInfo } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY found. Utilizing built-in expert curriculum generator.',
      });
    }

    const systemInstruction = `Bạn là chuyên gia ra đề thi tiểu học, am hiểu sâu sắc Chương trình GDPT 2018 bộ sách Kết nối tri thức với cuộc sống.
Quy định BẮT BUỘC:
1. Đề thi phải có đúng 10 câu (đối với Toán, KH, LS&ĐL, CN), tổng điểm 10 điểm. Đối với Tiếng Việt: Đọc hiểu 7 điểm (hoặc theo quy định lớp), Viết 10 điểm.
2. KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG. Trắc nghiệm chỉ ở mức Biết (M1) và Hiểu (M2). Mức Vận dụng (M3) chỉ dành cho Tự luận.
3. Trắc nghiệm nhiều lựa chọn:
   - Lớp 1, 2, 3: CHỈ CÓ 3 phương án (A, B, C).
   - Lớp 4, 5: CÓ 4 phương án (A, B, C, D).
4. Thứ tự câu trong đề: Xếp liên tục từ Câu 1 đến hết đề. KHÔNG ghi tiêu đề "Phần trắc nghiệm", "Phần tự luận".
   Thứ tự câu: Trắc nghiệm (Biết -> Hiểu) rồi đến Tự luận (Biết -> Hiểu -> Vận dụng).
   Trắc nghiệm: Biết NLC -> Biết ĐS -> Biết Nối cột -> Biết Điền khuyết -> Hiểu NLC -> Hiểu ĐS -> Hiểu Nối cột -> Hiểu Điền khuyết.
   Tự luận: Biết -> Hiểu -> Vận dụng.
5. Mỗi câu hỏi ứng với đúng 1 dòng trong Bản đặc tả.
6. Trả về đúng JSON theo cấu trúc yêu cầu.`;

    const userPrompt = `Hãy tạo một đề kiểm tra hoàn chỉnh kèm Ma trận và Bản đặc tả cho:
- Môn: ${subject || 'Toán'}
- Khối lớp: ${grade || 4}
- Kỳ kiểm tra: ${semester || 'Giữa học kì 1'}
- Các bài học/chủ đề trọng tâm: ${topics ? JSON.stringify(topics) : 'Toàn bộ kiến thức trọng tâm kỳ này của bộ sách Kết nối tri thức'}
- Yêu cầu bổ sung: ${customPrompt || 'Đúng chuẩn cấu trúc điểm, 10 câu 10 điểm, không lỗi'}.

Hãy phản hồi DUY NHẤT một chuỗi JSON hợp lệ với cấu trúc sau:
{
  "title": "ĐỀ KIỂM TRA ĐỊNH KÌ...",
  "timeMinutes": 40,
  "specificationTable": [
    {
      "id": 1,
      "strand": "Số và phép tính",
      "topic": "Tên bài/nội dung kiến thức",
      "requiredCompetencies": "Yêu cầu cần đạt chi tiết...",
      "periods": 12,
      "percentage": 25,
      "targetScore": 2.5,
      "tnNlc": {"biet": 1, "hieu": 0, "vd": 0},
      "tnDs": {"biet": 0, "hieu": 0, "vd": 0},
      "tnNoi": {"biet": 0, "hieu": 0, "vd": 0},
      "tnDien": {"biet": 0, "hieu": 0, "vd": 0},
      "tl1": {"biet": 0, "hieu": 0, "vd": 0},
      "tl2": {"biet": 0, "hieu": 1, "vd": 0},
      "tl3": {"biet": 0, "hieu": 0, "vd": 0},
      "questionNumbers": "Câu 1, Câu 7",
      "totalQuestions": 2,
      "itemScore": 2.5
    }
  ],
  "questions": [
    {
      "id": 1,
      "order": 1,
      "type": "tn_nlc",
      "level": "biet",
      "score": 0.5,
      "prompt": "Nội dung câu hỏi...",
      "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
      "correctAnswer": "A",
      "solution": "Hướng dẫn chấm hoặc giải thích...",
      "strand": "Số và phép tính",
      "topic": "Bài 1..."
    }
  ],
  "readingPassage": {
    "title": "Tiêu đề bài đọc (nếu là môn Tiếng Việt)",
    "content": "Nội dung bài đọc ngoài SGK đúng số chữ chuẩn...",
    "author": "Tên tác giả",
    "wordCount": 210
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Không nhận được nội dung từ AI');
    }

    const data = JSON.parse(text);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Gemini generate-exam error:', error);
    return res.status(500).json({
      error: error.message || 'Lỗi khi gọi AI Gemini',
      fallback: true,
    });
  }
});

// Endpoint: AI refine/generate single question
app.post('/api/ai/refine-question', async (req: Request, res: Response) => {
  try {
    const { grade, subject, currentQuestion, requirement } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const prompt = `Bạn là chuyên gia đề thi tiểu học GDPT 2018 (sách Kết nối tri thức).
Hãy tạo/tinh chỉnh một câu hỏi kiểm tra:
- Khối: Lớp ${grade}
- Môn: ${subject}
- Câu hỏi hiện tại (nếu có): ${JSON.stringify(currentQuestion || {})}
- Yêu cầu chỉnh sửa: ${requirement}
LƯU Ý QUAN TRỌNG:
- Lớp 1, 2, 3: Trắc nghiệm CHỈ CÓ 3 phương án A, B, C.
- Lớp 4, 5: Trắc nghiệm CÓ 4 phương án A, B, C, D.
- KHÔNG tạo trắc nghiệm ở mức Vận dụng (chỉ Biết hoặc Hiểu).
- Điểm: TN NLC 0.5đ, Đúng sai/Nối cột/Điền khuyết 0.25đ/ý, Tự luận M1: 0.5đ, M2: 1.0đ, M3: 1.0 - 2.0đ.

Trả về JSON:
{
  "type": "tn_nlc | tn_ds | tn_noi | tn_dien | tu_luan",
  "level": "biet | hieu | vd",
  "score": 0.5,
  "prompt": "Nội dung câu hỏi",
  "options": ["A...", "B...", "C..."],
  "correctAnswer": "A",
  "solution": "Lời giải chi tiết...",
  "strand": "Mạch kiến thức",
  "topic": "Bài học"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, question: parsed });
  } catch (err: any) {
    console.error('Refine question error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Generate reading passage for Vietnamese with strict word count
app.post('/api/ai/generate-passage', async (req: Request, res: Response) => {
  try {
    const { grade, genre, topic } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const wordLimits: Record<number, string> = {
      1: 'khoảng 90 – 130 chữ (truyện, miêu tả) hoặc thơ 50 – 70 chữ',
      2: 'truyện 180 – 200 chữ, miêu tả 150 – 180 chữ, thơ 70 – 90 chữ, thông tin 110 – 140 chữ',
      3: 'truyện 200 – 250 chữ, miêu tả 180 – 200 chữ, thơ 80 – 100 chữ, thông tin 120 – 150 chữ',
      4: 'truyện, kịch bản 280 – 330 chữ, miêu tả 200 – 250 chữ, thơ 100 – 120 chữ, thông tin 150 – 180 chữ',
      5: 'truyện, kịch bản 300 – 350 chữ, miêu tả 200 – 250 chữ, thơ 110 – 130 chữ, thông tin ~230 chữ',
    };

    const limitStr = wordLimits[grade] || 'khoảng 200 - 250 chữ';

    const prompt = `Viết một bài đọc hiểu ngoài sách giáo khoa cho học sinh Lớp ${grade} môn Tiếng Việt.
- Thể loại: ${genre || 'Truyện thiếu nhi'}
- Chủ đề: ${topic || 'Tình cảm gia đình, tình bạn, quê hương đất nước hoặc thiên nhiên tươi đẹp'}
- Độ dài quy định CHÍNH XÁC: ${limitStr}.
Văn phong trong sáng, giàu tính giáo dục nhân văn, câu văn gãy gọn phù hợp tâm lý lứa tuổi tiểu học.
Trả về JSON:
{
  "title": "Tên bài đọc",
  "content": "Nội dung toàn bộ bài đọc...",
  "author": "Tên tác giả hoặc Sưu tầm",
  "genre": "${genre}",
  "wordCount": 210,
  "mainLesson": "Ý nghĩa giáo dục..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, passage: parsed });
  } catch (err: any) {
    console.error('Generate passage error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
