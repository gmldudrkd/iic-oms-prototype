/* eslint-disable */
export interface MasterProductResponse {
  categoryName1?: string;
  categoryName2?: string;
  categoryName3?: string;
  productCategory1?: string;
  productCategory2?: string;
  productCategory3?: string;
  barcode?: string;
  brandCode?: string;
  createCode?: string;
  /** @format date-time */
  createdAt?: string;
  deleteFlag?: string;
  discontinuedCode?: string;
  discontinuedType?: string;
  frameFrontLength?: string;
  frameSideLength?: string;
  lensHeight?: string;
  lensWidth?: string;
  /** @format double */
  minPackQuantity?: number;
  model?: string;
  modelCode?: string;
  /** @format double */
  netWeight?: number;
  productCode?: string;
  productName?: string;
  /** @format int32 */
  productTier?: number;
  purchaseOrganization?: string;
  /** @format date */
  releaseDate?: string;
  /** @format date */
  releaseDateChina?: string;
  /** @format date */
  releaseDateGlobal?: string;
  salesOrganization?: string;
  standard?: string;
  /** @format date-time */
  updatedAt?: string;
  weightUnit?: string;
}

export interface PackageMappingResponse {
  brandType?: PackageMappingResponseBrandTypeEnum;
  /** @format int64 */
  id?: number;
  packageCode?: string;
  productCode?: string;
}

export enum PackageMappingResponseBrandTypeEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
  ETC = "ETC",
}

export interface MasterProductPriceResponse {
  brand?: MasterProductPriceResponseBrandEnum;
  currency?: string;
  /** @format int64 */
  id?: number;
  price?: number;
  productCode?: string;
}

export enum MasterProductPriceResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
  ETC = "ETC",
}
