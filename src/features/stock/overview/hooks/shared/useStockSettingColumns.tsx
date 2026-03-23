import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Chip,
  Box,
  SxProps,
  Theme,
  Avatar,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import {
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReactNode, useMemo } from "react";

import {
  FlattenedStockRow,
  ChannelStockData,
} from "@/features/stock/overview/models/transforms";
import { ChannelSelection } from "@/features/stock/overview/models/types";
import {
  COLUMN_TOOLTIPS,
  OFF_PERIOD_SCHEDULED,
} from "@/features/stock/overview/modules/constants";
import { CHANNEL_STOCK_ROW_HEIGHT } from "@/features/stock/overview/modules/styles";

import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { getLocalTime } from "@/shared/utils/formatDate";

dayjs.extend(customParseFormat);

// 공통 스타일 생성 헬퍼 함수
const getChannelRowStyle = (cs: ChannelStockData, index: number) => ({
  borderTop: index !== 0 ? "1px solid #E0E0E0" : "none",
  backgroundColor: cs.channel === "Total" ? "#e7e7e7" : "transparent",
  fontWeight: cs.channel === "Total" ? "bold" : "normal",
  padding: "4px 8px",
  flex: `0 0 ${CHANNEL_STOCK_ROW_HEIGHT}px`,
  display: "flex",
  alignItems: "center",
});

// channelStocks 렌더링 헬퍼 함수
const renderChannelStocksCell = (
  params: GridRenderCellParams,
  renderContent: (cs: ChannelStockData, index: number) => ReactNode,
  additionalStyles?: (cs: ChannelStockData, index: number) => SxProps<Theme>,
) => {
  const channelStocks = params.row.channelStocks || [];

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      {channelStocks.map((cs: ChannelStockData, index: number) => (
        <Box
          key={index}
          sx={{
            ...getChannelRowStyle(cs, index),
            ...(additionalStyles ? additionalStyles(cs, index) : {}),
          }}
        >
          {renderContent(cs, index)}
        </Box>
      ))}
    </Box>
  );
};

interface UseStockSettingColumnsOptions {
  variant: "channel" | "online";
  onOffPeriodScheduledClick?: (selection: ChannelSelection) => void;
  onPreOrderExpiredAtClick?: (selection: ChannelSelection) => void;
}

export default function useStockSettingColumns(
  options: UseStockSettingColumnsOptions,
) {
  const { variant, onOffPeriodScheduledClick, onPreOrderExpiredAtClick } =
    options;
  const isChannelVariant = variant === "channel";
  const timezone = useTimezoneStore((state) => state.timezone);

  // offPeriod를 현지 시각으로 변환하는 함수
  const convertOffPeriodToLocalTime = useMemo(
    () => (offPeriod: string | null) => {
      if (!offPeriod || offPeriod === OFF_PERIOD_SCHEDULED) {
        return offPeriod;
      }

      // "YYYY-MM-DD hh:mm A ~ YYYY-MM-DD hh:mm A" 형식을 파싱
      const [startStr, endStr] = offPeriod.split(" ~ ");
      if (!startStr) return offPeriod;

      try {
        // dayjs로 파싱 후 ISO 형식으로 변환하여 getLocalTime에 전달
        const startDate = dayjs(startStr, "YYYY-MM-DD hh:mm A");
        if (!startDate.isValid()) {
          console.error("Invalid start date:", startStr);
          return offPeriod;
        }

        const startTime = getLocalTime(
          startDate.toISOString(),
          timezone,
          "YYYY-MM-DD hh:mm A",
        );

        let endTime = "";
        if (endStr && endStr.trim()) {
          const endDate = dayjs(endStr.trim(), "YYYY-MM-DD hh:mm A");
          if (endDate.isValid()) {
            endTime = getLocalTime(
              endDate.toISOString(),
              timezone,
              "YYYY-MM-DD hh:mm A",
            );
          }
        }

        return `${startTime} ~ ${endTime}`;
      } catch (error) {
        console.error("Failed to convert offPeriod:", error);
        return offPeriod;
      }
    },
    [timezone],
  );

  const columns: GridColDef<FlattenedStockRow>[] = [
    {
      field: "productType",
      headerName: "Product Type",
      width: 100,
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        if (params.value === "Bundle") {
          return (
            <Chip
              label="Bundle"
              size="small"
              color="primary"
              variant="outlined"
            />
          );
        } else if (params.value === "Single") {
          return (
            <Chip
              label="Single"
              size="small"
              color="default"
              variant="outlined"
            />
          );
        }
        return null;
      },
      rowSpanValueGetter: (value, row) => {
        // 같은 sku 값을 가진 연속된 행들끼리만 span
        return row.sku;
      },
    },
    {
      field: "sku",
      headerName: "SKU Code",
      width: 100,
      headerAlign: "center",
      rowSpanValueGetter: (value, row) => {
        // 같은 sku 값을 가진 연속된 행들끼리만 span
        return row.sku;
      },
    },
    {
      field: "bundleUnitQty",
      headerName: "Bundle Unit Qty",
      width: 80,
      align: "center",
      headerAlign: "center",
      rowSpanValueGetter: () => null,
    },
    {
      field: "upcCode",
      headerName: "UPC Code",
      width: 150,
      headerAlign: "center",
      rowSpanValueGetter: () => null,
    },
    {
      field: "sapCode",
      headerName: "SAP Code",
      width: 100,
      headerAlign: "center",
      rowSpanValueGetter: () => null,
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 200,
      flex: 1,
      headerAlign: "center",
      rowSpanValueGetter: () => null,
    },
    // Online Qty 섹션
    {
      field: "erp",
      headerName: "ERP",
      width: 80,
      align: "right",
      headerAlign: "center",
      rowSpanValueGetter: () => null,
    },
    {
      field: "erpUpdate",
      headerName: "ERP Update",
      width: 100,
      align: "right",
      headerAlign: "center",
      renderHeader: () => (
        <Tooltip title={COLUMN_TOOLTIPS.ERP_UPDATE} arrow placement="top">
          <Box
            sx={{
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            ERP Update
          </Box>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
      rowSpanValueGetter: () => null,
    },
    {
      field: "safety",
      headerName: "Safety",
      width: 80,
      align: "right",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
      rowSpanValueGetter: () => null,
    },
    {
      field: "undistributed",
      headerName: "Undistributed",
      width: 110,
      align: "right",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
      rowSpanValueGetter: () => null,
    },
    // Channel 정보 - 체크박스 (Channel variant만)
    ...(isChannelVariant
      ? [
          {
            field: "channelCheckbox",
            headerName: "",
            width: 50,
            headerAlign: "center" as const,
            sortable: false,
            disableColumnMenu: true,
            valueGetter: (value: unknown, row: FlattenedStockRow) =>
              row.channelStocks,
            renderCell: () => null, // StockResultsTable에서 오버라이드됨
            rowSpanValueGetter: () => null,
          },
        ]
      : []),
    {
      field: "channelStocks",
      headerName: "Channel",
      width: 150,
      headerAlign: "center",
      valueGetter: (value) => value,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];
        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            width="100%"
            height="100%"
          >
            {channelStocks.map((cs: ChannelStockData, index: number) => (
              <Box
                key={index}
                fontWeight={cs.channel === "Total" ? "bold" : "normal"}
                sx={{
                  borderTop: index !== 0 ? "1px solid #E0E0E0" : "none",
                  backgroundColor:
                    cs.channel === "Total" ? "#e7e7e7" : "transparent",
                  padding: "4px 8px",
                  flex: "0 0 36px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {cs.channel}
              </Box>
            ))}
          </Box>
        );
      },
      rowSpanValueGetter: () => null,
    },
    {
      field: "distributionRatio",
      headerName: "Distribution Ratio",
      width: 110,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) =>
            cs.distributionRatio !== null && cs.distributionRatio !== undefined
              ? `${cs.distributionRatio}%`
              : "-",
          () => ({ justifyContent: "flex-end" }),
        ),
      rowSpanValueGetter: () => null,
    },
    {
      field: "distributed",
      headerName: "Distributed",
      width: 100,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderHeader: () => (
        <Tooltip title={COLUMN_TOOLTIPS.DISTRIBUTED} arrow placement="top">
          <Box
            sx={{
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Distributed
          </Box>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => cs.distributed,
          () => ({ justifyContent: "flex-end" }),
        ),
      rowSpanValueGetter: () => null,
    },
    {
      field: "preOrder",
      headerName: "Pre-order",
      width: 90,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => cs.preOrder,
          () => ({ justifyContent: "flex-end" }),
        ),
      rowSpanValueGetter: () => null,
    },
    // Channel Qty 섹션
    {
      field: "used",
      headerName: "Used",
      width: 80,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderHeader: () => (
        <Tooltip title={COLUMN_TOOLTIPS.USED} arrow placement="top">
          <Box
            sx={{
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Used
          </Box>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => cs.used,
          () => ({ justifyContent: "flex-end" }),
        ),
      rowSpanValueGetter: () => null,
    },
    {
      field: "shipped",
      headerName: "Shipped",
      width: 80,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderHeader: () => (
        <Tooltip title={COLUMN_TOOLTIPS.SHIPPED} arrow placement="top">
          <Box
            sx={{
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Shipped
          </Box>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => cs.shipped,
          () => ({ justifyContent: "flex-end" }),
        ),
    },
    {
      field: "available",
      headerName: "Available",
      width: 90,
      align: "right",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderHeader: () => (
        <Tooltip title={COLUMN_TOOLTIPS.AVAILABLE} arrow placement="top">
          <Box
            sx={{
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Available
          </Box>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => cs.available,
          (cs) => ({
            justifyContent: "flex-end",
            color: cs.available < 0 ? "error.main" : "inherit",
          }),
        ),
      rowSpanValueGetter: () => null,
    },
    // Stock Status
    {
      field: "stockStatus",
      headerName: "Stock Status",
      width: 180,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(params, (cs) => {
          if (!cs.stockStatus) return "";

          let color: "primary" | "warning" | "error" | "default" = "default";
          if (cs.stockStatus === "IN_STOCK") {
            color = "primary";
          } else if (cs.stockStatus === "OUT_OF_STOCK") {
            color = "default";
          } else if (cs.stockStatus === "OVERSELLING") {
            color = "error";
          }

          return (
            <Chip
              avatar={
                <Avatar>
                  <Box
                    width="100%"
                    height="100%"
                    bgcolor={
                      color === "default"
                        ? "#9E9E9E"
                        : color === "error"
                          ? "#C62828"
                          : color
                    }
                  />
                </Avatar>
              }
              label={cs.stockStatus}
              size="small"
              color={color}
              variant="outlined"
            />
          );
        }),
      rowSpanValueGetter: () => null,
    },
    // Channel Send 섹션
    {
      field: "status",
      headerName: "Status",
      width: 80,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(params, (cs) => {
          if (!cs.status) return "";
          if (cs.status === "ON") {
            return (
              <Chip
                label="ON"
                size="small"
                sx={{ width: "45px", bgcolor: "#1E88E5", color: "#FFFFFF" }}
              />
            );
          }
          if (cs.status === "OFF") {
            return (
              <Chip
                label="OFF"
                size="small"
                color="error"
                sx={{ width: "45px" }}
              />
            );
          }
          return "-";
        }),
      rowSpanValueGetter: () => null,
    },
    {
      field: "offPeriod",
      headerName: "Off Period",
      width: 360,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) => {
        const channelStocks = params.row.channelStocks || [];

        return (
          <Box display="flex" flexDirection="column" width="100%" height="100%">
            {channelStocks.map((cs: ChannelStockData, index: number) => (
              <Box
                key={index}
                sx={{
                  borderTop: index !== 0 ? "1px solid #E0E0E0" : "none",
                  backgroundColor:
                    cs.channel === "Total" ? "#e7e7e7" : "transparent",
                  fontWeight: cs.channel === "Total" ? "bold" : "normal",
                  padding: "4px 8px",
                  flex: "0 0 36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!cs.offPeriod ? (
                  "-"
                ) : cs.offPeriod === OFF_PERIOD_SCHEDULED ? (
                  <Button
                    variant="outlined"
                    sx={{
                      width: "25px",
                      height: "25px",
                      minWidth: "25px",
                      minHeight: "25px",
                      padding: "0",
                    }}
                    onClick={
                      onOffPeriodScheduledClick
                        ? () =>
                            onOffPeriodScheduledClick({
                              rowId: params.row.id,
                              sku: params.row.sku,
                              channelName: cs.channel,
                              channelData: cs,
                              singleSku: params.row.singleSku,
                            })
                        : undefined
                    }
                  >
                    <AccessTimeIcon
                      color="primary"
                      sx={{ width: "15px", height: "15px" }}
                    />
                  </Button>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={
                      onOffPeriodScheduledClick
                        ? () =>
                            onOffPeriodScheduledClick({
                              rowId: params.row.id,
                              sku: params.row.sku,
                              channelName: cs.channel,
                              channelData: cs,
                              singleSku: params.row.singleSku,
                            })
                        : undefined
                    }
                  >
                    {convertOffPeriodToLocalTime(cs.offPeriod)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        );
      },
      rowSpanValueGetter: () => null,
    },
    {
      field: "preOrderExpiredAt",
      headerName: "Pre-order Expired At",
      width: 300,
      headerAlign: "center",
      valueGetter: (value, row) => row.channelStocks,
      renderCell: (params: GridRenderCellParams) =>
        renderChannelStocksCell(
          params,
          (cs) => {
            if (cs.preOrderExpiredAt === undefined) {
              return "-";
            }

            // preorderStockExpiredAt == null & preorderQuantity == 0 : "-" 노출
            if (cs.preOrderExpiredAt === null && cs.preOrder === 0) {
              return "-";
            }

            return (
              <Typography
                sx={{
                  fontSize: "12px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={
                  onPreOrderExpiredAtClick
                    ? () =>
                        onPreOrderExpiredAtClick({
                          rowId: params.row.id,
                          sku: params.row.sku,
                          channelName: cs.channel,
                          channelData: cs,
                          singleSku: params.row.singleSku,
                        })
                    : undefined
                }
              >
                {cs.preOrderExpiredAt !== null && cs.preOrder > 0
                  ? getLocalTime(
                      cs.preOrderExpiredAt,
                      timezone,
                      "YYYY-MM-DD hh:mm A",
                    )
                  : cs.preOrderExpiredAt === null && cs.preOrder > 0
                    ? "Indefinite"
                    : "-"}
              </Typography>
            );
          },
          () => ({ justifyContent: "center" }),
        ),
      rowSpanValueGetter: () => null,
    },
  ];

  // Column Grouping 정의
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
        ...(isChannelVariant ? [{ field: "channelCheckbox" }] : []),
        { field: "channelStocks" },
        { field: "distributionRatio" },
        { field: "distributed" },
        { field: "preOrder" },
        { field: "used" },
        { field: "shipped" },
        { field: "available" },
      ],
    },
    {
      groupId: "channelSend",
      headerName: "Channel Send",
      children: [{ field: "status" }, { field: "offPeriod" }],
    },
  ];

  return { columns, columnGroupingModel };
}
