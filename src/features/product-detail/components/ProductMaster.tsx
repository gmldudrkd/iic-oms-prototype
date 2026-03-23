import { DataGridPro } from "@mui/x-data-grid-pro";
import { GridColDef } from "@mui/x-data-grid-pro";

import { PRODUCT_MASTER_COLUMNS } from "@/features/product-detail/modules/columns";
import { PRODUCT_DETAIL_DATA_GRID_STYLES } from "@/features/product-detail/modules/styles";

import Title from "@/shared/components/text/Title";

interface Props {
  data: {
    id: string;
    skuCode: string;
    sapCode: string;
    quantity: number;
    sapName: string;
    category: string;
    modelCode: string;
    modelName: string;
  }[];
  isLoading: boolean;
}

export default function ProductMaster({ data, isLoading }: Props) {
  return (
    <div className="mx-[24px] mt-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Product Master" variant="bordered" />

      <DataGridPro
        columns={PRODUCT_MASTER_COLUMNS as GridColDef[]}
        rows={data}
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableColumnSorting
        hideFooter
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
