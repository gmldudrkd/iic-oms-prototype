import { FetchWithoutAuth } from "@/shared/apis/fetchExtended";
import {
  UserLoginRequest,
  LoginFirstFactorResponse,
} from "@/shared/generated/auth/types/Auth";
import { LoginTokenResponse } from "@/shared/generated/auth/types/Auth";
import {
  MfaStatusResponse,
  MfaVerifyRequest,
  MfaSetupResponse,
  MfaSetupRequest,
} from "@/shared/generated/auth/types/MFA";

export const getClientIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("IP를 가져오는데 실패했습니다:", error);
    return null;
  }
};

/**
 * 사용자 로그인 API
 * @param data - 로그인 요청 데이터 (이메일, 비밀번호)
 * @returns Promise<LoginFirstFactorResponse> - 첫 번째 인증 단계 응답 (MFA 토큰 포함)
 */
export const postLogin = (data: UserLoginRequest) =>
  FetchWithoutAuth(`/auth/login`, "POST", data)
    .then((res) => res)
    .catch((error) => {
      console.error("postLogin API 에러:", error);
      throw error;
    }) as Promise<LoginFirstFactorResponse>;

/**
 * MFA(다중 인증) 상태 확인 API
 * @param token - MFA 토큰
 * @returns Promise<MfaStatusResponse> - MFA 상태 응답
 */
export const getMfaStatus = (token: string) => {
  return FetchWithoutAuth(`/mfa/status`, "GET", null, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("getMfaStatus API 에러:", error);
      throw error;
    }) as Promise<MfaStatusResponse>;
};

/**
 * MFA(다중 인증) 설정 API
 * @param token - MFA 토큰
 * @param data - 설정 요청 데이터 (코드)
 * @returns Promise<MfaSetupResponse> - 설정 응답
 */
export const postMfaSetup = ({
  token,
  data,
}: {
  token: string;
  data: MfaSetupRequest;
}) => {
  return FetchWithoutAuth(`/mfa/setup`, "POST", data, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("postMfaSetup API 에러:", error);
      throw error;
    }) as Promise<MfaSetupResponse>;
};

/**
 * MFA(다중 인증) 활성화 API
 * @param token - MFA 토큰
 * @param data - 활성화 요청 데이터 (코드)
 * @returns Promise<void> - 활성화
 */
export const postActivateMfa = ({
  token,
  data,
}: {
  token: string;
  data: MfaVerifyRequest;
}) => {
  return FetchWithoutAuth(`/mfa/verify`, "POST", data, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("postMfaVerify API 에러:", error);
      throw error;
    }) as Promise<void>;
};

/**
 * MFA(다중 인증) 코드 인증 API
 * @param token - MFA 토큰
 * @param data - 인증 요청 데이터 (코드)
 * @returns Promise<LoginTokenResponse> - 인증 응답
 */
export const postVerifyMfaCode = ({
  token,
  data,
}: {
  token: string;
  data: MfaVerifyRequest;
}) => {
  return FetchWithoutAuth(`/mfa/verify-code`, "POST", data, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("postMfaVerify API 에러:", error);
      throw error;
    }) as Promise<LoginTokenResponse>;
};

/**
 * 로그아웃 API
 * @returns Promise<void> - 로그아웃
 */
export const postLogout = (token: string) => {
  return FetchWithoutAuth(`/auth/logout`, "POST", null, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("postLogout API 에러:", error);
      throw error;
    }) as Promise<void>;
};
