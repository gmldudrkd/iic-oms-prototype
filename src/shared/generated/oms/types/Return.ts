/* eslint-disable */
import { Recipient, EnumResponse, Delivery, OrderItemComponent, OrderItemProduct } from "./common";

export interface ReturnRecipientUpdateRequest {
  recipient: Recipient;
}

export interface ReturnBulkCancelRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  returnIds: string[];
}

export interface ReturnSearchRequest {
  /** @uniqueItems true */
  channelTypes?: ReturnSearchRequestChannelTypesEnum[];
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
  returnNos?: string[];
  /** @uniqueItems true */
  returnStatuses?: ReturnSearchRequestReturnStatusesEnum[];
  /**
   * @format int32
   * @max 1000
   */
  size: number;
  /** @format date-time */
  to?: string;
}

export enum ReturnSearchRequestReturnStatusesEnum {
  PENDING = "PENDING",
  PICKUP_REQUESTED = "PICKUP_REQUESTED",
  PICKUP_ONGOING = "PICKUP_ONGOING",
  RECEIVED = "RECEIVED",
  REFUNDED = "REFUNDED",
  CANCELED = "CANCELED",
}

export enum ReturnSearchRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface PageResponseReturnResponse {
  data: ReturnResponse[];
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

export interface ReturnResponse {
  brand: EnumResponse;
  channelType: EnumResponse;
  claimId: string;
  corporation: ReturnResponseCorporationEnum;
  /** @format date-time */
  createdAt: string;
  orderId: string;
  ordererEmail: string;
  ordererName?: string;
  ordererPhone?: string;
  originOrderNo: string;
  pickupTrackingNo?: string;
  purchaseNo?: string;
  reason?: string;
  recipientName: string;
  recipientPhone: string;
  returnId: string;
  returnNo: string;
  status: EnumResponse;
}

export enum ReturnResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface ReturnDetailResponse {
  /** @format date-time */
  approvedAt?: string;
  claimCreatedBy: string;
  claimFault: ReturnDetailResponseClaimFaultEnum;
  claimId: string;
  claimItems: ReturnDetailClaimItemResponse[];
  claimReason: string;
  claimRequesterType: ReturnDetailResponseClaimRequesterTypeEnum;
  /** @format date-time */
  createdAt: string;
  delivery?: Delivery;
  items: ReturnDetailOrderItemResponse[];
  originOrderNo: string;
  recipient?: Recipient;
  returnId: string;
  returnNo: string;
  status: EnumResponse;
  trackingUrl?: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ReturnDetailOrderItemResponse {
  gradeSummaries: Record<string, number>;
  productCode: string;
  productName: string;
  /** @format int32 */
  quantity: number;
  sku?: string;
  thumbnailUrl?: string;
  upcCode?: string;
}

export enum ReturnDetailResponseClaimRequesterTypeEnum {
  CUSTOMER = "CUSTOMER",
  CS_OPERATOR = "CS_OPERATOR",
  OMS_ADMIN = "OMS_ADMIN",
  OMS_SYSTEM = "OMS_SYSTEM",
}

export interface ReturnDetailClaimItemResponse {
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

export enum ReturnDetailResponseClaimFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}
