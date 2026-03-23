import { useQuery } from "@tanstack/react-query";

import { getUserPermissions } from "@/features/header/models/apis";

import { UserPermissionResponse } from "@/shared/generated/oms/types/User";
import { queryKeys } from "@/shared/queryKeys";

export default function useGetUserPermission() {
  return useQuery<UserPermissionResponse>({
    queryKey: queryKeys.userPermissions(),
    queryFn: getUserPermissions,
    refetchOnMount: false,
    placeholderData: {
      brands: [],
    },
  });
}
