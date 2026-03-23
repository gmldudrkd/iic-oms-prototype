import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGridPro } from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";

import StockHistoryDetailDialog from "@/features/stock/history/components/shared/StockHistoryDetailDialog";
import useStockHistoryDataGridColumns from "@/features/stock/history/hooks/shared/useStockHistoryDataGridColumns";
import useStockHistoryDetailSearchFilterForm from "@/features/stock/history/hooks/shared/useStockHistoryDetailSearchFilterForm";
import { transformStockHistoryData } from "@/features/stock/history/models/transforms";
import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";
import { getDataGridStyles } from "@/features/stock/history/modules/styles";

import {
  StockHistorySearchRequestPeriodTypeEnum,
  StockHistoryWithProductResponse,
} from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface StockHistoryDataGridProps {
  rows: StockHistoryWithProductResponse;
  isLoading: boolean;
  productName?: string;
  sku: string;
  isToday: boolean;
}

export default function StockHistoryDataGrid({
  rows,
  isLoading,
  productName,
  sku,
  isToday,
}: StockHistoryDataGridProps) {
  const { watch } = useFormContext<StockHistorySearchFilterForm>();
  const { periodType } = watch();
  const { form } = useStockHistoryDetailSearchFilterForm();
  const isDaily = periodType === StockHistorySearchRequestPeriodTypeEnum.DAILY;

  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const { columns, columnGroupingModel } = useStockHistoryDataGridColumns({
    handleOpenDetailDialog: ({ sku, productName, from: startDate }) => {
      const from = isDaily
        ? dayjs(startDate).subtract(1, "day").startOf("day").toISOString()
        : dayjs(startDate).subtract(1, "hour").startOf("hour").toISOString();
      const to = isDaily
        ? dayjs(from).add(1, "day").toISOString()
        : dayjs(startDate).subtract(1, "hour").endOf("hour").toISOString();
      setOpenDetailDialog(true);
      form.setValue("sku", sku);
      form.setValue("productName", productName);
      form.setValue("onlineStockHistory.from", from);
      form.setValue("onlineStockHistory.to", to);
      form.setValue("channelStockHistory.from", from);
      form.setValue("channelStockHistory.to", to);
    },
  });

  // 데이터 변환
  const transformedRows = useMemo(() => {
    return transformStockHistoryData(rows);
  }, [rows]);

  // 스타일 적용
  const dataGridSx = useMemo(() => getDataGridStyles(), []);

  return (
    <FormProvider {...form}>
      <Box>
        <Typography fontSize="16px" fontWeight="bold">
          Snapshot
        </Typography>
        <Box mt="20px">
          <ThemeProvider theme={MUIDataGridTheme}>
            <DataGridPro
              rows={transformedRows}
              columns={columns}
              columnGroupingModel={columnGroupingModel}
              loading={isLoading}
              disableColumnMenu
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnSorting
              disableColumnResize
              getRowId={(row) => row.id}
              getRowHeight={() => "auto"}
              sx={dataGridSx}
              hideFooter
            />
          </ThemeProvider>
        </Box>
      </Box>

      {isToday && (
        <>
          <Box display="flex" alignItems="center" gap="4px" mt="20px">
            <Typography fontSize="16px" fontWeight="bold">
              Recent Log :
            </Typography>
            <Typography
              fontSize="16px"
              color="primary.main"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setOpenDetailDialog(true);
                form.setValue("sku", sku);
                form.setValue("productName", productName ?? "-");
                form.setValue(
                  "onlineStockHistory.from",
                  dayjs()
                    .startOf(isDaily ? "day" : "hour")
                    .toISOString(),
                );
                form.setValue(
                  "onlineStockHistory.to",
                  dayjs().endOf("hour").toISOString(),
                );
                form.setValue(
                  "channelStockHistory.from",
                  dayjs()
                    .startOf(isDaily ? "day" : "hour")
                    .toISOString(),
                );
                form.setValue(
                  "channelStockHistory.to",
                  dayjs().endOf("hour").toISOString(),
                );
              }}
            >
              {dayjs()
                .startOf(isDaily ? "day" : "hour")
                .format("YYYY.MM.DD hh:mm:ss A")}{" "}
              ~ Now
            </Typography>
          </Box>
        </>
      )}

      <StockHistoryDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
      />
    </FormProvider>
  );
}
