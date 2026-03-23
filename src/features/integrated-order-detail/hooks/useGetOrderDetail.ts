import { useQuery } from "@tanstack/react-query";

import { getOrderDetail } from "@/features/integrated-order-detail/models/apis";

import { queryKeys } from "@/shared/queryKeys";

export const useGetOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.orderDetail(orderId),
    queryFn: () => getOrderDetail(orderId),
  });
};
