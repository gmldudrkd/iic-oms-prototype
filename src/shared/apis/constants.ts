// API 관련 상수 정의

// 환경변수 기반 URL 생성
const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const version = process.env.NEXT_PUBLIC_API_BASE_URL_VERSION;

  if (!baseUrl || !version) {
    throw new Error(
      "API_BASE_URL 또는 API_VERSION 환경변수가 설정되지 않았습니다.",
    );
  }

  return `${baseUrl}${version}/api`;
};

const getAuthApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
  const version = process.env.NEXT_PUBLIC_AUTH_API_VERSION;

  if (!baseUrl || !version) {
    throw new Error(
      "AUTH_API_BASE_URL 또는 AUTH_API_VERSION 환경변수가 설정되지 않았습니다.",
    );
  }

  return `${baseUrl}${version}/api`;
};

const getPimApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_PIM_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("PIM_API_BASE_URL 환경변수가 설정되지 않았습니다.");
  }

  return baseUrl;
};

const getStoreApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("STORE_API_BASE_URL 환경변수가 설정되지 않았습니다.");
  }

  return baseUrl;
};

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  MAIN: getApiBaseUrl(),
  AUTH: getAuthApiBaseUrl(),
  PIM: getPimApiBaseUrl(),
  STORE: getStoreApiBaseUrl(),
  REFRESH_TOKEN: "/auth/refresh",
} as const;

// 기본 헤더 상수
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

// 리다이렉트 URL 상수
export const REDIRECT_URLS = {
  SIGN_IN: "/sign-in",
  NOT_FOUND: "/404",
  FORBIDDEN: "/403",
} as const;
