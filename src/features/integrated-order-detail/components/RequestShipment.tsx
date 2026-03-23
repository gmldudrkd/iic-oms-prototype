import { Button, MenuItem, Select } from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import usePatchPartialShipment from "@/features/integrated-order-detail/hooks/usePatchPartialShipment";
import { LIST_COLUMNS_REQUEST_PARTIAL_SHIPMENT } from "@/features/integrated-order-detail/modules/columns";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import ModalOrder from "@/shared/components/ModalOrder";
import { OrderPartialShipmentItemRequest } from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

interface Props {
  open: boolean;
  setOpen: (open: string | null) => void;
  rows: GridRowModel[];
  buttonLabel?: string;
}
export default function RequestShipment({
  open,
  setOpen,
  rows,
  buttonLabel = "Request Partial Shipment",
}: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbarStore();

  const [
    isPatchPartialShipmentProcessing,
    setIsPatchPartialShipmentProcessing,
  ] = useState(false);

  const { mutate, isPending } = usePatchPartialShipment({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.orderDetail(orderId),
      });
      setOpen(null);
    },
  });

  // react-hook-form
  const { control, getValues, reset } = useForm({
    defaultValues: { rows: rows.map(({ id, toShip }) => ({ id, toShip })) },
  });

  // rows가 변경될 때마다 폼을 업데이트
  useEffect(() => {
    reset({ rows: rows.map(({ id, toShip }) => ({ id, toShip })) });
  }, [rows, reset]);

  // 기존 컬럼에서 toShip renderCell 추가
  const columns = useMemo(() => {
    return LIST_COLUMNS_REQUEST_PARTIAL_SHIPMENT.map((col) =>
      col.field === "toShip"
        ? {
            ...col,
            renderCell: (params: GridRenderCellParams) => {
              const { id } = params.row;
              const index = rows.findIndex((r) => r.id === id);

              return (
                <Controller
                  control={control}
                  name={`rows.${index}.toShip`}
                  render={({ field }) => {
                    const maxShippable = params.row.shippable;
                    const safeValue = Math.min(field.value || 0, maxShippable);

                    return (
                      <Select
                        {...field}
                        size="small"
                        fullWidth
                        value={safeValue}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={maxShippable === 0}
                      >
                        {Array.from({ length: maxShippable + 1 }, (_, i) => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                      </Select>
                    );
                  }}
                />
              );
            },
          }
        : col,
    );
  }, [control, rows]);

  const handlePost = () => {
    // 중복 실행 방지: isPending 또는 isPatchPartialShipmentProcessing이 true면 return
    if (isPatchPartialShipmentProcessing || isPending) return;

    // 처리 시작 플래그 설정
    setIsPatchPartialShipmentProcessing(true);

    const items: OrderPartialShipmentItemRequest[] = getValues("rows").map(
      (row: { id: string; toShip: number }) => ({
        orderItemId: row.id,
        quantity: row.toShip,
      }),
    );

    const requestData = {
      items: items.filter((item) => item.quantity > 0),
    };

    if (requestData.items.length === 0) {
      openSnackbar({
        message: "Qty must be bigger than 0",
        severity: "error",
      });
      return;
    }

    // console.log(requestData);
    mutate(
      { orderId, data: requestData },
      {
        onError: () => {
          // 에러인 경우에만 플래그 해제
          setIsPatchPartialShipmentProcessing(false);
        },
      },
    );
  };

  const handleClose = () => {
    reset();
  };

  return (
    <>
      <Button
        color="primary"
        size="small"
        onClick={() => setOpen("REQUEST_PARTIAL_SHIPMENT")}
        disabled={isPatchPartialShipmentProcessing || isPending}
      >
        {buttonLabel}
      </Button>
      <ModalOrder
        open={open}
        setOpen={(open: boolean) =>
          setOpen(open ? "REQUEST_PARTIAL_SHIPMENT" : null)
        }
        dialogTitle="Request Shipment"
        dialogConfirmLabel="Request Shipment"
        handlePost={handlePost}
        handleClose={handleClose}
        buttonDisable={false}
        content={
          <div className="pt-[16px]">
            <DataGridPro
              columns={columns as GridColDef[]}
              rows={rows}
              disableColumnMenu
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnSelector
              disableColumnSorting
              hideFooter
              getRowHeight={() => "auto"}
              sx={DATA_GRID_STYLES}
            />
          </div>
        }
      />
    </>
  );
}
