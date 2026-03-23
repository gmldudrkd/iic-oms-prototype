import { DateRange, PickersShortcutsItem } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";

// Date Type 옵션
export const DATE_TYPE_OPTIONS = [
  { label: "Start Date", value: "startDate" },
  { label: "End Date", value: "endDate" },
];

// Status 옵션
export const STATUS_OPTIONS = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Draft", value: "DRAFT" },
];

// Search Key Type 옵션
export const SEARCH_KEY_TYPE_OPTIONS = [
  { label: "Title", value: "title" },
  { label: "Created By", value: "createdBy" },
  { label: "GWP Name", value: "gwpName" },
  { label: "GWP SAP Code", value: "gwpSapCode" },
  { label: "Target Product Name", value: "targetProductName" },
  { label: "Target SAP Code", value: "targetSapCode" },
];

// 멀티 검색 가능한 키 타입
export const MULTI_SEARCH_KEY_TYPES = ["gwpSapCode", "targetSapCode"];

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
