import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGridPro } from "@mui/x-data-grid-pro";

import useOnlineStockHistoryDataGridColumns from "@/features/stock/history/hooks/online-stock-history/useOnlineStockHistoryDataGridColumns";

import { OnlineStockHistoryResponse } from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface OnlineStockHistoryDataGridProps {
  onlineStockHistory: OnlineStockHistoryResponse[];
}

export default function OnlineStockHistoryDataGrid({
  onlineStockHistory,
}: OnlineStockHistoryDataGridProps) {
  const { columns, columnGroupingModel } =
    useOnlineStockHistoryDataGridColumns();

  return (
    <Box mt="10px">
      <ThemeProvider theme={MUIDataGridTheme}>
        <DataGridPro
          rows={onlineStockHistory}
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSorting
          disableColumnResize
          hideFooter
          getRowId={(row) => row.updatedAt}
          sx={{ borderBottom: "1px solid #E0E0E0" }}
        />
      </ThemeProvider>
    </Box>
  );
}
