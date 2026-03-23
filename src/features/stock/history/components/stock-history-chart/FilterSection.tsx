import { Box, Checkbox, Typography } from "@mui/material";

import FilterItem from "@/features/stock/history/components/stock-history-chart/FilterItem";

interface FilterSectionProps {
  title: string;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  filters: Array<{
    key: string;
    label: string;
    color: string;
    checked: boolean;
    onToggle: () => void;
  }>;
}

export default function FilterSection({
  title,
  allSelected,
  someSelected,
  onToggleAll,
  filters,
}: FilterSectionProps) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Checkbox
        checked={allSelected}
        indeterminate={!allSelected && someSelected}
        onChange={onToggleAll}
        size="small"
        sx={{
          "&.MuiButtonBase-root": {
            padding: "3px",
          },
        }}
      />
      <Typography fontSize="12px" fontWeight="bold">
        {title}
      </Typography>
      <Box display="flex" gap={2} alignItems="center">
        {filters.map((filter) => (
          <FilterItem
            key={filter.key}
            label={filter.label}
            color={filter.color}
            checked={filter.checked}
            onClick={filter.onToggle}
          />
        ))}
      </Box>
    </Box>
  );
}
