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

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

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
  // 주문에 베지키링(16000271)이 있으나 클레임에 포함되지 않은 경우 경고
  needsKeychainWarning?: boolean;
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
  needsKeychainWarning = false,
}: UseSubmitClaimParams) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const [isPostClaimProcessing, setIsPostClaimProcessing] = useState(false);
  const [openModalType, setOpenModalType] = useState<
    "force_refund" | "keychain" | null
  >(null);

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

    // 프로토타입 모드: 실제 API(mutation)가 no-op이라 onSuccess가 호출되지 않으므로
    // 여기서 직접 확정 처리(모달/Alert 닫기 + 상태 초기화)
    if (isPrototype) {
      onCloseModal();
      setOpenModalType(null);
      setIsPostClaimProcessing(false);
      return;
    }

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
    onCloseModal,
    mutate,
  ]);

  const isForceRefund =
    claimType ===
    ("RETURN_FORCE_REFUND" as OrderEstimateRefundFeeRequestClaimTypeEnum);

  const handleOpenModalBump = useCallback(() => {
    // 1) 베지키링 누락 경고 우선 노출 (모든 클레임 타입 대상)
    if (needsKeychainWarning) {
      setOpenModalType("keychain");
      return;
    }
    // 2) 강제 환불 확인
    if (isForceRefund) {
      setOpenModalType("force_refund");
      return;
    }
    handlePostRegisterClaim();
  }, [needsKeychainWarning, isForceRefund, handlePostRegisterClaim]);

  // bump 모달의 Confirm 처리: 키링 경고 확인 후 강제 환불이면 강제 환불 경고로 이어서 노출
  const handleBumpConfirm = useCallback(() => {
    if (openModalType === "keychain" && isForceRefund) {
      setOpenModalType("force_refund");
      return;
    }
    handlePostRegisterClaim();
  }, [openModalType, isForceRefund, handlePostRegisterClaim]);

  return {
    isPending,
    isPostClaimProcessing,
    openModalType,
    setOpenModalType,
    handlePostRegisterClaim,
    handleOpenModalBump,
    handleBumpConfirm,
  };
}
