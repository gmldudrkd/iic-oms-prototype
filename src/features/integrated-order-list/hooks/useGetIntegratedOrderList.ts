import { useQuery } from "@tanstack/react-query";

import {
  getExchangeList,
  getReshipmentList,
  getOrderList,
  getReturnList,
} from "@/features/integrated-order-list/models/apis";
import {
  IntegratedOrderResponse,
  IntegratedOrderRequest,
  OrderGroup,
} from "@/features/integrated-order-list/models/types";

import {
  ExchangeSearchRequest,
  PageResponseExchangeResponse,
} from "@/shared/generated/oms/types/Exchange";
import {
  OrderSearchRequest,
  PageResponseOrderResponse,
} from "@/shared/generated/oms/types/Order";
import {
  PageResponseReshipmentResponse,
  ReshipmentSearchRequest,
} from "@/shared/generated/oms/types/Reshipment";
import {
  PageResponseReturnResponse,
  ReturnSearchRequest,
} from "@/shared/generated/oms/types/Return";

// 공통 쿼리 설정
const createOrderQuery = <T extends IntegratedOrderResponse>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  enabled: boolean = true,
) => {
  return useQuery<T>({
    queryKey,
    queryFn,
    enabled,
    throwOnError: (error) => {
      console.error("🚀 Order Query 에러:", error);
      return false;
    },
  });
};

// Order 목록 조회
export const useGetOrderList = (
  params: OrderSearchRequest,
  enabled: boolean = false,
) => {
  return createOrderQuery<PageResponseOrderResponse>(
    ["order-list", JSON.stringify(params)],
    () => getOrderList(params),
    enabled,
  );
};

// Return 목록 조회
export const useGetReturnList = (
  params: ReturnSearchRequest,
  enabled: boolean = false,
) => {
  return createOrderQuery<PageResponseReturnResponse>(
    ["return-list", JSON.stringify(params)],
    () => getReturnList(params),
    enabled,
  );
};

// Exchange 목록 조회
export const useGetExchangeList = (
  params: ExchangeSearchRequest,
  enabled: boolean = false,
) => {
  return createOrderQuery<PageResponseExchangeResponse>(
    ["exchange-list", JSON.stringify(params)],
    () => getExchangeList(params),
    enabled,
  );
};

export const useGetReshipmentList = (
  params: ReshipmentSearchRequest,
  enabled: boolean = false,
) => {
  return createOrderQuery<PageResponseReshipmentResponse>(
    ["reshipment-list", JSON.stringify(params)],
    () => getReshipmentList(params),
    enabled,
  );
};

// 통합 목록 조회
export const useGetIntegratedOrderList = (
  group: OrderGroup | null,
  params: IntegratedOrderRequest,
) => {
  const enabled = (() => {
    const hasChannels = (params.channelTypes?.length ?? 0) > 0;

    switch (group) {
      case "order":
        return hasChannels && "orderStatuses" in params;
      case "shipment":
        return hasChannels && "shipmentStatuses" in params;
      case "storePickup":
        return hasChannels && "storePickupStatuses" in params;
      case "return":
        return hasChannels && "returnStatuses" in params;
      case "exchange":
        return hasChannels && "exchangeStatuses" in params;
      case "reshipment":
        return hasChannels && "reshipmentStatuses" in params;
      default:
        return false;
    }
  })();

  switch (group) {
    case "order":
    case "shipment":
    case "storePickup":
      // TODO : storePickup API 확인 필요
      return useGetOrderList(params as OrderSearchRequest, enabled);
    case "return":
      return useGetReturnList(params as ReturnSearchRequest, enabled);
    case "exchange":
      return useGetExchangeList(params as ExchangeSearchRequest, enabled);
    case "reshipment":
      return useGetReshipmentList(params as ReshipmentSearchRequest, enabled);
    default:
      return useGetOrderList(params as OrderSearchRequest, enabled);
  }
};
