/* eslint-disable */
export interface StockExportRequest {
  brand: StockExportRequestBrandEnum;
  corporation: StockExportRequestCorporationEnum;
  exportType: StockExportRequestExportTypeEnum;
  /** @format date-time */
  from: string;
  /** @format date-time */
  to: string;
  /**
   * 타임존 id
   * @example "Asia/Seoul"
   */
  zoneId?: string;
}

export enum StockExportRequestExportTypeEnum {
  OVERVIEW = "OVERVIEW",
  ONLINE_STOCK = "ONLINE_STOCK",
}

export enum StockExportRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  CA = "CA",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum StockExportRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}
