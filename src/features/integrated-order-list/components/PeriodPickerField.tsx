"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { DateRangePicker, DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import { SHORTCUTS_ITEMS } from "@/features/integrated-order-list/modules/constants";

import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

interface PeriodPickerFieldProps {
  name: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function PeriodPickerField({
  name,
  onFocus,
  onBlur,
}: PeriodPickerFieldProps) {
  const { control } = useFormContext();
  const { timezone } = useTimezoneStore();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            {...field}
            value={field.value as DateRange<Dayjs>}
            onChange={(newValue) => {
              const [start, end] = newValue;
              field.onChange([start?.startOf("day"), end?.endOf("day")]);
            }}
            onOpen={onFocus}
            onClose={onBlur}
            slots={{ field: SingleInputDateRangeField }}
            closeOnSelect={false}
            format="YYYY.MM.DD"
            timezone={timezone}
            slotProps={{
              textField: {
                onFocus,
                fullWidth: true,
                label: "Period",
                InputLabelProps: { shrink: true },
                InputProps: {
                  startAdornment: (
                    <CalendarTodayIcon sx={{ marginRight: "8px" }} />
                  ),
                },
              },
              shortcuts: {
                items: SHORTCUTS_ITEMS(timezone),
                changeImportance: "set",
              },
              actionBar: {
                actions: ["cancel", "accept"],
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}
