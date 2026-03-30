import { FormControl } from "@mui/material";
import { DataGridPro, GridRowModel } from "@mui/x-data-grid-pro";
import { GridColDef } from "@mui/x-data-grid-pro";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { getClaimReasonList } from "@/features/integrated-order-detail/modules/utils";
import usePostBulkCancel from "@/features/integrated-order-list/hooks/usePostBulkCancel";
import { OrderGroup } from "@/features/integrated-order-list/models/types";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import CustomSelect from "@/shared/components/form-elements/CustomSelect";
import ModalOrder from "@/shared/components/ModalOrder";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

interface ModalBulkCancelProps {
  group: OrderGroup;
  selectedRows: GridRowModel[];
  columns: GridColDef[];
  openBulkCancel: boolean;
  setOpenBulkCancel: (open: boolean) => void;
  bulkCancelTitle: string;
  bulkCancelConfirmLabel: string;
  isButtonDisableCancelModal: boolean;
  refetchList: () => void;
  refetchDashboard?: () => void;
}

// 모달 컴포넌트
export function ModalBulkCancel({
  group,
  selectedRows,
  columns,
  openBulkCancel,
  setOpenBulkCancel,
  bulkCancelTitle,
  bulkCancelConfirmLabel,
  isButtonDisableCancelModal,
  refetchList,
  refetchDashboard,
}: ModalBulkCancelProps) {
  const { openSnackbar } = useSnackbarStore();
  const { control, reset, getValues } = useFormContext();

  // 취소 API 훅 사용
  const { mutate: mutateBulkCancel } = usePostBulkCancel({
    onSuccess: () => {
      handleCloseBulkCancelModal();
      refetchList();
      if (refetchDashboard) {
        refetchDashboard();
      }
    },
    onError: (error) => {
      const message =
        (error as ApiError)?.errorMessage || "Failed to bulk cancel";
      openSnackbar({
        message: message || "Failed to bulk cancel",
        severity: "error",
      });
    },
  });

  const CustomSelectComponent = ({
    field,
  }: {
    field: ControllerRenderProps;
  }) => {
    const claimReasonList =
      selectedRows.length > 0
        ? getClaimReasonList(selectedRows[0].brand).cancelOrder
        : [];

    return (
      <CustomSelect
        {...field}
        control={control}
        selectList={claimReasonList}
        placeholder={"Select cancelation reason"}
      />
    );
  };

  const showReasonField = bulkCancelTitle === "Order Cancelation";

  // 취소 모달 닫기 핸들러
  const handleCloseBulkCancelModal = useCallback(() => {
    reset({ cancelationReason: "" });
    setOpenBulkCancel(false);
  }, [reset, setOpenBulkCancel]);

  return (
    <ModalOrder
      open={openBulkCancel}
      setOpen={setOpenBulkCancel}
      dialogTitle={bulkCancelTitle}
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
          {showReasonField && (
            <>
              <h2 className="mt-[16px] flex h-[48px] items-center px-[16px] text-[14px] text-text-secondary">
                Cancelation reason <span className="text-error">*</span>
              </h2>

              <FormControl size="small" fullWidth>
                <Controller
                  control={control}
                  name="cancelationReason"
                  render={CustomSelectComponent}
                />
              </FormControl>
            </>
          )}
        </div>
      }
      dialogConfirmLabel={bulkCancelConfirmLabel}
      handlePost={() =>
        mutateBulkCancel({
          group: group as "order" | "return" | "exchange",
          ids: selectedRows.map((row) => row.id as string),
          reason: group === "order" ? getValues().cancelationReason : undefined,
        })
      }
      buttonDisable={isButtonDisableCancelModal}
      handleClose={handleCloseBulkCancelModal}
    />
  );
}
