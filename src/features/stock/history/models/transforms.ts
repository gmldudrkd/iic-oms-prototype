import { StockHistoryWithProductResponse } from "@/shared/generated/oms/types/Stock";

export interface ChannelHistoryData {
  channel: string;
  channelEnum: string;
  distributed: number;
  preOrder: number;
  used: number;
  shipped: number;
  available: number;
}

export interface TransformedStockHistoryRow {
  id: string;
  timestamp: string;
  sku: string;
  productName: string;
  // Online Qty
  erp: number | null;
  erpUpdate: number | null;
  safety: number | null;
  undistributed: number | null;
  // Channel Qty - 배열로 보관
  channelStocks: ChannelHistoryData[];
}

export const transformStockHistoryData = (
  data: StockHistoryWithProductResponse,
): TransformedStockHistoryRow[] => {
  const transformedRows: TransformedStockHistoryRow[] = [];

  data.histories.forEach((item) => {
    const { timestamp, onlineStock, undistributedQuantity, channelStocks } =
      item;

    if (channelStocks.length === 0) return;

    // 각 채널 데이터 변환
    const channelHistoryData: ChannelHistoryData[] = channelStocks.map(
      (channelStock) => ({
        channel: channelStock.channelType.description || "",
        channelEnum: channelStock.channelType.name,
        distributed: channelStock.distributedQuantity,
        preOrder: channelStock.preorderQuantity,
        used: channelStock.usedQuantity,
        shipped: channelStock.shippedQuantity,
        available: channelStock.availableQuantity,
      }),
    );

    // Total 행 계산 및 추가
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

    channelHistoryData.push({
      channel: "Total",
      channelEnum: "Total",
      distributed: totalDistributed,
      preOrder: totalPreorder,
      used: totalUsed,
      shipped: totalShipped,
      available: totalAvailable,
    });

    // 하나의 행으로 생성
    transformedRows.push({
      id: timestamp,
      sku: data.sku,
      productName: data.productName ?? "",
      timestamp,
      // Online Qty
      erp: onlineStock?.quantity ?? null,
      erpUpdate: onlineStock?.movementQuantity ?? null,
      safety: onlineStock?.safetyQuantity ?? null,
      undistributed: undistributedQuantity ?? null,
      // Channel Qty
      channelStocks: channelHistoryData,
    });
  });

  return transformedRows;
};
