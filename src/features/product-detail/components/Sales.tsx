import { Switch } from "@mui/material";
import { GridColDef, DataGridPro, GridRowModel } from "@mui/x-data-grid-pro";
import { Controller, useFormContext } from "react-hook-form";

import { SALES_COLUMNS } from "@/features/product-detail/modules/columns";
import { PRODUCT_DETAIL_DATA_GRID_STYLES } from "@/features/product-detail/modules/styles";

import Title from "@/shared/components/text/Title";

interface SalesProps {
  rows: GridRowModel[];
  isLoading: boolean;
}

export default function Sales({ rows, isLoading }: SalesProps) {
  const { control } = useFormContext();

  const switchColumns: GridColDef[] = [
    {
      field: "availability",
      headerName: "Availability",
      flex: 1,
      renderCell: (params: { row: GridRowModel }) => {
        const { row } = params;

        return (
          <Controller
            control={control}
            name={`channel[${row.index}].isActive`}
            render={({ field }) => {
              const handleChange = (
                event: React.ChangeEvent<HTMLInputElement>,
              ) => {
                field.onChange(event.target.checked);
              };

              return <Switch checked={field.value} onChange={handleChange} />;
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="mx-[24px] mt-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Sales Availability by Channel" variant="bordered" />
      <div className="m-[16px]">
        <DataGridPro
          columns={[...switchColumns, ...SALES_COLUMNS] as GridColDef[]}
          rows={rows}
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
          sx={PRODUCT_DETAIL_DATA_GRID_STYLES}
        />
      </div>
    </div>
  );
}
