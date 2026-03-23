"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ThemeProvider } from "@mui/material";
import { DataGridPro, GridPaginationModel } from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import SearchForm from "@/features/promotion-list/components/SearchForm";
import { COLUMNS_PROMOTION_LIST } from "@/features/promotion-list/modules/columns";
import {
  MOCK_PROMOTIONS,
  MOCK_TOTAL_COUNT,
} from "@/features/promotion-list/modules/mockData";

import TotalResult from "@/shared/components/text/TotalResult";
import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

export default function PromotionList() {
  const { timezone } = useTimezoneStore();

  const defaultValues = useMemo(
    () => ({
      dateType: "",
      period: [
        dayjs().tz(timezone).startOf("day"),
        dayjs().tz(timezone).endOf("day"),
      ],
      status: "",
      channel: "",
      searchKeyType: "title",
      searchKeyword: "",
    }),
    [timezone],
  );

  const methods = useForm({ defaultValues });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
  });

  // Mock: 실제로는 API에서 isFetching, isSuccess를 받아옴
  const [isFetching] = useState(false);

  const { currentTime } = useCurrentTime({
    isFetching: false,
    isSuccess: true,
  });

  const rows = useMemo(() => {
    return MOCK_PROMOTIONS.map((row, index) => ({
      ...row,
      _id: `${row.id}-${index}`,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    // Mock: 실제로는 API 호출
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleReset = useCallback(() => {
    methods.reset();
  }, [methods]);

  const handleRefresh = useCallback(() => {
    // Mock: 실제로는 refetch 호출
  }, []);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      if (isFetching) return;
      setPaginationModel(model);
    },
    [isFetching],
  );

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-[24px]">
          {/* Search Form */}
          <div className="border-b border-outlined bg-white">
            <div className="px-[24px]">
              <SearchForm onSearch={handleSearch} onReset={handleReset} />
            </div>
          </div>

          {/* DataGrid */}
          <div className="border-[1px] border-solid border-[#E0E0E0] bg-white p-[24px]">
            <div className="mb-[8px] flex items-center justify-between">
              <TotalResult totalResult={MOCK_TOTAL_COUNT} classNames="!mb-0" />

              <div className="flex items-center gap-[8px]">
                <p className="text-[14px] text-black">
                  Updated at: {currentTime}
                </p>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="h-[calc(100vh-310px)] min-h-[400px]">
              <DataGridPro
                columns={COLUMNS_PROMOTION_LIST}
                rows={rows}
                getRowId={(row) => row._id}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={COMMON_TABLE_PAGE_SIZE_OPTIONS}
                rowCount={MOCK_TOTAL_COUNT}
                paginationMode="server"
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSorting
                loading={isFetching}
                rowHeight={24}
                getRowHeight={() => "auto"}
                hideFooterSelectedRowCount
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </ThemeProvider>
  );
}
