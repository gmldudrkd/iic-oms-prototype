import { CurrentSearchKeyType } from "@/features/stock/overview/models/types";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import {
  StockDashboardRequestChannelSendStatusEnum,
  StockDashboardRequestProductTypeEnum,
  ChannelStockSyncUpdateRequestLinkTypeEnum,
} from "@/shared/generated/oms/types/Stock";

export const ONLINE_STOCK_SETTING_VALUE = "online-stock-setting";
export const CHANNEL_STOCK_SETTING_VALUE = "channel-stock-setting";

export const CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES = "productCodes";
export const CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME = "productName";
export const CURRENT_SEARCH_KEY_TYPE_SKU_CODE = "skus";

export const PRODUCT_TYPE_LIST: {
  label: string;
  value: StockDashboardRequestProductTypeEnum;
}[] = [
  {
    label: "Single",
    value: StockDashboardRequestProductTypeEnum.SINGLE,
  },
  {
    label: "Bundle",
    value: StockDashboardRequestProductTypeEnum.BUNDLE,
  },
];

export const SHOW_ONLY_SAFETY_STOCK_LIST: {
  label: string;
  value: StockDashboardRequestForm["hasSafetyQuantity"];
}[] = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "≥1",
    value: true,
  },
  {
    label: "=0",
    value: false,
  },
];

export const SHOW_ONLY_PRE_ORDER_STOCK_LIST: {
  label: string;
  value: StockDashboardRequestForm["hasPreorderQuantity"];
}[] = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "≥1",
    value: true,
  },
  {
    label: "=0",
    value: false,
  },
];

export const CHANNEL_SEND_STATUS_LIST: {
  label: string;
  value: StockDashboardRequestChannelSendStatusEnum;
}[] = [
  {
    label: "ON",
    value: StockDashboardRequestChannelSendStatusEnum.ON,
  },
  {
    label: "OFF",
    value: StockDashboardRequestChannelSendStatusEnum.OFF,
  },
];

export const SEARCH_KEY_TYPE_LIST: {
  label: string;
  value: CurrentSearchKeyType;
}[] = [
  {
    label: "SAP Code",
    value: CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
  },
  {
    label: "SKU Code",
    value: CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
  },
  {
    label: "SAP Name",
    value: CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  },
];

// Column Header Tooltips
export const COLUMN_TOOLTIPS = {
  ERP_UPDATE: "Quantity updated due to changes after the daily batch",
  DISTRIBUTED:
    "Quantity distributed to channels at the time of the daily batch",
  USED: "Allocated stock in use between the 'Pending' and 'Packed' statuses.",
  SHIPPED:
    "Allocated stock marked as 'Shipped' or 'Delivered', which is cleared when the next day's ERP stock is received.",
  AVAILABLE: "(Distributed Qty + pre-order Qty) - (Used Qty + Shipped Qty)",
} as const;

export const LINK_TYPE_MAP = {
  [StockDashboardRequestChannelSendStatusEnum.ON]:
    ChannelStockSyncUpdateRequestLinkTypeEnum.LINKED,
  [StockDashboardRequestChannelSendStatusEnum.OFF]:
    ChannelStockSyncUpdateRequestLinkTypeEnum.UNLINKED,
};

export const OFF_PERIOD_SCHEDULED = "SCHEDULED";
