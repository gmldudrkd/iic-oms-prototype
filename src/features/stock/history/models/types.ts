import z from "zod";

import {
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
  ONLINE_STOCK_HISTORY_TAB_VALUE,
  CHANNEL_STOCK_HISTORY_TAB_VALUE,
} from "@/features/stock/history/modules/constants";

import {
  OnlineStockHistoryRequest,
  ChannelStockHistoryRequest,
  StockHistorySearchRequest,
  ChannelStockHistoryRequestChannelTypesEnum,
} from "@/shared/generated/oms/types/Stock";

export const CurrentSearchKeyTypeSchema = z.enum([
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
]);

export type CurrentSearchKeyType = z.infer<typeof CurrentSearchKeyTypeSchema>;

export interface StockHistorySearchFilterForm
  extends StockHistorySearchRequest {
  currentSearchKeyType: CurrentSearchKeyType;
  searchKeyword: string;
}

export interface ModifiedChannelStockHistoryRequest
  extends Omit<ChannelStockHistoryRequest, "channelTypes"> {
  channelTypes: ChannelStockHistoryRequestChannelTypesEnum | "";
}

export interface StockHistoryDetailParamsForm {
  onlineStockHistory: OnlineStockHistoryRequest;
  channelStockHistory: ModifiedChannelStockHistoryRequest;
  sku: string;
  productName: string;
}

export const StockHistoryTabSchema = z.enum([
  ONLINE_STOCK_HISTORY_TAB_VALUE,
  CHANNEL_STOCK_HISTORY_TAB_VALUE,
]);

export type StockHistoryTabType = z.infer<typeof StockHistoryTabSchema>;
