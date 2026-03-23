import {
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { useCallback, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

import useStockHistoryDateValidation from "@/features/stock/history/hooks/shared/useStockHistoryDateValidation";
import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";
import {
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
  PERIOD_TYPE_LIST,
  SEARCH_KEY_TYPE_LIST,
} from "@/features/stock/history/modules/constants";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import FormActions from "@/shared/components/form-elements/FormActions";
import { StockHistorySearchRequestPeriodTypeEnum } from "@/shared/generated/oms/types/Stock";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

interface StockHistorySearchFilterProps {
  defaultValues: StockHistorySearchFilterForm;
  searchParams: StockHistorySearchFilterForm | null;
  setSearchParams: (params: StockHistorySearchFilterForm | null) => void;
  refetch: () => void;
}

export default function StockHistorySearchFilter({
  defaultValues,
  searchParams,
  setSearchParams,
  refetch,
}: StockHistorySearchFilterProps) {
  const { openSnackbar } = useSnackbarStore();
  const {
    control,
    watch,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useFormContext<StockHistorySearchFilterForm>();

  const {
    validateDateRange,
    openDateErrorDialog,
    setOpenDateErrorDialog,
    dateErrorMessage,
    setDateErrorMessage,
    getFromMinDate,
    getFromMaxDate,
    getToMaxDate,
  } = useStockHistoryDateValidation(watch);

  const handleSearch = useCallback(() => {
    if (
      !(
        getValues("searchKeyword") &&
        getValues("from") &&
        getValues("to") &&
        getValues("periodType") &&
        getValues("searchKeyword")
      )
    ) {
      return openSnackbar({
        message: "Please fill in all search filters.",
        severity: "warning",
      });
    }

    // 날짜 유효성 검증
    if (!validateDateRange()) {
      return;
    }

    const formValues = getValues();
    const { periodType } = formValues;
    const isDaily =
      periodType === StockHistorySearchRequestPeriodTypeEnum.DAILY;

    // Daily 모드일 경우: 조회 시작/종료 날짜 + 1일의 정각 정보로 변환
    // Daily snapshot은 다음날 00시에 찍히므로 조회 일자 +1일의 정각 정보를 조회해야 함
    const transformedValues: StockHistorySearchFilterForm = {
      ...formValues,
      from: isDaily
        ? dayjs(formValues.from).add(1, "day").startOf("day").toISOString()
        : formValues.from,
      to: dayjs(formValues.to).add(1, "day").startOf("day").toISOString(),
    };

    if (isEqual(transformedValues, searchParams)) {
      return refetch();
    }

    setSearchParams(transformedValues);
  }, [
    getValues,
    setSearchParams,
    openSnackbar,
    refetch,
    searchParams,
    validateDateRange,
  ]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setSearchParams(null);
  }, [reset, defaultValues, setSearchParams]);

  const currentSearchKeyType = watch("currentSearchKeyType");

  // currentSearchKeyType이 변경될 때마다 searchKeyword validation 재실행
  useEffect(() => {
    const searchKeyword = getValues("searchKeyword");
    if (searchKeyword) {
      trigger("searchKeyword").catch(() => {
        // Validation error handling
      });
    }
  }, [currentSearchKeyType, getValues, trigger]);

  return (
    <>
      <Box bgcolor="white">
        <Box
          className="p-[24px]"
          borderBottom="1px solid #E0E0E0"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <div className="flex flex-wrap items-start gap-[16px]">
            {/* Start Date */}
            <Controller
              control={control}
              name="from"
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(
                      date ? date.startOf("day").toISOString() : "",
                    );
                  }}
                  format="YYYY-MM-DD"
                  minDate={getFromMinDate()}
                  maxDate={getFromMaxDate()}
                  slotProps={{
                    textField: {
                      required: true,
                      sx: { width: "180px" },
                    },
                  }}
                />
              )}
            />

            {/* End Date */}
            <Controller
              control={control}
              name="to"
              render={({ field }) => (
                <DatePicker
                  label="End Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date ? date.endOf("day").toISOString() : "");
                  }}
                  format="YYYY-MM-DD"
                  maxDate={getToMaxDate()}
                  slotProps={{
                    textField: {
                      required: true,
                      sx: { width: "180px" },
                    },
                  }}
                />
              )}
            />

            {/* Time Unit */}
            <Controller
              control={control}
              name="periodType"
              render={({ field }) => (
                <FormControl sx={{ width: "120px" }}>
                  <InputLabel required>Time Unit</InputLabel>
                  <Select {...field} label="Time Unit" required>
                    {PERIOD_TYPE_LIST.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Search Field */}
            <Controller
              control={control}
              name="searchKeyword"
              rules={{
                validate: (value) => {
                  const searchKeyType = getValues("currentSearchKeyType");
                  if (
                    searchKeyType === CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME &&
                    value &&
                    value.trim().length > 0 &&
                    value.trim().length < 2
                  ) {
                    return "Please enter at least 2 characters.";
                  }
                  return true;
                },
              }}
              render={({ field }) => {
                const handleInputChange = (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                ) => {
                  const { value } = event.target;
                  field.onChange(value);
                };

                return (
                  <TextField
                    {...field}
                    fullWidth
                    label="Search"
                    required
                    placeholder={"Search for a single product"}
                    onChange={handleInputChange}
                    error={!!errors.searchKeyword}
                    helperText={errors.searchKeyword?.message}
                    sx={{
                      "& .MuiInputBase-root": { padding: "12px 12px 12px 8px" },
                      "& .MuiInputBase-input": { padding: 0 },
                      width: "536px",
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            <Controller
                              control={control}
                              name="currentSearchKeyType"
                              render={({ field }) => {
                                return (
                                  <Select
                                    {...field}
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
                                    {SEARCH_KEY_TYPE_LIST.map((item) => (
                                      <MenuItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                );
                              }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    variant="outlined"
                  />
                );
              }}
            />
          </div>

          <FormActions onReset={handleReset} onSubmitClick={handleSearch} />
        </Box>

        {/* <Box
          padding="16px 24px"
          display="flex"
          justifyContent="flex-end"
          gap="12px"
          borderTop="1px solid #E0E0E0"
        >
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ width: "120px" }}
          >
            Reset
          </Button>
          <Button
            onClick={handleSearch}
            variant="contained"
            startIcon={<SearchIcon fontSize="small" />}
            sx={{ width: "120px" }}
          >
            Search
          </Button>
        </Box> */}
      </Box>

      <AlertDialog
        open={openDateErrorDialog}
        setOpen={setOpenDateErrorDialog}
        dialogContent={dateErrorMessage}
        dialogConfirmLabel="OK"
        handlePost={() => {
          setOpenDateErrorDialog(false);
          setDateErrorMessage("");
        }}
        isButton={false}
      />
    </>
  );
}
