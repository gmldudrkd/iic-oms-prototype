import { useQuery } from "@tanstack/react-query";

import { getVerifyEmailCode } from "@/features/change-password/models/api";

import { PasswordTokenResponse } from "@/shared/generated/auth/types/Auth";
import { ApiError } from "@/shared/types";

export default function useGetVerifyEmailCode(code: string) {
  return useQuery<PasswordTokenResponse, ApiError>({
    queryKey: ["verify-email-code", code],
    queryFn: () => getVerifyEmailCode(code),
    enabled: !!code,
  });
}
