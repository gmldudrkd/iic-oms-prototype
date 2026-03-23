/* eslint-disable */
export interface UserResponse {
  email: string;
  permissions: UserResponsePermission[];
  /** @format date-time */
  signupAt: string;
  status: UserResponseStatusEnum;
}

export enum UserResponseStatusEnum {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  DORMANCY = "DORMANCY",
  TEMPORARY = "TEMPORARY",
  EXPIRED = "EXPIRED",
  LOCKED = "LOCKED",
  PASSWORD_RESET_REQUESTED = "PASSWORD_RESET_REQUESTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface UserResponsePermission {
  brand: EnumResponse;
  requests: UserResponsePermissionRequest[];
}

export interface UserResponsePermissionRequest {
  corporation: UserResponsePermissionRequestCorporationEnum;
  reason: string;
  /** @format date-time */
  requestedAt: string;
  role: UserResponsePermissionRequestRoleEnum;
  status: UserResponsePermissionRequestStatusEnum;
}

export enum UserResponsePermissionRequestStatusEnum {
  APPROVAL = "APPROVAL",
  AWAITING = "AWAITING",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum UserResponsePermissionRequestRoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
  MANAGER = "MANAGER",
}

export enum UserResponsePermissionRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export interface EnumResponse {
  description?: string;
  name: string;
}
