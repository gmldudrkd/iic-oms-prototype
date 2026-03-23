import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useEffect, useState } from "react";

import { PRICE_MASTER_COLUMNS } from "@/features/product-detail/modules/columns";
import { PRODUCT_DETAIL_DATA_GRID_STYLES } from "@/features/product-detail/modules/styles";

import Title from "@/shared/components/text/Title";

interface PriceMasterProps {
  data: { [key: string]: string | number }[];
  isLoading: boolean;
}

export default function PriceMaster({ data, isLoading }: PriceMasterProps) {
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    const price = data.reduce(
      (acc, curr) =>
        acc +
        (isNaN(Number(curr.unitPrice)) ? 0 : Number(curr.unitPrice)) *
          Number(curr.quantity),
      0,
    );
    setTotalSum(price);
  }, [data]);

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Price Master" variant="bordered" />
      <DataGridPro
        columns={PRICE_MASTER_COLUMNS as GridColDef[]}
        rows={data}
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableColumnSorting
        slots={{ footer: () => <CustomFooter totalSum={totalSum} /> }}
        loading={isLoading}
        slotProps={{
          loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
        }}
        sx={{
          ...PRODUCT_DETAIL_DATA_GRID_STYLES,
          ".MuiDataGrid-cell": { display: "flex", alignItems: "center" },
        }}
        getRowHeight={() => "auto"}
      />
    </div>
  );
}

function CustomFooter({ totalSum = 0 }: { totalSum: number | string }) {
  return (
    <div className="border-t border-outlined">
      <div className="grid h-[52px] grid-cols-7 items-center">
        <div className="col-span-5" />
        <div className="flex h-full items-center bg-[rgba(33,150,243,0.08)] px-[10px] font-bold">
          Total
        </div>
        <div className="px-[10px] text-right">
          {totalSum.toLocaleString()} (KRW)
        </div>
      </div>
    </div>
  );
}
