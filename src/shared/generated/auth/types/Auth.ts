/* eslint-disable */
export interface LoginTokenResponse {
  accessToken: string;
  /** @format int64 */
  accessTokenExpire: number;
  /** @format date-time */
  lastLoginAt: string;
  refreshToken: string;
  /** @format int64 */
  refreshTokenExpire: number;
}

export interface UserEmailRequest {
  /** @pattern ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$ */
  email: string;
}

export interface PasswordTokenResponse {
  accessToken: string;
  /** @format int64 */
  accessTokenExpire: number;
}

export interface ErrorResponse {
  errorCode: string;
  errorDetail: FieldError[];
  errorMessage: string;
}

export interface FieldError {
  field: string;
  reason: string;
  value: string;
}

export interface UserCreateRequest {
  /**
   * @minLength 1
   * @pattern ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$
   */
  email: string;
  /**
   * @minLength 8
   * @maxLength 2147483647
   * @pattern ^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$
   */
  password: string;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  permissions: UserCreateRequestPermission[];
  /** @minLength 1 */
  reason: string;
  role: UserCreateRequestRoleEnum;
}

export enum UserCreateRequestRoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
  MANAGER = "MANAGER",
}

export interface UserCreateRequestPermission {
  brand: UserCreateRequestPermissionBrandEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  corporations: UserCreateRequestPermissionCorporationsEnum[];
}

export enum UserCreateRequestPermissionCorporationsEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum UserCreateRequestPermissionBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface UserRefreshRequest {
  refreshToken: string;
}

export interface UserPermissionRequest {
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  permissions: UserPermissionRequestPermission[];
  /** @minLength 1 */
  reason: string;
}

export interface UserPermissionRequestPermission {
  brand: UserPermissionRequestPermissionBrandEnum;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  corporations: UserPermissionRequestPermissionCorporationsEnum[];
}

export enum UserPermissionRequestPermissionCorporationsEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum UserPermissionRequestPermissionBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface UserLoginRequest {
  /** @minLength 1 */
  accessIp: string;
  /** @minLength 1 */
  email: string;
  /**
   * @minLength 8
   * @maxLength 2147483647
   * @pattern ^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$
   */
  password: string;
  /** @minLength 1 */
  userAgent: string;
}

export interface LoginFirstFactorResponse {
  /** @format int64 */
  expiresIn: number;
  mfaToken: string;
}

export interface UserCreateConfirmRequest {
  accessIp?: string;
  brand: UserCreateConfirmRequestBrandEnum;
  confirm: UserCreateConfirmRequestConfirmEnum;
  corporation: UserCreateConfirmRequestCorporationEnum;
  /** @minLength 1 */
  email: string;
  reason?: string;
}

export enum UserCreateConfirmRequestCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum UserCreateConfirmRequestConfirmEnum {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
}

export enum UserCreateConfirmRequestBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}

export interface UserChangePasswordRequest {
  password: string;
}
