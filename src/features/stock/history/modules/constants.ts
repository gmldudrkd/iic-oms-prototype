import { CurrentSearchKeyType } from "@/features/stock/history/models/types";

import {
  OnlineStockHistoryRequestEventsEnum,
  StockHistorySearchRequestPeriodTypeEnum,
  ChannelStockHistoryRequestEventsEnum,
} from "@/shared/generated/oms/types/Stock";

export const PERIOD_TYPE_LIST = [
  { label: "Daily", value: StockHistorySearchRequestPeriodTypeEnum.DAILY },
  { label: "Hourly", value: StockHistorySearchRequestPeriodTypeEnum.HOURLY },
] as const;

export const ONLINE_STOCK_HISTORY_TAB_VALUE = "online-stock-history-tab";
export const CHANNEL_STOCK_HISTORY_TAB_VALUE = "channel-stock-history-tab";
export const CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE = "productCode";
export const CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME = "productName";
export const CURRENT_SEARCH_KEY_TYPE_SKU_CODE = "sku";

export const SEARCH_KEY_TYPE_LIST: {
  label: string;
  value: CurrentSearchKeyType;
}[] = [
  {
    label: "SAP Code",
    value: CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
  },
  {
    label: "SKU Code",
    value: CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
  },
  // {
  //   label: "SAP Name",
  //   value: CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  // },
];

// Online Qty 색상
export const ONLINE_QTY_COLORS = {
  ERP: "rgba(213, 0, 249, 1)",
  "ERP Update": "rgba(33, 150, 243, 1)",
  Safety: "rgba(38, 166, 154, 1)",
  Undistributed: "rgba(176, 190, 197, 1)",
} as const;

export type OnlineQtyKey = keyof typeof ONLINE_QTY_COLORS;

export const ONLINE_STOCK_HISTORY_EVENTS = {
  [OnlineStockHistoryRequestEventsEnum.UPDATE_ONLINE_STOCK]: "Received ERP",
  [OnlineStockHistoryRequestEventsEnum.UPDATE_MOVEMENT]: "Received ERP Update",
  [OnlineStockHistoryRequestEventsEnum.UPDATE_SAFETY]: "Update Safety",
} as const;

export const CHANNEL_STOCK_HISTORY_EVENTS = {
  [ChannelStockHistoryRequestEventsEnum.UPDATE_ONLINE_STOCK]:
    "Distributed from  ERP",
  [ChannelStockHistoryRequestEventsEnum.CREATE_ORDER]: "Create Order",
  [ChannelStockHistoryRequestEventsEnum.SHIP_ORDER]: "Ship Order",
  [ChannelStockHistoryRequestEventsEnum.CANCEL_ORDER]: "Cancel Order",
  [ChannelStockHistoryRequestEventsEnum.TRANSFER]: "Transfer",
  [ChannelStockHistoryRequestEventsEnum.UPDATE_PREORDER]: "Update Pre-order",
} as const;
