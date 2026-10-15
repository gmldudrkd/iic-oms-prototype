import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";

import { INTELLIGENT_EYEWEAR_RETURN_REASONS } from "@/features/integrated-order-detail/modules/constants";
import { RegisterClaimSchema } from "@/features/integrated-order-detail/modules/schema";
import { ClaimModalType } from "@/features/integrated-order-detail/modules/types";
import { getClaimReasonList } from "@/features/integrated-order-detail/modules/utils";

import {
  OrderEstimateRefundFeeRequestClaimTypeEnum,
  OrderEstimateRefundFeeRequestFaultEnum,
} from "@/shared/generated/oms/types/Order";

const { RETURN, EXCHANGE, RESHIPMENT, RETURN_FORCE_REFUND } =
  OrderEstimateRefundFeeRequestClaimTypeEnum;
const { CUSTOMER, OPERATION } = OrderEstimateRefundFeeRequestFaultEnum;

const defaultClaimValues = {
  claimReason: "",
  claimReasonOthers: "",
  carrierCode: "",
  trackingNo: "",
};

const CLAIM_MODAL_CONFIG: Record<
  ClaimModalType,
  {
    claimType: OrderEstimateRefundFeeRequestClaimTypeEnum;
    defaultClaimValues: typeof defaultClaimValues;
  }
> = {
  DEFAULT: { claimType: RETURN, defaultClaimValues },
  LOST: {
    claimType: RESHIPMENT,
    defaultClaimValues: { ...defaultClaimValues, claimReason: "Lost" },
  },
};

interface Props {
  brandName?: string;
  modalType?: ClaimModalType;
  /** INT 채널 등 픽업 요청이 불가한 경우 true (Pickup Option 기본값을 "Do Not Request Pickup"으로) */
  disablePickupRequest?: boolean;
  /** GM US / GM KR + INTELLIGENT EYEWEAR 제품 포함 주문이면 true (Return/Force Refund 사유를 전용 사유로 노출) */
  useIntelligentEyewearReasons?: boolean;
}

export default function useRegisterClaimForm({
  brandName,
  modalType = "DEFAULT",
  disablePickupRequest = false,
  useIntelligentEyewearReasons = false,
}: Props) {
  const claimReasonList = getClaimReasonList(brandName);

  const methods = useForm({
    defaultValues: CLAIM_MODAL_CONFIG[modalType].defaultClaimValues,
    resolver: zodResolver(RegisterClaimSchema),
  });

  const { errors } = useFormState({ control: methods.control });

  const claimReason = methods.watch("claimReason");
  const claimReasonOthers = methods.watch("claimReasonOthers");
  const carrierCode = methods.watch("carrierCode");
  const trackingNo = methods.watch("trackingNo");

  // claim type & pickup option
  const [claimType, setClaimType] =
    useState<OrderEstimateRefundFeeRequestClaimTypeEnum>(
      CLAIM_MODAL_CONFIG[modalType].claimType,
    );
  const [pickupOption, setPickupOption] =
    useState<boolean>(!disablePickupRequest);

  const isReturnClaim =
    claimType === RETURN || claimType === RETURN_FORCE_REFUND;

  const reasonList: {
    group?: string;
    label: string;
    value: string;
    isCustomerFault: boolean;
  }[] =
    claimType === "EXCHANGE"
      ? claimReasonList.registerClaim.exchange
      : useIntelligentEyewearReasons && isReturnClaim
        ? INTELLIGENT_EYEWEAR_RETURN_REASONS
        : claimReasonList.registerClaim.return;

  const fault = reasonList.find((reason) => reason.value === claimReason)
    ?.isCustomerFault
    ? CUSTOMER
    : OPERATION;

  // derived visibility flags
  const isReturn = claimType === RETURN;
  const isExchange = claimType === EXCHANGE;
  const isReshipment =
    claimType === OrderEstimateRefundFeeRequestClaimTypeEnum.RESHIPMENT;

  const showPickupOption = isReturn || isExchange;
  const showTrackingInfo = (isReturn || isExchange) && !pickupOption;
  const showPickupAddressForm =
    (isReturn && pickupOption) || (isExchange && pickupOption);
  const showShipmentAddressForm = isExchange || isReshipment;

  // 타입 변경 시 폼 & 옵션 초기화
  useEffect(() => {
    methods.reset();
    setPickupOption(!disablePickupRequest);
  }, [claimType, methods, disablePickupRequest]);

  // form validity
  const formValid =
    (showTrackingInfo ? !!carrierCode && !!trackingNo : true) &&
    !errors?.claimReasonOthers &&
    claimReason !== "";

  // reset
  const resetForm = () => {
    methods.reset();
    setClaimType(CLAIM_MODAL_CONFIG[modalType].claimType);
  };

  return {
    methods,
    errors,
    claimReason,
    claimReasonOthers,
    carrierCode,
    trackingNo,
    claimType,
    setClaimType,
    pickupOption,
    setPickupOption,
    reasonList,
    fault,
    formValid,
    resetForm,
    isReturn,
    isExchange,
    isReshipment,
    showPickupOption,
    showTrackingInfo,
    showPickupAddressForm,
    showShipmentAddressForm,
  };
}
