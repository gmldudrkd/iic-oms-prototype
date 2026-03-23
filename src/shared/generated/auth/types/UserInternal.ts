/* eslint-disable */
export interface UserPermissionResponse {
  brands: BrandResponse[];
}

export interface BrandResponse {
  brand: BrandResponseBrandEnum;
  corporations: BrandResponseCorporationsEnum[];
}

export enum BrandResponseCorporationsEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum BrandResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}
