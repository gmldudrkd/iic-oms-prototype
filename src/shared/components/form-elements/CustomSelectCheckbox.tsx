import {
  Select,
  SelectProps,
  SelectChangeEvent,
  MenuItem,
  Checkbox,
  ListItemText,
  ListSubheader,
  InputLabel,
  FormControl,
} from "@mui/material";
import React, { useCallback } from "react";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from "react-hook-form";

import { SelectItem } from "@/shared/components/form-elements/modules/type";

interface CustomSelectCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  labelName?: string;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  control: Control<TFieldValues>;
  selectList: SelectItem[];
  placeholder?: string;
  onSelectChange?: (event: SelectChangeEvent<unknown>) => void;
  // onChange?: (event: SelectChangeEvent<unknown>) => void;
  selectProps?: SelectProps;
  label?: string;
  enableAllOption?: boolean;
  /**
   * "ALL" 선택 시에도 개별 옵션을 비활성화하지 않고, 개별 토글(부분 선택)을 허용한다.
   * (Brand & Corp 셀렉터와 동일한 동작)
   */
  allowIndividualToggle?: boolean;
}

const CustomSelectCheckboxInner = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(
  props: CustomSelectCheckboxProps<TFieldValues, TName>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    labelName,
    name,
    rules,
    control,
    selectList,
    placeholder,
    onSelectChange,
    selectProps,
    enableAllOption = false,
    allowIndividualToggle = false,
  } = props;

  const {
    field: { value: selectedValues, onChange, onBlur },
  } = useController({
    name,
    rules,
    control,
  });

  const optionValues = React.useMemo(
    () => selectList.map((option) => String(option.value)),
    [selectList],
  );

  // 전체 선택 여부: "All" 센티넬이 있거나 모든 개별 옵션이 선택된 경우
  const isAllSelected =
    selectedValues?.includes("All") ||
    (optionValues.length > 0 &&
      optionValues.every((value) => selectedValues?.includes(value)));

  // 일부만 선택된 상태 (ALL 체크박스 indeterminate 표시용)
  const isIndeterminate =
    !isAllSelected &&
    Array.isArray(selectedValues) &&
    selectedValues.some((value) => value !== "All");

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selected = event.target.value as string[];

    if (enableAllOption) {
      const tokenToggled =
        selected.includes("All") !== selectedValues.includes("All");

      // "ALL" 행을 클릭한 경우: 전체 선택 <-> 전체 해제 토글
      if (tokenToggled) {
        onChange(isAllSelected ? [] : ["All", ...optionValues]);
        return;
      }

      // 개별 옵션 토글: 모든 옵션이 선택되면 "All" 센티넬을 다시 부여
      const subset = selected.filter((item) => item !== "All");
      const coversAll =
        optionValues.length > 0 &&
        optionValues.every((value) => subset.includes(value));
      onChange(coversAll ? ["All", ...optionValues] : subset);
      onSelectChange?.(event);
      return;
    }

    const filtered = selected.filter((item) => item !== "All");

    onChange(filtered);
    onSelectChange?.(event);
  };

  const valueLabelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    selectList.forEach(({ value, label }) => {
      if (label !== undefined) {
        map.set(String(value), String(label));
      }
    });

    return map;
  }, [selectList]);

  const renderValue = useCallback(
    (selected: unknown) => {
      if (!selected || (Array.isArray(selected) && selected.length === 0)) {
        return (
          <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>{placeholder}</span>
        );
      }

      if (Array.isArray(selected)) {
        if (selected.includes("All")) return "ALL";

        // 선택된 항목이 하나일 때는 해당 라벨만 표시
        if (selected.length === 1) {
          return (
            valueLabelMap.get(selected[0] as string) ?? (selected[0] as string)
          );
        }

        // 여러 개 선택되었을 때는 첫 번째 항목 + "외 N개" 형태로 표시
        const firstLabel =
          valueLabelMap.get(selected[0] as string) ?? (selected[0] as string);
        return `${firstLabel} 외 ${selected.length - 1}개`;
      }

      return valueLabelMap.get(selected as string) ?? (selected as string);
    },
    [valueLabelMap, placeholder],
  );

  const renderSelectItem = useCallback(
    ({
      label,
      value: itemValue,
      disabled: itemDisabled,
      isGroupHeader,
    }: SelectItem) => {
      if (isGroupHeader) {
        return (
          <ListSubheader
            key={`header-${String(itemValue)}`}
            sx={{
              fontWeight: 700,
              fontSize: 13,
              color: "rgba(0,0,0,0.87)",
              backgroundColor: "#f5f5f5",
              lineHeight: "36px",
            }}
          >
            {label}
          </ListSubheader>
        );
      }

      const isAllOptionSelected = selectedValues.includes("All");

      // allowIndividualToggle: ALL이 선택돼도 개별 옵션을 비활성화하지 않음
      const isDisabled =
        itemValue === "All"
          ? itemDisabled
          : allowIndividualToggle
            ? itemDisabled
            : isAllOptionSelected || itemDisabled;

      return (
        <MenuItem
          key={String(itemValue)}
          value={itemValue}
          disabled={isDisabled}
        >
          <Checkbox
            checked={
              selectedValues.includes(itemValue) ||
              (isAllOptionSelected && itemValue !== "All")
            }
          />
          <ListItemText primary={label} />
        </MenuItem>
      );
    },
    [selectedValues, allowIndividualToggle],
  );

  return (
    <FormControl variant="outlined">
      <InputLabel shrink>{labelName}</InputLabel>
      <Select
        ref={ref}
        label={labelName}
        value={selectedValues ?? []}
        renderValue={(selected) => renderValue(selected) as React.ReactNode}
        onChange={handleChange}
        onBlur={onBlur}
        displayEmpty
        multiple
        {...selectProps}
      >
        {selectList?.map(renderSelectItem)}
        {enableAllOption && (
          <MenuItem
            value="All"
            sx={{ "&": { borderTop: "1px solid #e0e0e0" } }}
          >
            <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} />
            <ListItemText primary="ALL" />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

// forwardRef로 감싸서 ref를 전달할 수 있도록 함
const CustomSelectCheckbox = React.forwardRef(CustomSelectCheckboxInner) as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(
  props: CustomSelectCheckboxProps<TFieldValues, TName> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

(CustomSelectCheckbox as React.ComponentType).displayName =
  "CustomSelectCheckbox";

export default CustomSelectCheckbox;
