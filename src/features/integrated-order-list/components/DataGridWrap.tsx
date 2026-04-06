import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ThemeProvider, Tooltip } from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridPaginationModel,
  GridRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid-pro";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";

import PrintLabelModal from "@/features/integrated-order-detail/components/PrintLabelModal";
import type { LabelData } from "@/features/integrated-order-detail/components/PrintLabelModal";
import { ModalBulkCancel } from "@/features/integrated-order-list/components/ModalBulkCancel";
import { transformGroupData } from "@/features/integrated-order-list/models/transforms";
import { OrderGroup } from "@/features/integrated-order-list/models/types";
import { IntegratedOrderRequest } from "@/features/integrated-order-list/models/types";
import { GROUPED_CONFIG } from "@/features/integrated-order-list/modules/constants";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import TotalResult from "@/shared/components/text/TotalResult";
import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { PageResponseExchangeResponse } from "@/shared/generated/oms/types/Exchange";
import { PageResponseOrderResponse } from "@/shared/generated/oms/types/Order";
import { PageResponseReshipmentResponse } from "@/shared/generated/oms/types/Reshipment";
import { PageResponseReturnResponse } from "@/shared/generated/oms/types/Return";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface DataGridWrapProps {
  dashboardGroup: OrderGroup;
  params: IntegratedOrderRequest;
  setParams: Dispatch<SetStateAction<IntegratedOrderRequest>>;
  data:
    | PageResponseOrderResponse
    | PageResponseReturnResponse
    | PageResponseExchangeResponse
    | PageResponseReshipmentResponse
    | null;
  isSuccess: boolean;
  isFetching: boolean;
  refetchList: () => void;
  refetchDashboard?: () => void;
}

export default function DataGridWrap({
  dashboardGroup,
  // paginationModel,
  // setPaginationModel,
  params,
  setParams,
  data,
  isSuccess,
  isFetching,
  refetchList,
  refetchDashboard,
}: DataGridWrapProps) {
  const group = dashboardGroup;
  const { timezone } = useTimezoneStore();
  const { openSnackbar } = useSnackbarStore();

  // DataGrid에 표시될 columns와 rows를 위한 상태 추가
  const [displayColumns, setDisplayColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0); // 총 개수 상태 추가

  // Print Label 모달 관리
  const [openPrintLabel, setOpenPrintLabel] = useState(false);
  const [printLabels, setPrintLabels] = useState<LabelData[]>([]);
  const [openPrintLabelAlert, setOpenPrintLabelAlert] = useState(false);

  // Bulk Cancel 모달 관리
  const [openBulkCancel, setOpenBulkCancel] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { currentTime } = useCurrentTime({
    isFetching,
    isSuccess,
  });

  const methods = useForm({ defaultValues: { cancelationReason: "" } });
  const cancelReason = methods.watch("cancelationReason");

  // 데이터 매핑 로직 분리
  const transformedRows = useMemo(() => {
    if (
      !isSuccess ||
      isFetching ||
      !data ||
      !Array.isArray(data.data) ||
      data.data.length === 0
    ) {
      return [];
    }

    return transformGroupData(group, data.data, timezone);
  }, [group, data, timezone, isSuccess, isFetching]);

  useEffect(() => {
    const config = GROUPED_CONFIG[group as keyof typeof GROUPED_CONFIG];

    if (isSuccess && !isFetching && data && Array.isArray(data.data)) {
      setDisplayColumns(config.columns);
      setTotalCount(data.totalCount || 0);
      setRows(transformedRows as GridRowModel[]);
    } else {
      setDisplayColumns(config.columns);
      setTotalCount(0);
      setRows([]);
    }
  }, [isSuccess, isFetching, data, group, transformedRows]);

  // 그룹 변경 시 선택된 행 및 데이터 초기화
  useEffect(() => {
    setSelectedItems([]);
  }, [group]);

  // 현재 선택된 행 데이터 가져오기 (rows 사용)
  const selectedRows = useMemo(() => {
    return rows.filter((row) => selectedItems.includes(String(row.id)));
  }, [rows, selectedItems]);

  // 선택 변경 이벤트 핸들러
  const handleSelectionModelChange = (
    newSelectionModel: GridRowSelectionModel,
  ) => {
    setSelectedItems(newSelectionModel as string[]);
  };

  // 새로고침 핸들러
  const handleRefresh = () => refetchList();

  const handlePaginationModelChange = useCallback(
    ({ page, pageSize }: GridPaginationModel) => {
      if (isFetching) return;
      setParams({ ...params, page, size: pageSize });
    },
    [setParams, isFetching, params],
  );

  // bulk 버튼 활성화 조건 검사 (selectedRows 타입 검사)
  const isCancelBulkButtonEnabled = useMemo(() => {
    if (selectedRows.length === 0) return false;
    // return true;
    const ableBulkCancelStatus =
      GROUPED_CONFIG[group as keyof typeof GROUPED_CONFIG]
        ?.ableBulkCancelStatus || [];
    if (ableBulkCancelStatus.length === 0) return false;

    // selectedRows의 각 row가 status 속성을 가지고 있는지 확인 후 비교
    return selectedRows.every((row) =>
      ableBulkCancelStatus.includes(row.status),
    );
  }, [selectedRows, group]);

  // 취소 모달 버튼 비활성화 로직
  const isButtonDisableCancelModal = useMemo(
    () => group === "order" && !cancelReason,
    [group, cancelReason],
  );

  // Print Label 버튼 활성화 조건: CA 채널 + Picking Requested/Picked 상태
  const isPrintLabelEnabled = useMemo(() => {
    if (group !== "order") return false;
    const orderParams = params as {
      channelTypes?: string[];
      shipmentStatuses?: string[];
    };
    const channels = orderParams.channelTypes ?? [];
    const statuses = orderParams.shipmentStatuses ?? [];
    const hasCA =
      channels.length > 0 &&
      channels.every((ch) => ch.toUpperCase().includes("_CA"));
    const hasValidStatus =
      statuses.length > 0 &&
      statuses.every((s) => s === "PICKING_REQUESTED" || s === "PICKED");
    return hasCA && hasValidStatus;
  }, [group, params]);

  const handlePrintLabel = useCallback(() => {
    if (selectedRows.length === 0) {
      setOpenPrintLabelAlert(true);
      return;
    }
    const targetRows: GridRowModel[] = selectedRows;
    const labels: LabelData[] = targetRows.map((row) => ({
      shipmentNo: row.shipmentNo ?? row.orderId ?? "",
      orderId: row.orderId ?? "",
      recipientName: row.recipientName ?? "",
      recipientCompany: "IIC Combined",
      recipientAddress: row.recipientAddress ?? "100 Queen Street West",
      recipientCityStateZip: row.recipientCity
        ? `${row.recipientCity} ${row.recipientState ?? ""} ${row.recipientPostalCode ?? ""}`
        : "Toronto ON M5V 2T6",
      recipientCountry: row.recipientCountry ?? "CA",
      recipientPhone: row.recipientPhone ?? "",
      trackingNo: row.trackingNo ?? "3999 2375 8287",
    }));
    setPrintLabels(labels);
    setOpenPrintLabel(true);
  }, [selectedRows]);

  const handleBulkCancel = () => {
    const allSameBrand = selectedRows.every(
      (row) => row.brand === selectedRows[0].brand,
    );

    if (!allSameBrand) {
      openSnackbar({
        message: "Cannot proceed with multiple brands.",
        severity: "error",
      });
      return;
    }

    setOpenBulkCancel(true);
  };

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <div className="border-[1px] border-solid border-[#E0E0E0] bg-white p-[24px]">
        <div className="mb-[8px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TotalResult totalResult={totalCount} classNames="!mb-0" />
            <p className="text-[14px]">
              <span className="font-bold">{selectedRows.length}</span> selected
            </p>
          </div>

          <div className="flex items-center gap-[8px]">
            <p className="text-[14px] text-black">Updated at: {currentTime}</p>

            {/* 새로고침 버튼 */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={isFetching}
            >
              {isFetching ? "Updating" : "Refresh"}
            </Button>

            {/* Bulk Cancel 버튼 */}
            {group !== "reshipment" && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBulkCancel}
                  disabled={!isCancelBulkButtonEnabled}
                >
                  Bulk Cancel
                </Button>
                {/* Print Label 버튼 */}
                {group === "order" && (
                  <Tooltip
                    title={
                      isPrintLabelEnabled
                        ? ""
                        : "Activated when a self-logistics channel and a printable status are searched."
                    }
                    arrow
                  >
                    <span>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PrintIcon />}
                        disabled={!isPrintLabelEnabled}
                        onClick={handlePrintLabel}
                      >
                        Print Label
                      </Button>
                    </span>
                  </Tooltip>
                )}

                {/* Bulk Cancel Modal */}
                <FormProvider {...methods}>
                  <ModalBulkCancel
                    group={group}
                    selectedRows={selectedRows}
                    columns={GROUPED_CONFIG[group].bulkCancelColumns}
                    openBulkCancel={openBulkCancel}
                    setOpenBulkCancel={setOpenBulkCancel}
                    bulkCancelTitle={GROUPED_CONFIG[group].bulkCancelTitle}
                    bulkCancelConfirmLabel={
                      GROUPED_CONFIG[group].bulkCancelConfirmLabel
                    }
                    isButtonDisableCancelModal={isButtonDisableCancelModal}
                    refetchList={refetchList}
                    refetchDashboard={refetchDashboard}
                  />
                </FormProvider>
              </>
            )}
          </div>
        </div>

        {/* Print Label Modal */}
        <PrintLabelModal
          open={openPrintLabel}
          onClose={() => setOpenPrintLabel(false)}
          labels={printLabels}
        />
        <AlertDialog
          open={openPrintLabelAlert}
          setOpen={setOpenPrintLabelAlert}
          isButton={false}
          dialogContent="No orders selected. Please select orders to print labels."
          dialogCloseLabel="OK"
        />

        <div className="h-[calc(100vh-210px)] min-h-[400px]">
          <DataGridPro
            columns={displayColumns}
            columnVisibilityModel={{ amount: false }}
            rows={rows}
            pagination
            paginationModel={{
              page: data?.pageNumber ?? 0,
              pageSize: data?.pageSize ?? COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
            }}
            onPaginationModelChange={handlePaginationModelChange}
            paginationMode="server"
            pageSizeOptions={COMMON_TABLE_PAGE_SIZE_OPTIONS}
            rowCount={totalCount}
            disableColumnMenu
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSorting
            loading={isFetching}
            {...(group !== "reshipment" && {
              checkboxSelection: true,
              rowSelectionModel: selectedItems,
              onRowSelectionModelChange: handleSelectionModelChange,
              rowHeight: 24,
              getRowHeight: () => "auto",
              hideFooterSelectedRowCount: true,
            })}
            {...(group === "reshipment" && {
              getRowHeight: () => 43,
            })}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
