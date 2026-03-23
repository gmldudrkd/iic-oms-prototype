import { useQuery } from "@tanstack/react-query";

import { getOnlineStockHistory } from "@/features/stock/history/models/apis";

import { OnlineStockHistoryRequest } from "@/shared/generated/oms/types/Stock";
import { queryKeys } from "@/shared/queryKeys";

export default function useGetOnlineStockHistory({
  params,
  sku,
  isDialogOpen,
}: {
  params: OnlineStockHistoryRequest;
  sku: string;
  isDialogOpen: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.onlineStockHistory({ params, sku }),
    queryFn: () => getOnlineStockHistory({ params, sku }),
    enabled: !!params && !!sku && isDialogOpen,
    placeholderData: (previousData) => previousData,
  });
}
