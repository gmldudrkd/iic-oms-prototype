/* eslint-disable */
import { BrandPermissionDTO } from "./common";

export interface CreateAccountRequestDTO {
  email: string;
  /**
   * @maxItems 5
   * @minItems 0
   */
  permissions: BrandPermissionDTO[];
  /**
   * @minLength 0
   * @maxLength 50
   */
  reason: string;
}
