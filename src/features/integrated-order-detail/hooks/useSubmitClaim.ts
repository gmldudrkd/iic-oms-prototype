import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";

import { PickupAddressFormRef } from "@/features/integrated-order-detail/components/RegisterClaim/PickupAddressForm";
import { ShipmentAddressFormRef } from "@/features/integrated-order-detail/components/RegisterClaim/ShipmentAddressForm";
import usePostClaims from "@/features/integrated-order-detail/hooks/usePostClaims";
import { transformClaimCreateRequest } from "@/features/integrated-order-detail/models/transforms";
import {
  ClaimModalType,
  TAddressForm,
} from "@/features/integrated-order-detail/modules/types";

import {
  ClaimCreateRequest,
  ClaimCreateRequestTypeEnum,
} from "@/shared/generated/oms/types/Claim";
import {
  OrderEstimateRefundFeeRequestClaimTypeEnum,
  OrderEstimateRefundFeeRequestFaultEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";

interface UseSubmitClaimParams {
  claimType: OrderEstimateRefundFeeRequestClaimTypeEnum;
  claimReason: string;
  claimReasonOthers?: string;
  carrierCode?: string;
  trackingNo?: string;
  fault: OrderEstimateRefundFeeRequestFaultEnum;
  pickupOption: boolean;
  selectedRows: GridRowModel[];
  showPickupAddressForm: boolean;
  showShipmentAddressForm: boolean;
  recipientInfo: {
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  };
  pickupRef: React.RefObject<PickupAddressFormRef | null>;
  shipmentRef: React.RefObject<ShipmentAddressFormRef | null>;
  onCloseModal: () => void;
  modalType?: ClaimModalType;
}

export default function useSubmitClaim({
  claimType,
  claimReason,
  claimReasonOthers,
  carrierCode,
  trackingNo,
  fault,
  pickupOption,
  selectedRows,
  showPickupAddressForm,
  showShipmentAddressForm,
  recipientInfo,
  pickupRef,
  shipmentRef,
  onCloseModal,
  modalType = "DEFAULT",
}: UseSubmitClaimParams) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const [isPostClaimProcessing, setIsPostClaimProcessing] = useState(false);
  const [openModalType, setOpenModalType] = useState<"force_refund" | null>(
    null,
  );

  const { mutate, isPending } = usePostClaims({
    onSuccess: () => {
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orderDetail(orderId),
        });
        onCloseModal();
        setOpenModalType(null);
      }, 1000);
    },
  });

  const handlePostRegisterClaim = useCallback(() => {
    if (isPending || isPostClaimProcessing) return;

    setIsPostClaimProcessing(true);

    const reason = claimReason.toLowerCase().includes("others")
      ? `${claimReason}: ${claimReasonOthers}`
      : claimReason;

    const currentRecipientInfo = {
      ...(showPickupAddressForm && {
        pickupRecipient:
          pickupRef.current?.getValues() ?? recipientInfo.pickupRecipient,
      }),
      ...(showShipmentAddressForm && {
        shipmentRecipient:
          shipmentRef.current?.getValues() ?? recipientInfo.shipmentRecipient,
      }),
    };

    const requestData = transformClaimCreateRequest({
      claimType: claimType as unknown as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      recipientInfo: currentRecipientInfo,
      selectedRows,
      carrierCode,
      trackingNo,
      pickupOption,
      modalType,
    });

    console.log("🚀 requestData", requestData);
    mutate(requestData as ClaimCreateRequest, {
      onError: () => {
        setIsPostClaimProcessing(false);
      },
    });
  }, [
    isPending,
    isPostClaimProcessing,
    claimReason,
    claimReasonOthers,
    claimType,
    fault,
    selectedRows,
    carrierCode,
    trackingNo,
    pickupOption,
    showPickupAddressForm,
    showShipmentAddressForm,
    recipientInfo,
    pickupRef,
    shipmentRef,
    modalType,
    mutate,
  ]);

  const handleOpenModalBump = useCallback(() => {
    if (
      claimType ===
      ("RETURN_FORCE_REFUND" as OrderEstimateRefundFeeRequestClaimTypeEnum)
    ) {
      setOpenModalType("force_refund");
    } else {
      handlePostRegisterClaim();
    }
  }, [claimType, handlePostRegisterClaim]);

  return {
    isPending,
    isPostClaimProcessing,
    openModalType,
    setOpenModalType,
    handlePostRegisterClaim,
    handleOpenModalBump,
  };
}
