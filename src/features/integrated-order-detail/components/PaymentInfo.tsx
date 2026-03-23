import { ThemeProvider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import OrderInfoWrapper from "@/features/integrated-order-detail/components/OrderInfoWrapper";
import { transformRowsPaymentInfo } from "@/features/integrated-order-detail/models/transforms";
import { LIST_COLUMNS_PAYMENT } from "@/features/integrated-order-detail/modules/columns";

import { OrderDetailResponse } from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridOrderDetailTheme } from "@/shared/styles/theme";
import {
  convertToPrice,
  getCurrencyFromPayments,
} from "@/shared/utils/stringUtils";

export default function PaymentInfo() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );
  const { timezone } = useTimezoneStore();
  const rows = useMemo(
    () => transformRowsPaymentInfo(data || undefined, timezone),
    [data, timezone],
  );
  const currency = getCurrencyFromPayments(data?.payments || []);

  return (
    <OrderInfoWrapper title="Payment Info">
      <ThemeProvider theme={MUIDataGridOrderDetailTheme}>
        <DataGrid
          rows={rows}
          columns={LIST_COLUMNS_PAYMENT as GridColDef[]}
          pagination
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableColumnResize
          disableDensitySelector
          slots={{
            footer: () => (
              <>
                <div className="flex items-center justify-end border-t border-gray-200">
                  <div className="flex justify-end px-[10px] py-4 text-[16px] font-bold">
                    Total
                  </div>
                  <div className="flex justify-end px-[10px] py-4 pr-3 text-[16px] font-bold">
                    {convertToPrice(
                      rows.reduce((acc, row) => acc + Number(row.amount), 0),
                      currency,
                    )}
                  </div>
                </div>
              </>
            ),
          }}
        />
      </ThemeProvider>
    </OrderInfoWrapper>
  );
}
