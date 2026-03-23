"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  SingleInputDateRangeField,
  DateRangePicker,
  DateRange,
} from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";

import {
  DATE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  SEARCH_KEY_TYPE_OPTIONS,
  SHORTCUTS_ITEMS,
} from "@/features/promotion-list/modules/constants";

import FormActions from "@/shared/components/form-elements/FormActions";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

interface SearchFormProps {
  onSearch: () => void;
  onReset: () => void;
}

export default function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const { control, handleSubmit } = useFormContext();
  const { timezone } = useTimezoneStore();
  const { selectedPermission } = useUserPermissionStore();

  const channelTypesList = selectedPermission.flatMap((item) => {
    return item.corporations.flatMap((corp) => {
      return corp.channels.map((channel) => ({
        label: channel.description,
        value: channel.name,
      }));
    });
  });

  const onSubmit: SubmitHandler<FieldValues> = () => {
    onSearch();
  };

  return (
    <form
      className="flex items-start justify-between gap-[16px] py-[24px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="search-form w-full">
        <div className="flex flex-wrap items-start gap-[16px]">
          {/* Date Type */}
          <div className="flex w-[160px] items-center">
            <FormControl fullWidth size="small">
              <InputLabel shrink>Date Type</InputLabel>
              <Controller
                name="dateType"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Date Type" displayEmpty notched>
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {DATE_TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          {/* Period */}
          <div className="flex w-[260px] items-center">
            <FormControl fullWidth>
              <Controller
                name="period"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      {...field}
                      value={field.value as DateRange<Dayjs>}
                      onChange={(newValue) => {
                        const [start, end] = newValue;
                        field.onChange([
                          start?.startOf("day"),
                          end?.endOf("day"),
                        ]);
                      }}
                      slots={{ field: SingleInputDateRangeField }}
                      closeOnSelect={false}
                      format="YYYY.MM.DD"
                      timezone={timezone}
                      slotProps={{
                        textField: {
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
            </FormControl>
          </div>

          {/* Status */}
          <div className="flex w-[160px] items-center">
            <FormControl fullWidth size="small">
              <InputLabel shrink>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Status" displayEmpty notched>
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          {/* Channel */}
          <div className="flex w-[160px] items-center">
            <FormControl fullWidth size="small">
              <InputLabel shrink>Channel</InputLabel>
              <Controller
                name="channel"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Channel" displayEmpty notched>
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {channelTypesList.map((ch) => (
                      <MenuItem key={ch.value} value={ch.value}>
                        {ch.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          {/* Search (Select + TextField) */}
          <div className="flex flex-1 items-center">
            <FormControl fullWidth>
              <Controller
                name="searchKeyword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Search"
                    placeholder="Enter a keyword to search"
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "12px 14px 12px 8px",
                      },
                      "& .MuiInputBase-input": { padding: 0 },
                      width: "536px",
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            <Controller
                              control={control}
                              name="searchKeyType"
                              render={({ field: selectField }) => (
                                <Select
                                  {...selectField}
                                  sx={{
                                    mr: 1,
                                    "& .MuiSelect-select": {
                                      py: 0.5,
                                      pl: 1,
                                      pr: 2,
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                  }}
                                  variant="outlined"
                                >
                                  {SEARCH_KEY_TYPE_OPTIONS.map((item) => (
                                    <MenuItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </div>
        </div>
      </div>
      <FormActions onReset={onReset} />
    </form>
  );
}
