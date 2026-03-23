import { useQuery } from "@tanstack/react-query";

import { getStockOverview } from "@/features/stock/overview/models/apis";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

export default function useGetChannelStockOverview(
  params: StockDashboardRequestForm | null,
) {
  const timezone = useTimezoneStore((state) => state.timezone);
  const queryKey = queryKeys.channelStockOverview(params);

  return useQuery({
    queryKey: [...queryKey, timezone, params],
    queryFn: () => getStockOverview("channel", params),
    placeholderData: (previousData) => previousData,
    enabled: !!params,
  });
}
