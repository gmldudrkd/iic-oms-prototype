import { SelectProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import CustomSelectCheckbox from "@/shared/components/form-elements/CustomSelectCheckbox";
import { SelectItem } from "@/shared/components/form-elements/modules/type";

export function SelectCheckboxField({
  name,
  selectList,
  selectProps,
  enableAllOption,
  labelName,
}: {
  name: string;
  selectList: SelectItem[];
  selectProps: SelectProps;
  enableAllOption?: boolean;
  labelName: string;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <CustomSelectCheckbox
            {...field}
            control={control}
            labelName={labelName}
            selectList={selectList}
            placeholder={"Select"}
            name={name}
            enableAllOption={enableAllOption}
            selectProps={{
              ...selectProps,
            }}
          />
        );
      }}
    />
  );
}
