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
  } = props;

  const {
    field: { value: selectedValues, onChange, onBlur },
  } = useController({
    name,
    rules,
    control,
  });

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selected = event.target.value as string[];

    if (enableAllOption) {
      const wasAllSelected = selectedValues.includes("All");
      const isAllSelected = selected.includes("All");

      if (isAllSelected) {
        // "All" 체크 -> 전체 선택
        const optionValues = selectList.map((option) => option.value);
        onChange(wasAllSelected ? [] : ["All", ...optionValues]);
        return;
      }

      // "All" 체크 해제 -> 빈 배열 반환
      if (wasAllSelected && !isAllSelected) {
        onChange([]);
        return;
      }

      // 모든 옵션 선택 시 자동으로 All 선택
      // if (
      //   selected.length === selectList.length &&
      //   !selectedValues.includes("All")
      // ) {
      //   onChange([...selected, "All"]);
      //   return;
      // }
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
        if (selected.includes("All")) return "All";

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

      const isDisabled =
        itemValue === "All"
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
    [selectedValues],
  );

  const handleAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasSelected = selectedValues.includes("All");
    const newValue = wasSelected ? [] : ["All"];
    onChange(newValue);
  };

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
            onClick={handleAllClick}
          >
            <Checkbox checked={selectedValues.includes("All")} />
            All
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
