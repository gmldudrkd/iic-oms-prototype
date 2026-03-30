import { Button, Tooltip } from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import DataGridCancelClaim from "@/features/integrated-order-detail/components/DataGridCancelClaim";
import ClaimInformation from "@/features/integrated-order-detail/components/RegisterClaim/ClaimInformation";
import Summary from "@/features/integrated-order-detail/components/Summary";
import usePatchShipmentCancel from "@/features/integrated-order-detail/hooks/usePatchShipmentCancel";
import { transformRowsCancelShipment } from "@/features/integrated-order-detail/models/transforms";
import { getClaimReasonList } from "@/features/integrated-order-detail/modules/utils";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import ModalOrder from "@/shared/components/ModalOrder";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
  OrderDetailShipmentResponseEventEnum,
} from "@/shared/generated/oms/types/Order";
import {
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeRequestClaimTypeEnum,
  OrderEstimateRefundFeeRequestFaultEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";

interface Props {
  open: boolean;
  setOpen: (open: string | null) => void;
  shipment?: OrderDetailShipmentResponse; // shipment - cancel order
}

const { CUSTOMER, OPERATION } = OrderEstimateRefundFeeRequestFaultEnum;

export default function CancelShipment({ open, setOpen, shipment }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  const [isCancelShipmentProcessing, setIsCancelShipmentProcessing] =
    useState(false);
  const { mutate, isPending } = usePatchShipmentCancel({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.orderDetail(orderId),
      });
      resetForm();
      setOpen(null);
    },
  });

  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationAlertOpen, setValidationAlertOpen] = useState(false);
  const [summaryRequestData, setSummaryRequestData] =
    useState<OrderEstimateRefundFeeRequest>({
      claimType: OrderEstimateRefundFeeRequestClaimTypeEnum.CANCEL,
      reason: "",
      fault: OrderEstimateRefundFeeRequestFaultEnum.CUSTOMER,
      items: [],
    });

  const claimReasonList = getClaimReasonList(data?.brand.name);
  const methodsCancelOrder = useForm({ defaultValues: { claimReason: "" } });
  const claimReason = methodsCancelOrder.watch("claimReason");
  const fault = claimReasonList.cancelOrder.find(
    (reason) => reason.value === claimReason,
  )?.isCustomerFault
    ? CUSTOMER
    : OPERATION;
  const currency = data?.payments?.[0]?.currency;

  // 모달이 열리거나 데이터가 변경될 때 rows 계산
  useEffect(() => {
    if (open) {
      const initialRows = transformRowsCancelShipment(shipment, currency);
      setRows(initialRows);
    }
  }, [open, shipment, currency]);

  useEffect(() => {
    setSummaryRequestData((prev) => ({
      ...prev,
      reason: claimReason,
      fault,
      items: selectedRows.map((row) => ({
        orderItemId: row.orderItemId,
        quantity: row.cellQuantity,
      })),
    }));
  }, [claimReason, selectedRows, fault]);

  const handleOpenConfirmDialog = () => {
    if (!summaryRequestData.items.length || !summaryRequestData.reason) {
      return setValidationAlertOpen(true);
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmCancellation = () => {
    if (!shipment) return;
    setIsCancelShipmentProcessing(true);

    const requestData = {
      shipmentId: shipment.id,
      data: { reason: claimReason },
    };

    mutate(requestData, {
      onError: () => {
        setIsCancelShipmentProcessing(false);
      },
    });

    setConfirmDialogOpen(false);
  };

  const resetForm = () => {
    methodsCancelOrder.reset();
    setSelectedRows([]);
    setRows(transformRowsCancelShipment(shipment, currency));
  };

  const isEventAccept =
    shipment?.event === OrderDetailShipmentResponseEventEnum.ACCEPT;

  return (
    <>
      <Tooltip
        title="Can be canceled only after the shipment request is approved."
        disableHoverListener={isEventAccept}
        slotProps={{
          tooltip: {
            sx: { maxWidth: "none", whiteSpace: "nowrap" },
          },
        }}
      >
        <span>
          <Button
            color="primary"
            size="small"
            onClick={() => setOpen("CANCEL_SHIPMENT")}
            disabled={
              shipment?.event ===
                OrderDetailShipmentResponseEventEnum.CANCEL_REQUEST ||
              !isEventAccept ||
              isCancelShipmentProcessing
            }
          >
            {shipment?.event ===
            OrderDetailShipmentResponseEventEnum.CANCEL_REQUEST
              ? "Cancel Requested"
              : "Cancel Shipment"}
          </Button>
        </span>
      </Tooltip>
      <ModalOrder
        open={open}
        setOpen={(open: boolean) => setOpen(open ? "CANCEL_SHIPMENT" : null)}
        dialogTitle="Cancel Shipment"
        dialogConfirmLabel={isPending ? "Canceling..." : "Cancel and Refund"}
        handlePost={handleOpenConfirmDialog}
        handleClose={resetForm}
        buttonDisable={false}
        content={
          <FormProvider {...methodsCancelOrder}>
            <div className="flex flex-col gap-[12px] pt-[16px]">
              {/* claim information */}
              <ClaimInformation
                isCancelOrder
                reasonList={claimReasonList.cancelOrder}
              />

              {/* claim data grid */}
              <DataGridCancelClaim
                claimType="CANCEL_SHIPMENT"
                rows={rows}
                setRows={setRows}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                isAllCancel={true}
              />

              {/* summary data */}
              <Summary summaryRequestData={summaryRequestData} />
            </div>
          </FormProvider>
        }
      />

      {/* 최종 확인 Dialog */}
      <AlertDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        dialogContent="This order is in “Picking Requested” status. Cancellation may be rejected, and the shipment will proceed if so. Refund will be processed once cancellation is completed. Continue?"
        dialogContentProps={{
          sx: {
            fontWeight: 500,
          },
        }}
        dialogCloseLabel="Back"
        dialogConfirmLabel="Confirm Cancellation"
        handlePost={handleConfirmCancellation}
        isButton={false}
        maxWidth="xs"
        closeButtonProps={{
          variant: "text",
          color: "primary",
        }}
        postButtonProps={{
          variant: "text",
          color: "error",
        }}
        postButtonClassNames="!font-bold"
      />

      <AlertDialog
        open={validationAlertOpen}
        setOpen={setValidationAlertOpen}
        dialogContent="Please select at least one product and enter a reason."
        dialogConfirmLabel="OK"
        handlePost={() => setValidationAlertOpen(false)}
        isButton={false}
        postButtonProps={{
          color: "primary",
        }}
      />
    </>
  );
}
