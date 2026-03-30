/* eslint-disable */
import { Recipient, Address, OrderItemComponent, OrderItemProduct, Item, EnumResponse, DeliveryTracking, Delivery } from "./common";

export interface OrderEstimateRefundFeeRequest {
  claimType: OrderEstimateRefundFeeRequestClaimTypeEnum;
  fault: OrderEstimateRefundFeeRequestFaultEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  items: OrderEstimateRefundFeeItemRequest[];
  reason: string;
}

export interface OrderEstimateRefundFeeItemRequest {
  orderItemId: string;
  /** @format int32 */
  quantity: number;
}

export enum OrderEstimateRefundFeeRequestFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}

export enum OrderEstimateRefundFeeRequestClaimTypeEnum {
  CANCEL = "CANCEL",
  RETURN = "RETURN",
  RETURN_FORCE_REFUND = "RETURN_FORCE_REFUND",
  EXCHANGE = "EXCHANGE",
  RESHIPMENT = "RESHIPMENT",
}

export interface OrderEstimateRefundFeeResponse {
  estimateRefundPayment: OrderEstimateRefundFeePaymentResponse;
  netPayment: OrderEstimateRefundFeePaymentResponse;
  orderPayment: OrderEstimateRefundFeePaymentResponse;
  refundPayment: OrderEstimateRefundFeePaymentResponse;
}

export interface OrderEstimateRefundFeePaymentResponse {
  dutyAmount: number;
  shippingFee: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface OrderRecipientUpdateRequest {
  recipient: Recipient;
}

export interface OrderPartialShipmentRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  items: OrderPartialShipmentItemRequest[];
}

export interface OrderPartialShipmentItemRequest {
  /** @minLength 1 */
  orderItemId: string;
  /** @format int32 */
  quantity: number;
}

export interface OrderRead {
  brand: OrderReadBrandEnum;
  changeReason?: string;
  channelType: OrderReadChannelTypeEnum;
  corporation: OrderReadCorporationEnum;
  /** @format date-time */
  createdAt: string;
  /** @format int64 */
  id: number;
  items: OrderItemRead[];
  orderType: OrderReadOrderTypeEnum;
  /** @format date-time */
  orderedAt: string;
  orderer: Orderer;
  originOrderNo: string;
  /** @uniqueItems true */
  payments: OrderPayment[];
  recipient: Recipient;
  status: OrderReadStatusEnum;
  /** @format date-time */
  updatedAt: string;
}

export enum OrderReadStatusEnum {
  PENDING = "PENDING",
  COLLECTED = "COLLECTED",
  PARTLY_CONFIRMED = "PARTLY_CONFIRMED",
  PARTIAL_SHIPMENT_REQUESTED = "PARTIAL_SHIPMENT_REQUESTED",
  SHIPMENT_REQUESTED = "SHIPMENT_REQUESTED",
  DELETED = "DELETED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export interface OrderPayment {
  currency: string;
  dutyAmount?: number;
  method: string;
  paidAmount?: number;
  /** @format date-time */
  paidAt: string;
  shippingFee?: number;
  taxAmount?: number;
  transactionNo: string;
}

export interface Orderer {
  address?: Address;
  email: string;
  firstName?: string;
  fullName?: string;
  lastName?: string;
  phone?: string;
  phoneCountryNo?: string;
}

export enum OrderReadOrderTypeEnum {
  NORMAL = "NORMAL",
  GIFT = "GIFT",
  RX = "RX",
}

export interface OrderItemRead {
  /** @format int32 */
  allocateQuantity: number;
  /** @format int32 */
  cancelQuantity: number;
  category?: string;
  components: OrderItemComponent[];
  /** @format int64 */
  id: number;
  /** @format int32 */
  orderQuantity: number;
  originItemId?: string;
  pointAmount: number;
  price: number;
  productCode?: string;
  productName?: string;
  products: OrderItemProduct[];
  /** @format int32 */
  shipmentQuantity: number;
  sku: string;
  upcCode?: string;
}

export enum OrderReadCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OrderReadChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export enum OrderReadBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface ShipmentRead {
  /** @format date-time */
  createdAt: string;
  items: Item[];
  originOrderNo: string;
  /** @format int64 */
  shipmentId: number;
  shipmentNo: string;
  /** @format date-time */
  shippedAt?: string;
  status: ShipmentReadStatusEnum;
  /** @format date-time */
  updatedAt: string;
}

export enum ShipmentReadStatusEnum {
  PICKING_REQUESTED = "PICKING_REQUESTED",
  PICKED = "PICKED",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  CANCELED = "CANCELED",
  PICKING_REJECTED = "PICKING_REJECTED",
  DELIVERED = "DELIVERED",
  LOST = "LOST",
}

export interface OrderSearchRequest {
  /** @uniqueItems true */
  channelTypes?: OrderSearchRequestChannelTypesEnum[];
  /** @format date-time */
  from?: string;
  /** @uniqueItems true */
  orderStatuses?: OrderSearchRequestOrderStatusesEnum[];
  ordererEmail?: string;
  ordererName?: string;
  ordererPhone?: string;
  /**
   * @maxItems 100
   * @minItems 0
   * @uniqueItems true
   */
  originOrderNos?: string[];
  /** @format int32 */
  page: number;
  /**
   * @maxItems 100
   * @minItems 0
   * @uniqueItems true
   */
  shipmentNos?: string[];
  /** @uniqueItems true */
  shipmentStatuses?: OrderSearchRequestShipmentStatusesEnum[];
  /**
   * @format int32
   * @max 1000
   */
  size: number;
  /**
   * @maxItems 100
   * @minItems 0
   * @uniqueItems true
   */
  skus?: string[];
  /** @format date-time */
  to?: string;
}

export enum OrderSearchRequestShipmentStatusesEnum {
  PICKING_REQUESTED = "PICKING_REQUESTED",
  PICKED = "PICKED",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  CANCELED = "CANCELED",
  PICKING_REJECTED = "PICKING_REJECTED",
  DELIVERED = "DELIVERED",
  LOST = "LOST",
}

export enum OrderSearchRequestOrderStatusesEnum {
  PENDING = "PENDING",
  COLLECTED = "COLLECTED",
  PARTLY_CONFIRMED = "PARTLY_CONFIRMED",
  PARTIAL_SHIPMENT_REQUESTED = "PARTIAL_SHIPMENT_REQUESTED",
  SHIPMENT_REQUESTED = "SHIPMENT_REQUESTED",
  DELETED = "DELETED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export enum OrderSearchRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface PageResponseOrderResponse {
  data: OrderResponse[];
  isFirst: boolean;
  isLast: boolean;
  /** @format int32 */
  pageNumber: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  totalCount: number;
  /** @format int32 */
  totalPages: number;
}

export interface OrderResponse {
  brand: EnumResponse;
  channelType: EnumResponse;
  corporation: OrderResponseCorporationEnum;
  orderId: string;
  orderType: EnumResponse;
  /** @format date-time */
  orderedAt: string;
  ordererEmail: string;
  ordererName?: string;
  ordererPhone?: string;
  originOrderNo: string;
  purchaseNo?: string;
  recipientName: string;
  recipientPhone: string;
  shipments: OrderShipmentResponse[];
  status: EnumResponse;
}

export interface OrderShipmentResponse {
  shipmentId: string;
  shipmentNo: string;
  status: EnumResponse;
  trackingNo?: string;
}

export enum OrderResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface OrderDetailResponse {
  brand: EnumResponse;
  changeReason?: string;
  channelType: EnumResponse;
  corporation: OrderDetailResponseCorporationEnum;
  items: OrderDetailOrderItemResponse[];
  orderId: string;
  orderType: EnumResponse;
  /** @format date-time */
  orderedAt: string;
  orderer: Orderer;
  originOrderNo: string;
  /** @uniqueItems true */
  payments: OrderPayment[];
  purchaseNo?: string;
  recipient: Recipient;
  refundPayments: OrderDetailRefundPaymentResponse[];
  shipments: OrderDetailShipmentResponse[];
  shippingFee: number;
  status: EnumResponse;
  /** @format date-time */
  updatedAt: string;
}

export interface OrderDetailShipmentResponse {
  cancelReason?: string;
  deliveries: DeliveryTracking[];
  delivery?: Delivery;
  event: OrderDetailShipmentResponseEventEnum;
  id: string;
  items: OrderDetailShipmentItemResponse[];
  recipient: Recipient;
  shipmentNo: string;
  /** @format date-time */
  shippedAt?: string;
  status: EnumResponse;
  trackingUrl?: string;
  /** @format date-time */
  updatedAt: string;
  wmsNo: string;
}

export interface OrderDetailShipmentItemResponse {
  /** @format int32 */
  canceledQuantity: number;
  components: OrderItemComponent[];
  orderItemId: string;
  originItemId?: string;
  productCode?: string;
  productName?: string;
  products: OrderItemProduct[];
  /** @format int32 */
  sequence: number;
  shipmentItemId: string;
  /** @format int32 */
  shipmentQuantity: number;
  /** @format int32 */
  shippedQuantity: number;
  sku: string;
  thumbnailUrl?: string;
}

export enum OrderDetailShipmentResponseEventEnum {
  CREATE = "CREATE",
  ACCEPT = "ACCEPT",
  ALLOCATE = "ALLOCATE",
  PICK = "PICK",
  PACK = "PACK",
  SHIP = "SHIP",
  DISPATCH_OFFLINE = "DISPATCH_OFFLINE",
  COMPLETE = "COMPLETE",
  REJECT = "REJECT",
  CANCEL = "CANCEL",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  RESHIPMENT = "RESHIPMENT",
  LOSE = "LOSE",
}

export interface OrderDetailRefundPaymentResponse {
  createdBy: string;
  reason: string;
  /** @uniqueItems true */
  refundPayments: RefundPayment[];
}

export interface RefundPayment {
  currency: string;
  dutyAmount?: number;
  method: string;
  refundAmount?: number;
  /** @format date-time */
  refundAt: string;
  shippingFee?: number;
  taxAmount?: number;
  transactionNo: string;
}

export interface OrderDetailOrderItemResponse {
  /** @format int32 */
  allocateQuantity: number;
  /** @format int32 */
  canceledQuantity: number;
  components: OrderItemComponent[];
  orderItemId: string;
  /** @format int32 */
  orderedQuantity: number;
  originItemId?: string;
  price: number;
  productCode?: string;
  productName?: string;
  products: OrderItemProduct[];
  /** @format int32 */
  reshippedQuantity: number;
  /** @format int32 */
  returnedQuantity: number;
  /** @format int32 */
  sequence: number;
  /** @format int32 */
  shipmentQuantity: number;
  /** @format int32 */
  shippedQuantity: number;
  sku: string;
  subTotal: number;
  thumbnailUrl?: string;
  upcCode?: string;
}

export enum OrderDetailResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface OrderHistoryResponse {
  exchangeHistories: OrderHistoryExchangeResponse[];
  orderHistories: OrderHistoryOrderResponse[];
  reshipmentHistories: OrderHistoryReshipmentResponse[];
  returnHistories: OrderHistoryReturnResponse[];
  storePickupHistories: OrderHistoryStorePickupResponse[];
}

export interface OrderHistoryStorePickupResponse {
  event: EnumResponse;
  status: EnumResponse;
  storePickupId: string;
  /** @format date-time */
  updatedAt: string;
}

export interface OrderHistoryReturnResponse {
  returnId?: string;
  returnNo?: string;
  sapResults: SapApiResponse[];
  /** @format int32 */
  sequence: number;
  status: EnumResponse;
  /** @format date-time */
  updatedAt: string;
}

export interface SapApiResponse {
  result: string;
  /** @format date-time */
  resultAt: string;
}

export interface OrderHistoryReshipmentResponse {
  event: EnumResponse;
  reshipmentId: string;
  reshipmentNo: string;
  /** @format int32 */
  sequence: number;
  status: EnumResponse;
  /** @format date-time */
  updatedAt: string;
}

export interface OrderHistoryOrderResponse {
  event?: EnumResponse;
  orderId: string;
  originOrderNo: string;
  sapResults: SapApiResponse[];
  /** @format int32 */
  sequence: number;
  shipmentId?: string;
  shipmentNo?: string;
  shipmentStatus?: EnumResponse;
  status?: EnumResponse;
  /** @format date-time */
  updatedAt: string;
}

export interface OrderHistoryExchangeResponse {
  event?: EnumResponse;
  exchangeId?: string;
  exchangeNo?: string;
  exchangeShipmentId?: string;
  exchangeShipmentNo?: string;
  sapResults: SapApiResponse[];
  /** @format int32 */
  sequence: number;
  shipmentStatus?: EnumResponse;
  status?: EnumResponse;
  /** @format date-time */
  updatedAt: string;
}
