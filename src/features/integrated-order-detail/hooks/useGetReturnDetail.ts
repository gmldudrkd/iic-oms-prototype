import { useQuery } from "@tanstack/react-query";

import { getReturnDetail } from "@/features/integrated-order-detail/models/apis";

import { ApiError } from "@/shared/apis/types";
import { ReturnDetailResponse } from "@/shared/generated/oms/types/Return";
import { queryKeys } from "@/shared/queryKeys";

export const useGetReturnDetail = (orderId: string) => {
  return useQuery<ReturnDetailResponse[], ApiError>({
    queryKey: queryKeys.returnDetail(orderId),
    queryFn: () => getReturnDetail(orderId),
  });
};
