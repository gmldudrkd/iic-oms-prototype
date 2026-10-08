import { DataGridPro, GridRowModel } from "@mui/x-data-grid-pro";
import { useCallback, useMemo } from "react";

import { COLUMNS_SERIAL_PRINT } from "@/features/integrated-order-list/modules/columns";
import {
  SERIAL_PRINT_BLOCKED_ORDER_TYPE,
  SERIAL_PRINT_SHIPMENT_STATUS,
  SERIAL_PRINT_URL,
} from "@/features/integrated-order-list/modules/constants";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import ModalOrder from "@/shared/components/ModalOrder";

interface ModalSerialPrintProps {
  selectedRows: GridRowModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

// 출력여부 판정: 프린트 조건과 동일하게 [Picked, Packed, Shipped] 만 출력 가능
// 단, Type 이 RX 인 주문은 OMS 에서 시리얼 출력이 불가하므로 상태와 무관하게 출력 불가
const getPrintable = (status: string, isRxOrder: boolean) =>
  !isRxOrder && SERIAL_PRINT_SHIPMENT_STATUS.includes(status)
    ? "Printable"
    : "Not Printable";

// 선택된 주문을 Shipment 단위 행으로 평탄화 (주문:Shipment = 1:N)
const toShipmentRows = (orders: GridRowModel[]): GridRowModel[] =>
  orders.flatMap((order) => {
    const shipmentNos = Array.isArray(order.shipmentNo)
      ? (order.shipmentNo as string[])
      : [];
    const shipmentStatuses = Array.isArray(order.shipmentStatus)
      ? (order.shipmentStatus as string[])
      : [];
    const isRxOrder =
      String(order.orderType ?? "").toUpperCase() ===
      SERIAL_PRINT_BLOCKED_ORDER_TYPE;

    // Shipment 이 없는 주문도 한 줄로 노출 (출력 불가)
    if (shipmentStatuses.length === 0) {
      return [
        {
          id: `${order.orderId ?? order.orderNo}-no-shipment`,
          orderNo: order.orderNo,
          shipmentNo: "-",
          status: "-",
          printable: "Not Printable",
        },
      ];
    }

    return shipmentStatuses.map((status, index) => ({
      id: `${order.orderId ?? order.orderNo}-${index}`,
      orderNo: order.orderNo,
      shipmentNo: shipmentNos[index] ?? "-",
      status,
      printable: getPrintable(status, isRxOrder),
    }));
  });

// Serial Print 모달 (AC Card 출력용)
export function ModalSerialPrint({
  selectedRows,
  open,
  setOpen,
}: ModalSerialPrintProps) {
  const rows = useMemo(() => toShipmentRows(selectedRows), [selectedRows]);

  // 출력 가능한 Shipment 이 하나도 없으면(모두 Not Printable) Confirm 불가
  const hasPrintableRow = useMemo(
    () => rows.some((row) => row.printable === "Printable"),
    [rows],
  );

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
            columns={COLUMNS_SERIAL_PRINT}
            rows={rows}
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
      buttonDisable={!hasPrintableRow}
      handleClose={handleClose}
    />
  );
}
