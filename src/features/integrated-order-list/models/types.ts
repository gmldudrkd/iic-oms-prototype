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

// 공통 요청 타입 정의
export type IntegratedOrderRequest =
  | OrderSearchRequest
  | ReturnSearchRequest
  | ExchangeSearchRequest
  | ReshipmentSearchRequest;

// 공통 응답 타입 정의
export type IntegratedOrderResponse =
  | PageResponseOrderResponse
  | PageResponseReturnResponse
  | PageResponseExchangeResponse
  | PageResponseReshipmentResponse;

// 그룹 타입 정의
export type OrderGroup =
  | "order"
  | "return"
  | "exchange"
  | "reshipment"
  | "storePickup"
  | "shipment";

// 타입 가드 함수들
// export const isOrderSearchRequest = (
//   params: IntegratedOrderRequest,
// ): params is OrderSearchRequest => {
//   return "orderStatuses" in params || "shipmentStatuses" in params;
// };

// export const isReturnSearchRequest = (
//   params: IntegratedOrderRequest,
// ): params is ReturnSearchRequest => {
//   return "returnStatuses" in params;
// };

// export const isExchangeSearchRequest = (
//   params: IntegratedOrderRequest,
// ): params is ExchangeSearchRequest => {
//   return "exchangeStatuses" in params;
// };

// src/features/integrated-order/models/types.ts
export interface OrderRow {
  id: string;
  orderId: string;
  brand?: string;
  corp: string;
  channel?: string;
  orderNo: string;
  orderDate: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  shippingStatus: string[];
  shipmentNo: string[];
  shipmentStatus: string[];
  trackingNo: string[];
}

export interface ReturnRow {
  id: string;
  orderId: string;
  channel: string;
  orderNo: string;
  createdAt: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  trackingNo: string;
  returnNo: string;
}

export interface ExchangeRow {
  id: string;
  orderId: string;
  channel: string;
  orderNo: string;
  createdAt: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  exchangeNo: string;
  trackingNo: string;
  resendNo: string[];
}

export interface ReshipmentRow {
  id: string;
  orderId: string;
  channel: string;
  orderNo: string;
  createdAt: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  reshipmentNo: string;
  trackingNo: string;
}
