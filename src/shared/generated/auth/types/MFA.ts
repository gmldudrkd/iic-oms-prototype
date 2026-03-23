/* eslint-disable */
export interface MfaVerifyRequest {
  /**
   * TOTP 인증 코드 또는 백업 코드
   * @pattern ^([0-9]{6}|[0-9]{4}-[0-9]{4})$
   * @example 123456
   */
  code: string;
}

export interface MfaSetupRequest {
  /**
   * MFA 타입
   * @example "TOTP"
   */
  mfaType: MfaSetupRequestMfaTypeEnum;
}

/**
 * MFA 타입
 * @example "TOTP"
 */

export enum MfaSetupRequestMfaTypeEnum {
  TOTP = "TOTP",
}

export interface MfaSetupResponse {
  /** 백업 코드 목록 */
  backupCodes: string[];
  /**
   * OTP Auth URI
   * @example "otpauth://totp/..."
   */
  otpAuthUri: string;
  /**
   * QR 코드 URI (Data URI 형식)
   * @example "data:image/png;base64,..."
   */
  qrCodeUri: string;
  /**
   * 비밀 키 (수동 입력용)
   * @example "JBSWY3DPEHPK3PXP"
   */
  secret: string;
}

export interface MfaBackupCodesRegenerateRequest {
  /**
   * 현재 TOTP 인증 코드
   * @pattern ^[0-9]{6}$
   * @example 123456
   */
  code: string;
}

export interface MfaBackupCodesResponse {
  /** 새로운 백업 코드 목록 */
  backupCodes: string[];
  /**
   * 생성 일시
   * @format date-time
   * @example "2025-09-24T10:00:00Z"
   */
  generatedAt: string;
}

/** MFA 비활성화 요청 */

export interface MfaStatusResponse {
  /**
   * MFA 활성화 여부
   * @example true
   */
  enabled: boolean;
  /**
   * MFA 타입
   * @example "TOTP"
   */
  mfaType?: MfaStatusResponseMfaTypeEnum;
  /**
   * 남은 백업 코드 개수
   * @format int32
   * @example 8
   */
  remainingBackupCodes?: number;
  /**
   * MFA 상태
   * @example "ACTIVE"
   */
  status: MfaStatusResponseStatusEnum;
}

/**
 * MFA 타입
 * @example "TOTP"
 */

export enum MfaStatusResponseStatusEnum {
  NOT_ENROLLED = "NOT_ENROLLED",
  PENDING_SETUP = "PENDING_SETUP",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

/** MFA 확인 요청 */

export enum MfaStatusResponseMfaTypeEnum {
  TOTP = "TOTP",
}

/**
 * MFA 상태
 * @example "ACTIVE"
 */

export interface MfaDisableRequest {
  /**
   * 현재 인증 코드 또는 백업 코드
   * @pattern ^([0-9]{6}|[0-9]{4}-[0-9]{4})$
   */
  code: string;
}

/** MFA 설정 시작 요청 */
