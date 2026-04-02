"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ThemeProvider } from "@mui/material";
import { DataGridPro, GridPaginationModel } from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as XLSX from "xlsx";

import SearchForm from "@/features/promotion-list/components/SearchForm";
import { COLUMNS_PROMOTION_LIST } from "@/features/promotion-list/modules/columns";
import {
  MOCK_PROMOTIONS,
  PromotionRow,
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
      dateType: "startDate",
      period: [
        dayjs().tz(timezone).subtract(3, "month").startOf("day"),
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
  const [filteredData, setFilteredData] =
    useState<PromotionRow[]>(MOCK_PROMOTIONS);

  const { currentTime } = useCurrentTime({
    isFetching: false,
    isSuccess: true,
  });

  const rows = useMemo(() => {
    return filteredData.map((row, index) => ({
      ...row,
      _id: `${row.id}-${index}`,
    }));
  }, [filteredData]);

  const handleSearch = useCallback(() => {
    const values = methods.getValues();
    const { dateType, period, status, channel, searchKeyType, searchKeyword } =
      values;

    let result = [...MOCK_PROMOTIONS];

    // Status 필터
    if (status) {
      result = result.filter(
        (row) => row.status.toUpperCase() === String(status).toUpperCase(),
      );
    }

    // Channel 필터
    if (channel) {
      result = result.filter((row) =>
        row.triggerChannels.some((ch) =>
          ch.toLowerCase().includes(String(channel).toLowerCase()),
        ),
      );
    }

    // Date 필터 - period 값이 둘 다 있을 때만 적용
    if (period?.[0] && period?.[1]) {
      const startDate = dayjs(period[0]);
      const endDate = dayjs(period[1]);
      if (startDate.isValid() && endDate.isValid()) {
        result = result.filter((row) => {
          const dateField =
            dateType === "endDate" ? row.endDate : row.startDate;
          const normalized = dateField.replace(/\./g, "-");
          const rowDate = dayjs(normalized);
          if (!rowDate.isValid()) return true;
          return (
            rowDate.isAfter(startDate.subtract(1, "day")) &&
            rowDate.isBefore(endDate.add(1, "day"))
          );
        });
      }
    }

    // Keyword 검색
    const keyword = String(searchKeyword ?? "").trim();
    if (keyword) {
      const keywords = keyword
        .split("\n")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      if (keywords.length > 0) {
        result = result.filter((row) => {
          const fieldMap: Record<string, string> = {
            id: String(row.id),
            title: row.title,
            createdBy: row.createdBy,
            gwpName: row.reward,
            gwpSapCode: row.reward,
            targetProductName: row.trigger,
            targetSapCode: row.trigger,
          };
          const fieldValue = (
            fieldMap[String(searchKeyType)] ?? ""
          ).toLowerCase();
          return keywords.some((kw) => fieldValue.includes(kw));
        });
      }
    }

    setFilteredData(result);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [methods]);

  const handleReset = useCallback(() => {
    methods.reset();
    setFilteredData(MOCK_PROMOTIONS);
  }, [methods]);

  const handleRefresh = useCallback(() => {
    // Mock: 실제로는 refetch 호출
  }, []);

  const handleExport = useCallback(() => {
    const exportData = filteredData.map((row) => ({
      ID: row.id,
      promotionTitle: row.title,
      allocatedStock: Math.floor(Math.random() * 50000) + 900,
      totalStock: Math.floor(Math.random() * 50000) + 1000,
      promotionRule: row.triggerType,
      channel: row.triggerChannels.join(", "),
      status: row.status,
      createdDate: row.createdAt.replace(/\./g, "-").slice(0, 10),
      startDate: row.startDate.replace(/\./g, "-").slice(0, 10),
      endDate: row.endDate.replace(/\./g, "-"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promotions");
    const date = dayjs().tz(timezone).format("YYYYMMDD_HHmm");
    XLSX.writeFile(wb, `IIC_OMS_Promotion_List_${date}.xlsx`);
  }, [filteredData, timezone]);

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
              <TotalResult
                totalResult={filteredData.length}
                classNames="!mb-0"
              />

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
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                >
                  Export
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
                paginationMode="client"
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSorting
                loading={isFetching}
                rowHeight={26}
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
