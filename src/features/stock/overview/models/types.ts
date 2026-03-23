import { Dayjs } from "dayjs";
import { z } from "zod";

import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import {
  ONLINE_STOCK_SETTING_VALUE,
  CHANNEL_STOCK_SETTING_VALUE,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
} from "@/features/stock/overview/modules/constants";

import {
  StockDashboardRequest,
  StockDashboardRequestChannelSendStatusEnum,
  StockDashboardRequestChannelTypesEnum,
  StockDashboardRequestProductTypeEnum,
} from "@/shared/generated/oms/types/Stock";

export const StockSettingTabSchema = z.enum([
  ONLINE_STOCK_SETTING_VALUE,
  CHANNEL_STOCK_SETTING_VALUE,
]);

export type StockSettingTabType = z.infer<typeof StockSettingTabSchema>;

export const CurrentSearchKeyTypeSchema = z.enum([
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
]);

export type CurrentSearchKeyType = z.infer<typeof CurrentSearchKeyTypeSchema>;

export interface StockDashboardRequestForm
  extends Omit<
    StockDashboardRequest,
    | "channelTypes"
    | "channelSendStatus"
    | "hasPreorderQuantity"
    | "hasSafetyQuantity"
  > {
  channelTypes: (StockDashboardRequestChannelTypesEnum | "All")[];
  productTypes: (StockDashboardRequestProductTypeEnum | "All")[];
  currentSearchKeyType: CurrentSearchKeyType;
  searchKeyword: string;
  channelSendStatus: (StockDashboardRequestChannelSendStatusEnum | "All")[];
  hasPreorderQuantity: boolean | "All";
  hasSafetyQuantity: boolean | "All";
}

export interface ChannelSelection {
  rowId: string;
  sku: string;
  channelName: string;
  channelData: ChannelStockData;
  singleSku: string;
}

export interface OffPeriod {
  channelSendStatus: StockDashboardRequestChannelSendStatusEnum;
  startDate: Dayjs | null;
  endDate: Dayjs | null | undefined;
}

export interface PreOrderSetting {
  preOrderExpiredAt: Dayjs | null | undefined;
}
