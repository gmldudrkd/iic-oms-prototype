import dayjs from "dayjs";

import { OFF_PERIOD_SCHEDULED } from "@/features/stock/overview/modules/constants";

import { StockDashboardResponse } from "@/shared/generated/oms/types/Stock";

export interface ChannelStockData {
  channel: string;
  channelEnum: string;
  distributionRatio: number | null;
  distributed: number;
  preOrder: number;
  used: number;
  shipped: number;
  available: number;
  stockStatus: string;
  status: string;
  offPeriod: string | null;
  preOrderExpiredAt?: string | null;
  channelSendOffStartedAt?: string | null;
  channelSendOffEndedAt?: string | null;
}

export interface FlattenedStockRow {
  id: string;
  productType: string;
  sku: string;
  skuName: string;
  bundleUnitQty: number;
  upcCode: string;
  sapCode: string;
  productName: string;
  erp: number;
  erpUpdate: number;
  safety: number;
  undistributed: number;
  channelStocks: ChannelStockData[]; // 채널 데이터를 배열로 보관
  singleSku: string;
}

export const transformStockDashboardData = (
  data: StockDashboardResponse[],
): FlattenedStockRow[] => {
  const flattenedRows: FlattenedStockRow[] = [];

  data.forEach((item) => {
    const { productType, sku, skuName, products } = item;

    // products 배열이 비어있으면 건너뛰기
    if (products.length === 0) return;

    // products 배열 전체를 순회하여 각 product마다 행 생성
    products.forEach((product) => {
      const {
        upcCode,
        productCode,
        productName,
        unitQuantity,
        onlineQuantity,
        onlineMovementQuantity,
        safetyQuantity,
        undistributedQuantity,
        channelStocks,
        sku: singleSku,
      } = product;

      // 채널 데이터 변환
      const channelStockData: ChannelStockData[] = channelStocks.map(
        (channelStock) => {
          const {
            channel,
            rate,
            distributedQuantity,
            preorderQuantity,
            usedQuantity,
            shippedQuantity,
            availableQuantity,
            channelSendStatus,
            channelSendOffStartedAt,
            channelSendOffEndedAt,
            preorderStockExpiredAt,
          } = channelStock;

          // Stock Status 계산
          let stockStatus = "IN_STOCK";
          if (availableQuantity <= 0) {
            stockStatus = "OUT_OF_STOCK";
          }
          if (availableQuantity < 0) {
            stockStatus = "OVERSELLING";
          }

          // Off Period 포맷팅
          let offPeriod: string | null = null;
          if (channelSendStatus === "OFF" && channelSendOffStartedAt) {
            offPeriod = `${dayjs(channelSendOffStartedAt).format("YYYY-MM-DD hh:mm A")} ~ ${channelSendOffEndedAt ? dayjs(channelSendOffEndedAt).format("YYYY-MM-DD hh:mm A") : ""}`;
          }

          if (channelSendStatus === "ON" && channelSendOffStartedAt) {
            offPeriod = OFF_PERIOD_SCHEDULED;
          }

          return {
            channel: channel.description || "",
            channelEnum: channel.name,
            distributionRatio: rate,
            distributed: distributedQuantity,
            preOrder: preorderQuantity,
            used: usedQuantity,
            shipped: shippedQuantity,
            available: availableQuantity,
            stockStatus,
            status: channelSendStatus,
            offPeriod,
            preOrderExpiredAt: preorderStockExpiredAt,
            channelSendOffStartedAt,
            channelSendOffEndedAt,
          };
        },
      );

      // Total 행 데이터 계산
      const totalDistributionRatio = channelStocks.reduce(
        (sum, cs) => sum + cs.rate,
        0,
      );
      const totalDistributed = channelStocks.reduce(
        (sum, cs) => sum + cs.distributedQuantity,
        0,
      );
      const totalPreorder = channelStocks.reduce(
        (sum, cs) => sum + cs.preorderQuantity,
        0,
      );
      const totalUsed = channelStocks.reduce(
        (sum, cs) => sum + cs.usedQuantity,
        0,
      );
      const totalShipped = channelStocks.reduce(
        (sum, cs) => sum + cs.shippedQuantity,
        0,
      );
      const totalAvailable = channelStocks.reduce(
        (sum, cs) => sum + cs.availableQuantity,
        0,
      );

      // Total 행 추가
      channelStockData.push({
        channel: "Total",
        channelEnum: "Total",
        distributionRatio: totalDistributionRatio,
        distributed: totalDistributed,
        preOrder: totalPreorder,
        used: totalUsed,
        shipped: totalShipped,
        available: totalAvailable,
        stockStatus: "",
        status: "",
        offPeriod: null,
        preOrderExpiredAt: undefined,
      });

      // 각 product마다 별도의 행으로 생성
      // id는 고유하게 생성하기 위해 sku와 productCode를 조합
      flattenedRows.push({
        id: `${sku}-${productCode}`,
        productType: productType.description || productType.name,
        sku,
        skuName: skuName || "",
        bundleUnitQty: unitQuantity,
        upcCode,
        sapCode: productCode,
        productName,
        erp: onlineQuantity,
        erpUpdate: onlineMovementQuantity,
        safety: safetyQuantity,
        undistributed: undistributedQuantity,
        channelStocks: channelStockData,
        singleSku,
      });
    });
  });

  return flattenedRows;
};
