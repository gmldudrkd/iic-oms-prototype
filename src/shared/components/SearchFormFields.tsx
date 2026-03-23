import { FormControl, SelectProps } from "@mui/material";
import { Control, Controller, FieldValues } from "react-hook-form";

import { useFormRenderers } from "@/shared/hooks/useFormRenderers";

interface FormInputRowProps {
  label: string;
  control: Control<FieldValues>;
  name: string;
  placeholder?: string;
  isMultiLine?: boolean;
}

export function SearchFormInputRow({
  label,
  control,
  name,
  placeholder,
  isMultiLine = false,
}: FormInputRowProps) {
  const { renderCustomInput } = useFormRenderers();

  return (
    <div className="flex w-full">
      <h3 className="min-w-[150px] flex-shrink-0 pt-[15px]">{label}</h3>
      <FormControl className="flex-grow" size="small">
        <Controller
          control={control}
          name={name}
          render={renderCustomInput(placeholder, isMultiLine)}
        />
      </FormControl>
    </div>
  );
}

interface FormSelectRowProps {
  label: string;
  control: Control<FieldValues>;
  name: string;
  selectList: { label: string; value: string }[];
  selectProps: SelectProps;
}

export function SearchFormSelectRow({
  label,
  control,
  name,
  selectList,
  selectProps,
}: FormSelectRowProps) {
  const { renderCustomSelectCheckbox } = useFormRenderers();

  return (
    <div className="flex w-full items-center">
      <h3 className="min-w-[150px] whitespace-pre-line">{label}</h3>
      <FormControl fullWidth size="small">
        <Controller
          control={control}
          name={name}
          render={renderCustomSelectCheckbox({
            selectList,
            control,
            selectProps,
          })}
        />
      </FormControl>
    </div>
  );
}

export function SearchFormContainer({
  columns,
}: {
  columns: { content: React.ReactNode }[];
}) {
  return (
    <div className="flex justify-around gap-[50px] border-b border-[#e0e0e0] px-[20px] py-[24px]">
      {columns.map((column, index) => {
        return (
          <div
            key={index}
            className="flex basis-1/3 flex-col items-center gap-[8px]"
          >
            {column.content}
          </div>
        );
      })}
    </div>
  );
}
