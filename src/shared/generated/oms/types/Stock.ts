/* eslint-disable */
import { EnumResponse } from "./common";

export interface OnlineStockSafetyQuantityUpdateRequest {
  brand: OnlineStockSafetyQuantityUpdateRequestBrandEnum;
  corporation: OnlineStockSafetyQuantityUpdateRequestCorporationEnum;
  /**
   * @format int32
   * @min 0
   * @max 10000
   */
  safetyQuantity: number;
  /**
   * @minItems 1
   * @uniqueItems true
   */
  skus: string[];
}

export enum OnlineStockSafetyQuantityUpdateRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OnlineStockSafetyQuantityUpdateRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface OnlineStockSettingDistributionUpdateRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  requests: OnlineStockDistributionRate[];
}

export interface OnlineStockDistributionRate {
  channelType: OnlineStockDistributionRateChannelTypeEnum;
  /** @format int32 */
  distributionPriority: number;
  /** @format int32 */
  distributionRate: number;
}

export enum OnlineStockDistributionRateChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface ChannelStockTransferRequest {
  brand: ChannelStockTransferRequestBrandEnum;
  channelType: ChannelStockTransferRequestChannelTypeEnum;
  corporation: ChannelStockTransferRequestCorporationEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  skus: string[];
  /** @format int32 */
  transferQuantity: number;
}

export enum ChannelStockTransferRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum ChannelStockTransferRequestChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export enum ChannelStockTransferRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface ChannelStockPreorderSettingRequest {
  /** @format date-time */
  preorderExpiredAt?: string;
  /**
   * @format int32
   * @max 10000
   */
  preorderQuantity: number;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  targets: StockTarget[];
}

export interface StockTarget {
  channelType: StockTargetChannelTypeEnum;
  sku: string;
}

export enum StockTargetChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface ChannelStockSyncUpdateRequest {
  linkType: ChannelStockSyncUpdateRequestLinkTypeEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  targets: StockSyncTarget[];
  /** @format date-time */
  unlinkEndedAt?: string;
  /** @format date-time */
  unlinkStartedAt?: string;
}

export interface StockSyncTarget {
  channelType: StockSyncTargetChannelTypeEnum;
  sku: string;
}

export enum StockSyncTargetChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export enum ChannelStockSyncUpdateRequestLinkTypeEnum {
  LINKED = "LINKED",
  UNLINKED = "UNLINKED",
}

export interface ChannelStockSettingDistributionUpdateRequest {
  brand: ChannelStockSettingDistributionUpdateRequestBrandEnum;
  corporation: ChannelStockSettingDistributionUpdateRequestCorporationEnum;
  distributionRates?: DistributionRate[];
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  skus: string[];
  useDefaultRate: boolean;
}

export interface DistributionRate {
  channelType: DistributionRateChannelTypeEnum;
  /** @format int32 */
  distributionRate: number;
}

export enum DistributionRateChannelTypeEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export enum ChannelStockSettingDistributionUpdateRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum ChannelStockSettingDistributionUpdateRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface OnlineStockHistoryRequest {
  brand: OnlineStockHistoryRequestBrandEnum;
  corporation: OnlineStockHistoryRequestCorporationEnum;
  /** @uniqueItems true */
  events?: OnlineStockHistoryRequestEventsEnum[];
  /** @format date-time */
  from: string;
  /** @format date-time */
  to: string;
}

export enum OnlineStockHistoryRequestEventsEnum {
  UPDATE_ONLINE_STOCK = "UPDATE_ONLINE_STOCK",
  UPDATE_MOVEMENT = "UPDATE_MOVEMENT",
  UPDATE_SAFETY = "UPDATE_SAFETY",
}

export enum OnlineStockHistoryRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OnlineStockHistoryRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface OnlineStockHistoryResponse {
  brand: OnlineStockHistoryResponseBrandEnum;
  corporation: OnlineStockHistoryResponseCorporationEnum;
  event: EnumResponse;
  /** @format int32 */
  movementQuantity: number;
  /** @format int32 */
  movementQuantityChange: number;
  /** @format int32 */
  quantity: number;
  /** @format int32 */
  quantityChange: number;
  /** @format int32 */
  safetyQuantity: number;
  /** @format int32 */
  safetyQuantityChange: number;
  sku: string;
  /** @format date-time */
  updatedAt: string;
  updatedBy: string;
}

export enum OnlineStockHistoryResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OnlineStockHistoryResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface ChannelStockHistoryRequest {
  /** @uniqueItems true */
  channelTypes: ChannelStockHistoryRequestChannelTypesEnum[];
  /** @uniqueItems true */
  events?: ChannelStockHistoryRequestEventsEnum[];
  /** @format date-time */
  from: string;
  /** @format date-time */
  to: string;
}

export enum ChannelStockHistoryRequestEventsEnum {
  UPDATE_ONLINE_STOCK = "UPDATE_ONLINE_STOCK",
  UPDATE_PREORDER = "UPDATE_PREORDER",
  TRANSFER = "TRANSFER",
  CREATE_ORDER = "CREATE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
  SHIP_ORDER = "SHIP_ORDER",
}

export enum ChannelStockHistoryRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface ChannelStockHistoryResponse {
  /** @format int32 */
  availableQuantity: number;
  /** @format int32 */
  availableQuantityChange: number;
  channelType: EnumResponse;
  /** @format int32 */
  distributedQuantity: number;
  /** @format int32 */
  distributedQuantityChange: number;
  event: EnumResponse;
  /** @format date-time */
  preorderExpiredAt?: string;
  /** @format int32 */
  preorderQuantity: number;
  /** @format int32 */
  preorderQuantityChange: number;
  /** @format int32 */
  shippedQuantity: number;
  /** @format int32 */
  shippedQuantityChange: number;
  sku: string;
  /** @format date-time */
  updatedAt: string;
  updatedBy: string;
  /** @format int32 */
  usedQuantity: number;
  /** @format int32 */
  usedQuantityChange: number;
}

export interface UndistributedQuantityRequest {
  brand: UndistributedQuantityRequestBrandEnum;
  corporation: UndistributedQuantityRequestCorporationEnum;
  /** @uniqueItems true */
  skus: string[];
}

export enum UndistributedQuantityRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum UndistributedQuantityRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface UndistributedQuantityResponse {
  results: Item[];
}

export interface Item {
  sku: string;
  /** @format int32 */
  undistributedQuantity: number;
}

export interface StockDashboardRequest {
  brand: StockDashboardRequestBrandEnum;
  channelSendStatus?: StockDashboardRequestChannelSendStatusEnum;
  /** @uniqueItems true */
  channelTypes: StockDashboardRequestChannelTypesEnum[];
  corporation: StockDashboardRequestCorporationEnum;
  hasPreorderQuantity?: boolean;
  hasSafetyQuantity?: boolean;
  /** @format int32 */
  page: number;
  /**
   * SAP Code
   * @uniqueItems true
   */
  productCodes: string[];
  /**
   * SAP Name
   * @minLength 2
   * @maxLength 2147483647
   */
  productName?: string;
  productType?: StockDashboardRequestProductTypeEnum;
  /**
   * @format int32
   * @max 1000
   */
  size: number;
  /**
   * SKU Code
   * @uniqueItems true
   */
  skus: string[];
}

export enum StockDashboardRequestProductTypeEnum {
  BUNDLE = "BUNDLE",
  SINGLE = "SINGLE",
}

export enum StockDashboardRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum StockDashboardRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export enum StockDashboardRequestChannelSendStatusEnum {
  ON = "ON",
  OFF = "OFF",
}

export enum StockDashboardRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface PageResponseStockDashboardResponse {
  data: StockDashboardResponse[];
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

export interface StockDashboardResponse {
  productType: EnumResponse;
  products: OnlineStockResponse[];
  sku: string;
  skuName?: string;
}

export interface OnlineStockResponse {
  channelStocks: ChannelStockResponse[];
  /**
   * ERP Update Stock
   * @format int32
   */
  onlineMovementQuantity: number;
  /**
   * ERP Stock
   * @format int32
   */
  onlineQuantity: number;
  /** SAP CODE */
  productCode: string;
  /** SAP Name */
  productName: string;
  /** @format int32 */
  safetyQuantity: number;
  /** SKU CODE */
  sku: string;
  /** @format int32 */
  undistributedQuantity: number;
  /**
   * Bundle unit qty
   * @format int32
   */
  unitQuantity: number;
  /** Barcode */
  upcCode: string;
}

export interface ChannelStockResponse {
  /** @format int32 */
  availableQuantity: number;
  channel: EnumResponse;
  /** @format date-time */
  channelSendOffEndedAt?: string;
  /** @format date-time */
  channelSendOffStartedAt?: string;
  channelSendStatus: ChannelStockResponseChannelSendStatusEnum;
  /** @format int32 */
  distributedQuantity: number;
  /** @format int32 */
  preorderQuantity: number;
  /** @format date-time */
  preorderStockExpiredAt?: string;
  /** @format int32 */
  rate: number;
  /** @format int32 */
  shippedQuantity: number;
  /** @format int32 */
  usedQuantity: number;
}

export enum ChannelStockResponseChannelSendStatusEnum {
  ON = "ON",
  OFF = "OFF",
}

export interface StockHistorySearchRequest {
  brand: StockHistorySearchRequestBrandEnum;
  corporation: StockHistorySearchRequestCorporationEnum;
  /** @format date-time */
  from: string;
  periodType: StockHistorySearchRequestPeriodTypeEnum;
  productCode?: string;
  sku?: string;
  /** @format date-time */
  to: string;
  /**
   * 타임존 id (DAILY 타입에서만 사용)
   * @example "Asia/Seoul"
   */
  zoneId?: string;
}

export enum StockHistorySearchRequestPeriodTypeEnum {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
}

export enum StockHistorySearchRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum StockHistorySearchRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface StockHistoryWithProductResponse {
  histories: StockHistoryResponse[];
  productName?: string;
  sku: string;
}

export interface StockHistoryResponse {
  channelStocks: ChannelStockHistory[];
  onlineStock: OnlineStockHistory;
  /** @format date-time */
  timestamp: string;
  /** @format int32 */
  totalDistributedQuantity: number;
  /** @format int32 */
  undistributedQuantity: number;
}

export interface OnlineStockHistory {
  brand: OnlineStockHistoryBrandEnum;
  corporation: OnlineStockHistoryCorporationEnum;
  /** @format int32 */
  movementQuantity: number;
  /** @format int32 */
  quantity: number;
  /** @format int32 */
  safetyQuantity: number;
  sku: string;
  /** @format date-time */
  updatedAt: string;
}

export enum OnlineStockHistoryCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OnlineStockHistoryBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface ChannelStockHistory {
  /** @format int32 */
  availableQuantity: number;
  channelType: EnumResponse;
  /** @format int32 */
  distributedQuantity: number;
  /** @format date-time */
  preorderExpiredAt?: string;
  /** @format int32 */
  preorderQuantity: number;
  /** @format int32 */
  shippedQuantity: number;
  sku: string;
  /** @format date-time */
  updatedAt: string;
  /** @format int32 */
  usedQuantity: number;
}

export interface OnlineStockSettingSearchRequest {
  brand: OnlineStockSettingSearchRequestBrandEnum;
  corporation: OnlineStockSettingSearchRequestCorporationEnum;
}

export enum OnlineStockSettingSearchRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum OnlineStockSettingSearchRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface OnlineStockSettingResponse {
  channelType: EnumResponse;
  /** @format int32 */
  distributionPriority: number;
  /** @format int32 */
  distributionRate: number;
  /** @format int64 */
  id: number;
}

export interface ChannelStockSettingSearchRequest {
  brand: ChannelStockSettingSearchRequestBrandEnum;
  corporation: ChannelStockSettingSearchRequestCorporationEnum;
  /** @uniqueItems true */
  productCodes?: string[];
  productName?: string;
  /** @uniqueItems true */
  skus?: string[];
}

export enum ChannelStockSettingSearchRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum ChannelStockSettingSearchRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface ChannelStockSettingResponse {
  channelDistributeRates: ChannelDistributeRate[];
  productCode: string;
  productName: string;
  rateType: string;
  sku: string;
}

export interface ChannelDistributeRate {
  channelType: EnumResponse;
  /** @format int32 */
  distributedRate: number;
}
