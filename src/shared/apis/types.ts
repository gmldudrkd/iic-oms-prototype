// API 관련 타입 정의
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
}

export interface ApiErrorInterface {
  status?: number;
  errorCode: string;
  errorMessage: string;
}

export class ApiError extends Error implements ApiErrorInterface {
  status?: number;
  errorCode: string;
  errorMessage: string;
  errorDetail?: { field: string; value: string; reason: string }[];

  constructor(
    errorCode: string,
    errorMessage: string,
    status?: number,
    errorDetail?: { field: string; value: string; reason: string }[],
  ) {
    super(errorMessage);
    this.name = "ApiError";
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.status = status;
    this.errorDetail = errorDetail;
  }
}

export interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  responseType?: "json" | "blob" | "text";
  signal?: AbortSignal;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
  user: unknown;
}

// HTTP 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  GONE: 410,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 에러 코드 상수
export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  NETWORK_ERROR: "NETWORK_ERROR",
  ABORT_ERROR: "AbortError",
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
  NETWORK_ERROR: "서버 연결에 실패했습니다.",
  REQUEST_ABORTED: "요청이 사용자에 의해 중단되었습니다.",
} as const;
