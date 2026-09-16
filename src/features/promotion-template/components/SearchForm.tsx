"use client";

import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ClipboardEvent, useCallback } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";

import {
  TEMPLATE_SEARCH_KEY_TYPE_OPTIONS,
  TEMPLATE_TYPE_FILTER_OPTIONS,
} from "@/features/promotion-template/modules/constants";

import FormActions from "@/shared/components/form-elements/FormActions";

interface SearchFormProps {
  onSearch: () => void;
  onReset: () => void;
}

// Promotion List 검색 폼과 동일한 구성에서 Promotion Type · Search 만 둔 템플릿 검색 폼
// (템플릿은 채널을 갖지 않으므로 Channel 필터는 없음)
export default function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const methods = useFormContext();
  const { control, handleSubmit } = methods;

  // 모든 검색 키는 줄바꿈 복수 검색 지원 (엑셀 붙여넣기 → 줄바꿈 변환)
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (pasted.includes("\t") || pasted.includes("\r")) {
        e.preventDefault();
        const converted = pasted
          .split(/[\t\r\n]+/)
          .map((v) => v.trim())
          .filter(Boolean)
          .join("\n");
        const current = methods.getValues("searchKeyword") as string;
        const prefix = current ? current.trimEnd() + "\n" : "";
        methods.setValue("searchKeyword", prefix + converted);
      }
    },
    [methods],
  );

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
          {/* Promotion Type */}
          <div className="flex w-[200px] items-center">
            <FormControl fullWidth size="small">
              <InputLabel shrink>Promotion Type</InputLabel>
              <Controller
                name="promotionType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Promotion Type"
                    displayEmpty
                    notched
                  >
                    {TEMPLATE_TYPE_FILTER_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
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
                    placeholder="Enter multiple keywords separated by line breaks"
                    multiline
                    minRows={1}
                    maxRows={4}
                    onPaste={handlePaste}
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "8px 14px 8px 8px",
                        minHeight: "40px",
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
                                  {TEMPLATE_SEARCH_KEY_TYPE_OPTIONS.map(
                                    (item) => (
                                      <MenuItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </MenuItem>
                                    ),
                                  )}
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
