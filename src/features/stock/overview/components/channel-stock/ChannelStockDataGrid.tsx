import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
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
  GridValidRowModel,
} from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useMemo, useState, useCallback, memo, useEffect } from "react";

import ChangeChannelSendStatusAlerts, {
  AlertType as ChangeChannelSendStatusAlertType,
} from "@/features/stock/overview/components/channel-send-status/ChangeChannelSendStatusAlerts";
import ChangeChannelSendStatusDialog from "@/features/stock/overview/components/channel-send-status/ChangeChannelSendStatusDialog";
import PreOrderSettingAlerts from "@/features/stock/overview/components/pre-order-setting/PreOrderSettingAlerts";
import PreOrderSettingDialog from "@/features/stock/overview/components/pre-order-setting/PreOrderSettingDialog";
import StockTransferAlerts, {
  AlertType,
} from "@/features/stock/overview/components/stock-transfer/StockTransferAlerts";
import StockTransferDialog from "@/features/stock/overview/components/stock-transfer/StockTransferDialog";
import { useChangeChannelSendStatusDialog } from "@/features/stock/overview/hooks/channel-send-status/useChangeChannelSendStatusDialog";
import useChangeChannelSendStatusValidation from "@/features/stock/overview/hooks/channel-send-status/useChangeChannelSendStatusValidation";
import useChannelStockSettingColumns from "@/features/stock/overview/hooks/channel-stock/useChannelStockSettingColumns";
import { usePreOrderSettingDialog } from "@/features/stock/overview/hooks/pre-order-setting/usePreOrderSettingDialog";
import usePreOrderSettingValidation from "@/features/stock/overview/hooks/pre-order-setting/usePreOrderSettingValidation";
import useStockTransferValidation from "@/features/stock/overview/hooks/stock-transfer/useStockTransferValidation";
import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import {
  ChannelSelection,
  StockDashboardRequestForm,
} from "@/features/stock/overview/models/types";
import { CHANNEL_STOCK_ROW_HEIGHT } from "@/features/stock/overview/modules/styles";
import { getDataGridStyles } from "@/features/stock/overview/modules/styles";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { StockDashboardRequestChannelSendStatusEnum } from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface ChannelStockDataGridProps {
  totalCount: number;
  rows: GridRowModel[];
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  UpdatedAt: ({ sx }: { sx?: SxProps<Theme> }) => JSX.Element;
  searchParams: StockDashboardRequestForm;
}

function ChannelStockDataGrid({
  totalCount,
  rows,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  UpdatedAt,
  searchParams,
}: ChannelStockDataGridProps) {
  const dataGridSx = useMemo(() => getDataGridStyles(), []);

  const [activeAlert, setActiveAlert] = useState<{
    stockTransfer: AlertType;
    changeChannelSendStatus: ChangeChannelSendStatusAlertType;
    preOrderSetting: AlertType;
  }>({
    stockTransfer: null,
    changeChannelSendStatus: null,
    preOrderSetting: null,
  });

  const [openStockTransferDialog, setOpenStockTransferDialog] = useState(false);

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
    handleOpen: handleOpenPreOrderSettingDialog,
    handleOpenWithPreOrderSetting,
    handleClose: handleClosePreOrderSettingDialog,
  } = usePreOrderSettingDialog();

  // 채널 선택 상태 관리
  const [selectedChannelMap, setSelectedChannelMap] = useState<
    Map<string, ChannelSelection>
  >(new Map());

  // 검색 결과가 변경될 경우 선택된 채널 초기화
  useEffect(() => {
    setSelectedChannelMap(new Map());
  }, [rows]);

  // 체크된 행들 계산 (selectedChannelMap 기반 - 채널별로 별도 row 생성)
  const selectedChannelRows = useMemo(() => {
    return Array.from(selectedChannelMap.values()).map((selection) => {
      const product = rows.find((row) => row.id === selection.rowId);

      return {
        id: `${selection.rowId}-${selection.channelName}`,
        rowId: selection.rowId,
        sku: selection.sku,
        channelName: selection.channelName, // channel 정보
        productName: product?.productName ?? "",
        undistributed: product?.undistributed ?? 0,
        available: selection.channelData.available,
        status: selection.channelData.status, // channel send status 정보
        channelEnum: selection.channelData.channelEnum,
        singleSku: selection.singleSku,
        preOrder: selection.channelData.preOrder,
        productType: product?.productType.toUpperCase(), // product type 정보
      };
    });
  }, [selectedChannelMap, rows]);

  // Change Channel Send Status Dialog 에 사용될 데이터 가져오기
  const selectedChannelRowsForChangeChannelSendStatus = useMemo(() => {
    // SKU별로 선택된 채널들을 그룹핑
    const groupedBySku = new Map<string, Set<string>>();

    Array.from(selectedChannelMap.values()).forEach((selection) => {
      if (!groupedBySku.has(selection.sku)) {
        groupedBySku.set(selection.sku, new Set());
      }
      groupedBySku.get(selection.sku)!.add(selection.channelName);
    });

    // 각 SKU에 대해 rows에서 찾고, 선택된 채널만 필터링
    return Array.from(groupedBySku.entries()).map(([sku, selectedChannels]) => {
      const product = rows.find((row) => row.sku === sku);

      // product의 channelStocks에서 선택된 채널만 필터링
      const filteredChannelStocks =
        product?.channelStocks.filter((channelStock: ChannelStockData) =>
          selectedChannels.has(channelStock.channel),
        ) ?? [];

      return {
        id: product?.id ?? sku,
        sku: sku,
        productName: product?.productName ?? "",
        channelStocks: filteredChannelStocks,
        singleSku: product?.singleSku ?? "",
      };
    });
  }, [selectedChannelMap, rows]);

  // Validation 로직
  const { validateStockTransfer } = useStockTransferValidation({
    selectedChannelRows,
  });
  const { validatePreOrderSetting } = usePreOrderSettingValidation({
    selectedChannelRows,
  });
  const { validateChangeChannelSendStatus } =
    useChangeChannelSendStatusValidation();

  // 채널 체크박스 핸들러
  const handleChannelCheckboxChange = useCallback(
    (
      rowId: string,
      sku: string,
      channelName: string,
      checked: boolean,
      channelData: ChannelStockData,
      singleSku: string,
    ) => {
      const key = `${rowId}-${channelName}`;
      setSelectedChannelMap((prev) => {
        const newMap = new Map(prev);
        if (checked) {
          newMap.set(key, { rowId, sku, channelName, channelData, singleSku });
        } else {
          newMap.delete(key);
        }
        return newMap;
      });
    },
    [],
  );

  // 헤더 체크박스 상태 계산
  const headerCheckboxState = useMemo(() => {
    // 현재 페이지의 모든 채널 (Total 제외)
    const allChannels: Array<{
      rowId: string;
      sku: string;
      channelName: string;
      channelData: ChannelStockData;
    }> = [];

    rows.forEach((row) => {
      const channelStocks = row.channelStocks || [];
      channelStocks.forEach((cs: ChannelStockData) => {
        if (cs.channel !== "Total") {
          allChannels.push({
            rowId: row.id,
            sku: row.sku,
            channelName: cs.channel,
            channelData: cs,
          });
        }
      });
    });

    if (allChannels.length === 0) {
      return { checked: false, indeterminate: false };
    }

    // 선택된 채널 수 계산
    const selectedCount = allChannels.filter((channel) => {
      const key = `${channel.rowId}-${channel.channelName}`;
      return selectedChannelMap.has(key);
    }).length;

    if (selectedCount === 0) {
      return { checked: false, indeterminate: false };
    } else if (selectedCount === allChannels.length) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  }, [rows, selectedChannelMap]);

  // 헤더 체크박스 핸들러 (전체 선택/해제)
  const handleHeaderCheckboxChange = useCallback(
    (checked: boolean) => {
      setSelectedChannelMap((prev) => {
        const newMap = new Map(prev);

        rows.forEach((row) => {
          const channelStocks = row.channelStocks || [];
          channelStocks.forEach((cs: ChannelStockData) => {
            if (cs.channel !== "Total") {
              const key = `${row.id}-${cs.channel}`;
              if (checked) {
                newMap.set(key, {
                  rowId: row.id,
                  sku: row.sku,
                  channelName: cs.channel,
                  channelData: cs,
                  singleSku: row.singleSku,
                });
              } else {
                newMap.delete(key);
              }
            }
          });
        });

        return newMap;
      });
    },
    [rows],
  );

  // Stock Transfer Dialog 열기
  const handleOpenStockTransferDialog = useCallback(() => {
    const validationError = validateStockTransfer();

    if (validationError) {
      return setActiveAlert((prev) => ({
        ...prev,
        stockTransfer: validationError,
      }));
    }

    setOpenStockTransferDialog(true);
  }, [validateStockTransfer]);

  // Change Channel Send Status Dialog 열기
  const handleOpenChangeChannelSendStatusDialog = useCallback(() => {
    const validationError = validateChangeChannelSendStatus({
      selectedChannelMap,
      searchParams,
    });

    if (validationError) {
      return setActiveAlert((prev) => ({
        ...prev,
        changeChannelSendStatus: validationError,
      }));
    }

    handleOpenWithOffPeriod({
      channelSendStatus: StockDashboardRequestChannelSendStatusEnum.ON,
      startDate: null,
      endDate: null,
    });
  }, [
    handleOpenWithOffPeriod,
    validateChangeChannelSendStatus,
    searchParams,
    selectedChannelMap,
  ]);

  // Change Channel Send Status Dialog 열기 (Off Period 버튼 클릭 시 사용)
  const handleOffPeriodScheduledClick = useCallback(
    ({ rowId, sku, channelName, channelData, singleSku }: ChannelSelection) => {
      // 해당 채널을 선택하고 다이얼로그 열기
      const key = `${rowId}-${channelName}`;
      setSelectedChannelMap(() => {
        const newMap = new Map();
        newMap.set(key, { rowId, sku, channelName, channelData, singleSku });
        return newMap;
      });
      handleOpenWithOffPeriod({
        channelSendStatus: StockDashboardRequestChannelSendStatusEnum.OFF,
        startDate: channelData.channelSendOffStartedAt
          ? dayjs(channelData.channelSendOffStartedAt)
          : null,
        endDate: channelData.channelSendOffEndedAt
          ? dayjs(channelData.channelSendOffEndedAt)
          : null,
      });
    },
    [handleOpenWithOffPeriod],
  );

  // Pre-order Setting Dialog 열기
  const handleOpenPreOrderSettingDialogWithValidation = useCallback(() => {
    const validationError = validatePreOrderSetting();

    if (validationError) {
      return setActiveAlert((prev) => ({
        ...prev,
        preOrderSetting: validationError,
      }));
    }

    handleOpenPreOrderSettingDialog();
  }, [validatePreOrderSetting, handleOpenPreOrderSettingDialog]);

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
  const { columns, columnGroupingModel } = useChannelStockSettingColumns({
    selectedChannelMap,
    onChannelCheckboxChange: handleChannelCheckboxChange,
    onHeaderCheckboxChange: handleHeaderCheckboxChange,
    headerCheckboxState,
    onOffPeriodScheduledClick: handleOffPeriodScheduledClick,
    onPreOrderExpiredAtClick: handlePreOrderExpiredAtClick,
  });

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
              startIcon={<SendIcon />}
              onClick={handleOpenStockTransferDialog}
            >
              Stock Transfer
            </Button>
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              onClick={handleOpenChangeChannelSendStatusDialog}
            >
              Change Channel Send Status
            </Button>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={handleOpenPreOrderSettingDialogWithValidation}
            >
              Pre-order Setting
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
              unstable_rowSpanning
              initialState={{
                pinnedColumns: {
                  left: [
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

      <StockTransferDialog
        rows={selectedChannelRows}
        open={openStockTransferDialog}
        setOpen={setOpenStockTransferDialog}
      />

      <ChangeChannelSendStatusDialog
        offPeriod={offPeriod}
        setOffPeriod={setOffPeriod}
        rows={selectedChannelRowsForChangeChannelSendStatus}
        open={openChangeChannelSendStatusDialog}
        setOpen={(open) => {
          if (!open) {
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

      <StockTransferAlerts
        activeAlert={activeAlert.stockTransfer}
        onClose={() => setActiveAlert({ ...activeAlert, stockTransfer: null })}
      />

      <ChangeChannelSendStatusAlerts
        activeAlert={activeAlert.changeChannelSendStatus}
        onClose={() =>
          setActiveAlert({ ...activeAlert, changeChannelSendStatus: null })
        }
      />

      <PreOrderSettingAlerts
        activeAlert={activeAlert.preOrderSetting}
        onClose={() =>
          setActiveAlert({ ...activeAlert, preOrderSetting: null })
        }
      />
    </>
  );
}

export default memo(ChannelStockDataGrid);
