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

// /**
//  * 주문 상세 조회
//  * GET
//  * /v1/api/orders/{orderId}
//  */
// export const getOrderDetail = async (orderId: string) => {
//   const responseData = await FetchWithToken(`/orders/${orderId}`, "GET");
//   try {
//     const validatedData = OrderDetailDataSchema.parse(responseData);
//     console.log("✅ Zod validation successful (Data):", validatedData);
//     return validatedData;
//   } catch (error) {
//     console.error("❌ Zod validation failed (OrderDetail):", error);
//     throw new Error("API data validation failed");
//   }
// };

// /**
//  * 주문 클레임 생성
//  * POST
//  * /v1/api/orders/{orderId}/claims
//  */
// export const postClaims = async (orderId: string, data: ClaimsRequestDTO) => {
//   const rawResponse = await FetchWithToken(`/orders/${orderId}/claims`, "POST", data);
//   return rawResponse;
// };

// /**
//  * 배송 정보 수정
//  * PATCH
//  * /v1/api/orders/{orderId}/recipient
//  *
//  */
// export const patchRecipientInfo = async (orderId: string, data: RecipientRequestDTO) => {
//   const rawResponse = await FetchWithToken(`/orders/${orderId}/recipient`, "PATCH", data);
//   return rawResponse;
// };

// /**
//  * 주문 부분 출고 요청
//  * PATCH
//  * /v1/api/orders/{orderId}/partial-shipment
//  */
// export const patchOrderPartialShipment = async (orderId: string) => {
//   const rawResponse = await FetchWithToken(`/orders/${orderId}/partial-shipment`, "PATCH");
//   return rawResponse;
// };

// /**
//  * 출고 취소 요청
//  * PATCH
//  * /v1/api/shipments/{shipmentId}/cancel
//  */
// export const postShipmentCancel = async (
//   shipmentId: string,
//   data: {
//     reason: string;
//   },
// ) => {
//   const rawResponse = await FetchWithToken(`/shipments/${shipmentId}/cancel`, "PATCH", data);
//   return rawResponse;
// };

// /**
//  * 재출고 요청
//  * POST
//  * /v1/api/shipments/{shipmentId}/reshipment
//  */
// export const postShipmentReshipment = async (shipmentId: string) => {
//   const rawResponse = await FetchWithToken(`/shipments/${shipmentId}/reshipment`, "POST");

//   return rawResponse;
// };

// // ----------------------------------------------------------------
// // 반품
// /**
//  * 반품 상세 조회
//  * GET
//  * /v1/api/returns/orders/{orderId}
//  */
// export const getReturnDetail = async (orderId: string) => {
//   const responseData = await FetchWithToken(`/returns/orders/${orderId}`, "GET");
//   console.log("🚀 responseData", responseData);
//   try {
//     const validatedData = ReturnDetailResponseSchema.parse(responseData);
//     console.log("✅ Zod validation successful (Data):", validatedData);
//     return validatedData;
//   } catch (error) {
//     console.error("❌ Zod validation failed (ReturnDetail):", error);
//     throw new Error("API data validation failed");
//   }
// };

// /**
//  * 반품 상세 픽업 요청
//  * PATCH
//  * /v1/api/returns/{returnId}/request-pickup
//  */
// export const patchReturnRequestPickup = async (returnId: string) => {
//   const rawResponse = await FetchWithToken(`/returns/${returnId}/request-pickup`, "PATCH");
//   return rawResponse;
// };

// /**
//  * 반품 상세 취소 요청
//  * PATCH
//  * /v1/api/returns/{returnId}/cancel
//  */
// export const patchReturnCancel = async (returnId: string) => {
//   const rawResponse = await FetchWithToken(`/returns/${returnId}/cancel`, "PATCH");
//   return rawResponse;
// };

// /**
//  * 반품 상세 강제 완료
//  * PATCH
//  * /v1/api/returns/{returnId}/force-complete
//  */
// export const patchReturnCancelPartial = async (returnId: string) => {
//   const rawResponse = await FetchWithToken(`/returns/${returnId}/force-complete`, "PATCH");
//   return rawResponse;
// };

// /**
//  * 반품 픽업 수신자 정보 업데이트
//  * PATCH
//  * /v1/api/returns/{returnId}/recipient
//  */
// export const patchReturnRecipientInfo = async (returnId: string, data: RecipientRequestDTO) => {
//   const rawResponse = await FetchWithToken(`/returns/${returnId}/recipient`, "PATCH", data);
//   return rawResponse;
// };

// // ----------------------------------------------------------------
// // 교환
// /**
//  * 교환 상세 조회
//  * GET
//  * /v1/api/exchanges/orders/{orderId}
//  */
// export const getExchangeDetail = async (orderId: string) => {
//   const responseData = await FetchWithToken(`/exchanges/orders/${orderId}`, "GET");

//   try {
//     const validatedData = ExchangeDetailResponseSchema.parse(responseData);
//     console.log("✅ Zod validation successful (Data):", validatedData);
//     return validatedData;
//   } catch (error) {
//     console.error("❌ Zod validation failed (ExchangeDetail):", error);
//     throw new Error("API data validation failed");
//   }
// };

// /**
//  * 교환 상세 취소 요청
//  * PATCH
//  * /v1/api/exchanges/{exchangeId}/cancel
//  */
// export const patchExchangeCancel = async (exchangeId: string) => {
//   const rawResponse = await FetchWithToken(`/exchanges/${exchangeId}/cancel`, "PATCH");
//   return rawResponse;
// };

// /**
//  * 교환 상세 강제 완료 요청
//  * PATCH
//  * /v1/api/exchanges/{exchangeId}/force-complete
//  */
// export const patchExchangeCancelPartial = async (exchangeId: string) => {
//   const rawResponse = await FetchWithToken(`/exchanges/${exchangeId}/force-complete`, "PATCH");
//   return rawResponse;
// };

// // ----------------------------------------------------------------
// // 로그 히스토리

// /**
//  * 주문 이력 조회
//  * GET
//  * /v1/api/orders/{orderId}/histories
//  */
// export const getLogHistoryDetail = async (orderId: string) => {
//   const rawResponse = await FetchWithToken(`/orders/${orderId}/histories`, "GET");

//   try {
//     const validatedData = LogHistoryDetailResponseSchema.parse(rawResponse);
//     console.log("✅ Zod validation successful (Data):", validatedData);
//     return validatedData;
//   } catch (error) {
//     console.error("❌ Zod validation failed (LogHistoryDetail):", error);
//     throw new Error("API data validation failed");
//   }
// };
