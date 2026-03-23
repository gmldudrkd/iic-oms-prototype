export interface PromotionRow {
  id: number;
  brand: string;
  corp: string;
  title: string;
  status: "Active" | "Upcoming" | "Expired";
  triggerChannels: string[];
  trigger: string;
  reward: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
}

const CHANNEL_NAMES = [
  "GM_KR_KAKAOKAKAO",
  "GM_KR_NAVERNAVER",
  "GM_KR_COUPANGCOUP",
  "GM_KR_11ST11STREET",
];

const TRIGGER_TYPES = [
  "Purchase Over 70,000 KRW",
  "SHRY 240ml BLACK RIBBON_23년_24년 ...\n(+3 more specific products purchase)",
  "PERFUME SHELL X BLAHBLAH\n(specific products purchase)",
  "Purchase Any Products",
  "PERFUME SHELL X PUMKINI (15ML) ...\n(+3 more specific product purchase)",
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
    triggerChannels: [CHANNEL_NAMES[0], "(+3 more)"],
    trigger: TRIGGER_TYPES[0],
    reward: REWARD_TYPES[0],
    startDate: "2025.02.10 00:00:00",
    endDate: "2025.02.10 00:00:00",
    createdBy: "tam881",
    createdAt: "2025.02.10 00:00:00",
  });

  // Upcoming row
  rows.push({
    id: 998,
    brand: "GM",
    corp: "KR",
    title: "2026 크리스마스 이브 이벤트...",
    status: "Upcoming",
    triggerChannels: [CHANNEL_NAMES[0], "(+3 more)"],
    trigger: TRIGGER_TYPES[1],
    reward: REWARD_TYPES[1],
    startDate: "2025.02.10 00:00:00",
    endDate: "2025.02.10 00:00:00",
    createdBy: "tam1218",
    createdAt: "2025.02.10 00:00:00",
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
    const triggerIndex = index === 0 ? 2 : index === 1 ? 3 : 4;
    const rewardIndex = index < 2 ? 1 : 1;

    rows.push({
      id: 997,
      brand: "TB",
      corp: "KR",
      title,
      status: "Expired",
      triggerChannels: [CHANNEL_NAMES[0], "(+3 more)"],
      trigger: TRIGGER_TYPES[triggerIndex],
      reward: REWARD_TYPES[rewardIndex],
      startDate: "2025.02.10 00:00:00",
      endDate: "2025.02.10 00:00:00",
      createdBy: "tam35",
      createdAt: "2025.02.10 00:00:00",
    });
  });

  return rows;
}

export const MOCK_PROMOTIONS = generateMockPromotions();
export const MOCK_TOTAL_COUNT = 1234;
