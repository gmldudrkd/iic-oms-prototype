import { ThemeProvider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import OrderInfoWrapper from "@/features/integrated-order-detail/components/OrderInfoWrapper";
import { transformRowsOrderedProductInfo } from "@/features/integrated-order-detail/models/transforms";
import {
  LIST_COLUMNS_PRODUCT,
  LIST_COLUMNS_PRODUCT_GROUPING,
} from "@/features/integrated-order-detail/modules/columns";

import { OrderDetailResponse } from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import { MUIDataGridOrderDetailTheme } from "@/shared/styles/theme";
import {
  convertToPrice,
  getCurrencyFromPayments,
} from "@/shared/utils/stringUtils";

export default function OrderedProductInfo() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  const rows = useMemo(() => transformRowsOrderedProductInfo(data), [data]);
  const currency = getCurrencyFromPayments(data?.payments);
  const total =
    data?.items.reduce(
      (acc, item) => acc + Number(item.subTotal ?? 0),
      Number(data?.shippingFee ?? 0),
    ) ?? 0;

  return (
    <OrderInfoWrapper title="Ordered Product Info">
      <ThemeProvider theme={MUIDataGridOrderDetailTheme}>
        <DataGrid
          rows={rows}
          columns={LIST_COLUMNS_PRODUCT as GridColDef[]}
          columnGroupingModel={LIST_COLUMNS_PRODUCT_GROUPING}
          pagination
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableColumnResize
          disableDensitySelector
          rowSpanning
          slots={{
            footer: () => (
              <>
                <div className="flex items-center justify-end border-t border-gray-200">
                  <div className="flex justify-end px-[10px] py-4 text-[16px] font-bold">
                    Total
                  </div>
                  <div className="flex justify-end px-[10px] py-4 pr-3 text-[16px] font-bold">
                    {convertToPrice(total, currency)}
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
