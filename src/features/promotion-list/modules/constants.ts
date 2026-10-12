import { DateRange, PickersShortcutsItem } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";

// Status 옵션
export const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Ended", value: "ENDED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Deleted", value: "DELETED" },
];

// 메뉴 진입 시 기본 조회 상태 (Active) — 전체 조회는 "All" 옵션으로 가능
export const DEFAULT_STATUS = "ACTIVE";

// 검색 결과 보기 방식 (검색창은 공통, 결과 영역만 전환)
export type ViewMode = "list" | "calendar";
export const VIEW_MODE_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: "List View", value: "list" },
  { label: "Calendar View", value: "calendar" },
];

// 캘린더 내 상시(Always-on) 프로모션 표시 방식
export type AlwaysOnFilter = "include" | "exclude" | "only";
export const ALWAYS_ON_FILTER_OPTIONS: {
  label: string;
  value: AlwaysOnFilter;
}[] = [
  { label: "Include Always-on", value: "include" },
  { label: "Exclude Always-on", value: "exclude" },
  { label: "Always-on Only", value: "only" },
];

// 캘린더 채널별 색상 (bar 배경 / 텍스트·보더) — 채널명은 shared BRAND_CORP_CHANNELS 기준
export const CALENDAR_CHANNEL_COLORS: Record<
  string,
  { main: string; soft: string }
> = {
  GM_Official_KR: { main: "#2F5FBF", soft: "#DFE7F7" },
  GM_Official_INT: { main: "#0F6E63", soft: "#DDEFEB" },
  GM_KAKAO_KR: { main: "#B7791F", soft: "#F6EBD2" },
  GM_SSG_KR: { main: "#B3402F", soft: "#F6E0DC" },
  GM_SSF_KR: { main: "#1E8E4C", soft: "#DCEFE3" },
  GM_SI_VILLAGE_KR: { main: "#7A4FBF", soft: "#EAE2F7" },
  GM_ONLINE_FARFETCH: { main: "#C2185B", soft: "#FCE4EC" },
  GM_Official_CA: { main: "#00838F", soft: "#E0F7FA" },
  GM_Official_US: { main: "#3949AB", soft: "#E8EAF6" },
  GM_Official_AU: { main: "#E65100", soft: "#FFE0B2" },
  GM_Official_JP: { main: "#AD1457", soft: "#FCE4EC" },
  ATS_Official_KR: { main: "#5D4037", soft: "#EFEBE9" },
  NUF_Official_KR: { main: "#2E7D32", soft: "#E8F5E9" },
};
export const CALENDAR_FALLBACK_COLOR = { main: "#546E7A", soft: "#ECEFF1" };

// Search Key Type 옵션
export const SEARCH_KEY_TYPE_OPTIONS = [
  { label: "ID", value: "id" },
  { label: "Title", value: "title" },
  { label: "Created By", value: "createdBy" },
  { label: "Updated By", value: "updatedBy" },
  { label: "Reward Product Name", value: "rewardName" },
  { label: "Reward SAP Code", value: "rewardSapCode" },
  { label: "Target Product Name", value: "targetProductName" },
  { label: "Target SAP Code", value: "targetSapCode" },
];

// Title 검색은 단일 키워드 부분검색만 가능 — 최소 글자 수
export const TITLE_PARTIAL_SEARCH_MIN_LENGTH = 2;

// 멀티 검색 가능한 키 타입 (Title 은 단일 검색만 가능)
export const MULTI_SEARCH_KEY_TYPES = [
  "id",
  "createdBy",
  "updatedBy",
  "rewardName",
  "rewardSapCode",
  "targetProductName",
  "targetSapCode",
];

// Import 템플릿 컬럼 (헤더명은 업로드 파싱 키와 동일해야 함) — Export 엑셀과 동일한 표기
export const IMPORT_TEMPLATE_COLUMNS: { key: string; width: number }[] = [
  { key: "promotionTitle", width: 30 },
  { key: "goal", width: 24 },
  { key: "promotionType", width: 14 },
  { key: "targetType", width: 18 },
  { key: "purchaseBasis", width: 14 },
  { key: "purchaseQuantity", width: 16 },
  { key: "rewardBasis", width: 22 },
  { key: "targetProduct", width: 24 },
  { key: "excludedProduct", width: 24 },
  { key: "rewardProduct", width: 40 },
  { key: "channel", width: 20 },
  { key: "startDate", width: 18 },
  { key: "endDate", width: 18 },
];

// Import 시 허용하는 Target Type 코드 → 저장 triggerType (미기재·불일치 시 SPECIFIC_PRODUCT)
export const IMPORT_TARGET_TYPES: Record<string, string> = {
  SPECIFIC_PRODUCT: "Purchase Specific Product or Label",
  ORDER_AMOUNT: "Purchase Over Amount Threshold",
  ALL_PRODUCT: "Purchase Any Product",
};

// Import 시 허용하는 Promotion Type (미기재·불일치 시 GWP)
export const IMPORT_PROMOTION_TYPES = ["GWP", "PACKAGE"] as const;

// 템플릿에 포함되는 샘플 행 (Target Type · 증정 기준별 대표 케이스)
// - 제품은 "제품명 - 코드" 형식, 여러 개는 줄바꿈(Alt+Enter)으로 구분
// - Order Amount 의 rewardProduct 는 "[하한 ~ 상한] 제품명 - 코드" (상한 비우면 무제한)
// - endDate 를 비우면 상시(Always-on)
export const IMPORT_TEMPLATE_SAMPLE_ROWS: Record<string, string | number>[] = [
  {
    promotionTitle: "[APPLY-C6] GWP 옵션선택 자사몰전용",
    goal: "apply 검증 C6 OPTION_SELECT",
    promotionType: "GWP",
    targetType: "SPECIFIC_PRODUCT",
    purchaseBasis: "ANY",
    purchaseQuantity: 1,
    rewardBasis: "PER_ORDER",
    targetProduct: "제품F - STB0006",
    excludedProduct: "",
    rewardProduct: "선택 사은품 A - SGIFT006\n선택 사은품 B - SGIFT007",
    channel: "TAM_Official_KR",
    startDate: "2026-10-01 09:00",
    endDate: "2027-01-01 09:00",
  },
  {
    promotionTitle: "[APPLY-C5] GWP 재고 1개 소진종료",
    goal: "apply 검증 C5 SOLD_OUT",
    promotionType: "GWP",
    targetType: "SPECIFIC_PRODUCT",
    purchaseBasis: "ANY",
    purchaseQuantity: 1,
    rewardBasis: "PER_ORDER",
    targetProduct: "제품E - STB0005",
    excludedProduct: "",
    rewardProduct: "한정 사은품 - SGIFT005",
    channel: "TAM_KAKAO_KR",
    startDate: "2026-09-01 09:00",
    endDate: "2026-09-17 16:05",
  },
  {
    promotionTitle: "[APPLY-C4] GWP 금액구간 사은품",
    goal: "apply 검증 C4",
    promotionType: "GWP",
    targetType: "ORDER_AMOUNT",
    purchaseBasis: "",
    purchaseQuantity: "",
    rewardBasis: "",
    targetProduct: "",
    excludedProduct: "쇼핑백 - SBAG001",
    rewardProduct:
      "[50,000 ~ 100,000] 핸드크림 - SGIFT003\n[100,000 ~ ] 퍼퓸 미니 - SGIFT004",
    channel: "TAM_NAVER_KR",
    startDate: "2026-10-01 09:00",
    endDate: "2027-01-01 09:00",
  },
  {
    promotionTitle: "[APPLY-C3] PACKAGE 전제품 쇼핑백",
    goal: "apply 검증 C3",
    promotionType: "PACKAGE",
    targetType: "ALL_PRODUCT",
    purchaseBasis: "",
    purchaseQuantity: "",
    rewardBasis: "PER_PRODUCT_QUANTITY",
    targetProduct: "",
    excludedProduct: "쇼핑백 - SBAG001\n제품E - STB0005",
    rewardProduct: "쇼핑백 - SPKG001",
    channel: "TAM_NAVER_KR\nTAM_KAKAO_KR\nTAM_Official_KR",
    startDate: "2026-10-01 09:00",
    endDate: "",
  },
  {
    promotionTitle: "[APPLY-C2] GWP 수량비례 다중세트",
    goal: "apply 검증 C2",
    promotionType: "GWP",
    targetType: "SPECIFIC_PRODUCT",
    purchaseBasis: "ANY",
    purchaseQuantity: 2,
    rewardBasis: "PER_PRODUCT_QUANTITY",
    targetProduct: "제품B - STB0002",
    excludedProduct: "",
    rewardProduct: "샘플 키트 - SGIFT002",
    channel: "TAM_NAVER_KR",
    startDate: "2026-10-01 09:00",
    endDate: "2027-01-01 09:00",
  },
  {
    promotionTitle: "[APPLY-C1] GWP 특정제품 주문당 1회",
    goal: "apply 검증 C1",
    promotionType: "GWP",
    targetType: "SPECIFIC_PRODUCT",
    purchaseBasis: "ANY",
    purchaseQuantity: 2,
    rewardBasis: "PER_ORDER",
    targetProduct: "제품A - STB0001",
    excludedProduct: "",
    rewardProduct: "미니 파우치 - SGIFT001",
    channel: "TAM_KAKAO_KR",
    startDate: "2026-10-01 09:00",
    endDate: "2027-01-01 09:00",
  },
];

// 단축키 아이템
export const SHORTCUTS_ITEMS = (
  timezone: string,
): PickersShortcutsItem<DateRange<Dayjs>>[] => {
  return [
    {
      label: "Today",
      getValue: () => {
        const today = dayjs();
        return [
          today.tz(timezone).startOf("day"),
          today.tz(timezone).endOf("day"),
        ];
      },
    },
    {
      label: "Week",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(1, "week").startOf("day"), today];
      },
    },
    {
      label: "Month",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(1, "month").startOf("day"), today];
      },
    },
    {
      label: "3 Month",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(3, "month").startOf("day"), today];
      },
    },
    { label: "Reset", getValue: () => [null, null] },
  ];
};
