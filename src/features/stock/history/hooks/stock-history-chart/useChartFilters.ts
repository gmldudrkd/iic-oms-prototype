import { useMemo, useState } from "react";

import { StockHistoryResponse } from "@/shared/generated/oms/types/Stock";

export interface OnlineQtyFilters {
  ERP: boolean;
  "ERP Update": boolean;
  Safety: boolean;
  Undistributed: boolean;
}

export default function useChartFilters(historyData: StockHistoryResponse[]) {
  // Online Qty 필터
  const [onlineQtyFilters, setOnlineQtyFilters] = useState<OnlineQtyFilters>({
    ERP: true,
    "ERP Update": true,
    Safety: true,
    Undistributed: true,
  });

  // 채널 목록 추출
  const availableChannels = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    const channelSet = new Set<string>();
    historyData.forEach((item) => {
      item.channelStocks.forEach((cs) => {
        channelSet.add(cs.channelType.description || cs.channelType.name);
      });
    });
    return Array.from(channelSet);
  }, [historyData]);

  // 채널 필터 (초기값: 모두 미선택)
  const [channelFilters, setChannelFilters] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      availableChannels.forEach((channel) => {
        initial[channel] = false;
      });
      return initial;
    },
  );

  // 채널 필터 초기화
  useMemo(() => {
    const newFilters: Record<string, boolean> = {};
    availableChannels.forEach((channel) => {
      newFilters[channel] = channelFilters[channel] ?? true;
    });
    setChannelFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableChannels]);

  // Online Qty 전체 선택/해제 상태
  const allOnlineQtySelected = useMemo(() => {
    return Object.values(onlineQtyFilters).every((v) => v);
  }, [onlineQtyFilters]);

  const someOnlineQtySelected = useMemo(() => {
    return Object.values(onlineQtyFilters).some((v) => v);
  }, [onlineQtyFilters]);

  // Channel 전체 선택/해제 상태
  const allChannelsSelected = useMemo(() => {
    return Object.values(channelFilters).every((v) => v);
  }, [channelFilters]);

  const someChannelsSelected = useMemo(() => {
    return Object.values(channelFilters).some((v) => v);
  }, [channelFilters]);

  // Online Qty 전체 토글
  const handleToggleAllOnlineQty = () => {
    const newValue = !allOnlineQtySelected;
    setOnlineQtyFilters({
      ERP: newValue,
      "ERP Update": newValue,
      Safety: newValue,
      Undistributed: newValue,
    });
  };

  // Channel 전체 토글
  const handleToggleAllChannels = () => {
    const newValue = !allChannelsSelected;
    const newFilters: Record<string, boolean> = {};
    availableChannels.forEach((channel) => {
      newFilters[channel] = newValue;
    });
    setChannelFilters(newFilters);
  };

  // 개별 필터 토글
  const handleOnlineQtyFilterChange = (key: keyof OnlineQtyFilters) => {
    setOnlineQtyFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChannelFilterChange = (channel: string) => {
    setChannelFilters((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  return {
    onlineQtyFilters,
    channelFilters,
    availableChannels,
    allOnlineQtySelected,
    someOnlineQtySelected,
    allChannelsSelected,
    someChannelsSelected,
    handleToggleAllOnlineQty,
    handleToggleAllChannels,
    handleOnlineQtyFilterChange,
    handleChannelFilterChange,
  };
}
