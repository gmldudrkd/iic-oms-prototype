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

import {
  PERIOD_ERROR_MESSAGES,
  SHORTCUTS_ITEMS,
  validatePeriod,
} from "@/features/integrated-order-list/modules/constants";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

interface PeriodPickerFieldProps {
  name: string;
  onFocus?: () => void;
  onBlur?: () => void;
  /**
   * 필수 값 / 최대 조회 기간(PERIOD_MAX_DAYS) 유효성 검사 활성화 여부
   * - 활성화 시 필드 에러(빨간 테두리 + 메시지)와 기간 초과 에러 알럿을 노출한다
   */
  enableValidation?: boolean;
}

// 시작일은 00:00:00, 종료일은 23:59:59로 정규화
const normalizeRange = (range: DateRange<Dayjs>): DateRange<Dayjs> => [
  range[0]?.startOf("day") ?? null,
  range[1]?.endOf("day") ?? null,
];

// 같은 날짜인지 비교 (null 포함)
const isSameDate = (a: Dayjs | null, b: Dayjs | null) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.isSame(b, "day");
};

export function PeriodPickerField({
  name,
  onFocus,
  onBlur,
  enableValidation = false,
}: PeriodPickerFieldProps) {
  const { control, trigger } = useFormContext();
  const { timezone } = useTimezoneStore();
  const { openSnackbar } = useSnackbarStore();

  return (
    <Controller
      name={name}
      control={control}
      rules={
        enableValidation
          ? { validate: (value) => validatePeriod(value) ?? true }
          : undefined
      }
      render={({ field, fieldState }) => {
        const handleChange = async (newValue: DateRange<Dayjs>) => {
          const nextValue = normalizeRange(newValue);

          if (!enableValidation) {
            field.onChange(nextValue);
            return;
          }

          const prevValue = normalizeRange(
            (field.value ?? [null, null]) as DateRange<Dayjs>,
          );
          const [nextStart, nextEnd] = nextValue;
          const [prevStart] = prevValue;

          const commit = async (value: DateRange<Dayjs>) => {
            field.onChange(value);
            await trigger(name);
          };

          // 시작일을 새로 선택한 경우
          // MUI가 기존 종료일을 비워 YYYY.MM.DD로 표시되는 것을 막기 위해,
          // 종료일을 유지할 수 없으면 선택한 날짜의 단일 일자 범위로 채운다
          if (!isSameDate(nextStart, prevStart)) {
            const canKeepEnd =
              !!nextStart && !!nextEnd && !validatePeriod(nextValue);

            await commit(
              canKeepEnd ? nextValue : normalizeRange([nextStart, nextStart]),
            );
            return;
          }

          // 종료일이 180일을 초과하는 경우
          // 선택을 반영하지 않고 이전 날짜를 유지한 뒤 에러 알럿만 노출
          if (
            validatePeriod(nextValue) === PERIOD_ERROR_MESSAGES.exceedMaxDays
          ) {
            openSnackbar({
              message: PERIOD_ERROR_MESSAGES.exceedMaxDays,
              severity: "error",
            });
            await commit(prevValue);
            return;
          }

          await commit(nextValue);
        };

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              {...field}
              value={field.value as DateRange<Dayjs>}
              onChange={handleChange}
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
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
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
        );
      }}
    />
  );
}
