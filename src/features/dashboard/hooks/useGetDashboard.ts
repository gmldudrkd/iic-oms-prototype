import { useQuery } from "@tanstack/react-query";

import { getOrderDashboard } from "@/features/dashboard/models/apis";

import { OrderSummaryRequest } from "@/shared/generated/oms/types/OrderDashboard";

export const useGetDashboard = (
  params: OrderSummaryRequest,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["order-dashboard", params],
    queryFn: () => getOrderDashboard(params),
    enabled: options?.enabled ?? true,
  });
};
