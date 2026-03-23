import { PromotionDetail } from "./types";

function createExpiredDetail(id: number): PromotionDetail {
  return {
    promotionNo: id,
    title: "2026 할로윈 이벤트 🎃",
    status: "Expired",
    type: "GWP",
    brand: "TB",
    corp: "KR",
    startDate: "2025-10-01 00:00:00",
    endDate: "2025-11-01 00:00:00",
    createdBy: "tam35",
    reason: "시즌 프로모션",
    triggerType: "Purchase Any Product",
    amount: null,
    amountCurrency: null,
    triggerChannels: ["GM_KR_KAKAO", "GM_KR_NAVER", "GM_KR_SSG", "GM_KR_OFFICIAL"],
    triggerProducts: [],
    rewardType: "Order Level",
    rewardProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "H0000001",
        productName: "할로윈 한정판 파우치",
        rewardQty: 1,
        stockUseDedicated: 100,
        stockUseRemained: 30,
        stockUseAlertThreshold: 10,
      },
    ],
  };
}

export function getMockPromotionDetail(
  id: string,
): PromotionDetail | undefined {
  if (MOCK_PROMOTION_DETAIL[id]) return MOCK_PROMOTION_DETAIL[id];
  const numId = Number(id);
  if (numId >= 986 && numId <= 996) return createExpiredDetail(numId);
  return undefined;
}

export const MOCK_PROMOTION_DETAIL: Record<string, PromotionDetail> = {
  "999": {
    promotionNo: 999,
    title: "2026 크리스마스 이벤트 🎅",
    status: "Active",

    // General
    type: "GWP",
    brand: "GM",
    corp: "KR",
    startDate: "2026-04-01 00:00:00",
    endDate: "2026-05-01 00:00:00",
    createdBy: "tam35",
    reason: "매출창출",

    // Trigger Detail
    triggerType: "Purchase Specific Product or Label",
    amount: 70000,
    amountCurrency: "KRW",
    triggerChannels: [
      "GM_KR_KAKAO",
      "GM_KR_SSG",
      "GM_KR_OFFICIAL",
      "GM_KR_NAVER",
      "GM_KR_TIKTOK",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
      "GM_KR_INSTAGRAM",
    ],
    triggerProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "B0000001",
        productName: "SHRY 240ml BLACK RIBBON_23년",
      },
      {
        no: 2,
        imageUrl: "",
        skuCode: "S0000003",
        productName:
          "이것은 아주 긴 제품명 실제로 있을까? 이것은 아주 긴 제품명 실제로 있을까? ...",
      },
    ],

    // Reward Detail
    rewardType: "Order Level",
    rewardProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "B0000001",
        productName: "이것은 사은품 열쇠고리",
        rewardQty: 1,
        stockUseDedicated: 100,
        stockUseRemained: 30,
        stockUseAlertThreshold: 10,
      },
      {
        no: 2,
        imageUrl: "",
        skuCode: "S0000007",
        productName: "이것은 사은품 인형",
        rewardQty: 1,
        stockUseDedicated: 100,
        stockUseRemained: 30,
        stockUseAlertThreshold: 10,
      },
    ],
  },
  "998": {
    promotionNo: 998,
    title: "2026 크리스마스 이브 이벤트...",
    status: "Upcoming",

    type: "GWP",
    brand: "GM",
    corp: "KR",
    startDate: "2026-04-01 00:00:00",
    endDate: "2026-05-01 00:00:00",
    createdBy: "tam1218",
    reason: "매출창출",

    triggerType: "Purchase Over Amount Threshold",
    amount: 100000,
    amountCurrency: "KRW",
    triggerChannels: ["GM_KR_KAKAO", "GM_KR_NAVER"],
    triggerProducts: [],

    rewardType: "Product Level",
    rewardProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "B0000002",
        productName: "CAR DIFFUSER MINI_BLACK",
        rewardQty: 1,
        stockUseDedicated: 100,
        stockUseRemained: 30,
        stockUseAlertThreshold: 10,
      },
    ],
  },
  "997": {
    promotionNo: 997,
    title: "2026 할로윈 이벤트 🎃",
    status: "Draft",

    type: "GWP",
    brand: "TB",
    corp: "KR",
    startDate: "2025-10-01 00:00:00",
    endDate: "2025-11-01 00:00:00",
    createdBy: "tam35",
    reason: "시즌 프로모션",

    triggerType: "Purchase Any Product",
    amount: null,
    amountCurrency: null,
    triggerChannels: ["GM_KR_KAKAO", "GM_KR_NAVER", "GM_KR_SSG", "GM_KR_OFFICIAL"],
    triggerProducts: [],

    rewardType: "Order Level",
    rewardProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "H0000001",
        productName: "할로윈 한정판 파우치",
        rewardQty: 1,
        stockUseDedicated: 3,
        stockUseRemained: 0,
        stockUseAlertThreshold: 1,
      },
    ],
  },
  "996": {
    promotionNo: 996,
    title: "2026 할로윈 이벤트 🎃",
    status: "Expired",
    type: "GWP",
    brand: "TB",
    corp: "KR",
    startDate: "2025-10-01 00:00:00",
    endDate: "2025-11-01 00:00:00",
    createdBy: "tam35",
    reason: "시즌 프로모션",
    triggerType: "Purchase Specific Product Over Amount Threshold",
    amount: 50000,
    amountCurrency: "KRW",
    triggerChannels: ["GM_KR_KAKAO", "GM_KR_NAVER", "GM_KR_SSG", "GM_KR_OFFICIAL"],
    triggerProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "H0000002",
        productName: "할로윈 한정판 향수 세트",
      },
      {
        no: 2,
        imageUrl: "",
        skuCode: "H0000003",
        productName: "할로윈 스페셜 캔들",
      },
    ],
    rewardType: "Order Level",
    rewardProducts: [
      {
        no: 1,
        imageUrl: "",
        skuCode: "H0000001",
        productName: "할로윈 한정판 파우치",
        rewardQty: 1,
        stockUseDedicated: 100,
        stockUseRemained: 30,
        stockUseAlertThreshold: 10,
      },
    ],
  },
};
