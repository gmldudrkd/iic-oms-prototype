import Box from "@mui/material/Box";
import {
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { ReactNode } from "react";

import {
  ChannelHistoryData,
  TransformedStockHistoryRow,
} from "@/features/stock/history/models/transforms";

import { getLocalTime } from "@/shared/utils/formatDate";

interface UseStockHistoryDataGridColumnsOptions {
  handleOpenDetailDialog: ({
    sku,
    productName,
    from,
  }: {
    sku: string;
    productName: string;
    from: string;
  }) => void;
}

// 채널 스톡 셀 렌더링 헬퍼 함수
const renderChannelStockCell = (
  channelStocks: ChannelHistoryData[],
  renderContent: (cs: ChannelHistoryData) => ReactNode,
  options: {
    alignLeft?: boolean;
  } = {},
) => {
  const { alignLeft = false } = options;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
    >
      {channelStocks.map((cs: ChannelHistoryData, index: number) => (
        <Box
          key={index}
          fontWeight={cs.channel === "Total" ? "bold" : "normal"}
          sx={{
            borderTop: index !== 0 ? "1px solid #E0E0E0" : "none",
            backgroundColor: cs.channel === "Total" ? "#e7e7e7" : "transparent",
            padding: "4px 8px",
            flex: "0 0 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: alignLeft ? "flex-start" : "center",
          }}
        >
          {renderContent(cs)}
        </Box>
      ))}
    </Box>
  );
};

export default function useStockHistoryDataGridColumns({
  handleOpenDetailDialog,
}: UseStockHistoryDataGridColumnsOptions) {
  const columns: GridColDef<TransformedStockHistoryRow>[] = [
    {
      field: "timestamp",
      headerName: "DateTime",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value;
        const { sku, productName } = params.row;
        return (
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              color: "primary.main",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() =>
              handleOpenDetailDialog({ sku, productName, from: date })
            }
          >
            <Box textAlign="left">
              {getLocalTime(date, undefined, "YYYY.MM.DD")}
            </Box>
            <Box textAlign="left">
              {getLocalTime(date, undefined, "hh:mm:ss A")}
            </Box>
          </Box>
        );
      },
    },
    // Online Qty 컬럼들
    {
      field: "erp",
      headerName: "ERP",
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "erpUpdate",
      headerName: "ERP Update",
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "safety",
      headerName: "Safety",
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "undistributed",
      headerName: "Undistributed",
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    // Channel Qty 컬럼들 - renderCell로 세로 분할
    {
      field: "channelStocks",
      headerName: "Channel",
      width: 150,
      headerAlign: "center",
      valueGetter: (value) => value,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.channel, {
          alignLeft: true,
        });
      },
    },
    {
      field: "distributed",
      headerName: "Distributed",
      minWidth: 120,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.distributed);
      },
    },
    {
      field: "preOrder",
      headerName: "Pre-order",
      minWidth: 120,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.preOrder);
      },
    },
    {
      field: "used",
      headerName: "Used",
      minWidth: 120,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.used);
      },
    },
    {
      field: "shipped",
      headerName: "Shipped",
      minWidth: 120,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.shipped);
      },
    },
    {
      field: "available",
      headerName: "Available",
      minWidth: 120,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return renderChannelStockCell(channelStocks, (cs) => cs.available);
      },
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "onlineQty",
      headerName: "Online Qty",
      children: [
        { field: "erp" },
        { field: "erpUpdate" },
        { field: "safety" },
        { field: "undistributed" },
      ],
    },
    {
      groupId: "channelQty",
      headerName: "Channel Qty",
      children: [
        { field: "channelStocks" },
        { field: "distributed" },
        { field: "preOrder" },
        { field: "used" },
        { field: "shipped" },
        { field: "available" },
      ],
    },
  ];

  return { columns, columnGroupingModel };
}
