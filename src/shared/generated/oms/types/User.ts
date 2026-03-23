/* eslint-disable */
import { EnumResponse } from "./common";

export interface UserPermissionResponse {
  brands: BrandResponse[];
}

export interface BrandResponse {
  brand: EnumResponse;
  corporations: Corporation[];
}

export interface Corporation {
  channels: EnumResponse[];
  name: string;
}
