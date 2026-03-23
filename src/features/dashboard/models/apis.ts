import { FetchWithToken } from "@/shared/apis/fetchExtended";
import {
  DashboardSummaryResponse,
  OrderSummaryRequest,
} from "@/shared/generated/oms/types/OrderDashboard";
import { createQueryParams } from "@/shared/utils/querystring";

/**
 * 주문 대시보드 조회 API
 * @returns DashboardSummaryResponse
 */

export const getOrderDashboard = async (params: OrderSummaryRequest) => {
  const queryString = createQueryParams(params);
  const response = await FetchWithToken(
    `/order-dashboards/summary?${queryString}`,
    "GET",
  );
  return response as DashboardSummaryResponse;
};
