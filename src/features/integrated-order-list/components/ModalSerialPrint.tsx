import { DataGridPro, GridColDef, GridRowModel } from "@mui/x-data-grid-pro";
import { useCallback } from "react";

import { SERIAL_PRINT_URL } from "@/features/integrated-order-list/modules/constants";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import ModalOrder from "@/shared/components/ModalOrder";

interface ModalSerialPrintProps {
  selectedRows: GridRowModel[];
  columns: GridColDef[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Serial Print 모달 (AC Card 출력용)
export function ModalSerialPrint({
  selectedRows,
  columns,
  open,
  setOpen,
}: ModalSerialPrintProps) {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleConfirm = useCallback(() => {
    window.open(
      SERIAL_PRINT_URL,
      "serialPrint",
      "width=900,height=1000,scrollbars=yes,resizable=yes",
    );
    handleClose();
  }, [handleClose]);

  return (
    <ModalOrder
      open={open}
      setOpen={setOpen}
      dialogTitle="Serial Print"
      content={
        <div>
          <h2 className="mt-[16px] flex h-[48px] items-center px-[16px] text-[14px] text-text-secondary">
            Selected Items
          </h2>

          <DataGridPro
            columns={columns}
            rows={selectedRows}
            disableColumnMenu
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableColumnSorting
            hideFooter
            sx={DATA_GRID_STYLES}
          />
        </div>
      }
      dialogConfirmLabel="Confirm"
      handlePost={handleConfirm}
      buttonDisable={false}
      handleClose={handleClose}
    />
  );
}
