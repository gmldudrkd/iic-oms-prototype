"use client";

import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";

import StockHistoryDataGrid from "@/features/stock/history/components/shared/StockHistoryDataGrid";
import StockHistorySearchFilter from "@/features/stock/history/components/shared/StockHistorySearchFilter";
import StockHistoryChart from "@/features/stock/history/components/stock-history-chart/StockHistoryChart";
import useGetStockHistory from "@/features/stock/history/hooks/shared/useGetStockHistory";
import useStockHistorySearchFilterForm from "@/features/stock/history/hooks/shared/useStockHistorySearchFilterForm";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { ApiError } from "@/shared/types";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function StockHistory() {
  const { openSnackbar } = useSnackbarStore();
  const { timezone } = useTimezoneStore();
  const { form, defaultValues, searchParams, setSearchParams } =
    useStockHistorySearchFilterForm();

  const { data, error, isError, isLoading, isSuccess, isFetching, refetch } =
    useGetStockHistory(searchParams);

  // 에러 처리
  useEffect(() => {
    if (error && isError) {
      openSnackbar({
        message:
          (error as unknown as ApiError)?.errorMessage ||
          "Failed to fetch stock history.",
        severity: "error",
      });
    }
  }, [error, isError, openSnackbar]);

  const isToday = useMemo(() => {
    if (!searchParams?.to) return false;

    // timezone 기준으로 날짜 비교
    const searchDate = dayjs(searchParams.to).subtract(1, "day").tz(timezone);
    const today = dayjs().tz(timezone);

    return searchDate.isSame(today, "day");
  }, [searchParams?.to, timezone]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormProvider {...form}>
        <StockHistorySearchFilter
          defaultValues={defaultValues}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          refetch={refetch}
        />
        {searchParams && data && (
          <>
            <Box
              padding="24px"
              mt="24px"
              bgcolor="white"
              border="1px solid #E0E0E0"
            >
              <StockHistoryChart
                historyData={data.histories}
                productName={data.productName}
                sku={data.sku}
                isSuccess={isSuccess}
                isFetching={isFetching}
              />

              <StockHistoryDataGrid
                rows={data}
                isLoading={isLoading}
                productName={data.productName}
                sku={data.sku}
                isToday={isToday}
              />
            </Box>
          </>
        )}
      </FormProvider>
    </LocalizationProvider>
  );
}
