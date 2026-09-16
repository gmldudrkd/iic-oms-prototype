import { DateRange, PickersShortcutsItem } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";

// Date Type 옵션
export const DATE_TYPE_OPTIONS = [
  { label: "Start Date", value: "startDate" },
  { label: "End Date", value: "endDate" },
];

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
  { label: "GWP Name", value: "gwpName" },
  { label: "GWP SAP Code", value: "gwpSapCode" },
  { label: "Reward SAP Code", value: "rewardSapCode" },
  { label: "Target Product Name", value: "targetProductName" },
  { label: "Target SAP Code", value: "targetSapCode" },
];

// Title 단일 검색 시 부분검색 최소 글자 수 (복수 키워드는 정확일치)
export const TITLE_PARTIAL_SEARCH_MIN_LENGTH = 2;

// 멀티 검색 가능한 키 타입
export const MULTI_SEARCH_KEY_TYPES = [
  "id",
  "title",
  "createdBy",
  "updatedBy",
  "gwpName",
  "gwpSapCode",
  "rewardSapCode",
  "targetProductName",
  "targetSapCode",
];

// Import 템플릿 컬럼 (헤더명은 업로드 파싱 키와 동일해야 함)
export const IMPORT_TEMPLATE_COLUMNS: { key: string; width: number }[] = [
  { key: "Title", width: 40 },
  { key: "Brand", width: 8 },
  { key: "Corp", width: 8 },
  { key: "Channel", width: 24 },
  { key: "Trigger Type", width: 36 },
  { key: "Target SAP Code", width: 18 },
  { key: "Reward Product Name", width: 36 },
  { key: "Reward SAP Code", width: 18 },
  { key: "Reward Qty", width: 12 },
  { key: "Start Date", width: 14 },
  { key: "End Date", width: 14 },
];

// Import 시 허용하는 Trigger Type (미기재/불일치 시 첫 번째 값으로 대체)
export const IMPORT_TRIGGER_TYPES = [
  "Purchase Specific Product or Label",
  "Purchase Over Amount Threshold",
  "Purchase Any Product",
];

// 템플릿에 포함되는 샘플 1행
export const IMPORT_TEMPLATE_SAMPLE_ROW: Record<string, string | number> = {
  Title: "SHRY 240ml BLACK RIBBON GWP · 공식몰",
  Brand: "GM",
  Corp: "KR",
  Channel: "GM_Official_KR",
  "Trigger Type": IMPORT_TRIGGER_TYPES[0],
  "Target SAP Code": "32001988",
  "Reward Product Name": "SHRY 240ml BLACK RIBBON_23",
  "Reward SAP Code": "16000248",
  "Reward Qty": 1,
  "Start Date": "2026-10-01",
  "End Date": "2026-10-31",
};

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
