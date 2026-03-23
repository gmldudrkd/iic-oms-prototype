import { useMemo } from "react";

import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

/**
 * selectedPermission에서 brand와 corporation을 단일로 가져오는 훅
 * @returns { brand: string | undefined, corporation: string | undefined }
 */
export const useSingleBrandAndCorp = () => {
  const { selectedPermission } = useUserPermissionStore();

  return useMemo(() => {
    const brand = selectedPermission?.[0]?.brand.name;
    const corporation = selectedPermission?.[0]?.corporations?.[0]?.name;

    return { brand, corporation };
  }, [selectedPermission]);
};
