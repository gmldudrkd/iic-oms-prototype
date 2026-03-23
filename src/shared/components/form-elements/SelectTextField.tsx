import { InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { SelectItem } from "@/shared/components/form-elements/modules/type";

interface SelectTextFieldProps {
  name: string;
  selectName: string;
  selectList: SelectItem[];
  isMultiLine?: boolean;
  placeholder?: string;
  label?: string;
  maxItems?: number;
  width?: string | number;
}

export default function SelectTextField({
  name,
  selectName,
  selectList,
  isMultiLine = false,
  placeholder,
  label = "Search",
  maxItems = 100,
  width = "536px",
}: SelectTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        // 콤마로 구분된 값을 엔터로 변환하는 함수
        const handleInputChange = (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          let { value } = event.target;

          // 콤마를 엔터로 변환
          if (isMultiLine && value.includes(",")) {
            value = value.replace(/,/g, "\n");
          }

          // 최대 항목 개수로 제한
          if (isMultiLine) {
            const lines = value
              .split("\n")
              .filter((line) => line.trim() !== "");
            if (lines.length > maxItems) {
              value = lines.slice(0, maxItems).join("\n");
            }
          }

          field.onChange(value);
        };

        return (
          <TextField
            {...field}
            fullWidth
            label={label}
            placeholder={
              placeholder ??
              (isMultiLine
                ? "Enter multiple keywords separated by line breaks"
                : "Enter a keyword to search")
            }
            multiline={isMultiLine}
            minRows={isMultiLine ? 1 : 1}
            maxRows={isMultiLine ? 10 : 1}
            onChange={handleInputChange}
            sx={{
              "& .MuiInputBase-root": { padding: "12px 14px 12px 8px" },
              "& .MuiInputBase-input": { padding: 0 },
              ...(width && { width }),
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Controller
                      control={control}
                      name={selectName}
                      render={({ field: selectField }) => {
                        return (
                          <Select
                            {...selectField}
                            sx={{
                              mr: 1,
                              "& .MuiSelect-select": { py: 0.5, pl: 1, pr: 2 },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                            }}
                            variant="outlined"
                          >
                            {selectList.map((item) => (
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
