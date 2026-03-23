import { useQuery } from "@tanstack/react-query";

import { getExchangeDetail } from "@/features/integrated-order-detail/models/apis";

import { queryKeys } from "@/shared/queryKeys";

export const useGetExchangeDetail = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.exchangeDetail(orderId),
    queryFn: () => getExchangeDetail(orderId),
  });
};
