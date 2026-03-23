import {
  Select,
  SelectProps,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import React, { forwardRef, useCallback, ReactElement } from "react";
import {
  FieldValues,
  Path,
  RegisterOptions,
  useController,
  Control,
} from "react-hook-form";

import { SelectItem } from "@/shared/components/form-elements/modules/type";

// 타입 인터페이스 재정의
interface CustomSelectProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  control: Control<T>;
  selectList: SelectItem[];
  placeholder?: string;
  onChange?: (event: SelectChangeEvent<unknown>) => void;
  selectProps?: SelectProps;
  useRadio?: boolean;
}

// forwardRef로 컴포넌트 로직 정의 (내부 useController 로직 유지)
const CustomSelectComponent = forwardRef<HTMLDivElement, CustomSelectProps>(
  (props, ref) => {
    const {
      name,
      rules,
      control,
      selectList,
      placeholder,
      onChange: propsOnChange,
      selectProps,
    } = props;

    const {
      field: { value, onChange, onBlur },
    } = useController({ name, rules, control });

    const handleChange = (event: SelectChangeEvent<unknown>) => {
      event.preventDefault();
      onChange(event.target.value);
      if (propsOnChange) {
        propsOnChange(event);
      }
    };

    const renderValue = useCallback(
      (selected: unknown) => {
        if (selected === "") {
          return (
            <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>{placeholder}</span>
          );
        }
        return selectList?.find((item: SelectItem) => item.value === selected)
          ?.label;
      },
      [selectList, placeholder],
    );

    const renderSelectItem = useCallback(
      ({ label, value: itemValue, disabled }: SelectItem) => (
        <MenuItem key={String(label)} value={itemValue} disabled={disabled}>
          {label}
        </MenuItem>
      ),
      [],
    );

    return (
      <Select
        ref={ref}
        value={value ?? ""}
        renderValue={renderValue}
        onChange={handleChange}
        onBlur={onBlur}
        displayEmpty
        {...selectProps}
        sx={{
          "& .MuiSelect-select": { padding: "8.5px 14px" },
          ...(selectProps?.sx ?? {}),
        }}
      >
        {selectList?.map(renderSelectItem)}
      </Select>
    );
  },
);

// 디버깅을 위한 displayName 설정
CustomSelectComponent.displayName = "CustomSelect";

// 타입 단언을 사용하여 최종 컴포넌트 타입에 제네릭 재적용
const CustomSelect = CustomSelectComponent as <
  TFieldValues extends FieldValues = FieldValues,
>(
  props: CustomSelectProps<TFieldValues> & { ref?: React.Ref<HTMLDivElement> },
) => ReactElement;

export default CustomSelect;
