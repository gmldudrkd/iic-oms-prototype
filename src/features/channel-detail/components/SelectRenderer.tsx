import { SelectProps } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import CustomSelect from "@/shared/components/form-elements/CustomSelect";
import { SelectItem } from "@/shared/components/form-elements/modules/type";

interface SelectRendererProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  selectList: SelectItem[];
  placeholder?: string;
  selectProps?: SelectProps;
}

export default function SelectRenderer<T extends FieldValues>({
  control,
  name,
  selectList,
  placeholder = "Select",
  selectProps,
}: SelectRendererProps<T>) {
  const renderCustomSelectValue = (value: unknown) => {
    if (typeof value !== "string" || !value) {
      return (
        <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>{placeholder}</span>
      );
    }

    const selectedItem = selectList.find(
      (item: SelectItem) => item.value === value,
    );
    return selectedItem?.label?.toString().replace(/\s*\(.*$/, "") ?? value;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomSelect
          {...field}
          control={control}
          selectList={selectList}
          placeholder={placeholder}
          selectProps={{
            renderValue: (v) => renderCustomSelectValue(v),
            sx: { "& .Mui-disabled": { backgroundColor: "rgb(228 228 228)" } },
            ...selectProps,
          }}
        />
      )}
    />
  );
}
