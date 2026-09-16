import dayjs from "dayjs";

// 검색 기본 기간(최근 3개월)에 데이터가 걸리도록 오늘 기준 상대 날짜로 생성
const dateFrom = (days: number) =>
  dayjs().add(days, "day").startOf("day").format("YYYY.MM.DD HH:mm:ss");

export interface PromotionRewardProduct {
  productName: string;
  skuCode: string;
  // 재고 정보 (Expired 판정 등에 사용) — 없으면 디테일에서 기본값 사용
  total?: number;
  sold?: number;
  alert?: number;
}

// Target = Order Amount 프로모션의 금액 구간별 Reward 제품
// min 포함(>=), max 미포함(<). unlimited 는 마지막 구간(상한 없음)
export interface PromotionRangeReward {
  label: string;
  min: number;
  max: number;
  unlimited?: boolean;
  products: PromotionRewardProduct[];
}

// Target = Specific Product 프로모션의 대상 제품
// id 는 제품 DB(PromotionFormV2 의 PRODUCTS) 기준 — 디테일 진입 시 그대로 복원된다
export interface PromotionTargetProduct {
  id: string;
  productName: string;
  price: number;
  category: string;
}

export interface PromotionRow {
  id: number;
  brand: string;
  corp: string;
  title: string;
  status: "Active" | "Scheduled" | "Ended" | "Draft" | "Deleted";
  triggerType: string;
  triggerChannels: string[];
  trigger: string;
  // Target = Specific Product 인 경우에만 설정 (미설정 시 디테일에서 All Products 로 표시)
  targetProducts?: PromotionTargetProduct[];
  reward: string;
  // 증정 제품 전체 (Order Amount 타입은 모든 구간의 제품을 합친 목록)
  rewardProducts: PromotionRewardProduct[];
  // Target = Order Amount 인 경우 구간별 Reward 제품 (리스트는 구간별 재고 최소 제품만 노출)
  rangeRewards?: PromotionRangeReward[];
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  // 수정자 — 한 번도 수정되지 않은 프로모션은 "-"
  updatedBy: string;
  // 상시 프로모션(종료일 없음) — endDate 는 "" 로 두고 캘린더에서는 Always-on 영역에 표시
  alwaysOn?: boolean;
  // 프로모션 유형 (등록 화면의 Promotion Type). 미설정 시 GWP
  promotionType?: "GWP" | "PACKAGE";
}

// GWP 프로모션은 Trigger Channel 1개만 설정 (detail과 동일)
// 채널명은 shared BRAND_CORP_CHANNELS(Brand & Corp 별 사용 가능 채널) 기준
// 999 (Active)
const CHANNELS_999 = ["GM_KAKAO_KR"];

// 998 (Upcoming)
const CHANNELS_998 = ["GM_Official_KR"];

// 997~ (Draft/Expired)
const CHANNELS_EXPIRED = ["GM_Official_INT"];

const REWARD_TYPES = [
  "SHRY 240ml BLACK RIBBON_23년_ ... * 1",
  "CAR DIFFUSER MINI_BLACK * 1\n(per target item)",
  "CAR DIFFUSER MINI_BLACK * 1\n(per order)",
];

function generateMockPromotions(): PromotionRow[] {
  const rows: PromotionRow[] = [];

  // [Active] 현재 시간이 Start~End 기간에 포함 + 재고 있음 → 활성화
  rows.push({
    id: 999,
    brand: "GM",
    corp: "KR",
    title: "2026 크리스마스 이벤트 🎅 (Active)",
    status: "Active",
    triggerType: "Purchase Specific Product or Label",
    triggerChannels: [...CHANNELS_999],
    trigger: "SHRY 240ml BLACK RIBBON_23년\n(+1 more specific products)",
    reward: REWARD_TYPES[0],
    rewardProducts: [
      {
        productName: "이것은 사은품 열쇠고리",
        skuCode: "B0000001",
        total: 300,
        sold: 60,
        alert: 30,
      },
      // 잔여 20 = Alert 기준 이하 → 리스트 재고 경고 색상 확인용
      {
        productName: "이것은 사은품 인형",
        skuCode: "S0000007",
        total: 200,
        sold: 180,
        alert: 20,
      },
    ],
    startDate: dateFrom(-10),
    endDate: dateFrom(20),
    createdBy: "tam881",
    createdAt: dateFrom(-15),
    updatedBy: "tam1218",
  });

  // [Active] Target = Specific Product — Active 상태에서 Target 제품 "추가만" 가능한 케이스 확인용
  rows.push({
    id: 1000,
    brand: "GM",
    corp: "KR",
    title: "가을 신상 향수 구매 사은품 (Active · Specific Product)",
    status: "Active",
    triggerType: "Purchase Specific Product or Label",
    triggerChannels: [...CHANNELS_999],
    trigger: "Ten Perfume 50ml\n(+1 more specific products)",
    targetProducts: [
      {
        id: "p1",
        productName: "Ten Perfume 50ml",
        price: 32000,
        category: "Fragrance",
      },
      {
        id: "p3",
        productName: "Perfume Balm 6.5g",
        price: 42000,
        category: "Fragrance",
      },
    ],
    reward: REWARD_TYPES[1],
    rewardProducts: [
      {
        productName: "CAR DIFFUSER MINI_BLACK",
        skuCode: "B0000002",
        total: 400,
        sold: 85,
        alert: 40,
      },
    ],
    startDate: dateFrom(-5),
    endDate: dateFrom(25),
    createdBy: "tam1218",
    createdAt: dateFrom(-9),
    updatedBy: "tam881",
  });

  // [Active] Target = Order Amount — 금액 구간별 Reward. 리스트에는 구간별 재고 최소 제품만 노출
  const RANGE_LOW: PromotionRewardProduct[] = [
    {
      productName: "Ten Perfume 50ml",
      skuCode: "TAM-PF-050",
      total: 1000,
      sold: 180,
      alert: 100,
    },
    {
      productName: "Cica Hand Cream 30ml",
      skuCode: "TAM-HC-030",
      total: 1200,
      sold: 150,
      alert: 100,
    },
  ];
  const RANGE_HIGH: PromotionRewardProduct[] = [
    {
      productName: "Perfume Balm 6.5g",
      skuCode: "TAM-PB-006",
      total: 500,
      sold: 454,
      alert: 50,
    },
    // 재고 소진 → 구간 재고 0 (붉은색)
    {
      productName: "Cica Hand Cream 30ml",
      skuCode: "TAM-HC-030",
      total: 300,
      sold: 300,
      alert: 30,
    },
    {
      productName: "CAR DIFFUSER MINI_BLACK",
      skuCode: "B0000002",
      total: 800,
      sold: 120,
      alert: 80,
    },
  ];
  rows.push({
    id: 1001,
    brand: "GM",
    corp: "KR",
    title: "구매금액별 기프트 프로모션 (Active · Order Amount)",
    status: "Active",
    triggerType: "Purchase Over Amount Threshold",
    triggerChannels: ["GM_Official_KR"],
    trigger: "Order Amount ≥ 50,000 KRW",
    reward: "Ten Perfume 50ml * 1\n(per order)",
    rewardProducts: [...RANGE_LOW, ...RANGE_HIGH],
    rangeRewards: [
      {
        label: "50,000 ~ 100,000",
        min: 50000,
        max: 100000,
        products: RANGE_LOW,
      },
      {
        label: "≥ 100,000",
        min: 100000,
        max: 0,
        unlimited: true,
        products: RANGE_HIGH,
      },
    ],
    startDate: dateFrom(-7),
    endDate: dateFrom(30),
    createdBy: "tam1218",
    createdAt: dateFrom(-12),
    updatedBy: "tam881",
  });

  // [Upcoming] Start Date 아직 도달 전 → 비활성
  rows.push({
    id: 998,
    brand: "GM",
    corp: "KR",
    title: "2026 크리스마스 이브 이벤트... (Upcoming)",
    status: "Scheduled",
    triggerType: "Purchase Over Amount Threshold",
    triggerChannels: [...CHANNELS_998],
    trigger: "Purchase Over 100,000 KRW",
    reward: REWARD_TYPES[1],
    rewardProducts: [
      {
        productName: "CAR DIFFUSER MINI_BLACK",
        skuCode: "B0000002",
        total: 500,
        sold: 0,
        alert: 50,
      },
      {
        productName: "Perfume Balm 6.5g",
        skuCode: "TAM-PB-006",
        total: 200,
        sold: 0,
        alert: 20,
      },
    ],
    rangeRewards: [
      {
        label: "≥ 100,000",
        min: 100000,
        max: 0,
        unlimited: true,
        products: [
          {
            productName: "CAR DIFFUSER MINI_BLACK",
            skuCode: "B0000002",
            total: 500,
            sold: 0,
            alert: 50,
          },
          {
            productName: "Perfume Balm 6.5g",
            skuCode: "TAM-PB-006",
            total: 200,
            sold: 0,
            alert: 20,
          },
        ],
      },
    ],
    startDate: dateFrom(10),
    endDate: dateFrom(40),
    createdBy: "tam1218",
    createdAt: dateFrom(-3),
    updatedBy: "tam35",
  });

  // [Draft] 임시 저장 상태 — Start Date 가 도달해도 Active 되지 않음 (시작일이 지난 케이스)
  rows.push({
    id: 997,
    brand: "GM",
    corp: "KR",
    title: "봄맞이 기획전 (Draft · 시작일 경과)",
    status: "Draft",
    triggerType: "Purchase Any Product",
    triggerChannels: [...CHANNELS_EXPIRED],
    trigger: "Purchase Any Product",
    reward: REWARD_TYPES[2],
    rewardProducts: [
      {
        productName: "CAR DIFFUSER MINI_BLACK",
        skuCode: "B0000002",
        total: 100,
        sold: 0,
        alert: 10,
      },
    ],
    startDate: dateFrom(-3),
    endDate: dateFrom(27),
    createdBy: "tam35",
    createdAt: dateFrom(-5),
    updatedBy: "tam881",
  });

  // [Draft] 임시 저장 상태 — 아직 시작 전
  rows.push({
    id: 996,
    brand: "ATS",
    corp: "KR",
    title: "2026 여름 시즌 프로모션 (Draft)",
    status: "Draft",
    triggerType: "Purchase Specific Product or Label",
    triggerChannels: ["ATS_Official_KR"],
    trigger: "여름 한정판 세트",
    reward: "여름 한정판 파우치 * 1\n(per order)",
    rewardProducts: [
      {
        productName: "여름 한정판 파우치",
        skuCode: "H0000010",
        total: 100,
        sold: 0,
        alert: 10,
      },
    ],
    startDate: dateFrom(14),
    endDate: dateFrom(44),
    createdBy: "tam35",
    createdAt: dateFrom(-1),
    updatedBy: "-",
  });

  // [Expired] End Date 가 지나 종료된 프로모션
  rows.push({
    id: 995,
    brand: "NUF",
    corp: "KR",
    title: "2026 할로윈 이벤트 🎃 (Expired · 기간 종료)",
    status: "Ended",
    triggerType: "Purchase Any Product",
    triggerChannels: ["NUF_Official_KR"],
    trigger: "Purchase Any Product",
    reward: "할로윈 한정판 파우치 * 1\n(per order)",
    rewardProducts: [
      {
        productName: "할로윈 한정판 파우치",
        skuCode: "H0000001",
        total: 300,
        sold: 120,
        alert: 30,
      },
    ],
    startDate: dateFrom(-60),
    endDate: dateFrom(-10),
    createdBy: "tam35",
    createdAt: dateFrom(-70),
    updatedBy: "-",
  });

  // [Expired] 기간은 남았으나 재고가 0개가 되어 종료된 프로모션
  rows.push({
    id: 994,
    brand: "GM",
    corp: "KR",
    title: "한정 수량 GWP (Expired · 재고 소진)",
    status: "Ended",
    triggerType: "Purchase Specific Product or Label",
    triggerChannels: [...CHANNELS_999],
    trigger: "SHRY 240ml BLACK RIBBON_23년",
    reward: REWARD_TYPES[0],
    rewardProducts: [
      // total === sold → 잔여 0 (재고 소진)
      {
        productName: "이것은 사은품 열쇠고리",
        skuCode: "B0000001",
        total: 150,
        sold: 150,
        alert: 20,
      },
    ],
    startDate: dateFrom(-8),
    endDate: dateFrom(22),
    createdBy: "tam881",
    createdAt: dateFrom(-12),
    updatedBy: "tam881",
  });

  // 리스트 볼륨용 추가 Expired(기간 종료) 행들 — Brand & Corp 별 채널에 분산
  const ENDED_SCOPES: Array<[string, string, string]> = [
    ["GM", "KR", "GM_SSG_KR"],
    ["GM", "KR", "GM_SSF_KR"],
    ["GM", "CA", "GM_Official_CA"],
    ["GM", "US", "GM_Official_US"],
    ["GM", "AU", "GM_Official_AU"],
    ["GM", "KR", "GM_SI_VILLAGE_KR"],
    ["GM", "KR", "GM_ONLINE_FARFETCH"],
    ["ATS", "KR", "ATS_Official_KR"],
  ];
  for (let i = 0; i < ENDED_SCOPES.length; i += 1) {
    const [brand, corp, channel] = ENDED_SCOPES[i];
    rows.push({
      id: 993 - i,
      brand,
      corp,
      title: `2026 할로윈 이벤트 🎃 (Expired · ${channel})`,
      status: "Ended",
      triggerType: "Purchase Any Product",
      triggerChannels: [channel],
      trigger: "Purchase Any Product",
      reward: "할로윈 한정판 파우치 * 1\n(per order)",
      rewardProducts: [
        {
          productName: "할로윈 한정판 파우치",
          skuCode: "H0000001",
          total: 300,
          sold: 300,
          alert: 30,
        },
      ],
      startDate: dateFrom(-90 - i),
      endDate: dateFrom(-30 - i),
      createdBy: "tam35",
      createdAt: dateFrom(-100 - i),
      updatedBy: "tam35",
    });
  }

  // [Deleted] 삭제 처리된 프로모션 (디테일에서 아무것도 수정 불가)
  rows.push({
    id: 985,
    brand: "GM",
    corp: "KR",
    title: "삭제된 프로모션 (Deleted)",
    status: "Deleted",
    triggerType: "Purchase Any Product",
    triggerChannels: [...CHANNELS_999],
    trigger: "Purchase Any Product",
    reward: REWARD_TYPES[0],
    rewardProducts: [
      {
        productName: "이것은 사은품 열쇠고리",
        skuCode: "B0000001",
        total: 100,
        sold: 10,
        alert: 10,
      },
    ],
    startDate: dateFrom(5),
    endDate: dateFrom(35),
    createdBy: "tam881",
    createdAt: dateFrom(-6),
    updatedBy: "tam1218",
  });

  // ─── 캘린더 뷰 확인용: 채널별 기간 프로모션 + 상시(Always-on) 프로모션 ───
  // 기간 프로모션 (채널별 색상 확인용)
  const CAL_TIMED: Array<{
    id: number;
    title: string;
    brand: string;
    corp: string;
    channel: string;
    start: number;
    end: number;
    status: PromotionRow["status"];
  }> = [
    {
      id: 984,
      title: "O HAND CREAM_CHAMO_2ML GWP · 공식몰",
      brand: "GM",
      corp: "KR",
      channel: "GM_Official_KR",
      start: 2,
      end: 17,
      status: "Scheduled",
    },
    {
      id: 983,
      title: "O HAND CREAM_CHAMO_2ML GWP · 카카오",
      brand: "GM",
      corp: "KR",
      channel: "GM_KAKAO_KR",
      start: 6,
      end: 21,
      status: "Scheduled",
    },
    {
      id: 982,
      title: "O HAND CREAM_CHAMO_2ML GWP · SSG",
      brand: "GM",
      corp: "KR",
      channel: "GM_SSG_KR",
      start: 6,
      end: 21,
      status: "Draft",
    },
    {
      id: 981,
      title: "PUPPY CASE + CHAMO 2ML 퍼퓸 50ml GWP · SSF",
      brand: "GM",
      corp: "KR",
      channel: "GM_SSF_KR",
      start: -14,
      end: -1,
      status: "Ended",
    },
    {
      id: 980,
      title: "15만원 사은품 선택 GWP · 공식몰",
      brand: "GM",
      corp: "KR",
      channel: "GM_Official_KR",
      start: -4,
      end: 12,
      status: "Active",
    },
    {
      id: 979,
      title: "O HAND RIBBON MINI BAG 킬러카드 · 카카오 (1일)",
      brand: "GM",
      corp: "KR",
      channel: "GM_KAKAO_KR",
      start: 1,
      end: 1,
      status: "Scheduled",
    },
    {
      id: 978,
      title: "PERFUME VINYL BLUE HINOKI GWP · INT",
      brand: "GM",
      corp: "KR",
      channel: "GM_Official_INT",
      start: -20,
      end: 8,
      status: "Active",
    },
    {
      id: 972,
      title: "Holiday Perfume Gift GWP · Official CA",
      brand: "GM",
      corp: "CA",
      channel: "GM_Official_CA",
      start: -3,
      end: 24,
      status: "Active",
    },
    {
      id: 971,
      title: "Lip Mousse Launch GWP · ATS Official",
      brand: "ATS",
      corp: "KR",
      channel: "ATS_Official_KR",
      start: -2,
      end: 19,
      status: "Active",
    },
  ];
  CAL_TIMED.forEach((c) => {
    rows.push({
      id: c.id,
      brand: c.brand,
      corp: c.corp,
      title: c.title,
      status: c.status,
      triggerType: "Purchase Specific Product or Label",
      triggerChannels: [c.channel],
      trigger: "O HAND CREAM_BOTTARI_30ML(2026)\n(+3 more specific products)",
      reward: "O HAND CREAM_CHAMO_2ML(2026) * 1\n(per order)",
      rewardProducts: [
        {
          productName: "O HAND CREAM_CHAMO_2ML(2026)",
          skuCode: "12500593",
          total: 500,
          sold: c.status === "Active" ? 120 : 0,
          alert: 50,
        },
      ],
      startDate: dateFrom(c.start),
      endDate: dateFrom(c.end),
      createdBy: "tam1218",
      createdAt: dateFrom(c.start - 7),
      updatedBy: "-",
    });
  });

  // 상시 프로모션 (Always-on) — 종료일 없음
  const CAL_ALWAYS: Array<{
    id: number;
    title: string;
    brand: string;
    corp: string;
    channel: string;
    start: number;
    status: PromotionRow["status"];
    type: NonNullable<PromotionRow["promotionType"]>;
    reward: string;
    sku: string;
  }> = [
    {
      id: 977,
      title: "TAMBURINS SHOPPING BAG S 상시 · SSG",
      brand: "GM",
      corp: "KR",
      channel: "GM_SSG_KR",
      start: -13,
      status: "Active",
      reward: "[N]TAMBURINS SHOPPING BAG(WHITE)-S",
      type: "GWP",
      sku: "16000248",
    },
    {
      id: 976,
      title: "PERFUME BALM/OIL MINI PACKAGE_25 · SSF",
      brand: "GM",
      corp: "KR",
      channel: "GM_SSF_KR",
      start: -250,
      status: "Active",
      reward: "PERFUME BALM/OIL MINI PACKAGE_25",
      type: "PACKAGE",
      sku: "32002336",
    },
    {
      id: 975,
      title: "PERFUME 50ML PINK RIBBON_23년 · 카카오",
      brand: "GM",
      corp: "KR",
      channel: "GM_KAKAO_KR",
      start: -250,
      status: "Active",
      reward: "PERFUME 50ML PINK RIBBON_23년",
      type: "PACKAGE",
      sku: "32001988",
    },
    {
      id: 974,
      title: "O HAND CREAM_GREEN RIBBON_26 · 공식몰",
      brand: "GM",
      corp: "KR",
      channel: "GM_Official_KR",
      start: 1,
      status: "Scheduled",
      reward: "O HAND CREAM_GREEN RIBBON_26",
      type: "PACKAGE",
      sku: "32002382",
    },
    {
      id: 973,
      title: "HEART PACKAGE PINK(BLACK LOGO)_23년 · INT",
      brand: "GM",
      corp: "KR",
      channel: "GM_Official_INT",
      start: -3,
      status: "Draft",
      reward: "HEART PACKAGE PINK(BLACK LOGO)_23년",
      type: "PACKAGE",
      sku: "32001965",
    },
    {
      id: 970,
      title: "Nuflaat Starter Pouch 상시 · NUF Official",
      brand: "NUF",
      corp: "KR",
      channel: "NUF_Official_KR",
      start: -40,
      status: "Active",
      reward: "Nuflaat Starter Pouch",
      type: "GWP",
      sku: "NF-GWP-001",
    },
  ];
  CAL_ALWAYS.forEach((c) => {
    rows.push({
      id: c.id,
      brand: c.brand,
      corp: c.corp,
      title: c.title,
      status: c.status,
      triggerType: "Purchase Specific Product or Label",
      triggerChannels: [c.channel],
      trigger: "PERFUME_HAYSTACKS_50ml\n(+16 more specific products)",
      reward: `${c.reward} * 1\n(per target item)`,
      rewardProducts: [
        {
          productName: c.reward,
          skuCode: c.sku,
          total: 500,
          sold: 38,
          alert: 50,
        },
      ],
      startDate: dateFrom(c.start),
      endDate: "",
      alwaysOn: true,
      promotionType: c.type,
      createdBy: "tam881",
      createdAt: dateFrom(c.start - 5),
      updatedBy: "-",
    });
  });

  return rows;
}

export const MOCK_PROMOTIONS = generateMockPromotions();
export const MOCK_TOTAL_COUNT = 1234;
