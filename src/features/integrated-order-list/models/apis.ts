import { FetchWithToken } from "@/shared/apis/fetchExtended";
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
import { createQueryParams } from "@/shared/utils/querystring";

/**
 * 주문 목록 조회
 * GET
 * /v1/api/orders
 */
export const getOrderList = async (
  params: OrderSearchRequest,
): Promise<PageResponseOrderResponse> => {
  const url = "/orders";
  const queryString = createQueryParams(params);
  const rawResponse = await FetchWithToken(`${url}?${queryString}`, "GET");
  return rawResponse as PageResponseOrderResponse;
};

/**
 * 반품 목록 조회
 * GET
 * /v1/api/returns
 */
export const getReturnList = async (
  params: ReturnSearchRequest,
): Promise<PageResponseReturnResponse> => {
  const url = "/returns";
  const queryString = createQueryParams(params);

  const rawResponse = await FetchWithToken(`${url}?${queryString}`, "GET");
  return rawResponse as PageResponseReturnResponse;
};

/**
 * 교환 목록 조회
 * GET
 * /v1/api/exchanges
 */
export const getExchangeList = async (
  params: ExchangeSearchRequest,
): Promise<PageResponseExchangeResponse> => {
  const url = "/exchanges";
  const queryString = createQueryParams(params);

  const rawResponse = await FetchWithToken(`${url}?${queryString}`, "GET");
  return rawResponse as PageResponseExchangeResponse;
};

/**
 * Claim 출고 목록 조회
 * GET
 * /v1/api/reshipments
 */
export const getReshipmentList = async (
  params: ReshipmentSearchRequest,
): Promise<PageResponseReshipmentResponse> => {
  const url = "/reshipments";
  const queryString = createQueryParams(params);
  const rawResponse = await FetchWithToken(`${url}?${queryString}`, "GET");
  return rawResponse as PageResponseReshipmentResponse;
};

/**
 * 주문 취소 Bulk Cancel Order
 * POST
 * /v1/api/claims/cancel
 */
export const postBulkCancelOrder = async (data: {
  orderIds: string[];
  reason: string;
}) => {
  const rawResponse = await FetchWithToken("/claims/cancel", "POST", data);
  return rawResponse;
};

/**
 * 반품 취소 Bulk Cancel Return
 * PATCH
 * /v1/api/returns/cancel
 */
export const postBulkCancelReturn = async (data: { returnIds: string[] }) => {
  const rawResponse = await FetchWithToken("/returns/cancel", "PATCH", data);
  return rawResponse;
};

/**
 * 교환 목록 취소 요청
 * PATCH
 * /v1/api/exchanges/cancel
 */
export const postBulkCancelExchange = async (data: {
  exchangeIds: string[];
}) => {
  const rawResponse = await FetchWithToken("/exchanges/cancel", "PATCH", data);
  return rawResponse;
};
