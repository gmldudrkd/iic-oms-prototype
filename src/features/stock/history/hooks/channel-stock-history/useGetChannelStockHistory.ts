import { useQuery } from "@tanstack/react-query";

import { getChannelStockHistory } from "@/features/stock/history/models/apis";
import { ModifiedChannelStockHistoryRequest } from "@/features/stock/history/models/types";

import { queryKeys } from "@/shared/queryKeys";

export default function useGetChannelStockHistory({
  params,
  sku,
  isDialogOpen,
}: {
  params: ModifiedChannelStockHistoryRequest;
  sku: string;
  isDialogOpen: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.channelStockHistory({ params, sku }),
    queryFn: () => getChannelStockHistory({ params, sku }),
    enabled: !!params && !!sku && isDialogOpen && params.channelTypes !== "",
    placeholderData: (previousData) => previousData,
  });
}
