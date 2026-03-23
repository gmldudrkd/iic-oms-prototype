import { SyntheticEvent, useEffect } from "react";

import { STORAGE_KEYS } from "@/features/header/modules/constants";

import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

export function useUserTimezone() {
  const { timezone, setTimezone } = useTimezoneStore();

  const onChange = (_: SyntheticEvent, value: string | null) => {
    if (value) {
      setTimezone(value);
    }
  };

  useEffect(() => {
    const localTimezone = localStorage.getItem(STORAGE_KEYS.USER_TIMEZONE);
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!localTimezone) {
      setTimezone(browserTimezone);
    }
  }, [setTimezone]);

  return { timezone, onChange };
}
