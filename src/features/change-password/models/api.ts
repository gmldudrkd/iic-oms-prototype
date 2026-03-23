import { FetchWithoutAuth } from "@/shared/apis/fetchExtended";
import {
  UserChangePasswordRequest,
  UserEmailRequest,
  PasswordTokenResponse,
} from "@/shared/generated/auth/types/Auth";

/**
 * 비밀번호 변경을 위한 이메일 인증 요청
 * @param data - 사용자 이메일 정보
 * @returns Promise<void>
 */
export const postVerifyChangePasswordEmail = (data: UserEmailRequest) =>
  FetchWithoutAuth(`/auth/verify-email`, "POST", data)
    .then((res) => res)
    .catch((error) => {
      console.error("postVerifyChangePasswordEmail API 에러:", error);
      throw error;
    }) as Promise<void>;

/**
 * 이메일 인증 코드 검증 및 액세스 토큰 발급
 * @param code - 이메일로 받은 인증 코드
 * @returns Promise<{ accessToken: string; accessTokenExpire: number }>
 */
export const getVerifyEmailCode = (code: string) =>
  FetchWithoutAuth(`/auth/verify-email?code=${code}`, "GET", null, {})
    .then((res) => res)
    .catch((error) => {
      console.error("getVerifyEmailCode API 에러:", error);
      throw error;
    }) as Promise<PasswordTokenResponse>;

/**
 * 사용자 비밀번호 변경
 * @param data - 새로운 비밀번호 정보
 * @param token - 인증 토큰 (이메일 인증으로 발급받은 토큰)
 * @returns Promise<void>
 */
export const patchChangePassword = ({
  data,
  token,
}: {
  data: UserChangePasswordRequest;
  token: string;
}) =>
  FetchWithoutAuth(`/auth/change-password`, "PATCH", data, {}, token)
    .then((res) => res)
    .catch((error) => {
      console.error("patchChangePassword API 에러:", error);
      throw error;
    }) as Promise<void>;
