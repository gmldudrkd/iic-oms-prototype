/* eslint-disable */
export interface AuditLogResponse {
  brand: AuditLogResponseBrandEnum;
  corporation: AuditLogResponseCorporationEnum;
  /** @format date-time */
  createdAt: string;
  grant: AuditLogResponseGrantEnum;
  grantee: string;
  grantor: string;
  requestType: AuditLogResponseRequestTypeEnum;
  status: AuditLogResponseStatusEnum;
}

export enum AuditLogResponseStatusEnum {
  APPROVAL = "APPROVAL",
  AWAITING = "AWAITING",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum AuditLogResponseRequestTypeEnum {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum AuditLogResponseGrantEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
  MANAGER = "MANAGER",
}

export enum AuditLogResponseCorporationEnum {
  KR = "KR",
  JP = "JP",
  US = "US",
  TW = "TW",
  SG = "SG",
  AU = "AU",
}

export enum AuditLogResponseBrandEnum {
  GENTLE_MONSTER = "GENTLE_MONSTER",
  TAMBURINS = "TAMBURINS",
  NUDAKE = "NUDAKE",
  NUFLAAT = "NUFLAAT",
  ATIISSU = "ATIISSU",
}
