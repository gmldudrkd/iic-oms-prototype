import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { SyntheticEvent } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface SearchTypeRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  onTypeChange: (
    event: SyntheticEvent<Element, Event>,
    checked: boolean,
  ) => void;
}

export default function SearchTypeRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
>({ field, onTypeChange }: SearchTypeRadioGroupProps<TFieldValues>) {
  return (
    <RadioGroup
      {...field}
      row
      value={field.value || ""}
      onChange={field.onChange}
      sx={{
        gap: "10px",
        "& > label.MuiFormControlLabel-root": {
          gap: "0px",
          "& span.MuiTypography-root": { fontSize: "16px" },
        },
      }}
    >
      {["Single", "Bulk"].map((type) => (
        <FormControlLabel
          key={type}
          value={type}
          label={type}
          control={<Radio />}
          onChange={onTypeChange}
        />
      ))}
    </RadioGroup>
  );
}
