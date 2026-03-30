/* eslint-disable */
import { EnumResponse, DeliveryTracking, Delivery, Recipient } from "./common";

export interface ReshipmentSearchRequest {
  /** @uniqueItems true */
  channelTypes?: ReshipmentSearchRequestChannelTypesEnum[];
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
   * @maxItems 100
   * @minItems 0
   * @uniqueItems true
   */
  reshipmentNos?: string[];
  /** @uniqueItems true */
  reshipmentStatuses?: ReshipmentSearchRequestReshipmentStatusesEnum[];
  /**
   * @format int32
   * @max 1000
   */
  size: number;
  /** @format date-time */
  to?: string;
}

export enum ReshipmentSearchRequestReshipmentStatusesEnum {
  PICKING_REQUESTED = "PICKING_REQUESTED",
  PICKED = "PICKED",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  CANCELED = "CANCELED",
  PICKING_REJECTED = "PICKING_REJECTED",
  DELIVERED = "DELIVERED",
  LOST = "LOST",
}

export enum ReshipmentSearchRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface PageResponseReshipmentResponse {
  data: ReshipmentResponse[];
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

export interface ReshipmentResponse {
  brand: EnumResponse;
  channelType: EnumResponse;
  claimId: string;
  corporation: ReshipmentResponseCorporationEnum;
  /** @format date-time */
  createdAt: string;
  event: EnumResponse;
  orderId: string;
  ordererEmail: string;
  ordererName?: string;
  ordererPhone?: string;
  originOrderNo: string;
  purchaseNo?: string;
  recipientName: string;
  recipientPhone: string;
  reshipmentId: string;
  reshipmentNo: string;
  status: EnumResponse;
  trackingNo?: string;
}

export enum ReshipmentResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface ReshipmentDetailResponse {
  cancelReason?: string;
  claimCreatedBy: string;
  claimFault: ReshipmentDetailResponseClaimFaultEnum;
  claimId: string;
  claimItems: ReshipmentDetailClaimItemResponse[];
  claimReason: string;
  claimRequesterType: ReshipmentDetailResponseClaimRequesterTypeEnum;
  /** @format date-time */
  createdAt: string;
  deliveries: DeliveryTracking[];
  delivery?: Delivery;
  event: EnumResponse;
  items: ReshipmentDetailItemResponse[];
  originOrderNo: string;
  recipient: Recipient;
  reshipmentId: string;
  reshipmentNo: string;
  /** @format date-time */
  shippedAt?: string;
  status: EnumResponse;
  trackingUrl?: string;
  /** @format date-time */
  updatedAt: string;
  wmsNo: string;
}

export interface ReshipmentDetailItemResponse {
  productCode?: string;
  productName: string;
  /** @format int32 */
  quantity: number;
  sku: string;
  skuType: ReshipmentDetailItemResponseSkuTypeEnum;
  thumbnailUrl?: string;
}

export enum ReshipmentDetailItemResponseSkuTypeEnum {
  PRODUCT = "PRODUCT",
  COMPONENT = "COMPONENT",
}

export enum ReshipmentDetailResponseClaimRequesterTypeEnum {
  CUSTOMER = "CUSTOMER",
  CS_OPERATOR = "CS_OPERATOR",
  OMS_ADMIN = "OMS_ADMIN",
  OMS_SYSTEM = "OMS_SYSTEM",
}

export interface ReshipmentDetailClaimItemResponse {
  /** @format int32 */
  cancelQuantity: number;
  id: string;
  productCode?: string;
  productName: string;
  /** @format int32 */
  quantity: number;
  sku: string;
  thumbnailUrl?: string;
}

export enum ReshipmentDetailResponseClaimFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}
