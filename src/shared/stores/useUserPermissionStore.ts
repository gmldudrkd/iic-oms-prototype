import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { STORAGE_KEYS } from "@/features/header/modules/constants";

import { BrandResponse } from "@/shared/generated/oms/types/User";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

const PROTOTYPE_DEFAULT_PERMISSIONS: BrandResponse[] = isPrototype
  ? [
      {
        brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
        corporations: [
          {
            name: "US",
            channels: [
              { name: "GENTLE_MONSTER_OFFICIAL_US", description: "GM Official US" },
              { name: "NUFLAAT_OFFICIAL", description: "Nuflaat Official" },
              { name: "ATIISSU_OFFICIAL", description: "Atiissu Official" },
              { name: "ATIISSU_TEST", description: "Atiissu Test" },
            ],
          },
          {
            name: "CA",
            channels: [
              { name: "GENTLE_MONSTER_OFFICIAL_CA", description: "GM Official CA" },
            ],
          },
        ],
      },
    ]
  : [];

interface UserPermissionState {
  selectedPermission: BrandResponse[];
  setSelectedPermission: (permission: BrandResponse[]) => void;
}

export const useUserPermissionStore = create<UserPermissionState>()(
  devtools(
    (set) => ({
      selectedPermission: PROTOTYPE_DEFAULT_PERMISSIONS,
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
