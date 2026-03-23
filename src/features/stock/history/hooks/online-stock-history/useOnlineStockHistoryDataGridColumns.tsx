import { Box, Typography } from "@mui/material";
import {
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";

import { OnlineStockHistoryResponse } from "@/shared/generated/oms/types/Stock";
import { getLocalTime } from "@/shared/utils/formatDate";

export default function useOnlineStockHistoryDataGridColumns() {
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

  const columns: GridColDef<OnlineStockHistoryResponse>[] = [
    {
      field: "updatedAt",
      headerName: "DateTime",
      flex: 1,
      minWidth: 150,
      renderCell: (
        params: GridRenderCellParams<OnlineStockHistoryResponse>,
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
      field: "quantity",
      headerName: "ERP",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<OnlineStockHistoryResponse>) =>
        renderQtyCell(params.row.quantity, params.row.quantityChange),
    },
    {
      field: "movementQuantity",
      headerName: "ERP Update",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<OnlineStockHistoryResponse>) =>
        renderQtyCell(
          params.row.movementQuantity,
          params.row.movementQuantityChange,
        ),
    },
    {
      field: "safetyQuantity",
      headerName: "Safety",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<OnlineStockHistoryResponse>) =>
        renderQtyCell(
          params.row.safetyQuantity,
          params.row.safetyQuantityChange,
        ),
    },
    {
      field: "updatedBy",
      headerName: "Modifier",
      flex: 1.5,
      minWidth: 200,
      renderCell: (
        params: GridRenderCellParams<OnlineStockHistoryResponse>,
      ) => <Typography variant="body2">{params.value || "-"}</Typography>,
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "onlineQty",
      headerName: "Online Qty",
      children: [
        { field: "quantity" },
        { field: "movementQuantity" },
        { field: "safetyQuantity" },
      ],
    },
  ];

  return { columns, columnGroupingModel };
}
