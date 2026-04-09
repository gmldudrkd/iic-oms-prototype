import { useQuery } from "@tanstack/react-query";

import { getReshipmentDetail } from "@/features/integrated-order-detail/models/apis";

import { ReshipmentDetailResponse } from "@/shared/generated/oms/types/Reshipment";
import { queryKeys } from "@/shared/queryKeys";

export const useGetReshipmentDetail = (orderId: string) => {
  return useQuery<ReshipmentDetailResponse[]>({
    queryKey: queryKeys.reshipmentDetail(orderId),
    queryFn: () => getReshipmentDetail(orderId),
  });
};
