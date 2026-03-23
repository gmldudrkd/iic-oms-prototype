import DownloadIcon from "@mui/icons-material/Download";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Box,
  Button,
  Theme,
  SxProps,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridPaginationModel,
  GridRowModel,
  GridRowId,
  GridRowSelectionModel,
  GridValidRowModel,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useMemo, useState, useCallback, memo } from "react";

import ChangeChannelSendStatusDialog from "@/features/stock/overview/components/channel-send-status/ChangeChannelSendStatusDialog";
import PreOrderSettingDialog from "@/features/stock/overview/components/pre-order-setting/PreOrderSettingDialog";
import ChangeSafetyStockAlerts from "@/features/stock/overview/components/safety-stock/ChangeSafetyStockAlerts";
import { SafetyStockAlertType } from "@/features/stock/overview/components/safety-stock/ChangeSafetyStockAlerts";
import ChangeSafetyStockDialog from "@/features/stock/overview/components/safety-stock/ChangeSafetyStockDialog";
import StockExportDialog from "@/features/stock/overview/components/stock-export/StockExportDialog";
import { useChangeChannelSendStatusDialog } from "@/features/stock/overview/hooks/channel-send-status/useChangeChannelSendStatusDialog";
import useOnlineStockSettingColumns from "@/features/stock/overview/hooks/online-stock/useOnlineStockSettingColumns";
import { usePreOrderSettingDialog } from "@/features/stock/overview/hooks/pre-order-setting/usePreOrderSettingDialog";
import useChangeSafetyStockValidation from "@/features/stock/overview/hooks/safety-stock/useChangeSafetyStockValidation";
import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import { ChannelSelection } from "@/features/stock/overview/models/types";
import { CHANNEL_STOCK_ROW_HEIGHT } from "@/features/stock/overview/modules/styles";
import { getDataGridStyles } from "@/features/stock/overview/modules/styles";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { StockDashboardRequestChannelSendStatusEnum } from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface OnlineStockDataGridProps {
  totalCount: number;
  rows: GridRowModel[];
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  UpdatedAt: ({ sx }: { sx?: SxProps<Theme> }) => JSX.Element;
}

function OnlineStockDataGrid({
  totalCount,
  rows,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  UpdatedAt,
}: OnlineStockDataGridProps) {
  const dataGridSx = useMemo(() => getDataGridStyles(), []);

  const [activeAlert, setActiveAlert] = useState<SafetyStockAlertType | null>(
    null,
  );
  const [openChangeSafetyStockDialog, setOpenChangeSafetyStockDialog] =
    useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);

  // 행 선택 상태 관리
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);

  // Change Channel Send Status Dialog
  const {
    open: openChangeChannelSendStatusDialog,
    offPeriod,
    setOffPeriod,
    handleOpenWithOffPeriod,
    handleClose: handleCloseChannelSendStatusDialog,
  } = useChangeChannelSendStatusDialog();

  const {
    open: openPreOrderSettingDialog,
    preOrderSetting,
    handleOpenWithPreOrderSetting,
    handleClose: handleClosePreOrderSettingDialog,
  } = usePreOrderSettingDialog();

  // 채널 선택 상태 관리
  const [selectedChannelMap, setSelectedChannelMap] = useState<
    Map<string, ChannelSelection>
  >(new Map());

  // 체크된 행들 계산 (selectedChannelMap 기반 - 채널별로 별도 row 생성)
  const selectedChannelRows = useMemo(() => {
    return Array.from(selectedChannelMap.values()).map((selection) => {
      const product = rows.find((row) => row.id === selection.rowId);

      return {
        id: `${selection.rowId}-${selection.channelName}`,
        rowId: selection.rowId,
        sku: selection.sku,
        channelName: selection.channelName,
        productName: product?.productName ?? "",
        undistributed: product?.undistributed ?? 0,
        available: selection.channelData.available,
        status: selection.channelData.status,
        channelEnum: selection.channelData.channelEnum,
        singleSku: selection.singleSku,
        preOrder: selection.channelData.preOrder,
      };
    });
  }, [selectedChannelMap, rows]);

  // Off Period 버튼 클릭 시 선택된 채널 정보 관리
  const [selectedChannelForOffPeriod, setSelectedChannelForOffPeriod] =
    useState<ChannelSelection | null>(null);

  // Off Period 버튼 클릭 핸들러
  const handleOffPeriodScheduledClick = useCallback(
    (selection: ChannelSelection) => {
      setSelectedChannelForOffPeriod(selection);
      handleOpenWithOffPeriod({
        channelSendStatus: StockDashboardRequestChannelSendStatusEnum.OFF,
        startDate: selection.channelData.channelSendOffStartedAt
          ? dayjs(selection.channelData.channelSendOffStartedAt)
          : null,
        endDate: selection.channelData.channelSendOffEndedAt
          ? dayjs(selection.channelData.channelSendOffEndedAt)
          : null,
      });
    },
    [handleOpenWithOffPeriod],
  );

  // Pre-order Setting Dialog 열기 (Pre-order Expired At 클릭 시 사용)
  const handlePreOrderExpiredAtClick = useCallback(
    ({ rowId, sku, channelName, channelData, singleSku }: ChannelSelection) => {
      // 해당 채널을 선택하고 다이얼로그 열기
      const key = `${rowId}-${channelName}`;
      setSelectedChannelMap(() => {
        const newMap = new Map();
        newMap.set(key, { rowId, sku, channelName, channelData, singleSku });
        return newMap;
      });
      handleOpenWithPreOrderSetting({
        preOrderExpiredAt: channelData.preOrderExpiredAt
          ? dayjs(channelData.preOrderExpiredAt)
          : channelData.preOrderExpiredAt === null
            ? null
            : undefined,
      });
    },
    [handleOpenWithPreOrderSetting],
  );

  // columns와 columnGroupingModel 가져오기 (핸들러 주입)
  const { columns, columnGroupingModel } = useOnlineStockSettingColumns({
    onOffPeriodScheduledClick: handleOffPeriodScheduledClick,
    onPreOrderExpiredAtClick: handlePreOrderExpiredAtClick,
  });

  // 선택된 행들 계산
  const selectedRows = useMemo(() => {
    const selectionSet = new Set(rowSelectionModel);
    return rows.filter((row) => selectionSet.has(row.id));
  }, [rows, rowSelectionModel]);

  // Validation 로직
  const { validateChangeSafetyStock } = useChangeSafetyStockValidation({
    selectedRows,
  });

  const handleRowSelectionModelChange = useCallback(
    (newSelection: GridRowSelectionModel) => {
      setRowSelectionModel([...newSelection]);
    },
    [],
  );

  // Dialog에서 사용할 형식으로 변환 (offPeriod 버튼 클릭 시 사용)
  const selectedChannelRowsForChangeChannelSendStatus = useMemo(() => {
    if (!selectedChannelForOffPeriod) return [];

    const product = rows.find(
      (row) => row.id === selectedChannelForOffPeriod.rowId,
    );

    if (!product) return [];

    // 선택된 채널만 필터링
    const filteredChannelStocks =
      product.channelStocks?.filter(
        (channelStock: ChannelStockData) =>
          channelStock.channel === selectedChannelForOffPeriod.channelName,
      ) ?? [];

    return [
      {
        id: product.id,
        sku: selectedChannelForOffPeriod.sku,
        productName: product.productName || "",
        channelStocks: filteredChannelStocks,
        singleSku: product.singleSku || "",
      },
    ];
  }, [selectedChannelForOffPeriod, rows]);

  const handleOpenChangeSafetyStockDialog = useCallback(() => {
    const validationError = validateChangeSafetyStock();

    if (validationError) {
      return setActiveAlert(validationError);
    }

    setOpenChangeSafetyStockDialog(true);
  }, [validateChangeSafetyStock]);

  const handleOpenExportDialog = useCallback(() => {
    setOpenExportDialog(true);
  }, []);

  return (
    <>
      <Box p="24px" mt="24px" bgcolor="white" border="1px solid #E0E0E0">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="10px"
        >
          <Typography fontSize="14px" mb="8px">
            <strong>{totalCount.toLocaleString()}</strong> results
          </Typography>

          <Box display="flex" gap="8px" alignItems="center">
            <UpdatedAt />
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              onClick={handleOpenChangeSafetyStockDialog}
            >
              Change Safety Stock
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleOpenExportDialog}
            >
              Export
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: "calc(100vh - 210px)", minHeight: "400px" }}>
          <ThemeProvider theme={MUIDataGridTheme}>
            <DataGridPro
              columns={columns as GridColDef<GridValidRowModel>[]}
              columnGroupingModel={columnGroupingModel}
              rows={rows}
              getRowId={(row) => row.id}
              loading={isLoading}
              disableColumnMenu
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnSorting
              disableColumnResize
              getRowHeight={(params) => {
                return (
                  params.model.channelStocks?.length * CHANNEL_STOCK_ROW_HEIGHT
                );
              }}
              sx={dataGridSx}
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              pageSizeOptions={COMMON_TABLE_PAGE_SIZE_OPTIONS}
              paginationMode="server"
              rowCount={totalCount}
              autosizeOnMount={false}
              autosizeOptions={{
                expand: false,
                includeHeaders: true,
                includeOutliers: false,
              }}
              checkboxSelection
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              unstable_rowSpanning
              initialState={{
                pinnedColumns: {
                  left: [
                    GRID_CHECKBOX_SELECTION_COL_DEF.field,
                    "productType",
                    "sku",
                    "sapCode",
                    "productName",
                    "bundleUnitQty",
                  ],
                },
              }}
              disableVirtualization
            />
          </ThemeProvider>
        </Box>
      </Box>

      <ChangeSafetyStockDialog
        rows={selectedRows}
        open={openChangeSafetyStockDialog}
        setOpen={setOpenChangeSafetyStockDialog}
      />

      <ChangeChannelSendStatusDialog
        offPeriod={offPeriod}
        setOffPeriod={setOffPeriod}
        rows={selectedChannelRowsForChangeChannelSendStatus}
        open={openChangeChannelSendStatusDialog}
        setOpen={(open) => {
          if (!open) {
            setSelectedChannelForOffPeriod(null);
            handleCloseChannelSendStatusDialog();
          }
        }}
      />

      <PreOrderSettingDialog
        rows={selectedChannelRows}
        open={openPreOrderSettingDialog}
        setOpen={(open) => {
          if (!open) {
            handleClosePreOrderSettingDialog();
          }
        }}
        preOrderSetting={preOrderSetting}
      />

      <ChangeSafetyStockAlerts
        activeAlert={activeAlert}
        onClose={() => setActiveAlert(null)}
      />

      <StockExportDialog
        open={openExportDialog}
        setOpen={setOpenExportDialog}
      />
    </>
  );
}

export default memo(OnlineStockDataGrid);
