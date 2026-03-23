/* eslint-disable */
import { EnumResponse } from "./common";

export interface ChannelResponse {
  brand: EnumResponse;
  /** @format int64 */
  channelId: number;
  channelName: string;
  channelType: ChannelResponseChannelTypeEnum;
  corporation: ChannelResponseCorporationEnum;
  /** @format date-time */
  createdAt: string;
  isActive: boolean;
  sapChannelCode: string;
  sapChannelName: string;
  /** @format date-time */
  updatedAt: string;
}

export enum ChannelResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum ChannelResponseChannelTypeEnum {
  OWN = "OWN",
  EXTERNAL = "EXTERNAL",
  INTERNATIONAL = "INTERNATIONAL",
}

export interface ChannelCreateRequest {
  /**
   * 브랜드 타입
   * @example "GENTLE_MONSTER"
   */
  brand: ChannelCreateRequestBrandEnum;
  /**
   * 채널 카테고리
   * @example "OWN"
   */
  category: ChannelCreateRequestCategoryEnum;
  /**
   * 채널 Sap Code
   * @minLength 1
   * @example "E-1004"
   */
  channelCode: string;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
}

/**
 * 브랜드 타입
 * @example "GENTLE_MONSTER"
 */

export enum ChannelCreateRequestCategoryEnum {
  OWN = "OWN",
  EXTERNAL = "EXTERNAL",
  INTERNATIONAL = "INTERNATIONAL",
}

export enum ChannelCreateRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

/**
 * 채널 카테고리
 * @example "OWN"
 */

export interface ChannelUpdateRequest {
  /**
   * 채널 카테고리
   * @example "OWN"
   */
  category: ChannelUpdateRequestCategoryEnum;
  /**
   * 채널명
   * @example "OWN_KR"
   */
  channelName: string;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
}

/**
 * 채널 카테고리
 * @example "OWN"
 */

export enum ChannelUpdateRequestCategoryEnum {
  OWN = "OWN",
  EXTERNAL = "EXTERNAL",
  INTERNATIONAL = "INTERNATIONAL",
}

export interface BrandCorporation {
  brand: BrandCorporationBrandEnum;
  corporation: BrandCorporationCorporationEnum;
}

export enum BrandCorporationCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum BrandCorporationBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}
