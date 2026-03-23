import useStockSettingColumns from "@/features/stock/overview/hooks/shared/useStockSettingColumns";
import { ChannelSelection } from "@/features/stock/overview/models/types";

interface UseOnlineStockSettingColumnsOptions {
  onOffPeriodScheduledClick?: (selection: ChannelSelection) => void;
  onPreOrderExpiredAtClick?: (selection: ChannelSelection) => void;
}

export default function useOnlineStockSettingColumns(
  options?: UseOnlineStockSettingColumnsOptions,
) {
  return useStockSettingColumns({
    variant: "online",
    onOffPeriodScheduledClick: options?.onOffPeriodScheduledClick,
    onPreOrderExpiredAtClick: options?.onPreOrderExpiredAtClick,
  });
}
