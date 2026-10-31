import * as XLSX from 'xlsx';
import { ExamData, QuestionItem } from '../types/exam';

export function exportExamToExcel(exam: ExamData) {
  const wb = XLSX.utils.book_new();

  // ==========================================
  // SHEET 1: BẢN ĐẶC TẢ ĐỀ KIỂM TRA (EXACT FORMAT)
  // ==========================================
  const headerRow1 = [
    'TT',
    'Mạch kiến thức',
    'Nội dung/đơn vị kiến thức',
    'Yêu cầu cần đạt',
    'Số tiết',
    'Tỉ lệ (%)',
    'Số điểm cần đạt',
    'Trắc nghiệm', '', '', '', '', '', '', '', '', '', '', '', // 12 columns for TN
    'Tự luận', '', '', '', '', '', '', '', '', // 9 columns for TL
    'Tổng số câu/ý',
    'Điểm từng bài',
    'Câu số'
  ];

  const headerRow2 = [
    '', '', '', '', '', '', '',
    'Nhiều lựa chọn', '', '',
    'Đúng-Sai', '', '',
    'Nối cột', '', '',
    'Điền khuyết', '', '',
    'Tự luận 1', '', '',
    'Tự luận 2', '', '',
    'Tự luận 3', '', '',
    '', '', ''
  ];

  const headerRow3 = [
    '', '', '', '', '', '', '',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    'Biết', 'Hiểu', 'VD',
    '', '', ''
  ];

  const sheetData: any[][] = [];

  // Title rows
  sheetData.push([exam.header.administrativeLevel.toUpperCase()]);
  sheetData.push([exam.header.schoolName.toUpperCase()]);
  sheetData.push([`BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ - NĂM HỌC ${exam.header.schoolYear}`]);
  sheetData.push([`MÔN: ${exam.subject.toUpperCase()} - LỚP ${exam.grade} (${exam.semester.toUpperCase()})`]);
  sheetData.push([]); // blank

  // Header rows
  sheetData.push(headerRow1);
  sheetData.push(headerRow2);
  sheetData.push(headerRow3);

  // Rows from specRows
  let totalBiet = 0;
  let totalHieu = 0;
  let totalVd = 0;

  let sumTN_NLC_B = 0, sumTN_NLC_H = 0, sumTN_NLC_V = 0;
  let sumTN_DS_B = 0, sumTN_DS_H = 0, sumTN_DS_V = 0;
  let sumTN_NOI_B = 0, sumTN_NOI_H = 0, sumTN_NOI_V = 0;
  let sumTN_DIEN_B = 0, sumTN_DIEN_H = 0, sumTN_DIEN_V = 0;
  let sumTL1_B = 0, sumTL1_H = 0, sumTL1_V = 0;
  let sumTL2_B = 0, sumTL2_H = 0, sumTL2_V = 0;
  let sumTL3_B = 0, sumTL3_H = 0, sumTL3_V = 0;

  let totalQuestionsCount = 0;
  let totalScoreSum = 0;

  exam.specRows.forEach((row, idx) => {
    sumTN_NLC_B += row.tnNlc.biet;
    sumTN_NLC_H += row.tnNlc.hieu;
    sumTN_NLC_V += row.tnNlc.vd;

    sumTN_DS_B += row.tnDs.biet;
    sumTN_DS_H += row.tnDs.hieu;
    sumTN_DS_V += row.tnDs.vd;

    sumTN_NOI_B += row.tnNoi.biet;
    sumTN_NOI_H += row.tnNoi.hieu;
    sumTN_NOI_V += row.tnNoi.vd;

    sumTN_DIEN_B += row.tnDien.biet;
    sumTN_DIEN_H += row.tnDien.hieu;
    sumTN_DIEN_V += row.tnDien.vd;

    sumTL1_B += row.tl1.biet;
    sumTL1_H += row.tl1.hieu;
    sumTL1_V += row.tl1.vd;

    sumTL2_B += row.tl2.biet;
    sumTL2_H += row.tl2.hieu;
    sumTL2_V += row.tl2.vd;

    sumTL3_B += row.tl3.biet;
    sumTL3_H += row.tl3.hieu;
    sumTL3_V += row.tl3.vd;

    totalQuestionsCount += row.totalQuestions;
    totalScoreSum += row.itemScore;

    sheetData.push([
      idx + 1,
      row.strand,
      row.topic,
      row.requiredCompetencies,
      row.periods,
      row.percentage,
      row.targetScore,
      row.tnNlc.biet || '', row.tnNlc.hieu || '', row.tnNlc.vd || '',
      row.tnDs.biet || '', row.tnDs.hieu || '', row.tnDs.vd || '',
      row.tnNoi.biet || '', row.tnNoi.hieu || '', row.tnNoi.vd || '',
      row.tnDien.biet || '', row.tnDien.hieu || '', row.tnDien.vd || '',
      row.tl1.biet || '', row.tl1.hieu || '', row.tl1.vd || '',
      row.tl2.biet || '', row.tl2.hieu || '', row.tl2.vd || '',
      row.tl3.biet || '', row.tl3.hieu || '', row.tl3.vd || '',
      row.totalQuestions,
      row.itemScore.toFixed(1).replace('.', ','),
      row.questionNumbers
    ]);
  });

  // Calculate scores per level from questions
  let scoreBiet = 0;
  let scoreHieu = 0;
  let scoreVd = 0;
  let countBiet = 0;
  let countHieu = 0;
  let countVd = 0;

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

  // Dòng: Tổng số câu
  sheetData.push([
    'Tổng số câu', '', '', '', '', '', '',
    sumTN_NLC_B, sumTN_NLC_H, sumTN_NLC_V,
    sumTN_DS_B, sumTN_DS_H, sumTN_DS_V,
    sumTN_NOI_B, sumTN_NOI_H, sumTN_NOI_V,
    sumTN_DIEN_B, sumTN_DIEN_H, sumTN_DIEN_V,
    sumTL1_B, sumTL1_H, sumTL1_V,
    sumTL2_B, sumTL2_H, sumTL2_V,
    sumTL3_B, sumTL3_H, sumTL3_V,
    exam.questions.length,
    totalExamScore.toFixed(1).replace('.', ','),
    ''
  ]);

  // Dòng: Điểm từng mức độ
  const ptTN_NLC_B = sumTN_NLC_B * 0.5;
  const ptTN_NLC_H = sumTN_NLC_H * 0.5;
  const ptTN_DS_B = sumTN_DS_B * 0.25;
  const ptTN_DS_H = sumTN_DS_H * 0.25;
  const ptTN_NOI_B = sumTN_NOI_B * 0.25;
  const ptTN_NOI_H = sumTN_NOI_H * 0.25;
  const ptTN_DIEN_B = sumTN_DIEN_B * 0.25;
  const ptTN_DIEN_H = sumTN_DIEN_H * 0.25;
  const ptTL1_B = sumTL1_B * 0.5;
  const ptTL2_H = sumTL2_H * 1.0;
  const ptTL3_V = scoreVd;

  sheetData.push([
    'Điểm từng mức độ', '', '', '', '', '', '',
    ptTN_NLC_B || 0, ptTN_NLC_H || 0, 0,
    ptTN_DS_B || 0, ptTN_DS_H || 0, 0,
    ptTN_NOI_B || 0, ptTN_NOI_H || 0, 0,
    ptTN_DIEN_B || 0, ptTN_DIEN_H || 0, 0,
    ptTL1_B || 0, 0, 0,
    0, ptTL2_H || 0, 0,
    0, 0, ptTL3_V || 0,
    '',
    totalExamScore.toFixed(1).replace('.', ','),
    ''
  ]);

  // Dòng: Tỉ lệ %
  sheetData.push([
    'Tỉ lệ (%)', '', '', '', '', '', '',
    Math.round(((ptTN_NLC_B + ptTN_NLC_H) / totalExamScore) * 100) + '%', '', '',
    Math.round(((ptTN_DS_B + ptTN_DS_H) / totalExamScore) * 100) + '%', '', '',
    Math.round(((ptTN_NOI_B + ptTN_NOI_H) / totalExamScore) * 100) + '%', '', '',
    Math.round(((ptTN_DIEN_B + ptTN_DIEN_H) / totalExamScore) * 100) + '%', '', '',
    Math.round((ptTL1_B / totalExamScore) * 100) + '%', '', '',
    Math.round((ptTL2_H / totalExamScore) * 100) + '%', '', '',
    Math.round((ptTL3_V / totalExamScore) * 100) + '%', '', '',
    '100%',
    '',
    ''
  ]);

  // Thống kê chi tiết & Quy định điểm (theo mẫu yêu cầu)
  sheetData.push([]);
  sheetData.push(['', '', 'QUY ĐỊNH ĐIỂM TỪNG DẠNG CÂU HỎI:', '']);
  sheetData.push(['', '', 'Điểm 1 câu nhiều lựa chọn:', '0,5 điểm / câu']);
  sheetData.push(['', '', 'Điểm 1 câu đúng sai:', '0,25 điểm / ý']);
  sheetData.push(['', '', 'Điểm 1 câu nối cột:', '0,25 điểm / ý']);
  sheetData.push(['', '', 'Điểm 1 câu điền khuyết:', '0,25 điểm / ý']);
  sheetData.push(['', '', 'Điểm 1 câu tự luận 1 (Mức 1):', '0,5 điểm / ý hoặc câu']);
  sheetData.push(['', '', 'Điểm 1 câu tự luận 2 (Mức 2):', '1,0 điểm / câu']);
  sheetData.push(['', '', 'Điểm 1 câu tự luận 3 (Mức 3):', '1,0 – 3,0 điểm / câu']);
  sheetData.push([]);

  // Bảng thống kê mức độ đánh giá:
  sheetData.push(['', '', 'THỐNG KÊ MỨC ĐỘ ĐÁNH GIÁ (GDPT 2018):', '', '']);
  sheetData.push(['', '', 'Mức độ đánh giá', 'Mức 1 (Biết)', 'Mức 2 (Hiểu)', 'Mức 3 (Vận dụng)', 'Tổng cộng']);
  sheetData.push(['', '', 'Số câu / ý', countBiet, countHieu, countVd, exam.questions.length]);
  sheetData.push(['', '', 'Điểm từng phần', `${scoreBiet.toFixed(1).replace('.', ',')} đ`, `${scoreHieu.toFixed(1).replace('.', ',')} đ`, `${scoreVd.toFixed(1).replace('.', ',')} đ`, `${totalExamScore.toFixed(1).replace('.', ',')} đ`]);
  sheetData.push(['', '', 'Tỉ lệ (%)', `${pctBiet}%`, `${pctHieu}%`, `${pctVd}%`, '100%']);

  const ws1 = XLSX.utils.aoa_to_sheet(sheetData);

  // Set column widths
  ws1['!cols'] = [
    { wch: 6 },  // TT
    { wch: 22 }, // Mạch kiến thức
    { wch: 28 }, // Nội dung kiến thức
    { wch: 38 }, // YCCĐ
    { wch: 8 },  // Số tiết
    { wch: 9 },  // Tỉ lệ
    { wch: 14 }, // Số điểm cần đạt
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // NLC
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // ĐS
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // Nối
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // Điền
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // TL1
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // TL2
    { wch: 6 }, { wch: 6 }, { wch: 6 }, // TL3
    { wch: 14 }, // Tổng câu
    { wch: 14 }, // Điểm từng bài
    { wch: 16 }  // Câu số
  ];

  XLSX.utils.book_append_sheet(wb, ws1, 'Ban_Dac_Ta');

  // ==========================================
  // SHEET 2: NỘI DUNG ĐỀ THI & HƯỚNG DẪN CHẤM
  // ==========================================
  const examSheetData: any[][] = [];
  examSheetData.push([exam.header.administrativeLevel.toUpperCase(), '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM']);
  examSheetData.push([exam.header.schoolName.toUpperCase(), '', '', 'Độc lập - Tự do - Hạnh phúc']);
  examSheetData.push([exam.header.examTitle]);
  examSheetData.push([`NĂM HỌC: ${exam.header.schoolYear} - MÔN: ${exam.subject.toUpperCase()} LỚP ${exam.grade}`]);
  examSheetData.push([`(Thời gian làm bài: ${exam.header.durationMinutes} phút)`]);
  examSheetData.push([]);

  if (exam.readingPassage) {
    examSheetData.push(['I. BÀI ĐỌC HIỂU:']);
    examSheetData.push([exam.readingPassage.title.toUpperCase()]);
    examSheetData.push([exam.readingPassage.content]);
    examSheetData.push([`(${exam.readingPassage.author || 'Sưu tầm'} - Số lượng: ${exam.readingPassage.wordCount} chữ)`]);
    examSheetData.push([]);
  }

  examSheetData.push(['II. CÁC CÂU HỎI KIỂM TRA (Sắp xếp từ Trắc nghiệm đến Tự luận):']);
  examSheetData.push([]);

  exam.questions.forEach((q) => {
    examSheetData.push([
      `Câu ${q.order} (${q.score.toString().replace('.', ',')} điểm):`,
      q.prompt,
      `[Mạch: ${q.strand} - ${q.level.toUpperCase()}]`
    ]);

    if (q.options && q.options.length > 0) {
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        examSheetData.push(['', `   ${letter}. ${opt}`]);
      });
    }

    if (q.trueFalseItems) {
      q.trueFalseItems.forEach((item, iIdx) => {
        const letter = String.fromCharCode(97 + iIdx);
        examSheetData.push(['', `   ${letter}) ${item.text}`]);
      });
    }

    if (q.matchingPairs) {
      q.matchingPairs.forEach((pair) => {
        examSheetData.push(['', `   ${pair.left}  ----->  ${pair.right}`]);
      });
    }

    if (q.fillBlankText) {
      examSheetData.push(['', `   ${q.fillBlankText}`]);
    }

    examSheetData.push(['', `>>> ĐÁP ÁN: ${q.correctAnswer}`]);
    examSheetData.push(['', `>>> HƯỚNG DẪN CHẤM: ${q.solution}`]);
    examSheetData.push([]);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(examSheetData);
  ws2['!cols'] = [{ wch: 18 }, { wch: 60 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'De_Thi_Va_Dap_An');

  // Trigger file download
  const fileName = `Ban_Dac_Ta_De_Kiem_Tra_${exam.subject}_Lop${exam.grade}_${exam.header.schoolYear.replace(/\s+/g, '')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
