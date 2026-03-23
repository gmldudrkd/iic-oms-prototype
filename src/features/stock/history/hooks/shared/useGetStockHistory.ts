import { useQuery } from "@tanstack/react-query";

import { getStockHistory } from "@/features/stock/history/models/apis";
import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";

import { queryKeys } from "@/shared/queryKeys";

export default function useGetStockHistory(
  params: StockHistorySearchFilterForm | null,
) {
  return useQuery({
    queryKey: queryKeys.stockHistory(params),
    queryFn: () => getStockHistory(params),
    enabled: !!params,
  });
}
