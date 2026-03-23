import { SelectProps, TextField } from "@mui/material";
import { useCallback } from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Control,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";

import CustomInput from "@/shared/components/form-elements/CustomInput";
import CustomSelectCheckbox from "@/shared/components/form-elements/CustomSelectCheckbox";
import { SelectItem } from "@/shared/components/form-elements/modules/type";

interface CustomSelectCheckboxProps {
  selectList: SelectItem[];
  control: Control<FieldValues>;
  selectProps?: SelectProps;
}

// 커스텀 훅 정의
export function useFormRenderers() {
  // 텍스트 입력 필드 렌더링
  const renderCustomInput = useCallback(
    (placeholder?: string, isMultiLine?: boolean) =>
      ({
        field,
      }: {
        field: FieldValues;
        fieldState: { error?: FieldError };
      }) => (
        <CustomInput
          {...field}
          name={field.name}
          textFieldProps={{
            placeholder: placeholder ?? "Enter here",
            multiline: isMultiLine,
            maxRows: isMultiLine ? 3 : undefined,
            minRows: isMultiLine ? 3 : undefined,
          }}
        />
      ),
    [],
  );

  // 숫자 입력 필드 렌더링
  const renderCustomInputNumber = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: FieldValues;
      fieldState: { error?: FieldError };
    }) => (
      <NumericFormat
        name={field.name}
        value={field.value || ""}
        onValueChange={(values, sourceInfo) => {
          if (sourceInfo.event) {
            field.onChange(values.value);
          } else if (values.value !== field.value) {
            field.onChange(values.value);
          }
        }}
        customInput={TextField}
        thousandSeparator=","
        valueIsNumericString
        allowNegative={false}
        size="small"
        placeholder="Enter"
        sx={{
          width: "90px",
          "& input": { textAlign: "right", fontSize: "14px" },
        }}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        onBlur={field.onBlur}
        inputRef={field.ref}
      />
    ),
    [],
  );

  // 체크박스 선택 렌더링
  const renderCustomSelectCheckbox = useCallback(
    ({ selectList, control, selectProps }: CustomSelectCheckboxProps) =>
      ({ field }: { field: ControllerRenderProps<FieldValues> }) => (
        <CustomSelectCheckbox
          {...field}
          name={field.name}
          control={control}
          selectList={selectList}
          placeholder={"Select"}
          enableAllOption={true}
          selectProps={{
            ...selectProps,
          }}
        />
      ),
    [],
  );

  return {
    renderCustomInput,
    renderCustomInputNumber,
    renderCustomSelectCheckbox,
  };
}
