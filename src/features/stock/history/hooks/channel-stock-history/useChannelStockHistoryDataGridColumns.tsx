import { Box, Typography } from "@mui/material";
import {
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";

import { ChannelStockHistoryResponse } from "@/shared/generated/oms/types/Stock";
import { getLocalTime } from "@/shared/utils/formatDate";

export default function useChannelStockHistoryDataGridColumns() {
  const renderQtyCell = (value: number, change: number) => {
    if (change === 0) {
      return <Typography variant="body2">{value}</Typography>;
    }

    const isIncrease = change > 0;
    const changeColor = isIncrease ? "#2196F3" : "#F44336";
    const changeText = isIncrease ? `+${change}` : `${change}`;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="body2">{value}</Typography>
        <Typography
          variant="body2"
          sx={{ color: changeColor, fontWeight: 700 }}
        >
          ({changeText})
        </Typography>
      </Box>
    );
  };

  const columns: GridColDef<ChannelStockHistoryResponse>[] = [
    {
      field: "updatedAt",
      headerName: "DateTime",
      flex: 1,
      minWidth: 150,
      renderCell: (
        params: GridRenderCellParams<ChannelStockHistoryResponse>,
      ) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {getLocalTime(params.value, undefined, "YYYY.MM.DD")}
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {getLocalTime(params.value, undefined, "hh:mm:ss A")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "event",
      headerName: "Event",
      flex: 1,
      minWidth: 150,
      valueGetter: (value: { description: string }) => value.description,
    },
    {
      field: "distributedQuantity",
      headerName: "Distributed",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<ChannelStockHistoryResponse>) =>
        renderQtyCell(
          params.row.distributedQuantity,
          params.row.distributedQuantityChange,
        ),
    },
    {
      field: "preorderQuantity",
      headerName: "Pre-order",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<ChannelStockHistoryResponse>) =>
        renderQtyCell(
          params.row.preorderQuantity,
          params.row.preorderQuantityChange,
        ),
    },
    {
      field: "usedQuantity",
      headerName: "Used",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<ChannelStockHistoryResponse>) =>
        renderQtyCell(params.row.usedQuantity, params.row.usedQuantityChange),
    },
    {
      field: "shippedQuantity",
      headerName: "Shipped",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<ChannelStockHistoryResponse>) =>
        renderQtyCell(
          params.row.shippedQuantity,
          params.row.shippedQuantityChange,
        ),
    },
    {
      field: "availableQuantity",
      headerName: "Available",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<ChannelStockHistoryResponse>) =>
        renderQtyCell(
          params.row.availableQuantity,
          params.row.availableQuantityChange,
        ),
    },
    {
      field: "updatedBy",
      headerName: "Modifier",
      flex: 1.5,
      minWidth: 200,
      renderCell: (
        params: GridRenderCellParams<ChannelStockHistoryResponse>,
      ) => <Typography variant="body2">{params.value || "-"}</Typography>,
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "channelQty",
      headerName: "Channel Qty",
      children: [
        { field: "distributedQuantity" },
        { field: "preorderQuantity" },
        { field: "usedQuantity" },
        { field: "shippedQuantity" },
        { field: "availableQuantity" },
      ],
    },
  ];

  return { columns, columnGroupingModel };
}
