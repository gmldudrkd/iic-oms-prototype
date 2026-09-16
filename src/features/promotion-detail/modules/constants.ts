import {
  PromotionType,
  RewardType,
  TriggerType,
} from "@/features/promotion-detail/modules/types";

export const PROMOTION_TYPE_OPTIONS: { label: string; value: PromotionType }[] =
  [
    { label: "Gift With Purchase (GWP)", value: "GWP" },
    { label: "Packaging Benefit", value: "Packaging Benefit" },
  ];

export const TRIGGER_TYPE_OPTIONS: { label: string; value: TriggerType }[] = [
  {
    label: "Purchase Over Amount Threshold",
    value: "Purchase Over Amount Threshold",
  },
  {
    label: "Purchase Specific Product or Label",
    value: "Purchase Specific Product or Label",
  },
  {
    label: "Purchase Specific Product Over Amount Threshold",
    value: "Purchase Specific Product Over Amount Threshold",
  },
  { label: "Purchase Any Product", value: "Purchase Any Product" },
];

export const REWARD_TYPE_OPTIONS: { label: string; value: RewardType }[] = [
  { label: "Order Level", value: "Order Level" },
  { label: "Product Level", value: "Product Level" },
];

export const SHOW_AMOUNT_TRIGGER_TYPES: TriggerType[] = [
  "Purchase Over Amount Threshold",
  "Purchase Specific Product Over Amount Threshold",
];

export const SHOW_TRIGGER_PRODUCT_TYPES: TriggerType[] = [
  "Purchase Specific Product or Label",
  "Purchase Specific Product Over Amount Threshold",
];

export const SHOW_EXCEPTION_PRODUCT_TYPES: TriggerType[] = [
  "Purchase Over Amount Threshold",
  "Purchase Any Product",
];

export const TITLE_MAX_LENGTH = 50;
export const REASON_MAX_LENGTH = 50;

// Mock channel options for prototype
export const MOCK_CHANNEL_OPTIONS = [
  "GM_KR_KAKAO",
  "GM_KR_SSG",
  "GM_KR_OFFICIAL",
  "GM_KR_NAVER",
  "GM_KR_TIKTOK",
  "GM_KR_INSTAGRAM",
  "GM_KR_COUPANG",
  "GM_KR_11ST",
];

// Mock brand/corp options
export const MOCK_BRAND_OPTIONS = [
  { label: "GM", value: "GM" },
  { label: "TB", value: "TB" },
  { label: "ND", value: "ND" },
];

export const MOCK_CORP_OPTIONS = [
  { label: "KR", value: "KR" },
  { label: "US", value: "US" },
  { label: "JP", value: "JP" },
];

// Mock product options for "+ Add Product"
export const MOCK_PRODUCT_OPTIONS = [
  {
    skuCode: "B0000001",
    productName: "SHRY 240ml BLACK RIBBON_23년",
    imageUrl: "",
  },
  {
    skuCode: "S0000003",
    productName: "이것은 아주 긴 제품명 실제로 있을까?",
    imageUrl: "",
  },
  { skuCode: "S0000007", productName: "이것은 사은품 인형", imageUrl: "" },
  { skuCode: "H0000001", productName: "할로윈 한정판 파우치", imageUrl: "" },
  { skuCode: "H0000002", productName: "할로윈 한정판 향수 세트", imageUrl: "" },
  {
    skuCode: "P0000001",
    productName: "PERFUME SHELL X BLAHBLAH",
    imageUrl: "",
  },
  { skuCode: "P0000002", productName: "CAR DIFFUSER MINI_BLACK", imageUrl: "" },
  { skuCode: "P0000003", productName: "쇼핑백 (대)", imageUrl: "" },
  { skuCode: "P0000004", productName: "참 (CHARM) 골드", imageUrl: "" },
];

// ---- 통화 (Corporation 기준) ----
// Order Amount Range 등 금액 입력·표기에 사용할 통화.
// 상단 헤더 Brand & Corp 에서 선택한 법인(국가) 코드로 결정한다.
export interface CurrencyInfo {
  /** ISO 4217 코드 — 금액 표기·입력 필드 단위에 그대로 사용 */
  code: string;
  /** 소수점 자리수 (KRW/JPY 는 0) */
  fractionDigits: number;
}

export const CORP_CURRENCY: Record<string, CurrencyInfo> = {
  KR: { code: "KRW", fractionDigits: 0 },
  US: { code: "USD", fractionDigits: 2 },
  CA: { code: "CAD", fractionDigits: 2 },
  AU: { code: "AUD", fractionDigits: 2 },
  JP: { code: "JPY", fractionDigits: 0 },
};

/** 매핑에 없는 법인일 때 사용할 기본 통화 */
export const DEFAULT_CURRENCY: CurrencyInfo = CORP_CURRENCY.KR;

/** 법인 코드 -> 통화 (미지정·미매핑이면 기본 통화) */
export const currencyForCorp = (corp?: string | null): CurrencyInfo =>
  (corp ? CORP_CURRENCY[corp] : undefined) ?? DEFAULT_CURRENCY;

/**
 * 금액 표기: "KRW 100,000" / "AUD 1,250.00"
 * 앱 공통 convertToPrice(shared/utils/stringUtils) 와 동일하게 ISO 코드를 사용한다.
 * (통화 기호는 USD/CAD/AUD 가 모두 "$" 계열이라 법인 구분이 모호해짐)
 */
export const formatMoney = (n: number, c: CurrencyInfo): string =>
  `${c.code} ${(Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: c.fractionDigits,
    maximumFractionDigits: c.fractionDigits,
  })}`;
