export interface PromotionRow {
  id: number;
  brand: string;
  corp: string;
  title: string;
  status: "Active" | "Upcoming" | "Expired" | "Draft";
  triggerType: string;
  triggerChannels: string[];
  trigger: string;
  reward: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
}

// 999 (Active) - detail과 동일
const CHANNELS_999 = [
  "GM_KR_KAKAO",
  "GM_KR_SSG",
  "GM_KR_OFFICIAL",
  "GM_KR_NAVER",
  "GM_KR_TIKTOK",
  "GM_KR_INSTAGRAM",
];

// 998 (Upcoming) - detail과 동일
const CHANNELS_998 = ["GM_KR_KAKAO", "GM_KR_NAVER"];

// 997~ (Draft/Expired) - detail과 동일
const CHANNELS_EXPIRED = [
  "GM_KR_KAKAO",
  "GM_KR_NAVER",
  "GM_KR_SSG",
  "GM_KR_OFFICIAL",
];

const REWARD_TYPES = [
  "SHRY 240ml BLACK RIBBON_23년_ ... * 1",
  "CAR DIFFUSER MINI_BLACK * 1\n(per target item)",
  "CAR DIFFUSER MINI_BLACK * 1\n(per order)",
];

function generateMockPromotions(): PromotionRow[] {
  const rows: PromotionRow[] = [];

  // Active row
  rows.push({
    id: 999,
    brand: "GM",
    corp: "KR",
    title: "2026 크리스마스 이벤트 🎅",
    status: "Active",
    triggerType: "Purchase Specific Product or Label",
    triggerChannels: [...CHANNELS_999],
    trigger: "SHRY 240ml BLACK RIBBON_23년\n(+1 more specific products)",
    reward: REWARD_TYPES[0],
    startDate: "2026.01.10 00:00:00",
    endDate: "2026.03.10 00:00:00",
    createdBy: "tam881",
    createdAt: "2026.01.05 00:00:00",
  });

  // Upcoming row
  rows.push({
    id: 998,
    brand: "GM",
    corp: "KR",
    title: "2026 크리스마스 이브 이벤트...",
    status: "Upcoming",
    triggerType: "Purchase Over Amount Threshold",
    triggerChannels: [...CHANNELS_998],
    trigger: "Purchase Over 100,000 KRW",
    reward: REWARD_TYPES[1],
    startDate: "2026.01.10 00:00:00",
    endDate: "2026.03.10 00:00:00",
    createdBy: "tam1218",
    createdAt: "2026.01.05 00:00:00",
  });

  // Expired rows
  const expiredTitles = [
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
    "2026 할로윈 이벤트 🎃",
  ];

  expiredTitles.forEach((title, index) => {
    const triggerText =
      index === 1
        ? "할로윈 한정판 향수 세트\n(+1 more, Over 50,000 KRW)"
        : "Purchase Any Product";

    rows.push({
      id: 997 - index,
      brand: "TB",
      corp: "KR",
      title,
      status: index === 0 ? "Draft" : "Expired",
      triggerType:
        index === 1
          ? "Purchase Specific Product Over Amount Threshold"
          : "Purchase Any Product",
      triggerChannels: [...CHANNELS_EXPIRED],
      trigger: triggerText,
      reward: "할로윈 한정판 파우치 * 1\n(per order)",
      startDate: "2026.01.10 00:00:00",
      endDate: "2026.03.10 00:00:00",
      createdBy: "tam35",
      createdAt: "2026.01.05 00:00:00",
    });
  });

  return rows;
}

export const MOCK_PROMOTIONS = generateMockPromotions();
export const MOCK_TOTAL_COUNT = 1234;
