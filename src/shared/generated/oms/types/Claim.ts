/* eslint-disable */
import { Recipient } from "./common";

export interface ClaimReshipmentCreateRequest {
  fault: ClaimReshipmentCreateRequestFaultEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  items: ClaimReshipmentCreateItemRequest[];
  /** @minLength 1 */
  reason: string;
  recipient: Recipient;
}

export interface ClaimReshipmentCreateItemRequest {
  productCode?: string;
  /** @format int32 */
  quantity: number;
  /** @minLength 1 */
  sku: string;
  skuType: ClaimReshipmentCreateItemRequestSkuTypeEnum;
}

export enum ClaimReshipmentCreateItemRequestSkuTypeEnum {
  PRODUCT = "PRODUCT",
  COMPONENT = "COMPONENT",
}

export enum ClaimReshipmentCreateRequestFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}

export interface ClaimCreateRequest {
  carrierCode?: string;
  fault: ClaimCreateRequestFaultEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  items: ClaimCreateItemRequest[];
  pickupRecipient?: Recipient;
  /** @minLength 1 */
  reason: string;
  shipmentRecipient?: Recipient;
  trackingNo?: string;
  type: ClaimCreateRequestTypeEnum;
}

export enum ClaimCreateRequestTypeEnum {
  CANCEL = "CANCEL",
  RETURN = "RETURN",
  RETURN_FORCE_REFUND = "RETURN_FORCE_REFUND",
  EXCHANGE = "EXCHANGE",
  RESHIPMENT = "RESHIPMENT",
}

export interface ClaimCreateItemRequest {
  /** @minLength 1 */
  orderItemId: string;
  originItemId?: string;
  /** @format int32 */
  quantity: number;
}

export enum ClaimCreateRequestFaultEnum {
  CUSTOMER = "CUSTOMER",
  OPERATION = "OPERATION",
}

export interface ClaimCancelCreateRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  orderIds: string[];
  /** @minLength 1 */
  reason: string;
}
