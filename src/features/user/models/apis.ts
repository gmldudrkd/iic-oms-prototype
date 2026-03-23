import { FetchWithTokenAuth } from "@/shared/apis/fetchExtended";
import { UserCreateConfirmRequest } from "@/shared/generated/auth/types/Auth";

/**
 * 회원가입 요청 승인 / 거절
 * PATCH
 * /v1/api/auth/signup/confirm
 * @param params - UserCreateConfirmRequest
 * @returns void
 */
export const patchSignupConfirm = async (data: UserCreateConfirmRequest) => {
  const response = await FetchWithTokenAuth(
    `/auth/signup/confirm`,
    "PATCH",
    data,
  );
  return response;
};
