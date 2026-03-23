import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getUsers } from "@/shared/apis/getUsers";
import { UserResponse } from "@/shared/generated/auth/types/User";
import { ApiError } from "@/shared/types";

/**
 * useGetUsers 훅
 * - email을 key로 query 실행
 */
export const useGetUsers = <T = UserResponse>(
  email: string,
): UseQueryResult<UserResponse, ApiError> => {
  return useQuery({
    queryKey: ["users", email],
    queryFn: () => getUsers(email),
  });
};
