import { InputAdornment, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useCallback, SetStateAction, Dispatch } from "react";

import { COLUMNS_CHANNEL } from "@/features/stock/distributionSetting/modules/columns";

import { OnlineStockSettingResponse } from "@/shared/generated/oms/types/Stock";

interface UseChannelDefaultRateColumnsProps {
  rows: OnlineStockSettingResponse[];
  setRows: Dispatch<SetStateAction<OnlineStockSettingResponse[]>>;
  isEdit: boolean;
}

export const useChannelDefaultRateColumns = ({
  rows,
  setRows,
  isEdit,
}: UseChannelDefaultRateColumnsProps): GridColDef<OnlineStockSettingResponse>[] => {
  const updateRowField = useCallback(
    (
      id: number,
      field: "distributionRate" | "distributionPriority",
      value: number,
    ) => {
      if (value < 0 || value > 100) return;

      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
      );
    },
    [setRows],
  );

  return COLUMNS_CHANNEL.map(
    (column): GridColDef<OnlineStockSettingResponse> => {
      if (column.field === "distributionRate") {
        return {
          ...column,
          renderCell: (params: GridRenderCellParams) => {
            const currentRow = rows.find((row) => row.id === params.id);
            const currentValue = currentRow?.distributionRate ?? params.value;

            return isEdit ? (
              <TextField
                size="small"
                type="number"
                value={currentValue}
                onChange={(e) =>
                  updateRowField(
                    Number(params.id),
                    "distributionRate",
                    Number(e.target.value),
                  )
                }
                slotProps={{
                  input: {
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            ) : (
              <>{currentValue}%</>
            );
          },
        };
      }

      if (column.field === "distributionPriority") {
        return {
          ...column,
          renderCell: (params: GridRenderCellParams) => {
            const currentRow = rows.find((row) => row.id === params.id);
            const currentValue =
              currentRow?.distributionPriority ?? params.value;

            return isEdit ? (
              <TextField
                size="small"
                type="number"
                slotProps={{ input: { inputProps: { min: 0 } } }}
                value={currentValue}
                onChange={(e) =>
                  updateRowField(
                    Number(params.id),
                    "distributionPriority",
                    Number(e.target.value),
                  )
                }
              />
            ) : (
              currentValue
            );
          },
        };
      }

      return column as GridColDef<OnlineStockSettingResponse>;
    },
  );
};
