"use client";

import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";

import { useUserTimezone } from "@/features/header/hooks/useUserTimezone";
import { StyledFormControl } from "@/features/header/modules/styles";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * IANA TimeZone 전체 목록을 반환
 */
function getTimezones(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }
  // fallback (구형 브라우저용)
  return [
    "UTC",
    "Asia/Seoul",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

export default function UserTimezone() {
  const { timezone, onChange } = useUserTimezone();
  const timezones = useMemo(() => getTimezones(), []);

  return (
    <StyledFormControl fullWidth>
      <Autocomplete
        options={timezones}
        value={timezone || ""}
        onChange={onChange}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Timezone"
            variant="standard"
            placeholder="Select timezone"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
        slotProps={{
          popper: { sx: { "& .MuiAutocomplete-paper": { width: 300 } } },
        }}
      />
    </StyledFormControl>
  );
}
