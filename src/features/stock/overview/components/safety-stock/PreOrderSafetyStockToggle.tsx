import { Box, Switch, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

interface PreOrderSafetyStockToggleProps {
  control: Control<StockDashboardRequestForm>;
}

export default function PreOrderSafetyStockToggle({
  control,
}: PreOrderSafetyStockToggleProps) {
  return (
    <Box display="flex" mt="16px" alignItems="center">
      <Controller
        control={control}
        name="excludeZeroPreorderQuantity"
        render={({ field }) => <Switch {...field} />}
      />

      <Typography fontSize="12px">
        Show only products with &apos;Pre-order stock&apos; (≥1)
      </Typography>
    </Box>
  );
}
