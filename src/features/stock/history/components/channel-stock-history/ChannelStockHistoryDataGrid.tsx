import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGridPro } from "@mui/x-data-grid-pro";

import useChannelStockHistoryDataGridColumns from "@/features/stock/history/hooks/channel-stock-history/useChannelStockHistoryDataGridColumns";

import { ChannelStockHistoryResponse } from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface ChannelStockHistoryDataGridProps {
  channelStockHistory: ChannelStockHistoryResponse[];
}

export default function ChannelStockHistoryDataGrid({
  channelStockHistory,
}: ChannelStockHistoryDataGridProps) {
  const { columns, columnGroupingModel } =
    useChannelStockHistoryDataGridColumns();

  return (
    <Box mt="10px">
      <ThemeProvider theme={MUIDataGridTheme}>
        <DataGridPro
          rows={channelStockHistory}
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
