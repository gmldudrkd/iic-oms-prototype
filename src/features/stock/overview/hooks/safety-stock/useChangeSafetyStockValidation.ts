import { GridRowModel } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import { SafetyStockAlertType } from "@/features/stock/overview/components/safety-stock/ChangeSafetyStockAlerts";

import { StockDashboardRequestProductTypeEnum } from "@/shared/generated/oms/types/Stock";

interface UseChangeSafetyStockValidationProps {
  selectedRows: GridRowModel[];
}

export default function useChangeSafetyStockValidation({
  selectedRows,
}: UseChangeSafetyStockValidationProps) {
  const isProductTypeSingle = useMemo(
    () =>
      selectedRows.every(
        (row) =>
          row.productType.toUpperCase() ===
          StockDashboardRequestProductTypeEnum.SINGLE,
      ),
    [selectedRows],
  );

  const validateChangeSafetyStock = (): SafetyStockAlertType => {
    if (selectedRows.length === 0) {
      return "noItemsSelected";
    }

    if (!isProductTypeSingle) {
      return "singleOnly";
    }

    return null;
  };

  return {
    isProductTypeSingle,
    validateChangeSafetyStock,
  };
}
