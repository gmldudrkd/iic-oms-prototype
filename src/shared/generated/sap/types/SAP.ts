/* eslint-disable */
export interface SapReceiveResponse {
  ES_RESULT?: ResponseData;
  success?: boolean;
}

export interface ResponseData {
  ERRSYS?: string;
  MSG?: string;
  MTY?: string;
}

export interface SearchStoreRequest {
  /** @format date */
  endDate: string;
  /** @format date */
  startDate: string;
}

export interface SapPackageRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  T_DATA?: PackageItem[];
}

export interface PackageItem {
  DATAB?: string;
  DATBI?: string;
  KNREZ?: string;
  KNRMAT?: string;
  KNRZM?: string;
  MATNR?: string;
  VKORG?: string;
}

export interface SapProductPriceRequest {
  I_SENDTO?: string;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  T_DATA?: PriceItem[];
}

export interface PriceItem {
  DATAB?: string;
  DATBI?: string;
  KBETR?: string;
  KONWA?: string;
  KSCHL?: string;
  KUNNR?: string;
  LOEVM_KO?: string;
  MATNR?: string;
  VKORG?: string;
  updatedPrice?: boolean;
  updatedSupplyPrice?: boolean;
  updatedSupplyPriceDiscountRate?: boolean;
}

export interface SapInventoryVariableStockRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  T_DATA?: VariableStockItem[];
}

export interface VariableStockItem {
  LABST?: string;
  LGORT?: string;
  MATNR?: string;
  MEINS?: string;
  VKORG?: string;
  atiissuVariableStock?: boolean;
  gentleMonsterVariableStock?: boolean;
  nuflaatVariableStock?: boolean;
  tamburinsVariableStock?: boolean;
}

export interface SapInventoryStockRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  T_DATA?: StockItem[];
}

export interface StockItem {
  LABST?: string;
  LGORT?: string;
  MATNR?: string;
  MEINS?: string;
  VKORG?: string;
  atiissuStock?: boolean;
  gentleMonsterStock?: boolean;
  nuflaatStock?: boolean;
  tamburinsStock?: boolean;
}

export interface SapProductRequest {
  I_IF_DATE?: string;
  I_SENDTO?: string;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  T_DATA?: ProductItem[];
}

export interface ProductItem {
  EAN11?: string;
  ZCLASS1?: string;
  ZCLASS2?: string;
  ZMATKL1?: string;
  ZMATKL2?: string;
  ZZ_MAKTX1?: string;
  ZZ_PROCESS1?: string;
  ZZ_PROCESS2?: string;
  ZZ_USETEXT001?: string;
  BRAND_ID?: string;
  /** @format float */
  BRGEW?: number;
  BSTME?: string;
  EKORG?: string;
  EXTWG?: string;
  GEWEI?: string;
  GROES?: string;
  LVORM?: string;
  MAKTX?: string;
  MATKL?: string;
  MATNR?: string;
  MEINS?: string;
  MMSTA?: string;
  MTART?: string;
  NORMT?: string;
  /** @format float */
  NTGEW?: number;
  SAISJ?: string;
  SAISO?: string;
  STOFF?: string;
  /** @format float */
  STPRS?: number;
  VKORG?: string;
  WAERS?: string;
  WERKS?: string;
  /** @format float */
  WESCH?: number;
  WGBEZ?: string;
  ZBLUEYN?: string;
  ZDUAL?: string;
  ZOPER_TY?: string;
  ZOPER_TY_T?: string;
  ZPLMUP?: string;
  ZZ_COLDES?: string;
  ZZ_COLORCD?: string;
  ZZ_COLORNM?: string;
  ZZ_COLYN?: string;
  ZZ_DESIGNTYPE?: string;
  ZZ_FCOLORCD?: string;
  ZZ_FCOLORNM?: string;
  ZZ_FRMFRTSIZE?: string;
  ZZ_FRMLETSIZE?: string;
  ZZ_FRMTEMSIZE?: string;
  ZZ_HOWTOUSE?: string;
  ZZ_LCOLORCD?: string;
  ZZ_LCOLORNM?: string;
  ZZ_LENHEIGHT?: string;
  ZZ_LENWIDTH?: string;
  ZZ_MAKTX_CN?: string;
  ZZ_MAKTX_EN?: string;
  ZZ_MAKTX_KO?: string;
  ZZ_MEABM?: string;
  ZZ_MODCD?: string;
  ZZ_RMATDIV?: string;
  ZZ_ROUTDAT?: string;
  ZZ_ROUT_CN?: string;
  ZZ_ROUT_GLB?: string;
  ZZ_SIZECLASSIF?: string;
  ZZ_TCOLORCD?: string;
  ZZ_TCOLORNM?: string;
  ZZ_VLT?: string;
  enabledSmaregi?: boolean;
  valid?: boolean;
}
