import { useMemo } from "react";

import { OnlineQtyFilters } from "@/features/stock/history/hooks/stock-history-chart/useChartFilters";
import { ONLINE_QTY_COLORS } from "@/features/stock/history/modules/constants";
import { generateRandomChannelColor } from "@/features/stock/history/modules/utils";

import { StockHistoryResponse } from "@/shared/generated/oms/types/Stock";

export interface LineConfig {
  id: string;
  label: string;
  data: (number | null)[];
  color: string;
  strokeDasharray?: string;
}

interface UseChartDataParams {
  historyData: StockHistoryResponse[];
  onlineQtyFilters: OnlineQtyFilters;
  channelFilters: Record<string, boolean>;
  availableChannels: string[];
}

export default function useChartData({
  historyData,
  onlineQtyFilters,
  channelFilters,
  availableChannels,
}: UseChartDataParams) {
  const { xAxisData, series } = useMemo(() => {
    if (!historyData || historyData.length === 0) {
      return { xAxisData: [], series: [] };
    }

    // X축 데이터 (timestamp)
    const xAxisData = historyData.map((item) => new Date(item.timestamp));

    const allSeries: LineConfig[] = [];

    // Online Qty 라인 추가
    if (onlineQtyFilters.ERP) {
      allSeries.push({
        id: "erp",
        label: "ERP",
        data: historyData.map((item) => item.onlineStock?.quantity ?? null),
        color: ONLINE_QTY_COLORS.ERP,
      });
    }

    if (onlineQtyFilters["ERP Update"]) {
      allSeries.push({
        id: "erpUpdate",
        label: "ERP Update",
        data: historyData.map(
          (item) => item.onlineStock?.movementQuantity ?? null,
        ),
        color: ONLINE_QTY_COLORS["ERP Update"],
      });
    }

    if (onlineQtyFilters.Safety) {
      allSeries.push({
        id: "safety",
        label: "Safety",
        data: historyData.map(
          (item) => item.onlineStock?.safetyQuantity ?? null,
        ),
        color: ONLINE_QTY_COLORS.Safety,
      });
    }

    if (onlineQtyFilters.Undistributed) {
      allSeries.push({
        id: "undistributed",
        label: "Undistributed",
        data: historyData.map((item) => item.undistributedQuantity ?? null),
        color: ONLINE_QTY_COLORS.Undistributed,
      });
    }

    // Channel Qty 라인 추가
    availableChannels.forEach((channel) => {
      if (!channelFilters[channel]) return;

      const color =
        generateRandomChannelColor(availableChannels).get(channel) ?? "";

      // Distributed (실선)
      allSeries.push({
        id: `${channel}_distributed`,
        label: `${channel} - Distributed`,
        data: historyData.map((item) => {
          const channelStock = item.channelStocks.find(
            (cs) =>
              cs.channelType.description === channel ||
              cs.channelType.name === channel,
          );
          return channelStock?.distributedQuantity ?? null;
        }),
        color,
      });

      // Available (점선)
      allSeries.push({
        id: `${channel}_available`,
        label: `${channel} - Available`,
        data: historyData.map((item) => {
          const channelStock = item.channelStocks.find(
            (cs) =>
              cs.channelType.description === channel ||
              cs.channelType.name === channel,
          );
          return channelStock?.availableQuantity ?? null;
        }),
        color,
        strokeDasharray: "5 5",
      });
    });

    return { xAxisData, series: allSeries };
  }, [historyData, onlineQtyFilters, channelFilters, availableChannels]);

  return { xAxisData, series };
}
