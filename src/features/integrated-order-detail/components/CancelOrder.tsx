import { Button } from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import DataGridCancelClaim from "@/features/integrated-order-detail/components/DataGridCancelClaim";
import ClaimInformation from "@/features/integrated-order-detail/components/RegisterClaim/ClaimInformation";
import Summary from "@/features/integrated-order-detail/components/Summary";
import usePostClaims from "@/features/integrated-order-detail/hooks/usePostClaims";
import {
  transformRowsCancelOrder,
  transformRowsCancelOrderShipment,
} from "@/features/integrated-order-detail/models/transforms";
import { mapFaultEnum } from "@/features/integrated-order-detail/models/types";
import { getClaimReasonList } from "@/features/integrated-order-detail/modules/utils";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import ModalOrder from "@/shared/components/ModalOrder";
import { ClaimCreateRequestTypeEnum } from "@/shared/generated/oms/types/Claim";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
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

export default function CancelOrder({ open, setOpen, shipment }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  const [isPostClaimProcessing, setIsPostClaimProcessing] = useState(false);

  const { mutate, isPending } = usePostClaims({
    onSuccess: () => {
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orderDetail(orderId),
        });
        resetForm();
        setOpen(null);
      }, 1000);
    },
  });

  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [validationAlertOpen, setValidationAlertOpen] = useState(false);
  const [summaryRequestData, setSummaryRequestData] =
    useState<OrderEstimateRefundFeeRequest>({
      claimType: OrderEstimateRefundFeeRequestClaimTypeEnum.CANCEL,
      reason: "",
      fault: CUSTOMER,
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

  // 모달이 열리거나 데이터가 변경될 때 rows 계산
  useEffect(() => {
    if (open) {
      if (shipment) {
        // shipment level - cancel order 데이터 변환
        const initialRows = transformRowsCancelOrderShipment(shipment, data);
        setRows(initialRows);

        const shipmentOrderItemIds = shipment.items.map(
          (item) => item.orderItemId,
        );

        // isActive === true 이고 shipment.items 에 포함된 row만 선택
        const validSelectedRows = initialRows.filter(
          (row) =>
            row.isActive &&
            shipmentOrderItemIds.includes(String(row.orderItemId)),
        );

        setSelectedRows(validSelectedRows);
      } else {
        // order level - cancel order 데이터 변환
        const initialRows = transformRowsCancelOrder(data);
        setRows(initialRows);
      }
    }
  }, [data, open, shipment]);

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

  const handlePost = () => {
    if (!summaryRequestData.items.length || !summaryRequestData.reason) {
      return setValidationAlertOpen(true);
    }

    // 중복 실행 방지: isPending 또는 isPostClaimProcessing이 true면 return
    if (isPending || isPostClaimProcessing) return;

    // 처리 시작 플래그 설정
    setIsPostClaimProcessing(true);

    const requestData = {
      fault: mapFaultEnum(fault),
      reason: claimReason,
      items: selectedRows.map((row) => ({
        orderItemId: row.orderItemId,
        quantity: row.cellQuantity,
      })),
      type: ClaimCreateRequestTypeEnum.CANCEL,
    };

    mutate(requestData, {
      onError: () => {
        // 에러인 경우에만 플래그 해제
        setIsPostClaimProcessing(false);
      },
    });
  };

  const resetForm = () => {
    methodsCancelOrder.reset();
    setSelectedRows([]);
    if (shipment) {
      setRows(transformRowsCancelOrderShipment(shipment, data));
    } else {
      setRows(transformRowsCancelOrder(data));
    }
  };

  return (
    <>
      <Button
        color="primary"
        size="small"
        onClick={() => setOpen("CANCEL_ORDER")}
        disabled={isPostClaimProcessing || isPending}
      >
        Cancel Order
      </Button>

      <ModalOrder
        open={open}
        setOpen={(open: boolean) => setOpen(open ? "CANCEL_ORDER" : null)}
        dialogTitle="Cancel Order"
        dialogConfirmLabel={isPending ? "Canceling..." : "Cancel Order"}
        handlePost={handlePost}
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
                claimType="CANCEL_ORDER"
                rows={rows}
                setRows={setRows}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />

              {/* summary data */}
              <Summary summaryRequestData={summaryRequestData} />
            </div>
          </FormProvider>
        }
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
