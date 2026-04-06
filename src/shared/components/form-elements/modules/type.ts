import { ReactNode } from "react";
import { Control, FieldValues } from "react-hook-form";

export interface SelectItem {
  index?: number;
  label: ReactNode | string;
  value: string | number;
  dataValue?: string | boolean | null;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  isGroupHeader?: boolean;
}

export interface TControl<T extends FieldValues> {
  control: Control<T>;
}
