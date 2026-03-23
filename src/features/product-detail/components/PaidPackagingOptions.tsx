import Button from "@mui/material/Button";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid-pro";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { PAID_PACKAGING_OPTIONS_COLUMNS } from "@/features/product-detail/modules/columns";
import { PRODUCT_DETAIL_DATA_GRID_STYLES } from "@/features/product-detail/modules/styles";
import ModalItemBundler from "@/features/product-list/components/ModalItemBundler";

import Title from "@/shared/components/text/Title";

interface PaidPackagingOptionsProps {
  data: { [key: string]: string | number }[];
  isLoading: boolean;
  rows: GridRowModel[];
  setRows: Dispatch<SetStateAction<GridRowModel[]>>;
}

export default function PaidPackagingOptions({
  data,
  isLoading,
  rows,
  setRows,
}: PaidPackagingOptionsProps) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const newSelectedRows = data.map((row) => ({ ...row, selected: true }));
    setRows((prev) =>
      JSON.stringify(prev) === JSON.stringify(newSelectedRows)
        ? prev
        : newSelectedRows,
    );
  }, [data, setRows]);

  // 상품 삭제
  const handleDelete = useCallback(
    (sapCode: string) => {
      setRows((prev: GridRowModel[]) =>
        prev.filter((item) => item.sapCode !== sapCode),
      );
    },
    [setRows],
  );

  const COLUMNS = useMemo(() => {
    return PAID_PACKAGING_OPTIONS_COLUMNS.map((column) => {
      if (column.field === "delete") {
        return {
          ...column,
          renderCell: (params: GridRenderCellParams) => {
            return (
              <Button
                variant="text"
                color="error"
                onClick={() => handleDelete(params.row.sapCode)}
                sx={{ marginLeft: "-9px" }}
              >
                Delete
              </Button>
            );
          },
        };
      }
      return column;
    });
  }, [handleDelete]);

  // Packaging 생성
  const handleCreate = (selectedProducts: GridRowModel[]) => {
    const newSelectedRows = selectedProducts.map((product) => ({
      ...product,
      totalPrice: product.unitPrice * product.quantity,
    }));

    setRows(newSelectedRows);
    setOpenModal(false);
  };

  // modal create 버튼 활성화 조건
  const handleButtonDisabled = (selectedProducts: GridRowModel[]) => {
    return selectedProducts.length < 1;
  };

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Paid Packaging Options" variant="bordered">
        <div className="flex flex-1 items-center justify-end">
          <Button color="primary" onClick={() => setOpenModal(true)}>
            Add
          </Button>
          <ModalItemBundler
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedRows={rows}
            dialogTitle="Add Paid Packaging Options"
            handleCreate={handleCreate}
            handleButtonDisabled={handleButtonDisabled}
            isPendingCreate={false}
          />
        </div>
      </Title>

      <DataGridPro
        columns={COLUMNS as GridColDef[]}
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
        sx={{
          ...PRODUCT_DETAIL_DATA_GRID_STYLES,
          ".MuiDataGrid-cell": { display: "flex", alignItems: "center" },
        }}
        getRowHeight={() => "auto"}
      />
    </div>
  );
}
