import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useController, useFormContext } from "react-hook-form";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

type ReceiveMethod = "Delivery" | "Store Pickup";
type OrderType = "Normal" | "Gift" | "RX" | "Lens Only";
type OrderTag = "Pre-Order";
type OptionField = "receiveMethod" | "type" | "tags";

interface AttributeOption {
  label: string;
  group: string;
  field: OptionField;
}

export interface OrderAttributeFilterValue {
  receiveMethods: ReceiveMethod[];
  types: OrderType[];
  tags: OrderTag[];
}

// ────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────

const OPTIONS: AttributeOption[] = [
  { label: "Delivery", group: "Receive Method", field: "receiveMethod" },
  { label: "Store Pickup", group: "Receive Method", field: "receiveMethod" },
  { label: "Normal", group: "Type", field: "type" },
  { label: "Gift", group: "Type", field: "type" },
  { label: "RX", group: "Type", field: "type" },
  { label: "Lens Only", group: "Type", field: "type" },
  { label: "Pre-Order", group: "Tags", field: "tags" },
];

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

const toOptions = (
  value: OrderAttributeFilterValue | undefined,
): AttributeOption[] => {
  if (!value) return [];
  return [
    ...(value.receiveMethods ?? []).map(
      (l) => OPTIONS.find((o) => o.label === l)!,
    ),
    ...(value.types ?? []).map((l) => OPTIONS.find((o) => o.label === l)!),
    ...(value.tags ?? []).map((l) => OPTIONS.find((o) => o.label === l)!),
  ].filter(Boolean);
};

const toValue = (selected: AttributeOption[]): OrderAttributeFilterValue => ({
  receiveMethods: selected
    .filter((o) => o.field === "receiveMethod")
    .map((o) => o.label as ReceiveMethod),
  types: selected
    .filter((o) => o.field === "type")
    .map((o) => o.label as OrderType),
  tags: selected
    .filter((o) => o.field === "tags")
    .map((o) => o.label as OrderTag),
});

const DEFAULT_VALUE: OrderAttributeFilterValue = {
  receiveMethods: [],
  types: [],
  tags: [],
};

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────

export default function OrderAttributeField() {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
  } = useController({
    name: "orderAttributeFilter",
    control,
    defaultValue: DEFAULT_VALUE,
  });

  const selected = toOptions(value as OrderAttributeFilterValue);

  const handleChange = (_: unknown, newSelected: AttributeOption[]) => {
    onChange(toValue(newSelected));
  };

  return (
    <Autocomplete<AttributeOption, true>
      multiple
      limitTags={2}
      options={OPTIONS}
      groupBy={(o) => o.group}
      getOptionLabel={(o) => o.label}
      value={selected}
      onChange={handleChange}
      disableCloseOnSelect
      isOptionEqualToValue={(o, v) => o.label === v.label}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Order Attribute Filter"
          slotProps={{ inputLabel: { shrink: true } }}
          placeholder={selected.length > 0 ? "" : "Select"}
          sx={{
            "& .MuiInputBase-root": {
              flexWrap: "nowrap",
              overflowX: "auto",
            },
            "& .MuiInputBase-root.Mui-focused": {
              flexWrap: "wrap",
              overflowX: "unset",
            },
          }}
        />
      )}
      renderTags={(tags, getTagProps) =>
        tags.map((opt, idx) => (
          <Chip
            {...getTagProps({ index: idx })}
            key={opt.label}
            label={opt.label}
          />
        ))
      }
      renderOption={({ key, ...props }, opt) => {
        const checked = selected.some((v) => v.label === opt.label);
        return (
          <li key={key} {...props}>
            <Checkbox size="small" checked={checked} sx={{ mr: 1, p: 0.5 }} />
            <ListItemText primary={opt.label} />
          </li>
        );
      }}
      renderGroup={(params) => (
        <li key={params.key}>
          <div className="bg-[var(--color-outlined)] px-4 py-1.5 text-[11px] font-bold">
            {params.group}
          </div>
          <ul className="m-0 p-0">{params.children}</ul>
        </li>
      )}
    />
  );
}
