import { FetchWithToken } from "@/shared/apis/fetchExtended";
import { ClaimCreateRequest } from "@/shared/generated/oms/types/Claim";
import { ExchangeDetailResponse } from "@/shared/generated/oms/types/Exchange";
import {
  OrderDetailResponse,
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeResponse,
  OrderPartialShipmentRequest,
  OrderRecipientUpdateRequest,
} from "@/shared/generated/oms/types/Order";
import {
  ReturnDetailResponse,
  ReturnRecipientUpdateRequest,
} from "@/shared/generated/oms/types/Return";
import { ShipmentCancelRequest } from "@/shared/generated/oms/types/Shipment";

/**
 * 주문 상세 조회
 * GET
 * /v1/api/orders/{orderId}
 */
export const getOrderDetail = async (orderId: string) => {
  const responseData = await FetchWithToken(`/orders/${orderId}`, "GET");
  return responseData as OrderDetailResponse;
};

/**
 * PATCH
 * /v1/api/orders/{orderId}/partial-shipment
 * 주문 부분 출고 요청
 * @param {orderId, data} orderId: string, data: OrderPartialShipmentRequest
 * @returns OrderDetailResponse
 */
export const patchPartialShipment = async ({
  orderId,
  data,
}: {
  orderId: string;
  data: OrderPartialShipmentRequest;
}) => {
  const responseData = await FetchWithToken(
    `/orders/${orderId}/partial-shipment`,
    "PATCH",
    data,
  );
  return responseData as OrderDetailResponse;
};

/**
 * PATCH
 * /v1/api/orders/{orderId}/recipient
 * 주문 수령자 정보 수정
 * @param {orderId, data} orderId: string, data: OrderRecipientUpdateRequest
 * @returns OrderDetailResponse
 */
export const patchOrderRecipient = async ({
  orderId,
  data,
}: {
  orderId: string;
  data: OrderRecipientUpdateRequest;
}) => {
  const rawResponse = await FetchWithToken(
    `/orders/${orderId}/recipient`,
    "PATCH",
    data,
  );
  return rawResponse;
};

/**
 * POST
 * /v1/api/orders/{orderId}/estimate-refund-fee
 * 환불 요청 금액 예상 조회
 * @param {orderId, data} orderId: string, data: OrderEstimateRefundFeeRequest
 * @returns OrderEstimateRefundFeeResponse
 */
export const postEstimateRefundFee = async ({
  orderId,
  data,
}: {
  orderId: string;
  data: OrderEstimateRefundFeeRequest;
}) => {
  const rawResponse = await FetchWithToken(
    `/orders/${orderId}/estimate-refund-fee`,
    "POST",
    data,
  );
  return rawResponse as OrderEstimateRefundFeeResponse;
};

/**
 * POST
 * /v1/api/orders/{orderId}/claims
 * 주문 클레임 생성
 */
export const postClaims = async (orderId: string, data: ClaimCreateRequest) => {
  const rawResponse = await FetchWithToken(
    `/orders/${orderId}/claims`,
    "POST",
    data,
  );
  return rawResponse;
};

/**
 * PATCH
 * /v1/api/shipments/{shipmentId}/cancel
 * 출고 취소 요청
 */
export const patchShipmentCancel = async (
  shipmentId: string,
  data: ShipmentCancelRequest,
) => {
  const rawResponse = await FetchWithToken(
    `/shipments/${shipmentId}/cancel`,
    "PATCH",
    data,
  );
  return rawResponse;
};

/**
 * GET
 * /v1/api/returns/orders/{orderId}
 * 반품 상세 조회
 */
export const getReturnDetail = async (
  orderId: string,
): Promise<ReturnDetailResponse[]> => {
  const responseData = await FetchWithToken<ReturnDetailResponse[]>(
    `/returns/orders/${orderId}`,
    "GET",
  );

  return responseData;
};

/**
 * PATCH
 * /v1/api/returns/{returnId}/request-pickup
 * 반품 상세 픽업 요청
 */
export const patchReturnRequestPickup = async (returnId: string) => {
  const rawResponse = await FetchWithToken(
    `/returns/${returnId}/request-pickup`,
    "PATCH",
  );
  return rawResponse;
};

/**
 * PATCH
 * /v1/api/returns/{returnId}/cancel
 * 반품 상세 취소 요청
 */
export const patchReturnCancel = async (returnId: string) => {
  const rawResponse = await FetchWithToken(
    `/returns/${returnId}/cancel`,
    "PATCH",
  );
  return rawResponse;
};

/**
 * PATCH
 * /v1/api/returns/{returnId}/recipient
 * 반품 수신자 정보 수정
 */
export const patchReturnRecipient = async (
  returnId: string,
  data: ReturnRecipientUpdateRequest,
) => {
  const rawResponse = await FetchWithToken(
    `/returns/${returnId}/recipient`,
    "PATCH",
    data,
  );
  return rawResponse;
};

/**
 * GET
 * /v1/api/exchanges/orders/{orderId}
 * 교환 상세 조회
 */
export const getExchangeDetail = async (orderId: string) => {
  const responseData = await FetchWithToken<ExchangeDetailResponse>(
    `/exchanges/orders/${orderId}`,
    "GET",
  );
  return responseData;
};

/**
 * PATCH
 * /v1/api/exchanges/{exchangeId}/cancel
 * 교환 상세 취소 요청
 */
export const patchExchangeCancel = async (exchangeId: string) => {
  const rawResponse = await FetchWithToken(
    `/exchanges/${exchangeId}/cancel`,
    "PATCH",
  );
  return rawResponse;
};

/**
 * PATCH
 * /v1/api/exchanges/{exchangeId}/request-shipment
 * 교환 출고 요청
 */
export const patchExchangeRequestShipment = async (exchangeId: string) => {
  const rawResponse = await FetchWithToken(
    `/exchanges/${exchangeId}/request-shipment`,
    "PATCH",
  );
  return rawResponse;
};

/**
 * 주문 이력 조회
 * GET
 * /v1/api/orders/{orderId}/histories
 */
export const getLogHistoryDetail = async (orderId: string) => {
  const rawResponse = await FetchWithToken(
    `/orders/${orderId}/histories`,
    "GET",
  );
  return rawResponse;
};
