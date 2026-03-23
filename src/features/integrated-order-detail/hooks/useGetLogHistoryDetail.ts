import { useQuery } from "@tanstack/react-query";

import { getLogHistoryDetail } from "@/features/integrated-order-detail/models/apis";

import { queryKeys } from "@/shared/queryKeys";

export const useGetLogHistoryDetail = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.logHistoryDetail(orderId),
    queryFn: () => getLogHistoryDetail(orderId),
  });
};
