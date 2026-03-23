import { TextField, TextFieldProps } from "@mui/material";
import React, { Ref } from "react";
import {
  useController,
  FieldValues,
  FieldPath,
  UseControllerProps,
} from "react-hook-form";

interface MuiProps {
  textFieldProps?: TextFieldProps;
}

function CustomInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  {
    textFieldProps,
    ...props
  }: MuiProps & UseControllerProps<TFieldValues, TName>,
  ref: Ref<HTMLInputElement>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.value);
  };

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ""}
      error={!!error}
      helperText={!!error && error.message}
      onChange={handleChange} // onChange 처리
      inputRef={ref} // ref 전달
    />
  );
}

export default React.forwardRef(CustomInput) as typeof CustomInput;
