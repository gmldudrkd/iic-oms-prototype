import Button from "@mui/material/Button";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { FormProvider } from "react-hook-form";

import ClaimInformation from "@/features/integrated-order-detail/components/RegisterClaim/ClaimInformation";
import ClaimType from "@/features/integrated-order-detail/components/RegisterClaim/ClaimType";
import DataGridClaim from "@/features/integrated-order-detail/components/RegisterClaim/DataGridClaim";
import { transformRowsClaimShipmentLost } from "@/features/integrated-order-detail/components/RegisterClaim/models/transforms";
import { LIST_COLUMNS_REGISTER_RESHIPMENT_LOST } from "@/features/integrated-order-detail/components/RegisterClaim/modules/columns";
import type { PickupAddressFormRef } from "@/features/integrated-order-detail/components/RegisterClaim/PickupAddressForm";
import type { ShipmentAddressFormRef } from "@/features/integrated-order-detail/components/RegisterClaim/ShipmentAddressForm";
import ShipmentAddressForm from "@/features/integrated-order-detail/components/RegisterClaim/ShipmentAddressForm";
import Summary from "@/features/integrated-order-detail/components/Summary";
import useRecipientDefaultAddress from "@/features/integrated-order-detail/hooks/useRecipientDefaultAddress";
import useRegisterClaimForm from "@/features/integrated-order-detail/hooks/useRegisterClaimForm";
import useSubmitClaim from "@/features/integrated-order-detail/hooks/useSubmitClaim";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

import ModalBump from "@/shared/components/modal/ModalBump";
import ModalOrder from "@/shared/components/ModalOrder";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeRequestClaimTypeEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";

const { RETURN_FORCE_REFUND } = OrderEstimateRefundFeeRequestClaimTypeEnum;

interface Props {
  open: boolean;
  setOpen: (open: string | null) => void;
  shipment: OrderDetailShipmentResponse;
}

export default function RegisterClaimLost({ open, setOpen, shipment }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  const defaultAddressValues = useRecipientDefaultAddress();

  // 폼 & 클레임 타입 로직
  const {
    methods,
    claimReason,
    claimReasonOthers,
    claimType,
    setClaimType,
    pickupOption,
    reasonList,
    fault,
    formValid,
    resetForm,
    showPickupAddressForm,
    showShipmentAddressForm,
  } = useRegisterClaimForm({
    brandName: data?.brand.name,
    modalType: "LOST",
  });

  // rows & summary
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grouped" | "separated">("grouped");
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [summaryRequestData, setSummaryRequestData] =
    useState<OrderEstimateRefundFeeRequest>({
      claimType,
      reason: "",
      fault,
      items: [],
    });

  // address validation
  const pickupRef = useRef<PickupAddressFormRef | null>(null);
  const shipmentRef = useRef<ShipmentAddressFormRef | null>(null);
  const [isShipmentValid, setIsShipmentValid] = useState(true);
  const [recipientInfo, setRecipientInfo] = useState<{
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  }>({
    pickupRecipient: defaultAddressValues,
    shipmentRecipient: defaultAddressValues,
  });

  const handleShipmentValidChange = useCallback(
    (isValid: boolean, values: TAddressForm) => {
      setIsShipmentValid(isValid);
      setRecipientInfo((prev) => ({ ...prev, shipmentRecipient: values }));
    },
    [],
  );

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    resetForm();
    setSelectedRows([]);
    setRecipientInfo({
      pickupRecipient: defaultAddressValues,
      shipmentRecipient: defaultAddressValues,
    });
    setOpen(null);
    setIsClaimFormOpen(false);
  }, [resetForm, defaultAddressValues, setOpen, setIsClaimFormOpen]);

  // 제출 로직
  const { isPending, isPostClaimProcessing, handlePostRegisterClaim } =
    useSubmitClaim({
      claimType,
      claimReason,
      claimReasonOthers,
      fault,
      pickupOption: true,
      selectedRows,
      showPickupAddressForm: false,
      showShipmentAddressForm: true,
      recipientInfo: {
        pickupRecipient: defaultAddressValues,
        shipmentRecipient: defaultAddressValues,
      },
      pickupRef,
      shipmentRef,
      onCloseModal: handleClose,
      modalType: "LOST",
    });

  // rows & selectedRows 초기화 (모달 열릴 때)
  useEffect(() => {
    if (!open || !shipment) return;

    // rows 초기화
    const initialRows = transformRowsClaimShipmentLost(shipment);
    setRows(initialRows);

    // selectedRows 초기화
    setSelectedRows(initialRows);

    console.log("initialRows", initialRows);
  }, [open, shipment]);

  // summary 데이터 갱신
  useEffect(() => {
    setSummaryRequestData((prev) => ({
      ...prev,
      claimType: RETURN_FORCE_REFUND,
      reason: claimReason,
      fault,
      items: selectedRows.map((row) => ({
        orderItemId: row.orderItemId,
        quantity: row.refundQty,
      })),
    }));
  }, [claimReason, selectedRows, fault, claimType]);

  // 최종 유효성
  const addressValid = showShipmentAddressForm ? isShipmentValid : true;

  const isConfirmDisabled =
    !formValid || !addressValid || isPending || isPostClaimProcessing;

  return (
    <FormProvider {...methods}>
      <Button color="primary" size="small" onClick={() => setOpen("LOST_BUMP")}>
        Lost
      </Button>
      <ModalBump
        open={open}
        setOpen={(modalOpen) => setOpen(modalOpen ? "LOST_BUMP" : null)}
        text={`Are you absolutely sure you want to set this shipment status to 'Lost'?
        This action is permanent and cannot be undone.

        If you confirm, the shipment status will be set to 'Lost', and the 'Register Claim' popup will open to continue the process.`}
        dialogCloseLabel="Cancel"
        dialogConfirmLabel="Confirm"
        handleClose={() => setOpen(null)}
        handlePost={() => {
          setOpen(null);
          setIsClaimFormOpen(true);
        }}
        closeButtonClassNames="!text-error"
      />
      <ModalOrder
        open={isClaimFormOpen}
        setOpen={(isClaimFormOpen) => {
          if (!isClaimFormOpen) handleClose();
        }}
        dialogTitle="Register Claim"
        dialogConfirmLabel="Confirm"
        handlePost={handlePostRegisterClaim}
        handleClose={handleClose}
        buttonDisable={isConfirmDisabled}
        content={
          <div className="flex flex-col gap-[12px]">
            <ClaimType
              claimType={claimType}
              setClaimType={setClaimType}
              disabledValues={
                [
                  "RETURN",
                  "EXCHANGE",
                ] as OrderEstimateRefundFeeRequestClaimTypeEnum[]
              }
            />

            <ClaimInformation
              key={`claim-information-${claimType}`}
              reasonList={reasonList}
              lockedValue="Lost"
            />

            <DataGridClaim
              claimType={claimType}
              viewMode={viewMode}
              setViewMode={setViewMode}
              rows={rows}
              setRows={setRows}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              columns={LIST_COLUMNS_REGISTER_RESHIPMENT_LOST}
              checkboxSelection={false}
              showViewModeTabs={false}
            />

            {showShipmentAddressForm && (
              <ShipmentAddressForm
                key={`shipment-${claimType}-${pickupOption}`}
                ref={shipmentRef}
                defaultValue={defaultAddressValues}
                onValidChange={handleShipmentValidChange}
                showPickup={showPickupAddressForm}
                pickupValues={recipientInfo.pickupRecipient}
              />
            )}

            {claimType === RETURN_FORCE_REFUND && (
              <Summary summaryRequestData={summaryRequestData} />
            )}
          </div>
        }
      />
    </FormProvider>
  );
}
