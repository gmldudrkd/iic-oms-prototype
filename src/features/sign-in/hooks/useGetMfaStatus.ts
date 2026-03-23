import { useQuery } from "@tanstack/react-query";

import { getMfaStatus } from "@/features/sign-in/models/api";

export default function useGetMfaStatus(token: string) {
  return useQuery({
    queryKey: ["mfa-status", token],
    queryFn: () => getMfaStatus(token),
  });
}
