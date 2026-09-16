import {
  RewardBasis,
  RewardType,
  TargetMode,
  TemplateProduct,
  TemplateType,
} from "@/features/promotion-template/modules/types";

// ---- palette (PromotionFormV2 와 동일 톤) ----
export const BORDER = "#E0E0E0";
export const BORDER_STRONG = "#C4C4C4";
export const SURFACE_ALT = "#FAFAFA";
export const SURFACE_SUNKEN = "#F0F0F0";
export const BRAND = "#1976D2";
export const BRAND_STRONG = "#115293";
export const BRAND_SOFT = "#E9F2FE";
export const BRAND_TINT = "#DCEAFB";
export const SUCCESS = "#2E7D32";
export const SUCCESS_BG = "#E8F3E9";
export const WARNING = "#B26A00";
export const WARNING_BG = "#FBF0DC";
export const DANGER = "#C62828";
export const DANGER_BG = "#FBE9E9";
export const PURPLE = "#6D28D9";
export const PURPLE_BG = "#EDE9FE";
export const TEXT_PRIMARY = "rgba(0,0,0,0.87)";
export const TEXT_SECONDARY = "rgba(0,0,0,0.6)";
export const TEXT_TERTIARY = "rgba(0,0,0,0.4)";

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "10px",
    fontSize: 14,
    background: "#fff",
    "& fieldset": { borderColor: BORDER, borderWidth: "1.5px" },
  },
};

// ---- labels ----
export const TEMPLATE_TYPE_OPTIONS: { value: TemplateType; label: string }[] = [
  { value: "GWP", label: "GWP · Free Gift" },
  { value: "PACKAGE", label: "Packaging Benefit" },
];
export const TEMPLATE_TYPE_LABEL: Record<TemplateType, string> = {
  GWP: "GWP · Free Gift",
  PACKAGE: "Packaging Benefit",
};

export const TARGET_MODE_OPTIONS: { value: TargetMode; label: string }[] = [
  { value: "product", label: "Specific Product" },
  { value: "amount", label: "Order Amount" },
  { value: "all", label: "All Products" },
];
export const TARGET_MODE_LABEL: Record<TargetMode, string> = {
  product: "Specific Product",
  amount: "Order Amount",
  all: "All Products",
};

export const REWARD_BASIS_OPTIONS: { value: RewardBasis; label: string }[] = [
  { value: "per_order", label: "Per order" },
  { value: "per_qty", label: "Per product quantity" },
];

export const REWARD_TYPE_OPTIONS: { value: RewardType; label: string }[] = [
  { value: "default", label: "Default Gift" },
  { value: "option", label: "Option Select" },
];

// Promotion Goal 선택지 — Create Promotion(PromotionFormV2) 과 동일. 목록 밖 값은 Custom 직접 입력
export const GOALS = [
  "Increase Sales",
  "Acquire New Customers",
  "Drive Repurchase",
  "Promote New Products",
  "Clear Inventory",
  "Boost Brand Awareness",
];
export const CUSTOM_GOAL = "__custom__";

export const SEARCH_FIELD_OPTIONS: {
  value: "sap" | "name" | "model";
  label: string;
}[] = [
  { value: "sap", label: "SAP Code" },
  { value: "name", label: "Product Name" },
  { value: "model", label: "ModelPack2" },
];

// 템플릿 목록 검색 — Promotion Type 옵션 ("" = All)
export const TEMPLATE_TYPE_FILTER_OPTIONS: {
  label: string;
  value: "" | TemplateType;
}[] = [{ label: "All", value: "" }, ...TEMPLATE_TYPE_OPTIONS];

// 템플릿 목록 검색 키 (Promotion List 의 Search 키 중 템플릿에 있는 항목만)
export const TEMPLATE_SEARCH_KEY_TYPE_OPTIONS = [
  { label: "Title", value: "title" },
  { label: "GWP Name", value: "gwpName" },
  { label: "Reward SAP Code", value: "rewardSapCode" },
  { label: "Target Product Name", value: "targetProductName" },
  { label: "Target SAP Code", value: "targetSapCode" },
] as const;
export type TemplateSearchKeyType =
  (typeof TEMPLATE_SEARCH_KEY_TYPE_OPTIONS)[number]["value"];

// Option Select 증정은 자사몰(채널명에 "Official" 포함)에서만 제공 — PromotionFormV2 와 동일 규칙
export const isOfficialChannel = (name: string) =>
  name.toLowerCase().includes("official");

// Brand & Corp 조합에 따른 판매 채널 목록 — shared 공통 매핑을 그대로 사용
export { BRAND_CORP_CHANNELS } from "@/shared/constants/brandCorpChannels";

export const DEFAULT_BRAND = "GM";
export const DEFAULT_CORP = "KR";

// 채널 구분 색 (미리보기·칩) — 채널 순서대로 순환
export const CHANNEL_COLORS: { color: string; bg: string }[] = [
  { color: "#2F5FBF", bg: "#DFE7F7" },
  { color: "#1E8E4C", bg: "#DCEFE3" },
  { color: "#B3402F", bg: "#F6E0DC" },
  { color: "#B7791F", bg: "#F6EBD2" },
  { color: "#7A4FBF", bg: "#EAE2F7" },
  { color: "#0F766E", bg: "#D9F0EC" },
  { color: "#BE185D", bg: "#FBE1EC" },
];

// ---- product DB (9월 GWP 시트에 등장한 SAP 코드로만 구성) ----
const P: TemplateProduct[] = [];
const add = (
  sap: string,
  name: string,
  model: string,
  category: string,
  price: number,
) => P.push({ sap, name, model, category, price });

// target products
(
  [
    ["12500600", "O HAND CREAM_BOTTARI_30ML(2026)"],
    ["12500601", "O HAND CREAM_CHAMO_30ML(2026)"],
    ["12500602", "O HAND CREAM_EVENING GLOW_30ML(2026)"],
    ["12500603", "O HAND CREAM_W.DARJEELING_30ML(2026)"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-OHC-030", "Hand Care", 28000));
(
  [
    ["12001718", "PERFUME SHELL X SUNSHINE_30ml"],
    ["12001389", "PERFUME SHELL X EVENING GLOW_30ml"],
    ["12500371", "PERFUME SHELL X PUMKINI (30ml)"],
    ["12500161", "PERFUME SHELL X LALE_30ml"],
    ["12500160", "PERFUME SHELL X BERGA SANDAL_30ml"],
    ["12500159", "PERFUME SHELL X CHAMO_30ml"],
    ["12001791", "PERFUME SHELL X_CHAMO_30ml (2025)"],
    ["12002521", "PERFUME SHELL X_SUMMER TAILS 30ml"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-SHX-030", "Fragrance", 52000));
(
  [
    ["12001156", "[N]PERFUME BALM BERGA SANDAL"],
    ["12500442", "PERFUME BALM PUMKINI"],
    ["12500443", "PERFUME BALM HOLY METAL"],
    ["12001446", "PERFUME BALM EVENING GLOW_6.5g"],
    ["12001155", "[N]PERFUME BALM LALE"],
    ["12001154", "[N]PERFUME BALM CHAMO"],
    ["12001516", "[KR]PERFUME BALM - BOTTARI (6.5g)"],
    ["12001584", "PERFUME BALM BLUE HINOKI_6.5g"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-PB-006", "Fragrance", 42000));
(
  [
    ["12500107", "PERFUME_HAYSTACKS_50ml"],
    ["12500389", "PERFUME WOOD SALT BEACH_50ml"],
    ["12500392", "PERFUME BATHER IN THE LAKE_50ml"],
    ["12500393", "PERFUME LATE AUTUMN_50ml"],
    ["12500394", "PERFUME BROWN_50ml"],
    ["12500388", "PERFUME PUMKINI_50ml"],
    ["12500106", "PERFUME_WHITE DARJEELING_50ml"],
    ["12500108", "PERFUME_LALE_50ml"],
    ["12500110", "PERFUME_BERGA SANDAL_50ml"],
    ["12001506", "PERFUME BOTTARI_50ml"],
    ["12001384", "PERFUME - EVENING GLOW (50ml)"],
    ["12500109", "PERFUME_UNKNOWN OUD_50ml"],
    ["12500111", "PERFUME_CHAMO_50ml"],
    ["12001657", "PERFUME BLUE HINOKI_50ml"],
    ["12001681", "PERFUME SUNSHINE_50ml"],
    ["12001684", "PERFUME PUPPY_50ml"],
    ["12002398", "PERFUME SUMMER TAILS 50ml"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-PF-050", "Fragrance", 98000));
(
  [
    ["12500403", "THE EGG PERFUME PUMKINI_14ML"],
    ["12001167", "THE EGG PERFUME LATE AUTUMN_14ML"],
    ["12001445", "THE EGG PERFUME CHAMO_14ML"],
    ["12002350", "THE EGG PERFUME EVENING GLOW_14ML"],
    ["12001596", "THE EGG PERFUME BLUE HINOKI_14ML"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-EGG-014", "Fragrance", 68000));
add("12002536", "NUDE H.AND CREAM FEY9", "MDL-NHC-030", "Hand Care", 22000);

// reward products (GWP)
(
  [
    ["12002438", "PERFUME_CHAMO_2ML_판매용", "MDL-PF-002", 3000],
    ["12002354", "KEY COMB", "MDL-ACC-KC", 0],
    ["12002417", "DISCOVERY SET SUMMER TAILS", "MDL-DS-ST", 0],
    ["12500593", "O HAND CREAM_CHAMO_2ML(2026)", "MDL-OHC-002", 0],
    ["12500587", "O HAND RIBBON BAG(GWP)", "MDL-GWP-BAG", 0],
    ["12500598", "O HAND RIBBON MINI BAG(GWP)", "MDL-GWP-BAG", 0],
    ["12002509", "HAIR PERFUME SUMMER TAILS_2ML", "MDL-HP-002", 0],
    ["12001603", "PERFUME VINYL BLUE HINOKI_23g", "MDL-PV-023", 0],
    ["12002370", "O HAND CHARM CHAMO FLOWER", "MDL-ACC-CH", 0],
    ["12002472", "PERFUME 2ML PUPPY CASE WHITE", "MDL-ACC-PC", 0],
    ["12002397", "PERFUME DISCOVERY MINI SET(C/E/B_2025)", "MDL-DS-MINI", 0],
    ["16000248", "[N]TAMBURINS SHOPPING BAG(WHITE)-S", "MDL-BAG-S", 0],
  ] as const
).forEach(([s, n, m, p]) => add(s, n, m, "GWP", p));

// reward products (Packaging)
(
  [
    ["32002382", "O HAND CREAM_GREEN RIBBON_26"],
    ["32002064", "PERFUME OIL BOTTARI RIBBON_25년"],
    ["32002336", "PERFUME BALM/OIL MINI PACKAGE_25"],
    ["32001983", "CAR DIFFUSER MINI_BLACK RIBON(공용)_24년"],
    ["32001982", "250ml EXCLUSIVE WHITE PACKAGE_24년"],
    ["32001988", "PERFUME 50ML PINK RIBBON_23년"],
    ["32001989", "PERFUME 11ML PINK RIBBON_23년"],
    ["32002063", "BOTTARI 50ml RIBBON_25년"],
    ["32001985", "SHRY 240ml BLACK RIBBON_23년"],
    ["32001984", "PYRAMID PINK PACKAGE _23년"],
    ["32001965", "HEART PACKAGE PINK(BLACK LOGO)_23년"],
    ["32001980", "EXCLUSIVE PINK PACKAGE _24년"],
    ["32001987", "EGG PERFUME PINK RIBBON_23년"],
    ["32002518", "HAIR OIL 50ML RIBBON_26년"],
    ["32002519", "HAIR PERFUME 80ML RIBBON_26년"],
  ] as const
).forEach(([s, n]) => add(s, n, "MDL-PKG", "Packaging", 0));

export const PRODUCTS: TemplateProduct[] = P;
export const PRODUCT_BY_SAP: Record<string, TemplateProduct> =
  Object.fromEntries(P.map((p) => [p.sap, p]));

// 프로모션 등록 화면에서 "템플릿으로 등록"할 때 템플릿 상품 DB에 없는 제품을 추가한다
// (프로모션 화면과 템플릿 화면의 목 상품 DB가 달라 이름·가격을 함께 보관해야 카드에 표시된다)
export const ensureProduct = (p: TemplateProduct) => {
  if (PRODUCT_BY_SAP[p.sap]) return;
  P.push(p);
  PRODUCT_BY_SAP[p.sap] = p;
};

export const REWARD_CATEGORIES = ["GWP", "Packaging"];
export const isRewardProduct = (p: TemplateProduct) =>
  REWARD_CATEGORIES.includes(p.category);
export const isTargetProduct = (p: TemplateProduct) => !isRewardProduct(p);

// 모델 코드별 SKU 묶음 (시드 템플릿용)
export const skusOfModel = (model: string) =>
  P.filter((p) => p.model === model).map((p) => p.sap);

// 검색 결과 최대 노출 개수 (나머지는 Select all 로 일괄 추가)
export const SEARCH_RESULT_LIMIT = 6;
