import { FetchWithTokenAuth } from "@/shared/apis/fetchExtended";
import { UserResponse } from "@/shared/generated/auth/types/User";

/**
 * 유저 목록 조회
 * GET
 * /v1/api/users
 * @param email - 유저 이메일
 * @returns UserResponse
 */

export const getUsers = async (email: string) => {
  const response = await FetchWithTokenAuth(`/users?email=${email}`, "GET");
  return response as UserResponse;
};
