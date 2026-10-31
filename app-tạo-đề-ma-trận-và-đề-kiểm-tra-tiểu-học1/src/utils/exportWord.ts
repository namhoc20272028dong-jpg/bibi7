import { ExamData } from '../types/exam';

export function exportExamToWord(exam: ExamData) {
  const isLowerGrade = exam.grade <= 3;

  const questionsHtml = exam.questions.map((q) => {
    let optionsHtml = '';
    if (q.options && q.options.length > 0) {
      optionsHtml = `
        <div style="margin-left: 28px; margin-top: 4px; margin-bottom: 6px;">
          ${q.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return `<div style="margin-bottom: 3px; font-weight: normal;"><b>${letter}.</b> ${opt}</div>`;
          }).join('')}
        </div>
      `;
    } else if (q.trueFalseItems && q.trueFalseItems.length > 0) {
      optionsHtml = `
        <div style="margin-left: 28px; margin-top: 4px; margin-bottom: 6px;">
          ${q.trueFalseItems.map((item, idx) => {
            const letter = String.fromCharCode(97 + idx);
            return `<div style="margin-bottom: 4px;">${letter}) ${item.text} &nbsp;&nbsp;&nbsp; [ &nbsp; ]</div>`;
          }).join('')}
        </div>
      `;
    } else if (q.matchingPairs && q.matchingPairs.length > 0) {
      optionsHtml = `
        <div style="margin-left: 28px; margin-top: 4px; margin-bottom: 6px;">
          <table style="width: 80%; border-collapse: collapse; margin-top: 5px;">
            ${q.matchingPairs.map((p, idx) => `
              <tr>
                <td style="padding: 4px 8px; border: 1px dashed #666; width: 45%;"><b>${p.left}</b></td>
                <td style="padding: 4px 8px; text-align: center; width: 10%;">... nối ...</td>
                <td style="padding: 4px 8px; border: 1px dashed #666; width: 45%;">${p.right}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    } else if (q.fillBlankText) {
      optionsHtml = `
        <div style="margin-left: 28px; margin-top: 4px; margin-bottom: 6px; white-space: pre-line; line-height: 1.6;">
          ${q.fillBlankText}
        </div>
      `;
    }

    // Format: Câu 1 (0,5 điểm): Nội dung câu hỏi (chữ câu số in đậm, điểm in nghiêng liền kề, câu hỏi chữ thường)
    return `
      <div style="margin-bottom: 14px; font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.4;">
        <p style="margin: 0; text-indent: 0; text-align: justify;">
          <b>Câu ${q.order}</b> <i>(${q.score.toString().replace('.', ',')} điểm)</i>: <span>${q.prompt}</span>
        </p>
        ${optionsHtml}
      </div>
    `;
  }).join('');

  const answerKeyHtml = exam.questions.map((q) => {
    return `
      <tr>
        <td style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold; width: 10%;">Câu ${q.order}</td>
        <td style="border: 1px solid black; padding: 6px; text-align: center; width: 12%;">${q.score.toString().replace('.', ',')} đ</td>
        <td style="border: 1px solid black; padding: 6px; font-weight: bold; width: 20%; color: #b91c1c;">${q.correctAnswer}</td>
        <td style="border: 1px solid black; padding: 6px; text-align: justify;">${q.solution.replace(/\n/g, '<br/>')}</td>
      </tr>
    `;
  }).join('');

  const readingSectionHtml = exam.readingPassage ? `
    <div style="border: 1px solid #1e3a8a; padding: 12px; margin-bottom: 18px; border-radius: 4px; background-color: #f8fafc;">
      <h3 style="text-align: center; margin: 0 0 6px 0; font-size: 13.5pt; text-transform: uppercase; color: #1e3a8a;">${exam.readingPassage.title}</h3>
      <p style="text-align: justify; text-indent: 20px; line-height: 1.5; font-size: 12.5pt; margin: 0 0 8px 0; white-space: pre-line;">${exam.readingPassage.content}</p>
      <div style="text-align: right; font-style: italic; font-size: 11.5pt;">(${exam.readingPassage.author || 'Sưu tầm'} - Số lượng: ${exam.readingPassage.wordCount} chữ)</div>
    </div>
  ` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${exam.header.examTitle}</title>
      <style>
        @page {
          size: A4;
          margin: 1.8cm 1.8cm 1.8cm 2.0cm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          color: #000;
          line-height: 1.35;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        .header-table td {
          vertical-align: top;
          padding: 2px 4px;
        }
        .student-box {
          border: 1px solid black;
          padding: 8px 12px;
          margin-bottom: 14px;
          border-radius: 4px;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width: 45%; text-align: center;">
            <div style="font-size: 12pt;">${exam.header.administrativeLevel.toUpperCase()}</div>
            <div style="font-weight: bold; font-size: 12.5pt;">${exam.header.schoolName.toUpperCase()}</div>
            <div style="border-bottom: 1px solid black; width: 120px; margin: 3px auto 0 auto;"></div>
          </td>
          <td style="width: 55%; text-align: center;">
            <div style="font-weight: bold; font-size: 13pt;">${exam.header.examTitle}</div>
            <div style="font-weight: bold; font-size: 12.5pt;">NĂM HỌC ${exam.header.schoolYear}</div>
            <div style="font-size: 12pt;">MÔN: ${exam.subject.toUpperCase()} - LỚP ${exam.grade}</div>
            <div style="font-style: italic; font-size: 11.5pt;">(Thời gian làm bài: ${exam.header.durationMinutes} phút)</div>
          </td>
        </tr>
      </table>

      <div class="student-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 60%; padding: 3px 0;">Họ và tên học sinh: ..............................................................</td>
            <td style="width: 40%; padding: 3px 0;">Lớp: ..............</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">Trường: ${exam.header.schoolName}</td>
            <td style="padding: 3px 0;">Ngày kiểm tra: ..... / ..... / 202...</td>
          </tr>
        </table>
        <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-top: 8px;">
          <tr>
            <td style="border: 1px solid black; width: 30%; text-align: center; padding: 4px; font-weight: bold;">Điểm</td>
            <td style="border: 1px solid black; width: 70%; text-align: center; padding: 4px; font-weight: bold;">Nhận xét của thầy cô giáo</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; height: 50px;"></td>
            <td style="border: 1px solid black; height: 50px; font-size: 11pt; padding: 4px; vertical-align: top;">........................................................................................................<br/>........................................................................................................</td>
          </tr>
        </table>
      </div>

      ${readingSectionHtml}

      <div>
        ${questionsHtml}
      </div>

      <div style="text-align: center; margin-top: 20px; font-weight: bold; font-style: italic;">
        ---------- HẾT ----------<br/>
        <span style="font-weight: normal; font-size: 11.5pt;">(Cán bộ coi thi không giải thích gì thêm)</span>
      </div>

      <div class="page-break"></div>

      <!-- HƯỚNG DẪN CHẤM & ĐÁP ÁN -->
      <table class="header-table">
        <tr>
          <td style="width: 45%; text-align: center;">
            <div style="font-size: 12pt;">${exam.header.administrativeLevel.toUpperCase()}</div>
            <div style="font-weight: bold; font-size: 12.5pt;">${exam.header.schoolName.toUpperCase()}</div>
          </td>
          <td style="width: 55%; text-align: center;">
            <div style="font-weight: bold; font-size: 13pt;">HƯỚNG DẪN CHẤM & BIỂU ĐIỂM</div>
            <div style="font-weight: bold; font-size: 12pt;">${exam.header.examTitle} - NĂM HỌC ${exam.header.schoolYear}</div>
            <div style="font-size: 12pt;">MÔN: ${exam.subject.toUpperCase()} - LỚP ${exam.grade}</div>
          </td>
        </tr>
      </table>

      <h3 style="text-align: center; margin: 10px 0 14px 0; text-transform: uppercase;">ĐÁP ÁN VÀ THANG ĐIỂM CHI TIẾT (TỔNG: 10,0 ĐIỂM)</h3>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid black; padding: 6px; width: 10%;">Câu số</th>
            <th style="border: 1px solid black; padding: 6px; width: 12%;">Điểm</th>
            <th style="border: 1px solid black; padding: 6px; width: 20%;">Đáp án</th>
            <th style="border: 1px solid black; padding: 6px;">Hướng dẫn chấm chi tiết</th>
          </tr>
        </thead>
        <tbody>
          ${answerKeyHtml}
        </tbody>
      </table>

      ${exam.writingSection?.essayPrompt ? `
        <div style="margin-top: 18px; border: 1px solid #000; padding: 10px;">
          <b>Hướng dẫn chấm phần Viết văn (${exam.writingSection.essayPrompt.score} điểm):</b>
          <ul style="margin: 4px 0; padding-left: 20px;">
            <li><b>Mở bài (1,0 điểm):</b> Giới thiệu được sự vật, cây cối hoặc sự việc cần tả.</li>
            <li><b>Thân bài (4,0 - 5,0 điểm):</b> Tả chi tiết theo trình tự hợp lí, dùng từ ngữ gợi cảm, hình ảnh so sánh, nhân hóa sinh động.</li>
            <li><b>Kết bài (1,0 điểm):</b> Nêu được tình cảm, sự gắn bó hoặc bài học cho bản thân.</li>
            <li><b>Chính tả, chữ viết, dùng từ (1,0 điểm):</b> Chữ viết rõ ràng, không mắc quá 3 lỗi chính tả.</li>
          </ul>
        </div>
      ` : ''}

      <table style="width: 100%; margin-top: 35px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top;">
            <b>HIỆU TRƯỞNG / TỔ TRƯỞNG CHUYÊN MÔN</b><br/>
            <i>(Ký và ghi rõ họ tên)</i>
            <div style="height: 65px;"></div>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top;">
            <i>Chí Cà, ngày ...... tháng ...... năm 202...</i><br/>
            <b>NGƯỜI RA ĐỀ KIỂM TRA</b><br/>
            <i>(Ký và ghi rõ họ tên)</i>
            <div style="height: 65px;"></div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `De_Kiem_Tra_${exam.subject}_Lop${exam.grade}_${exam.header.schoolYear.replace(/\s+/g, '')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
