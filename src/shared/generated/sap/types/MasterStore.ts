/* eslint-disable */
export interface OnlineStoreSearchRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  brands?: OnlineStoreSearchRequestBrandsEnum[];
  /**
   * @maxItems 2147483647
   * @minItems 1
   * @uniqueItems true
   */
  corporations?: string[];
}

export enum OnlineStoreSearchRequestBrandsEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
  ETC = "ETC",
}

export interface OnlineStoreResponse {
  brand?: OnlineStoreResponseBrandEnum;
  corporations?: Corporation[];
}

export interface Corporation {
  corporation?: string;
  onlineStores?: OnlineStore[];
}

export interface OnlineStore {
  code?: string;
  name?: string;
}

export enum OnlineStoreResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
  ETC = "ETC",
}

export interface MasterStoreNameResponse {
  code?: string;
  name?: string;
}
