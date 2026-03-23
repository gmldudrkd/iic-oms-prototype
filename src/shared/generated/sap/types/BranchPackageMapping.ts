/* eslint-disable */
export interface ErrorResponse {
  details?: string;
  message?: string;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  timestamp?: string;
}

export interface BranchPackageMappingResponse {
  brand?: BranchPackageMappingResponseBrandEnum;
  /** @format int64 */
  id?: number;
  packageCode?: string;
  plant?: string;
  productCode?: string;
}

export enum BranchPackageMappingResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
  ETC = "ETC",
}
