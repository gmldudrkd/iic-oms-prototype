import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
  DEFAULT_HEADERS,
  REDIRECT_URLS,
  API_ENDPOINTS,
} from "@/shared/apis/constants";
import {
  ApiError,
  FetchOptions,
  TokenData,
  HTTP_STATUS,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/shared/apis/types";
import { updateNextAuthSession } from "@/shared/utils/updateNextAuthSession";

/**
 * API 요청 헤더 생성
 */
export const createHeaders = (
  session: Session | null,
  options: FetchOptions,
  withToken: boolean,
  token?: string,
): HeadersInit => {
  const headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  };

  if (withToken && (token || session?.accessToken)) {
    (headers as Record<string, string>).Authorization =
      `Bearer ${token || session?.accessToken}`;
  }

  return headers;
};

/**
 * Fetch 옵션 생성
 */
export const createFetchOptions = (
  method: string,
  headers: HeadersInit,
  body: unknown,
  options: FetchOptions,
): FetchOptions => {
  const fetchOptions: FetchOptions = {
    ...options,
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    const contentType = (headers as Record<string, string>)["Content-Type"];

    if (contentType === "application/json") {
      fetchOptions.body = JSON.stringify(body);
    } else if (contentType === "multipart/form-data" && fetchOptions.headers) {
      // multipart/form-data의 경우 브라우저가 자동으로 Content-Type 설정
      delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
      fetchOptions.body = body as BodyInit;
    }
  }

  return fetchOptions;
};

/**
 * 세션 유효성 검증
 */
export const validateSession = async (
  session: Session | null,
): Promise<boolean> => {
  if (!session || !session.accessToken) {
    console.warn("⚠️ 세션이 만료됨 → 자동 로그아웃 실행");
    await signOut({ callbackUrl: REDIRECT_URLS.SIGN_IN, redirect: true });
    return false;
  }
  return true;
};

/**
 * 토큰 갱신 처리
 */
export const handleTokenRefresh = async (
  session: Session,
  baseUrl: string,
): Promise<TokenData | null> => {
  if (!session.refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.REFRESH_TOKEN}`, {
      method: "POST",
      body: JSON.stringify({
        refreshToken: session.refreshToken,
      }),
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("🚨 Refresh token 갱신 실패");
      await signOut({ callbackUrl: REDIRECT_URLS.SIGN_IN, redirect: true });
      throw new ApiError(
        ERROR_CODES.REFRESH_TOKEN_EXPIRED,
        ERROR_MESSAGES.SESSION_EXPIRED,
      );
    }

    const responseData = await response.json();

    const newTokenData: TokenData = {
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
      accessTokenExpires: Number(responseData.accessTokenExpire),
      refreshTokenExpires: Number(responseData.refreshTokenExpire),
      user: session.user,
    };

    console.log("🔍 리프레시 토큰 갱신 성공");
    await updateNextAuthSession(newTokenData);

    return newTokenData;
  } catch (error) {
    console.error("🚨 토큰 갱신 중 오류:", error);
    throw error;
  }
};

/**
 * 응답 처리
 */
export const processResponse = async (
  response: Response,
  responseType?: string,
): Promise<unknown> => {
  // Blob 응답 처리
  if (responseType === "blob" && response.status === HTTP_STATUS.OK) {
    return await response.blob();
  }

  // 성공 응답 (201, 202 등)
  if (response.status > HTTP_STATUS.OK && response.status < 300) {
    const text = await response.text();

    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    return { result: true };
  }

  // No Content 응답
  if (response.status === HTTP_STATUS.NO_CONTENT) {
    return { result: true };
  }

  return null; // 추가 처리 필요한 경우
};

/**
 * 에러 응답 처리
 */
export const handleErrorResponse = async (
  response: Response,
): Promise<never> => {
  const { status } = response;

  // 404 에러 - 토스트 팝업 알럿으로 대체
  if (status === HTTP_STATUS.NOT_FOUND) {
    const errorBody = await response.json();

    // 에러 응답이 있는 경우
    if (errorBody.errorCode && errorBody.errorMessage) {
      throw new ApiError(
        errorBody.errorCode,
        errorBody.errorMessage,
        HTTP_STATUS.NOT_FOUND,
        errorBody.errorDetail,
      );
    }

    throw new ApiError(ERROR_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);
  }

  // 403 에러
  if (status === HTTP_STATUS.FORBIDDEN) {
    if (typeof window !== "undefined") {
      window.location.href = REDIRECT_URLS.FORBIDDEN;
    }
    throw new ApiError(ERROR_CODES.SESSION_EXPIRED, "접근 권한이 없습니다.");
  }

  // 410 에러
  if (status === HTTP_STATUS.GONE) {
    const errorBody = await response.json();
    throw new ApiError(
      errorBody.errorCode,
      errorBody.errorMessage,
      HTTP_STATUS.GONE,
      errorBody.errorDetail,
    );
  }

  // 기타 에러
  const errorBody = await response.json();
  console.error("🚨 API 응답 오류 발생:", errorBody);
  throw new ApiError(
    errorBody.errorCode || "UNKNOWN_ERROR",
    errorBody.errorMessage ||
      errorBody.errorDetail?.errors?.[0]?.message ||
      "알 수 없는 오류가 발생했습니다.",
    status,
    errorBody.errorDetail || [],
  );
};

/**
 * 네트워크 에러 처리
 */
export const handleNetworkError = async (error: unknown): Promise<never> => {
  // AbortError 처리
  if ((error as { name?: string })?.name === ERROR_CODES.ABORT_ERROR) {
    console.error("🚨", ERROR_MESSAGES.REQUEST_ABORTED);
    throw error;
  }

  // 백엔드에서 온 에러는 그대로 전달
  if ((error as { errorCode?: string })?.errorCode) {
    throw error;
  }

  // 네트워크 에러
  console.error("🚨 네트워크 오류:", error);
  // await signOut({ callbackUrl: REDIRECT_URLS.SIGN_IN, redirect: true });

  throw new ApiError(ERROR_CODES.NETWORK_ERROR, ERROR_MESSAGES.NETWORK_ERROR);
};
