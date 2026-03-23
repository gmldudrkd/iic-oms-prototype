/* eslint-disable */
import { Recipient, EnumResponse, Delivery, DeliveryTracking, OrderItemComponent, OrderItemProduct } from "./common";

export interface ExchangeRecipientUpdateRequest {
  recipient: Recipient;
}

export interface ExchangeBulkCancelRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  exchangeIds: string[];
}

export interface ExchangeSearchRequest {
  /** @uniqueItems true */
  channelTypes?: ExchangeSearchRequestChannelTypesEnum[];
  /**
   * @maxItems 100
   * @minItems 0
   * @uniqueItems true
   */
  exchangeNos?: string[];
  /** @uniqueItems true */
  exchangeStatuses?: ExchangeSearchRequestExchangeStatusesEnum[];
  /** @format date-time */
  from?: string;
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
   * @format int32
   * @max 1000
   */
  size: number;
  /** @format date-time */
  to?: string;
}

export enum ExchangeSearchRequestExchangeStatusesEnum {
  PENDING = "PENDING",
  PICKUP_REQUESTED = "PICKUP_REQUESTED",
  PICKUP_ONGOING = "PICKUP_ONGOING",
  RECEIVED = "RECEIVED",
  INSPECTED = "INSPECTED",
  SHIPMENT_REQUESTED = "SHIPMENT_REQUESTED",
  EXCHANGED = "EXCHANGED",
  CANCELED = "CANCELED",
}

/** @format byte */

export enum ExchangeSearchRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface PageResponseExchangeResponse {
  data: ExchangeResponse[];
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

export interface ExchangeResponse {
  brand: EnumResponse;
  channelType: EnumResponse;
  claimId: string;
  corporation: ExchangeResponseCorporationEnum;
  /** @format date-time */
  createdAt: string;
  exchangeId: string;
  exchangeNo: string;
  exchangeShipmentNos: string[];
  orderId: string;
  ordererEmail: string;
  ordererName?: string;
  ordererPhone?: string;
  originOrderNo: string;
  pickupTrackingNo?: string;
  purchaseNo?: string;
  recipientName: string;
  recipientPhone: string;
  status: EnumResponse;
}

export enum ExchangeResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface ExchangeDetailResponse {
  /** @format date-time */
  approvedAt?: string;
  claimCreatedBy: string;
  claimFault: ExchangeDetailResponseClaimFaultEnum;
  claimId: string;
  claimItems: ExchangeDetailClaimItemResponse[];
  claimReason: string;
  claimRequesterType: ExchangeDetailResponseClaimRequesterTypeEnum;
  /** @format date-time */
  createdAt: string;
  exchangeId: string;
  exchangeNo: string;
  items: ExchangeDetailItemResponse[];
  originOrderNo: string;
  pickupDelivery?: Delivery;
  pickupRecipient: Recipient;
  pickupTrackingUrl?: string;
  shipmentRecipient: Recipient;
  shipments: ExchangeDetailShipmentResponse[];
  status: EnumResponse;
  /** @format date-time */
  updatedAt: string;
  wmsNo: string;
}

export interface ExchangeDetailShipmentResponse {
  deliveries: DeliveryTracking[];
  delivery?: Delivery;
  shipmentId: string;
  shipmentNo: string;
  /** @format date-time */
  shippedAt?: string;
  status: EnumResponse;
  trackingUrl?: string;
  wmsNo: string;
}

export interface ExchangeDetailItemResponse {
  gradeSummaries: Record<string, number>;
  productCode: string;
  productName: string;
  /** @format int32 */
  quantity: number;
  sku?: string;
  thumbnailUrl?: string;
  upcCode?: string;
}

export enum ExchangeDetailResponseClaimRequesterTypeEnum {
  CUSTOMER = "CUSTOMER",
  CS_OPERATOR = "CS_OPERATOR",
  OMS_ADMIN = "OMS_ADMIN",
  OMS_SYSTEM = "OMS_SYSTEM",
}

export interface ExchangeDetailClaimItemResponse {
  /** @format int32 */
  cancelQuantity: number;
  components: OrderItemComponent[];
  id: string;
  orderItemId: string;
  productCode?: string;
  productName: string;
  products: OrderItemProduct[];
  /** @format int32 */
  quantity: number;
  sku: string;
  thumbnailUrl?: string;
}

export enum ExchangeDetailResponseClaimFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}
