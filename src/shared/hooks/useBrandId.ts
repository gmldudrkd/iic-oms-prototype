import { useMemo } from "react";

import { BRAND_ID_LIST } from "@/shared/constants";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

/**
 * selectedPermission에서 brandId를 가져오는 훅
 * @returns brandId 또는 undefined
 */
export const useBrandId = () => {
  const { selectedPermission } = useUserPermissionStore();

  const brandId = useMemo(() => {
    if (selectedPermission.length === 0) {
      return "";
    }

    const currentBrand = selectedPermission[0].brand.name;
    return BRAND_ID_LIST[currentBrand as keyof typeof BRAND_ID_LIST];
  }, [selectedPermission]);

  return brandId;
};
