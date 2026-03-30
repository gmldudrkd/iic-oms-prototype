/* eslint-disable */
import { BrandPermissionDTO } from "./common";

export interface OffsetPageAccountResponseDTO {
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 데이터 목록 */
  items: AccountResponseDTO[];
  /**
   * 현재 페이지 번호
   * @format int32
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   */
  pageSize: number;
  /**
   * 현재 페이지 아이템 수
   * @format int32
   */
  size: number;
  /**
   * 전체 데이터 수
   * @format int32
   */
  totalCount: number;
  /**
   * 전체 페이지 수
   * @format int32
   */
  totalPageCount: number;
}

/** 오프셋 기반 페이지네이션 응답 */

export interface AccountResponseDTO {
  /** @format date-time */
  createdAt: string;
  email: string;
  /** @format date-time */
  lastLoginAt?: string;
  permissions: PermissionResponseDTO[];
  status: string;
}

export interface PermissionResponseDTO {
  brand: string;
  corporations: string[];
  role?: string;
}

export interface AdminCreateAccountRequestDTO {
  email: string;
}

export interface AccountRequestStatusDTO {
  email: string;
  status: AccountRequestStatusDtoStatusEnum;
}

export enum AccountRequestStatusDtoStatusEnum {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface AccountRequestBulkActionDTO {
  action: AccountRequestBulkActionDtoActionEnum;
  emails: string[];
}

export enum AccountRequestBulkActionDtoActionEnum {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
}

export interface BulkActionResponseDTO {
  /** @format int32 */
  failedCount: number;
  results: BulkActionResultDTO[];
  /** @format int32 */
  successCount: number;
  /** @format int32 */
  totalCount: number;
}

export interface BulkActionResultDTO {
  email: string;
  message?: string;
  success: boolean;
}

/** Bulk asset upload response */

export interface UpdateAccountPermissionsDTO {
  /** @minLength 1 */
  email: string;
  /**
   * @maxItems 5
   * @minItems 0
   */
  permissions: BrandPermissionDTO[];
}

export interface OffsetPageAccountRequestResponseDTO {
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 데이터 목록 */
  items: AccountRequestResponseDTO[];
  /**
   * 현재 페이지 번호
   * @format int32
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   */
  pageSize: number;
  /**
   * 현재 페이지 아이템 수
   * @format int32
   */
  size: number;
  /**
   * 전체 데이터 수
   * @format int32
   */
  totalCount: number;
  /**
   * 전체 페이지 수
   * @format int32
   */
  totalPageCount: number;
}

/** 오프셋 기반 페이지네이션 응답 */

export interface AccountRequestResponseDTO {
  /** @format date-time */
  createdAt: string;
  email: string;
  /** @format date-time */
  processedAt?: string;
  processedBy?: string;
  reason: string;
  requestBrand?: string;
  requestCompanies: string[];
  requestRole?: string;
  status: string;
  /** @format date-time */
  updatedAt: string;
}
