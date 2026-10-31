import { QuestionItem, SpecRow } from '../types/exam';

export function syncSpecWithQuestions(questions: QuestionItem[], currentSpecs: SpecRow[]): SpecRow[] {
  // Group questions by strand and topic
  const groups: Record<string, QuestionItem[]> = {};

  questions.forEach((q) => {
    const key = `${q.strand}:::${q.topic}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(q);
  });

  const keys = Object.keys(groups);
  if (keys.length === 0) return currentSpecs;

  const newSpecs: SpecRow[] = keys.map((key, idx) => {
    const [strand, topic] = key.split(':::');
    const items = groups[key];

    // Find existing spec row if any
    const existing = currentSpecs.find((s) => s.strand === strand && s.topic === topic);

    let tnNlcB = 0, tnNlcH = 0, tnNlcV = 0;
    let tnDsB = 0, tnDsH = 0, tnDsV = 0;
    let tnNoiB = 0, tnNoiH = 0, tnNoiV = 0;
    let tnDienB = 0, tnDienH = 0, tnDienV = 0;
    let tl1B = 0, tl1H = 0, tl1V = 0;
    let tl2B = 0, tl2H = 0, tl2V = 0;
    let tl3B = 0, tl3H = 0, tl3V = 0;

    let rowScore = 0;
    const qNums: string[] = [];

    items.forEach((item) => {
      rowScore += item.score;
      qNums.push(`Câu ${item.order}`);

      if (item.type === 'tn_nlc') {
        if (item.level === 'biet') tnNlcB++;
        else if (item.level === 'hieu') tnNlcH++;
        else tnNlcV++;
      } else if (item.type === 'tn_ds') {
        if (item.level === 'biet') tnDsB++;
        else if (item.level === 'hieu') tnDsH++;
        else tnDsV++;
      } else if (item.type === 'tn_noi') {
        if (item.level === 'biet') tnNoiB++;
        else if (item.level === 'hieu') tnNoiH++;
        else tnNoiV++;
      } else if (item.type === 'tn_dien') {
        if (item.level === 'biet') tnDienB++;
        else if (item.level === 'hieu') tnDienH++;
        else tnDienV++;
      } else if (item.type === 'tu_luan_1') {
        if (item.level === 'biet') tl1B++;
        else if (item.level === 'hieu') tl1H++;
        else tl1V++;
      } else if (item.type === 'tu_luan_2') {
        if (item.level === 'biet') tl2B++;
        else if (item.level === 'hieu') tl2H++;
        else tl2V++;
      } else if (item.type === 'tu_luan_3') {
        if (item.level === 'biet') tl3B++;
        else if (item.level === 'hieu') tl3H++;
        else tl3V++;
      }
    });

    const firstItem = items[0];

    return {
      id: idx + 1,
      strand: strand || 'Mạch kiến thức',
      topic: topic || 'Chủ đề kiến thức',
      requiredCompetencies:
        existing?.requiredCompetencies ||
        firstItem.requiredCompetency ||
        'Nhận biết, thông hiểu và vận dụng các kiến thức trọng tâm theo chuẩn GDPT 2018.',
      periods: existing?.periods || Math.max(4, items.length * 3),
      percentage: existing?.percentage || Math.round((items.length / questions.length) * 100),
      targetScore: existing?.targetScore || rowScore,
      tnNlc: { biet: tnNlcB, hieu: tnNlcH, vd: tnNlcV },
      tnDs: { biet: tnDsB, hieu: tnDsH, vd: tnDsV },
      tnNoi: { biet: tnNoiB, hieu: tnNoiH, vd: tnNoiV },
      tnDien: { biet: tnDienB, hieu: tnDienH, vd: tnDienV },
      tl1: { biet: tl1B, hieu: tl1H, vd: tl1V },
      tl2: { biet: tl2B, hieu: tl2H, vd: tl2V },
      tl3: { biet: tl3B, hieu: tl3H, vd: tl3V },
      totalQuestions: items.length,
      itemScore: rowScore,
      questionNumbers: qNums.join(', '),
    };
  });

  return newSpecs;
}
