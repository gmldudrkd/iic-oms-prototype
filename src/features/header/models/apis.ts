import { FetchWithToken } from "@/shared/apis/fetchExtended";
import { UserPermissionResponse } from "@/shared/generated/oms/types/User";

/**
 * GET
 *  /v1/api/users/me/permissions
 * 내 권한 정보 조회 API
 * @returns UserPermissionResponse
 */
export const getUserPermissions = async () => {
  const response = await FetchWithToken("/users/me/permissions", "GET");
  return response as UserPermissionResponse;
};
