/* eslint-disable */
export interface CreateBundleRequestDTO {
  /** @minItems 1 */
  bundleProducts: BundleProductRequestDTO[];
  description: string;
  name: string;
}

export interface BundleProductRequestDTO {
  /**
   * 수량
   * @format int32
   * @min 1
   * @example 1
   */
  quantity: number;
  /**
   * 제품 ID (SAP 코드)
   * @minLength 1
   * @example 66000000
   */
  sapCode: string;
}

export interface BundleResponseDTO {
  bundleId: string;
  bundleProductDetails: ProductResponseDTO[];
  bundleProducts: BundleProductResponseDTO[];
  /** @format date-time */
  createdAt: string;
  description?: string;
  name: string;
  productIds: string[];
  /** @format int32 */
  qty: number;
  status: BundleResponseDtoStatusEnum;
  /** @format date-time */
  updatedAt: string;
}

export enum BundleResponseDtoStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface BundleProductResponseDTO {
  productDetails?: ProductResponseDTO;
  productId: string;
  /** @format int32 */
  quantity: number;
}

export interface ProductResponseDTO {
  id?: string;
  isBundle: boolean;
  sapCode?: string;
  sapName?: string;
  sku?: string;
  status?: string;
}
