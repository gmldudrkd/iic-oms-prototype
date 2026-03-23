/* eslint-disable */
export interface AccountRequestStatusDTO {
  email: string;
  status: AccountRequestStatusDtoStatusEnum;
}

export enum AccountRequestStatusDtoStatusEnum {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface AccountRequestBulkApproveDTO {
  emails: string[];
}

export interface BulkApproveResponseDTO {
  /** @format int32 */
  failedCount: number;
  results: BulkApproveResultDTO[];
  /** @format int32 */
  successCount: number;
  /** @format int32 */
  totalCount: number;
}

export interface BulkApproveResultDTO {
  email: string;
  message?: string;
  success: boolean;
}

/** Bulk asset upload response */

export interface CursorPageAccountResponseDTO {
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 데이터 목록 */
  items: AccountResponseDTO[];
  /** 다음 페이지 커서 (null이면 마지막 페이지) */
  nextCursor?: string;
  /**
   * 현재 페이지 아이템 수
   * @format int32
   */
  size: number;
}

/** 채널 상세 */

export interface AccountResponseDTO {
  /** @format date-time */
  createdAt: string;
  email: string;
  /** @format date-time */
  lastLoginAt?: string;
  status: string;
}

export interface CursorPageAccountRequestResponseDTO {
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 데이터 목록 */
  items: AccountRequestResponseDTO[];
  /** 다음 페이지 커서 (null이면 마지막 페이지) */
  nextCursor?: string;
  /**
   * 현재 페이지 아이템 수
   * @format int32
   */
  size: number;
}

/** 커서 기반 페이지네이션 응답 */

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
