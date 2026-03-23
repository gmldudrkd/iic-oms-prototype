import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";

import CustomInput from "@/shared/components/form-elements/CustomInput";

interface InputRendererProps {
  control: Control<FieldValues>;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function InputRenderer({
  control,
  name,
  placeholder = "Enter here",
  disabled = false,
  readOnly = false,
}: InputRendererProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }: { field: ControllerRenderProps }) => (
        <CustomInput
          {...field}
          textFieldProps={{
            size: "small",
            placeholder,
            disabled,
            InputProps: readOnly
              ? {
                  readOnly: true,
                  sx: {
                    pointerEvents: "none",
                    backgroundColor: "rgb(228 228 228)",
                    color: "rgba(0,0,0,0.38)",
                  },
                }
              : {},
          }}
        />
      )}
    />
  );
}
