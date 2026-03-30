import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { STORAGE_KEYS } from "@/features/header/modules/constants";

import { BrandResponse } from "@/shared/generated/oms/types/User";

interface UserPermissionState {
  selectedPermission: BrandResponse[];
  setSelectedPermission: (permission: BrandResponse[]) => void;
}

export const useUserPermissionStore = create<UserPermissionState>()(
  devtools(
    (set) => ({
      selectedPermission: [],
      setSelectedPermission: (permission) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_KEYS.USER_PERMISSION,
            JSON.stringify(permission),
          );
        }
        set({ selectedPermission: permission }, false, "setSelectedPermission");
      },
    }),
    { name: "🧩 UserPermissionStore" },
  ),
);

/** ✅ 다른 탭 간 user permission 동기화 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEYS.USER_PERMISSION && e.newValue) {
      const selectedPermission = JSON.parse(e.newValue);
      useUserPermissionStore
        .getState()
        .setSelectedPermission(selectedPermission);
    }
  });
}
