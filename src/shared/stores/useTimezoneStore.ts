import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { STORAGE_KEYS } from "@/features/header/modules/constants";

interface TimezoneState {
  timezone: string;
  setTimezone: (tz: string) => void;
}

export const useTimezoneStore = create<TimezoneState>()(
  devtools(
    (set) => ({
      timezone:
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.USER_TIMEZONE) ||
            Intl.DateTimeFormat().resolvedOptions().timeZone
          : Intl.DateTimeFormat().resolvedOptions().timeZone,

      setTimezone: (tz) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER_TIMEZONE, tz);
        }
        set({ timezone: tz }, false, "setTimezone");
      },
    }),
    { name: "🕒 TimezoneStore" },
  ),
);

/** ✅ 다른 탭 간 타임존 동기화 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEYS.USER_TIMEZONE && e.newValue) {
      const timezone =
        localStorage.getItem(STORAGE_KEYS.USER_TIMEZONE) ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      useTimezoneStore.getState().setTimezone(timezone);
    }
  });
}
