import { Box, Switch, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

interface SafetyStockToggleProps {
  control: Control<StockDashboardRequestForm>;
}

export default function SafetyStockToggle({ control }: SafetyStockToggleProps) {
  return (
    <Box display="flex" mt="16px" alignItems="center">
      <Controller
        control={control}
        name="hasSafetyQuantity"
        render={({ field }) => <Switch {...field} />}
      />

      <Typography fontSize="12px">
        Show only products with &apos;Safety stock&apos; (≥1)
      </Typography>
    </Box>
  );
}
