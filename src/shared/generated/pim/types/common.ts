/* eslint-disable */
export interface BrandPermissionDTO {
  brand: string;
  /** @minItems 1 */
  corporations: string[];
  role?: string;
}
