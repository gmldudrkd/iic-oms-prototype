import { getSession } from "next-auth/react";

import { API_ENDPOINTS } from "@/shared/apis/constants";
import { FetchOptions, HTTP_STATUS, ERROR_CODES } from "@/shared/apis/types";
import {
  createHeaders,
  createFetchOptions,
  validateSession,
  handleTokenRefresh,
  processResponse,
  handleErrorResponse,
  handleNetworkError,
} from "@/shared/apis/utils";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

/**
 * Prototype Mode - mock fetcher
 */
const makeMockFetcher = () => {
  return async <T = unknown>(
    url: string,
    method: string = "GET",
    _body: unknown = null,
    _options: FetchOptions = {},
  ): Promise<T> => {
    // 동적 import로 mock 데이터 로드 (번들 사이즈 영향 최소화)
    const { getMockResponse } = await import("@/shared/apis/mockData");
    const mockData = getMockResponse(url, method);
    console.log(`[PROTOTYPE] ${method} ${url} →`, mockData);
    return mockData as T;
  };
};

/**
 * Access Token을 포함한 API 요청 함수 생성기
 */
export const makeApiFetcher = (baseUrl: string, token?: string) => {
  if (isPrototype) return makeMockFetcher();

  return async <T = unknown>(
    url: string,
    method: string = "GET",
    body: unknown = null,
    options: FetchOptions = {},
  ): Promise<T | never> => {
    const session = await getSession();

    // 세션 유효성 검증
    if (!(await validateSession(session))) {
      return { success: false, errorCode: ERROR_CODES.SESSION_EXPIRED } as T;
    }

    const headers = createHeaders(session, options, true, token);
    const fetchOptions = createFetchOptions(method, headers, body, options);

    try {
      const response = await fetch(`${baseUrl}${url}`, fetchOptions);

      // blob 응답 처리
      if (options.responseType === "blob") {
        return response as T;
      }

      // JSON/text 등 일반 응답 처리
      const processedResponse = await processResponse(
        response,
        options.responseType,
      );

      if (processedResponse !== null) {
        return processedResponse as T;
      }

      // 401 에러 - 토큰 갱신 시도
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        console.error("🚨 Unauthorized 오류 - 토큰 갱신 시도");

        if (session?.refreshToken) {
          await handleTokenRefresh(session, baseUrl);

          const retryResponse = await fetch(`${baseUrl}${url}`, fetchOptions);
          return (await retryResponse.json()) as T;
        }
      }

      // 기타 에러 응답 처리
      if (!response.ok) {
        await handleErrorResponse(response);
      }

      // JSON 응답 처리
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return (await response.json()) as T;
      }

      return response as T;
    } catch (error) {
      return await handleNetworkError(error);
    }
  };
};

/**
 * Access Token 없이 API 요청 (비로그인 상태에서 사용)
 */
export const makeApiFetcherWithoutAuth = (baseUrl: string) => {
  if (isPrototype) return makeMockFetcher();

  return async <T = unknown>(
    url: string,
    method: string = "GET",
    body: unknown = null,
    options: FetchOptions = {},
    token?: string,
  ): Promise<T | never> => {
    const headers = createHeaders(null, options, !!token, token);
    const fetchOptions = createFetchOptions(method, headers, body, options);
    fetchOptions.cache = "no-store";

    try {
      const response = await fetch(`${baseUrl}${url}`, fetchOptions);

      // 성공 응답 커스텀 처리
      const processedResponse = await processResponse(
        response,
        options.responseType,
      );
      if (processedResponse !== null) {
        return processedResponse as T;
      }

      // 에러 응답 처리
      if (!response.ok) {
        await handleErrorResponse(response);
      }

      // 텍스트 응답 처리
      const textResponse = await response.text();
      return textResponse
        ? (JSON.parse(textResponse) as T)
        : ({ result: true } as T);
    } catch (error) {
      console.error("🚨 API 에러:", error);
      throw error;
    }
  };
};

// Fetch API 인스턴스
// with auth
export const FetchWithToken = makeApiFetcher(API_ENDPOINTS.MAIN);
export const FetchWithTokenPIM = makeApiFetcher(API_ENDPOINTS.PIM);
export const FetchWithTokenAuth = makeApiFetcher(API_ENDPOINTS.AUTH);
// without auth
export const FetchWithoutAuth = makeApiFetcherWithoutAuth(API_ENDPOINTS.AUTH);
export const FetchWithoutAuthStore = makeApiFetcherWithoutAuth(
  API_ENDPOINTS.STORE,
);
