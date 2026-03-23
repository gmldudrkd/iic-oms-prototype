import { Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ProductRateSearchForm } from "@/features/stock/distributionSetting/models/types";
import {
  SEARCH_KEY_TYPE_LIST,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_NAME,
} from "@/features/stock/overview/modules/constants";

export default function SearchField() {
  const {
    control,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<ProductRateSearchForm>();
  const currentSearchKeyType = watch("searchKeyType");

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
    <Controller
      control={control}
      name="searchKeyword"
      rules={{
        validate: (value) => {
          const searchKeyType = getValues("searchKeyType");
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
        const isMultiLineField =
          currentSearchKeyType === CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES ||
          currentSearchKeyType === CURRENT_SEARCH_KEY_TYPE_SKU_CODE;

        // 콤마로 구분된 값을 엔터로 변환하는 함수
        const handleInputChange = (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          let { value } = event.target;

          // 콤마를 엔터로 변환
          if (isMultiLineField && value.includes(",")) {
            value = value.replace(/,/g, "\n");
          }

          // 최대 100개 항목으로 제한
          if (isMultiLineField) {
            const lines = value
              .split("\n")
              .filter((line) => line.trim() !== "");
            if (lines.length > 100) {
              value = lines.slice(0, 100).join("\n");
            }
          }

          field.onChange(value);
        };

        return (
          <TextField
            {...field}
            fullWidth
            label="Search"
            placeholder={
              isMultiLineField
                ? "Separate entries with Enter"
                : "Search for a single product"
            }
            multiline={isMultiLineField}
            minRows={isMultiLineField ? 1 : 1}
            maxRows={isMultiLineField ? 10 : 1}
            onChange={handleInputChange}
            error={!!errors.searchKeyword}
            helperText={
              currentSearchKeyType === CURRENT_SEARCH_KEY_TYPE_SKU_CODE
                ? "Only SKU codes of type ‘single’ can be searched."
                : errors.searchKeyword?.message
            }
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
                      name="searchKeyType"
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            sx={{
                              mr: 1,
                              "& .MuiSelect-select": { py: 0.5, pl: 1, pr: 2 },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                            }}
                            variant="outlined"
                          >
                            {SEARCH_KEY_TYPE_LIST.map((item) => (
                              <MenuItem key={item.value} value={item.value}>
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
  );
}
