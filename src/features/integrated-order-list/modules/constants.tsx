import { GridColDef } from "@mui/x-data-grid-pro";
import { DateRange, PickersShortcutsItem } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";

import {
  COLUMNS_CANCEL_ORDER,
  COLUMNS_CANCEL_RETURN,
  COLUMNS_CANCEL_EXCHANGE,
  COLUMNS_ORDER_LIST,
  COLUMNS_RETURN_LIST,
  COLUMNS_EXCHANGE_LIST,
  COLUMNS_RESHIPMENT_LIST,
} from "@/features/integrated-order-list/modules/columns";

// 검색 폼 필드
export const FORM_FIELDS = [
  { name: "searchType", label: "Search Type", placeholder: "Select" },
  {
    name: "searchKeyword",
    label: "Search Keyword",
    placeholder: "Search",
  },
  { name: "statusFilter", label: "Status", placeholder: "Select" },
  { name: "channelCodes", label: "Channel", placeholder: "Select" },
  { name: "period", label: "Period", placeholder: "Select" },
] as const;

// 검색 폼 컨트롤 스타일
export const FORM_CONTROL_STYLES = {
  className: "!ml-0 !mr-0 flex justify-between gap-5",
  sx: { "& .MuiFormControlLabel-label": { flex: 1 } },
};

// 검색 폼 단축키아이템
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

// 검색 필드
// SEARCH_KEY_TYPE
export const SEARCH_KEY_TYPE_ORDER = [
  { label: "Order No", value: "originOrderNos" },
  { label: "Orderer Name", value: "ordererName" },
  { label: "Orderer Email", value: "ordererEmail" },
  { label: "Orderer Phone", value: "ordererPhone" },
  { label: "Shipment No", value: "shipmentNos" },
  { label: "SKU Code", value: "skus" },
  { label: "Purchase No", value: "purchaseNo" },
];

export const SEARCH_KEY_TYPE_RETURN = [
  { label: "Order No", value: "originOrderNos" },
  { label: "Orderer Name", value: "ordererName" },
  { label: "Orderer Email", value: "ordererEmail" },
  { label: "Orderer Phone", value: "ordererPhone" },
  { label: "Return No", value: "returnNos" },
  { label: "Purchase No", value: "purchaseNo" },
  { label: "Tracking No", value: "trackingNo" },
];

export const SEARCH_KEY_TYPE_EXCHANGE = [
  { label: "Order No", value: "originOrderNos" },
  { label: "Orderer Name", value: "ordererName" },
  { label: "Orderer Email", value: "ordererEmail" },
  { label: "Orderer Phone", value: "ordererPhone" },
  { label: "Exchange No", value: "exchangeNos" },
  { label: "Purchase No", value: "purchaseNo" },
  { label: "Tracking No", value: "trackingNo" },
];

export const SEARCH_KEY_TYPE_RESHIPMENT = [
  { label: "Order No", value: "originOrderNos" },
  { label: "Orderer Name", value: "ordererName" },
  { label: "Orderer Email", value: "ordererEmail" },
  { label: "Orderer Phone", value: "ordererPhone" },
  { label: "Reshipment No", value: "reshipmentNos" },
  { label: "Tracking No", value: "trackingNo" },
];

// GROUPED_STATUS_FILTER
export const GROUPED_STATUS_FILTER_ORDER = [
  { label: "Pending", value: "PENDING" },
  { label: "Deleted", value: "DELETED" },
  { label: "Collected", value: "COLLECTED" },
  {
    label: "Partly Confirmed",
    value: "PARTLY_CONFIRMED",
  },
  {
    label: "Partial Shipment Requested",
    value: "PARTIAL_SHIPMENT_REQUESTED",
  },
  {
    label: "Shipment Requested",
    value: "SHIPMENT_REQUESTED",
  },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELED" },
];
export const GROUPED_STATUS_FILTER_SHIPPING = [
  {
    label: "Shipping Status Filter",
    value: "__header_shipping",
    isGroupHeader: true,
  },
  { label: "Picking Requested", value: "PICKING_REQUESTED" },
  { label: "Picking Rejected", value: "PICKING_REJECTED" },
  { label: "Picked", value: "PICKED" },
  { label: "Packed", value: "PACKED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Lost", value: "LOST" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Canceled", value: "CANCELED" },
  {
    label: "Store Pickup Filter",
    value: "__header_store_pickup",
    isGroupHeader: true,
  },
  { label: "Pickup Requested", value: "PICKUP_REQUESTED" },
  { label: "Shipped", value: "STORE_SHIPPED" },
  { label: "Prepared", value: "PREPARED" },
  { label: "Completed", value: "STORE_COMPLETED" },
  { label: "Canceled", value: "STORE_CANCELED" },
];
export const GROUPED_STATUS_FILTER_RETURN = [
  { label: "Pending", value: "PENDING" },
  {
    label: "Pickup Requested",
    value: "PICKUP_REQUESTED",
  },
  {
    label: "Pickup Ongoing",
    value: "PICKUP_ONGOING",
  },
  { label: "Received", value: "RECEIVED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Canceled", value: "CANCELED" },
];
export const GROUPED_STATUS_FILTER_EXCHANGE = [
  { label: "Pending", value: "PENDING" },
  { label: "Pickup Requested", value: "PICKUP_REQUESTED" },
  { label: "Pickup Ongoing", value: "PICKUP_ONGOING" },
  { label: "Received", value: "RECEIVED" },
  { label: "Inspected", value: "INSPECTED" },
  { label: "Shipment Requested", value: "SHIPMENT_REQUESTED" },
  { label: "Exchanged", value: "EXCHANGED" },
  { label: "Canceled", value: "CANCELED" },
];

export const GROUPED_STATUS_FILTER_RESHIPMENT = [
  { label: "Picking Requested", value: "PICKING_REQUESTED" },
  { label: "Picking Rejected", value: "PICKING_REJECTED" },
  { label: "Picked", value: "PICKED" },
  { label: "Packed", value: "PACKED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Canceled", value: "CANCELED" },
];

// GROUPED_CONFIG
export const GROUPED_CONFIG = {
  order: {
    columns: COLUMNS_ORDER_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: "Order Cancelation",
    bulkCancelColumns: COLUMNS_CANCEL_ORDER as GridColDef[],
    bulkCancelConfirmLabel: "Cancel and Refund",
    ableBulkCancelStatus: ["Pending", "Collected", "Partly Confirmed"],
  },
  shipment: {
    columns: COLUMNS_ORDER_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: "Order Cancelation",
    bulkCancelColumns: COLUMNS_CANCEL_ORDER as GridColDef[],
    bulkCancelConfirmLabel: "Cancel and Refund",
    ableBulkCancelStatus: ["Pending", "Collected", "Partly Confirmed"],
  },
  // TODO : storePickup 리스트 확인 필요
  storePickup: {
    columns: COLUMNS_ORDER_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: "Order Cancelation",
    bulkCancelColumns: COLUMNS_CANCEL_ORDER as GridColDef[],
    bulkCancelConfirmLabel: "Cancel and Refund",
    ableBulkCancelStatus: ["Pending", "Collected", "Partly Confirmed"],
  },
  return: {
    columns: COLUMNS_RETURN_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: "Bulk Cancel",
    bulkCancelColumns: COLUMNS_CANCEL_RETURN as GridColDef[],
    bulkCancelConfirmLabel: "Cancel Return",
    ableBulkCancelStatus: ["Pending"],
  },
  exchange: {
    columns: COLUMNS_EXCHANGE_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: "Bulk Cancel",
    bulkCancelColumns: COLUMNS_CANCEL_EXCHANGE as GridColDef[],
    bulkCancelConfirmLabel: "Cancel Exchange",
    ableBulkCancelStatus: [
      "Pending",
      "Pickup Requested",
      "Pickup Ongoing",
      "Received",
    ],
  },
  reshipment: {
    columns: COLUMNS_RESHIPMENT_LIST as GridColDef[],
    totalCount: 0,
    bulkCancelTitle: null,
    bulkCancelColumns: null,
    bulkCancelConfirmLabel: null,
    ableBulkCancelStatus: null,
  },
};
