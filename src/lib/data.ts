// 모든 데이터는 프로토타입용 예시(mock)입니다. 실제 인물·기관·수치가 아닙니다.
export const STAGES = ["접수", "공개 기준 검토", "카드 공론장", "시민 합의안", "함께하기·실행팀", "공동 실행실", "결과 공개"] as const;
export type Stage = (typeof STAGES)[number];
export type Category = "주거" | "경제" | "환경" | "교통·안전" | "복지";
export const CATEGORIES: Category[] = ["주거", "경제", "환경", "교통·안전", "복지"];

export interface Statement { id: number; text: string; groupA: number; groupB: number }
export interface Agreement { number: string; title: string; preamble: string; articles: [string, string][]; minority: string; supporters: number; team: number; goal: number; roles: string[] }
export interface Room { goal: string; criteria: string; tasks: { date: string; title: string; owner: string; done: boolean }[]; decisions: string[]; minority: string; resources: string; risks: string[]; sources: string; next: string; partner: string; members: number }
export interface Result { date: string; before: [string, string]; after: [string, string]; stats: [string, string][]; problem: string; activities: string; limits: string; minority: string; responses: string[]; unfinished: string; history: string[] }
export interface Issue {
  id: string; category: Category; emoji: string; title: string; summary: string; background: string; affected: string;
  known: string[]; unknown: string[]; opposition: string; nextDecision: string;
  consensus: number; participants: number; stage: Stage; region: string; needs: string; updated: string; proposer: string;
  gradient: string; history: string[]; statements: Statement[]; agreement?: Agreement; room?: Room; result?: Result;
}

// 결정적(deterministic) 의사 난수 — 빌드마다 같은 예시 값
function seeded(seed: number) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
function mkStatements(texts: string[], seed: number, pairs?: [number, number][]): Statement[] {
  const r = seeded(seed);
  return texts.map((text, i) => {
    if (pairs) return { id: i + 1, text, groupA: pairs[i][0], groupB: pairs[i][1] };
    const a = Math.round(35 + r() * 60); const b = Math.round(Math.max(10, Math.min(97, a + (r() - 0.5) * 70)));
    return { id: i + 1, text, groupA: a, groupB: b };
  });
}
const APT = [
  "100세대 이상 공동주택은 항목별 지출 영수증을 스캔하여 온라인에 30일 이내 게시해야 한다.", "관리비 공개는 개인정보(세대별 체납 등)를 제외하고 이루어져야 한다.",
  "공개 포맷은 지자체가 정한 표준 양식으로 통일해야 한다.", "입주자대표회의 회의록도 함께 공개해야 한다.", "공개 의무 위반 시 과태료를 부과해야 한다.",
  "소규모 단지는 공개 비용을 지자체가 지원해야 한다.", "관리업체 계약서 전문을 공개해야 한다.", "공개는 단지 내부 입주민에게만 허용해야 한다.",
  "장기수선충당금 사용 내역은 분기별로 공개해야 한다.", "입주민 누구나 이의제기를 온라인으로 접수할 수 있어야 한다.", "관리사무소 직원 인건비 세부 내역도 공개해야 한다.",
  "공개 의무는 3년 유예 후 시행해야 한다.", "외부 회계감사 주기를 매년으로 단축해야 한다.", "공개 자료는 기계가 읽을 수 있는 형식(CSV 등)으로 제공해야 한다.",
  "공개 플랫폼은 기존 공동주택관리정보시스템을 활용해야 한다.", "과도한 공개는 관리 인력의 업무 부담을 키운다.", "공사·용역 입찰 과정 전체를 공개해야 한다.",
  "이의제기가 많은 항목은 자동으로 감사 대상이 되어야 한다.", "공개 관련 교육을 입주민 대표에게 의무화해야 한다.", "제도 시행 1년 후 효과를 시민이 다시 평가해야 한다.",
];
const APT_P: [number, number][] = [[91,82],[95,90],[88,79],[76,58],[70,41],[83,77],[64,38],[22,61],[86,80],[90,85],[58,30],[35,62],[79,76],[81,72],[77,80],[30,68],[85,63],[74,52],[69,71],[92,88]];
const T = (done: number, list: [string, string, string][]) => list.map(([date, title, owner], i) => ({ date, title, owner, done: i < done }));

export const ISSUES: Issue[] = [
  { id: "apt-fee", category: "주거", emoji: "🏢", title: "아파트 관리비 내역 상시 온라인 공개", summary: "항목별 지출 영수증을 누구나 볼 수 있게",
    background: "외부 감사 결과만 형식적으로 공유되어 입주민 불신이 커지고 있습니다.", affected: "○○구 공동주택 입주민 약 4만 세대(예시), 관리사무소, 입주자대표회의",
    known: ["시범 단지 3곳 공개 현황 조사 완료 [출처: 참여자 조사 기록]"], unknown: ["단지별 공개 비용 (회계 전문가 검토 필요)"], opposition: "관리 인력 업무 부담 증가 우려", nextDecision: "실행팀 구성 완료 여부 · 10.31",
    consensus: 84, participants: 3420, stage: "함께하기·실행팀", region: "○○구", needs: "실행팀 20명 · 회계 검토 1명", updated: "10.10", proposer: "느티나무", gradient: "from-amber-500 via-orange-600 to-rose-700",
    history: ["10.02 카드 공론장 → 시민 합의안 · 양 그룹 75%↑ 문장 9개", "09.08 공개 기준 검토 통과 · 운영자 A", "09.01 접수"],
    statements: mkStatements(APT, 1, APT_P),
    agreement: { number: "시민 합의안 2026-04", title: "아파트 관리비 투명 공개를 위한 시민 합의안",
      preamble: "이 합의안은 카드 공론장에서 서로 다른 입장의 두 그룹이 모두 75% 이상 동의한 문장을 바탕으로 정리되었다. 우리는 공동주택 관리의 투명성이 공동체 신뢰의 기초임을 확인하고, 다음을 함께 실행·제안하기로 한다.",
      articles: [["1. 영수증 디지털 공개", "100세대 이상 공동주택이 항목별 지출 영수증을 30일 이내 온라인에 게시하도록 관리 주체와 지자체에 제안한다. 세대별 개인정보는 제외한다."], ["2. 표준 양식", "기계 판독 가능한 표준 공개 양식을 시민 실행팀이 초안으로 만들어 지자체에 전달한다."], ["3. 이의제기 경로", "입주민이 온라인으로 이의를 제기하고 14일 이내 답변을 받는 절차를 시범 단지에서 실험한다."], ["4. 재평가", "시행 1년 후 공론장에서 효과를 다시 평가한다."]],
      minority: "“과도한 공개는 관리 인력 부담을 키운다” — A그룹 30%, B그룹 68%. 합의에 이르지 못했으나 실행 단계에서 업무 부담 측정을 포함하기로 함.",
      supporters: 3892, team: 214, goal: 5000, roles: ["🔎 단지 현장 조사", "🧾 표준 양식 만들기", "⚖️ 회계 검토", "📣 이웃에게 알리기"] },
    room: { goal: "6주 안에 시범 단지 3곳 공개 실태 조사 후 표준 양식 초안을 지자체에 전달", criteria: "조사 원자료 공개 + 양식 초안 1건 전달", members: 214, partner: "○○구청 공동주택과 — 협의 중 (공식 협력 아님)",
      tasks: T(1, [["10.20", "조사 양식 확정", "느티나무"], ["10.27", "시범 단지 3곳 현장 조사", "조사팀"], ["11.03", "공개 회의 · 양식 초안 검토", "전체"], ["11.17", "표준 양식 초안 지자체 전달", "양식팀"]]),
      decisions: ["10.12 조사 대상 단지 선정 기준 결정 (참석 9, 합의)"], minority: "소규모 단지도 포함해야 함 → 2차 조사에서 검토", resources: "회의실 2회(현물) · 회계 검토 4시간 · 현금 0원", risks: ["관리업체 반발 가능 → 의견 청취 세션", "김○○: 관련 용역 이력 없음 (자기 신고)"], sources: "공동주택관리법 관련 조항 · 조사 원자료(공개 시트, 예시)", next: "현장 조사 3곳 완료 + 원자료 공개" } },
  { id: "night-bus", category: "교통·안전", emoji: "🚌", title: "심야 버스 배차 간격 조정", summary: "밤 12시 이후 귀가길 배차를 늘릴 수 있을까",
    background: "심야 귀가 수요 대비 배차가 부족해 대기 시간이 길고 안전 문제가 반복됩니다.", affected: "□□시 심야 귀가 시민, 교대 근무자, 운수 종사자",
    known: ["주요 정류장 3곳 평균 대기 23분 관찰 [출처: 참여자 관찰]"], unknown: ["노선별 실제 승차 데이터 (정보공개청구 예정)"], opposition: "운수 종사자 야간 근무 부담, 재정 소요", nextDecision: "카드 공론장 마감 · 10.25",
    consensus: 61, participants: 1890, stage: "카드 공론장", region: "□□시", needs: "데이터 분석 2명", updated: "10.11", proposer: "새벽별", gradient: "from-indigo-500 via-violet-700 to-slate-900",
    history: ["09.25 공개 기준 검토 통과 → 카드 공론장 개설", "09.20 접수"],
    statements: mkStatements(["자정 이후 주요 노선 배차 간격을 20분 이내로 줄여야 한다.", "배차 확대 비용은 심야 할증 요금으로 일부 충당할 수 있다.", "운수 종사자의 야간 근무 여건 개선이 먼저다.", "수요응답형 버스를 시범 도입해야 한다.", "승차 데이터를 공개해 노선을 시민과 함께 정해야 한다.", "심야 택시 공급 확대가 더 효과적이다.", "정류장 조명과 안전 시설을 함께 개선해야 한다.", "주말에만 우선 시범 운영해야 한다."], 2) },
  { id: "school-road", category: "환경", emoji: "🌳", title: "통학로 그늘길 조성", summary: "폭염 속 통학길에 그늘과 쉼터를",
    background: "여름철 통학로 표면 온도가 50℃를 넘는 구간이 늘고 있습니다.", affected: "○○구 초등학생과 보호자, 인근 상인",
    known: ["8월 표면 온도 측정 12지점 [출처: 참여자 측정]"], unknown: ["가로수 식재 가능 폭과 지하 매설물"], opposition: "상가 간판 가림, 낙엽 관리 부담", nextDecision: "카드 공론장 마감 · 10.20",
    consensus: 78, participants: 2210, stage: "카드 공론장", region: "○○구", needs: "조경 전문성 · 공간", updated: "10.09", proposer: "은행잎", gradient: "from-emerald-500 via-teal-700 to-slate-900",
    history: ["09.15 카드 공론장 개설", "09.10 접수"],
    statements: mkStatements(["통학로 300m 구간에 가로수를 우선 심어야 한다.", "그늘막보다 가로수가 장기적으로 낫다.", "상인 의견을 반영해 수종과 위치를 정해야 한다.", "쿨링포그 설치를 함께 검토해야 한다.", "학부모·학생이 직접 온도 측정에 참여해야 한다.", "예산이 부족하면 그늘막부터 설치해야 한다."], 3) },
  { id: "local-store", category: "경제", emoji: "🛒", title: "골목상권 지역화폐 캐시백 기준 개편", summary: "소상공인 매출에 실제로 도움이 되는 방식은?",
    background: "캐시백 혜택이 대형 프랜차이즈에 쏠린다는 지적이 있습니다.", affected: "△△시 소상공인, 지역화폐 이용 시민",
    known: ["가맹점 업종별 결제 비중 공개 자료 확인"], unknown: ["캐시백 조정 시 매출 변화 추정"], opposition: "이용자 혜택 축소 우려", nextDecision: "공개 기준 검토 결과 · 10.15",
    consensus: 0, participants: 340, stage: "공개 기준 검토", region: "△△시", needs: "의견 모으는 중", updated: "10.08", proposer: "골목지기", gradient: "from-yellow-500 via-amber-600 to-stone-800",
    history: ["10.08 공개 기준 검토 시작 · 운영자 B", "10.01 접수"], statements: [] },
  { id: "jeonse", category: "주거", emoji: "🔑", title: "청년 전세 계약 전 위험 신호 체크", summary: "계약 전에 위험 신호를 함께 확인할 수 있게",
    background: "선순위 채권·체납 정보를 계약 전에 확인하기 어렵습니다.", affected: "○○구 청년 임차인, 공인중개사",
    known: ["피해 상담 사례 유형 분류 40건 [출처: 협력 상담소 공개 자료]"], unknown: ["계약 전 확인 절차의 실제 이용률"], opposition: "중개업계 업무 부담", nextDecision: "체크리스트 시범 배포 · 11.01",
    consensus: 88, participants: 2780, stage: "공동 실행실", region: "○○구", needs: "현장 조사 4명 · 법률 검토 1명", updated: "10.10", proposer: "새싹", gradient: "from-fuchsia-600 via-purple-800 to-slate-900",
    history: ["10.01 함께하기 → 공동 실행실 · 실행팀 120명", "09.20 시민 합의안 정리", "09.05 접수"],
    statements: mkStatements(["계약 전 확인할 체크리스트를 공개해야 한다.", "선순위 채권 정보를 쉽게 볼 수 있어야 한다.", "청년 대상 무료 상담을 늘려야 한다.", "중개사가 위험 정보를 설명하도록 권고해야 한다.", "보증보험 가입 안내를 강화해야 한다."], 5),
    agreement: { number: "시민 합의안 2026-03", title: "청년 전세 피해 예방을 위한 시민 합의안", preamble: "카드 공론장 참여자들이 공통으로 동의한 내용을 바탕으로, 계약 전 위험 신호를 시민이 함께 점검하는 도구를 만들기로 한다.",
      articles: [["1. 계약 전 체크리스트", "선순위 채권, 체납, 보증보험 가능 여부를 점검하는 쉬운 체크리스트를 만들어 공개한다."], ["2. 상담 연결", "지역 상담 기관 정보를 한곳에 모아 안내한다."], ["3. 효과 확인", "3개월 후 체크리스트 이용 경험을 조사해 공개한다."]],
      minority: "“중개사 설명 의무를 법으로 강제해야 한다” — 합의에 이르지 못해 기록으로 남김.", supporters: 2140, team: 120, goal: 3000, roles: ["🔎 사례 조사", "🧾 체크리스트 작성", "⚖️ 법률 검토", "📣 알리기"] },
    room: { goal: "4주 안에 계약 전 체크리스트 v1 공개 후 청년 50명 사용성 테스트", criteria: "체크리스트 공개 + 사용성 테스트 결과 공개", members: 120, partner: "○○구 청년센터 — 협의 중 (공식 협력 아님)",
      tasks: T(2, [["10.05", "피해 사례 유형 정리", "새싹"], ["10.12", "체크리스트 초안", "작성팀"], ["10.19", "법률 검토", "법률팀"], ["11.01", "시범 배포 · 사용성 테스트", "전체"]]),
      decisions: ["10.05 체크리스트는 1페이지로 제한 (참석 11, 합의)"], minority: "영문판도 함께 만들어야 함 → v2에서 검토", resources: "상담소 자료 제공(현물) · 법률 검토 6시간 · 현금 0원", risks: ["특정 업체 홍보로 오해 소지 → 업체명 표기 금지"], sources: "주택임대차보호법 관련 조항 · 상담 사례 요약(비식별)", next: "법률 검토 반영 후 v1 공개" } },
  { id: "plastic", category: "환경", emoji: "♻️", title: "배달용기 다회용 전환 동네 실험", summary: "동네 단위 다회용기 순환 실험",
    background: "배달 일회용기 배출량이 해마다 늘고 있습니다.", affected: "○○구 주민, 배달 음식점", known: ["주 1회 재활용 배출량 관찰"], unknown: ["음식점 참여 의향"], opposition: "세척·회수 비용", nextDecision: "공개 기준 검토 · 10.14",
    consensus: 0, participants: 120, stage: "접수", region: "○○구", needs: "의견 모으는 중", updated: "10.07", proposer: "바다", gradient: "from-lime-500 via-green-700 to-slate-900", history: ["10.07 접수"], statements: [] },
  { id: "night-light", category: "교통·안전", emoji: "💡", title: "어두운 통학로에 불을 켜기", summary: "야간 조도 조사로 보안등 설치 검토를 이끌어냈어요",
    background: "○○동 통학로 일부 구간이 밤에 너무 어둡다는 제보가 이어졌습니다.", affected: "○○동 학생과 야간 귀가 주민", known: ["조도 측정 42지점 [출처: 공개 원자료]"], unknown: ["사유지 구간 소유자 협의 가능성"], opposition: "CCTV가 우선이라는 의견", nextDecision: "12월 설치 이행 재확인",
    consensus: 91, participants: 640, stage: "결과 공개", region: "○○구", needs: "후속 의제 참여자", updated: "10.04", proposer: "반딧불", gradient: "from-amber-400 via-orange-600 to-stone-900",
    history: ["10.04 결과 정정: 측정 지점 40→42 · 운영자 B", "10.02 결과 공개 · 운영자 A", "08.20 공동 실행 시작", "08.01 접수"],
    statements: mkStatements(["어두운 구간을 시민이 직접 측정해야 한다.", "보안등 설치를 우선 요청해야 한다.", "측정 원자료를 공개해야 한다.", "CCTV 설치를 먼저 해야 한다."], 7, [[94, 90], [88, 86], [96, 93], [35, 52]]),
    agreement: { number: "시민 합의안 2026-02", title: "야간 통학로 조도 개선을 위한 시민 합의안", preamble: "참여자들은 측정 가능한 근거를 먼저 모으고 그 결과를 공개해 개선을 요청하기로 합의했다.", articles: [["1. 시민 조도 측정", "통학로 전 구간 조도를 3회 측정하고 원자료를 공개한다."], ["2. 개선 요청", "기준 미달 지점 목록과 함께 구청에 개선을 요청한다."]], minority: "“CCTV가 우선” — 후속 논의 의제로 기록.", supporters: 812, team: 9, goal: 500, roles: ["🔎 측정", "🧾 정리"] },
    room: { goal: "2주 안에 조도 측정 3회, 개선안 전달", criteria: "원자료 공개 + 구청 전달", members: 9, partner: "□□대학교 연구실 — 장비 지원(현물)", tasks: T(4, [["08.20", "측정 지점 선정", "반딧불"], ["08.27", "1차 측정", "측정팀"], ["09.10", "3차 측정 완료", "측정팀"], ["09.20", "구청 전달", "전체"]]), decisions: ["08.20 측정 시간 21시 통일 (합의)"], minority: "주말도 측정해야 함 → 한계로 기록", resources: "조도계 대여(현물) · 38시간 · 현금 0원", risks: ["대학 연구실: 관련 용역 없음 (자기 신고)"], sources: "KS 조도 기준 · 원자료 시트", next: "완료" },
    result: { date: "10.02", before: ["11곳", "기준 미달 지점"], after: ["5곳", "연내 보안등 설치 검토"], stats: [["9", "참여 시민"], ["38h", "투입 시간"], ["0원", "현금 지출"]], problem: "야간 통학로 어두운 구간 파악, 개선 요청", activities: "조도 측정 3회(42지점), 주민 의견 수렴 1회", limits: "측정 2주, 날씨 영향 미보정 · 참여자는 주민 전체를 대표하지 않음", minority: "“보안등보다 CCTV가 우선” (참여자 2명) — 후속 논의 의제로 기록", responses: ["09.20 구청에 개선안 전달", "09.30 답변: 5곳 연내 보안등 설치 검토", "12월 설치 이행 여부 재확인 예정"], unfinished: "6곳은 사유지 → 소유자 협의를 후속 의제로 등록", history: ["10.04 측정 지점 수 정정 (40→42) · 사유: 원자료 재확인 · 운영자 B", "10.02 결과 공개 · 운영자 A"] } },
  { id: "braille", category: "복지", emoji: "♿", title: "공원 화장실 점자 안내", summary: "시각장애인 이용자와 함께 접근성을 점검했어요",
    background: "공원 화장실에 점자 안내가 없어 혼자 이용하기 어렵다는 제보가 있었습니다.", affected: "△△시 시각장애인 이용자와 보호자", known: ["공원 4곳 화장실 점검"], unknown: ["다른 공원 현황"], opposition: "예산 우선순위 논란", nextDecision: "다른 공원 확대 여부",
    consensus: 95, participants: 210, stage: "결과 공개", region: "△△시", needs: "확대 점검 참여자", updated: "09.28", proposer: "손끝", gradient: "from-sky-500 via-blue-800 to-slate-900",
    history: ["09.28 결과 공개 · 운영자 A", "08.10 접수"],
    statements: mkStatements(["당사자가 직접 점검에 참여해야 한다.", "점자 안내를 우선 설치해야 한다.", "음성 안내도 함께 검토해야 한다."], 8, [[97, 95], [93, 92], [80, 77]]),
    agreement: { number: "시민 합의안 2026-01", title: "공원 화장실 접근성 개선 시민 합의안", preamble: "당사자와 함께 점검하고, 결과를 근거로 개선을 요청하기로 합의했다.", articles: [["1. 당사자 참여 점검", "시각장애인 이용자와 함께 공원 4곳을 점검한다."], ["2. 개선 요청", "점검 결과와 함께 점자 안내 설치를 요청한다."]], minority: "“음성 안내가 더 시급” — 2차 과제로 기록.", supporters: 420, team: 6, goal: 300, roles: ["🔎 점검 동행", "🧾 정리"] },
    room: { goal: "공원 4곳 점검 후 개선 요청", criteria: "점검표 공개 + 요청 전달", members: 6, partner: "△△시 공원과 — 답변 수령", tasks: T(3, [["08.15", "점검표 작성", "손끝"], ["08.22", "현장 점검", "점검팀"], ["09.01", "요청 전달", "전체"]]), decisions: ["08.15 당사자 2인 이상 동행 원칙 (합의)"], minority: "음성 안내 우선 → 2차 과제", resources: "점검 12시간 · 현금 0원", risks: ["없음 (자기 신고)"], sources: "장애인등편의법 관련 기준", next: "완료" },
    result: { date: "09.28", before: ["0개", "점자 안내"], after: ["3개", "설치 완료"], stats: [["6", "참여 시민"], ["12h", "투입 시간"], ["0원", "현금 지출"]], problem: "공원 화장실 점자 안내 부재", activities: "당사자 동행 점검 4곳, 요청서 전달 1회", limits: "공원 4곳만 점검 · 참여자는 전체 이용자를 대표하지 않음", minority: "“음성 안내가 더 시급” — 2차 과제로 기록", responses: ["09.01 공원과에 요청 전달", "09.15 답변: 3곳 설치, 1곳 리모델링 시 반영", "09.27 3곳 설치 확인"], unfinished: "1곳은 리모델링 일정에 맞춰 반영 예정", history: ["09.28 결과 공개 · 운영자 A"] } },
];
export const getIssue = (id: string) => ISSUES.find((i) => i.id === id);
export const stageIdx = (s: Stage) => STAGES.indexOf(s);
export const reached = (i: Issue, s: Stage) => stageIdx(i.stage) >= stageIdx(s);
export const isConsensus = (s: Statement) => Math.min(s.groupA, s.groupB) >= 75;
export const isDivisive = (s: Statement) => Math.abs(s.groupA - s.groupB) >= 25;
const STAGE_HREF: Record<Stage, string> = { "접수": "/issues/", "공개 기준 검토": "/issues/", "카드 공론장": "/deliberate/", "시민 합의안": "/agreement/", "함께하기·실행팀": "/agreement/", "공동 실행실": "/room/", "결과 공개": "/results/" };
export const stageHref = (i: Issue) => STAGE_HREF[i.stage] + i.id;
export const STAGE_CTA: Record<Stage, string> = { "접수": "의견 남기기", "공개 기준 검토": "검토 과정 보기", "카드 공론장": "1분 카드 숙의", "시민 합의안": "합의안 읽기", "함께하기·실행팀": "실행팀 합류", "공동 실행실": "작업 맡기", "결과 공개": "결과 보기" };
export const METRICS = [
  { label: "참여 시민", value: 42890, suffix: "명" },
  { label: "도출된 시민 합의안", value: 18, suffix: "건" },
  { label: "기관 답변 수령", value: 7, suffix: "건" },
];
export const BADGES = [
  { key: "propose", emoji: "🌱", label: "첫 제안" }, { key: "deliberate", emoji: "🗳️", label: "카드 숙의 5문장" }, { key: "statement", emoji: "✍️", label: "새 문장 제안" },
  { key: "support", emoji: "💚", label: "합의안 공감" }, { key: "team", emoji: "🤝", label: "실행팀 합류" }, { key: "task", emoji: "🙋", label: "작업 맡기" },
];
