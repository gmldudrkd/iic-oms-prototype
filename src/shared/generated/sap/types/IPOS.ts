/* eslint-disable */
export interface InsertInventoryInitRequest {
  deliveryCode?: string;
  invoice?: string;
  japan?: boolean;
}

export interface BranchPackageMappingUpdateRequest {
  appliedDate: string;
  packageCode: string;
  plant: string;
  withdrawDate: string;
}

export interface BranchPackageMappingProductUpdateRequest {
  appliedDate: string;
  packageCode: string;
  plant: string;
  productCode: string;
  withdrawDate: string;
}

export interface TransactionItemResponse {
  barcode?: string;
  /** @format float */
  price?: number;
  productCode?: string;
  /** @format int32 */
  quantity?: number;
}
