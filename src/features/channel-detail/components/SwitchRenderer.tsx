import { FormControlLabel, Switch } from "@mui/material";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";

interface SwitchRendererProps {
  control: Control<FieldValues>;
  name: string;
}

export default function SwitchRenderer({ control, name }: SwitchRendererProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormControlLabel
          control={<Switch checked={field.value} onChange={field.onChange} />}
          sx={{ "&": { width: "fit-content" } }}
          label=""
        />
      )}
    />
  );
}
