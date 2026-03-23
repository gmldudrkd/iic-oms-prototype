import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";
import { ModifiedChannelStockHistoryRequest } from "@/features/stock/history/models/types";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import { OnlineStockHistoryRequest } from "@/shared/generated/oms/types/Stock";

export const queryKeys = {
  // user
  userPermissions: () => ["user-permissions"] as const,
  userTimezone: () => ["user-timezone"] as const,
  // integrated-order
  orderDetail: (orderId: string) => ["order-detail", orderId] as const,
  returnDetail: (orderId: string) => ["return-detail", orderId] as const,
  exchangeDetail: (orderId: string) => ["exchange-detail", orderId] as const,
  logHistoryDetail: (orderId: string) =>
    ["log-history-detail", orderId] as const,
  // channel
  channelList: () => ["channel-list"] as const,
  channelDetail: (id: string) => ["channel-detail", id] as const,
  activeChannelList: (brand: string, corporation: string) =>
    ["active-channel-list", brand, corporation] as const,
  sapChannelList: (queryParams: string) =>
    ["sap-channel-list", queryParams] as const,
  // stock
  onlineStockOverview: (params?: StockDashboardRequestForm | null) =>
    ["online-stock-overview", params] as const,
  onlineStockOverviewWithoutParams: () => ["online-stock-overview"] as const,
  channelStockOverview: (params?: StockDashboardRequestForm | null) =>
    ["channel-stock-overview", params] as const,
  channelStockOverviewWithoutParams: () => ["channel-stock-overview"] as const,
  onlineStockSettings: (brand: string, corporation: string) =>
    ["online-stock-settings", brand, corporation] as const,
  channelStockSetting: (
    brand: unknown,
    corporation: unknown,
    searchKeyType: string,
    searchKeyword: string,
  ) =>
    [
      "channel-stock-setting",
      brand,
      corporation,
      searchKeyType,
      searchKeyword,
    ] as const,
  stockHistory: (params?: StockHistorySearchFilterForm | null) =>
    ["stock-history", params] as const,
  onlineStockHistory: ({
    params,
    sku,
  }: {
    params: OnlineStockHistoryRequest;
    sku: string;
  }) => ["online-stock-history", JSON.stringify(params), sku] as const,
  channelStockHistory: ({
    params,
    sku,
  }: {
    params: ModifiedChannelStockHistoryRequest;
    sku: string;
  }) => ["channel-stock-history", JSON.stringify(params), sku] as const,
  // product
  productDetail: (sku: string) => ["product-detail", sku] as const,
};
