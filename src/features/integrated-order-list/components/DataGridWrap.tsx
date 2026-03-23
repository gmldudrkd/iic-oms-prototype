import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ThemeProvider } from "@mui/material";
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

import { ModalBulkCancel } from "@/features/integrated-order-list/components/ModalBulkCancel";
import { transformGroupData } from "@/features/integrated-order-list/models/transforms";
import {
  COLUMNS_CANCEL_ORDER,
  COLUMNS_CANCEL_RETURN,
  COLUMNS_CANCEL_EXCHANGE,
} from "@/features/integrated-order-list/modules/columns";
import {
  COLUMNS_ORDER_LIST,
  COLUMNS_RETURN_LIST,
  COLUMNS_EXCHANGE_LIST,
} from "@/features/integrated-order-list/modules/columns";

import TotalResult from "@/shared/components/text/TotalResult";
import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { PageResponseExchangeResponse } from "@/shared/generated/oms/types/Exchange";
import { ExchangeSearchRequest } from "@/shared/generated/oms/types/Exchange";
import { PageResponseOrderResponse } from "@/shared/generated/oms/types/Order";
import { OrderSearchRequest } from "@/shared/generated/oms/types/Order";
import {
  PageResponseReturnResponse,
  ReturnSearchRequest,
} from "@/shared/generated/oms/types/Return";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface DataGridWrapProps {
  dashboardGroup: "order" | "return" | "exchange";
  params: OrderSearchRequest | ReturnSearchRequest | ExchangeSearchRequest;
  setParams: Dispatch<
    SetStateAction<
      OrderSearchRequest | ReturnSearchRequest | ExchangeSearchRequest
    >
  >;
  data:
    | PageResponseOrderResponse
    | PageResponseReturnResponse
    | PageResponseExchangeResponse
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

  const groupConfig = useMemo(
    () => ({
      order: {
        columns: COLUMNS_ORDER_LIST as GridColDef[],
        totalCount: 0,
        bulkCancelTitle: "Order Cancelation",
        bulkCancelColumns: COLUMNS_CANCEL_ORDER as GridColDef[],
        bulkCancelConfirmLabel: "Cancel and Refund",
        ableBulkCancelStatus: ["Pending", "Collected", "Partly Confirmed"],
      },
      return: {
        columns: COLUMNS_RETURN_LIST as GridColDef[],
        totalCount: 0,
        bulkCancelTitle: "Bulk Cancel",
        bulkCancelColumns: COLUMNS_CANCEL_RETURN as GridColDef[],
        bulkCancelConfirmLabel: "Cancel Return",
        ableBulkCancelStatus: ["Pending"],
      },
      exchange: {
        columns: COLUMNS_EXCHANGE_LIST as GridColDef[],
        totalCount: 0,
        bulkCancelTitle: "Bulk Cancel",
        bulkCancelColumns: COLUMNS_CANCEL_EXCHANGE as GridColDef[],
        bulkCancelConfirmLabel: "Cancel Exchange",
        ableBulkCancelStatus: [
          "Pending",
          "Pickup Requested",
          "Pickup Ongoing",
          "Received",
        ],
      },
    }),
    [],
  );

  // DataGrid에 표시될 columns와 rows를 위한 상태 추가
  const [displayColumns, setDisplayColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0); // 총 개수 상태 추가

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
    const config = groupConfig[group as keyof typeof groupConfig];

    if (isSuccess && !isFetching && data && Array.isArray(data.data)) {
      // setCurrentStaticConfig(config);
      setDisplayColumns(config.columns);
      setTotalCount(data.totalCount || 0);
      setRows(transformedRows as GridRowModel[]);
    } else {
      // setCurrentStaticConfig(config);
      setDisplayColumns(config.columns);
      setTotalCount(0);
      setRows([]);
    }
  }, [isSuccess, isFetching, data, group, groupConfig, transformedRows]);

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
      groupConfig[group as keyof typeof groupConfig]?.ableBulkCancelStatus ||
      [];
    if (ableBulkCancelStatus.length === 0) return false;

    // selectedRows의 각 row가 status 속성을 가지고 있는지 확인 후 비교
    return selectedRows.every((row) =>
      ableBulkCancelStatus.includes(row.status),
    );
  }, [selectedRows, group, groupConfig]);

  // 취소 모달 버튼 비활성화 로직
  const isButtonDisableCancelModal = useMemo(
    () => group === "order" && !cancelReason,
    [group, cancelReason],
  );

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
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBulkCancel}
              disabled={!isCancelBulkButtonEnabled}
            >
              Bulk Cancel
            </Button>

            {/* Bulk Cancel Modal */}
            <FormProvider {...methods}>
              <ModalBulkCancel
                group={group}
                selectedRows={selectedRows}
                columns={groupConfig[group].bulkCancelColumns}
                openBulkCancel={openBulkCancel}
                setOpenBulkCancel={setOpenBulkCancel}
                bulkCancelTitle={groupConfig[group].bulkCancelTitle}
                bulkCancelConfirmLabel={
                  groupConfig[group].bulkCancelConfirmLabel
                }
                isButtonDisableCancelModal={isButtonDisableCancelModal}
                refetchList={refetchList}
                refetchDashboard={refetchDashboard}
              />
            </FormProvider>
          </div>
        </div>

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
            checkboxSelection
            rowSelectionModel={selectedItems}
            onRowSelectionModelChange={handleSelectionModelChange}
            rowHeight={24}
            getRowHeight={() => "auto"}
            hideFooterSelectedRowCount
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
