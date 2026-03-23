import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";

import ClaimInformation from "@/features/integrated-order-detail/components/ClaimInformation";
import DataGridClaim from "@/features/integrated-order-detail/components/DataGridClaim";
import PickupInformation, {
  PickupInformationRef,
} from "@/features/integrated-order-detail/components/PickupInformation";
import Summary from "@/features/integrated-order-detail/components/Summary";
// import TrackingInformation from "@/features/integrated-order-detail/components/TrackingInformation";
import usePostClaims from "@/features/integrated-order-detail/hooks/usePostClaims";
import useRecipientDefaultAddress from "@/features/integrated-order-detail/hooks/useRecipientDefaultAddress";
import {
  transformRowsClaimOrder,
  transformClaimCreateRequest,
} from "@/features/integrated-order-detail/models/transforms";
import {
  CLAIM_OPTIONS,
  MODAL_CONFIGS,
} from "@/features/integrated-order-detail/modules/constants";
import { RegisterClaimSchema } from "@/features/integrated-order-detail/modules/schema";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";
import { getClaimReasonList } from "@/features/integrated-order-detail/modules/utils";

import ModalBump from "@/shared/components/modal/ModalBump";
import ModalOrder from "@/shared/components/ModalOrder";
import {
  ClaimCreateRequest,
  ClaimCreateRequestTypeEnum,
} from "@/shared/generated/oms/types/Claim";
import {
  OrderDetailResponse,
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeRequestClaimTypeEnum,
  OrderEstimateRefundFeeRequestFaultEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";

const { RETURN, RETURN_FORCE_REFUND, EXCHANGE } =
  OrderEstimateRefundFeeRequestClaimTypeEnum;
const { CUSTOMER, OPERATION } = OrderEstimateRefundFeeRequestFaultEnum;
interface Props {
  open: boolean;
  setOpen: (open: string | null) => void;
}
export default function RegisterClaim({ open, setOpen }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  const claimReasonList = getClaimReasonList(data?.brand.name);
  const defaultClaimValues = {
    claimReason: "",
    claimReasonOthers: "",
    carrierCode: "",
    trackingNo: "",
  };

  const methodsRegisterClaim = useForm({
    defaultValues: defaultClaimValues,
    resolver: zodResolver(RegisterClaimSchema),
  });

  const { errors } = useFormState({ control: methodsRegisterClaim.control });
  const claimReason = methodsRegisterClaim.watch("claimReason");
  const claimReasonOthers = methodsRegisterClaim.watch("claimReasonOthers");
  const carrierCode = methodsRegisterClaim.watch("carrierCode");
  const trackingNo = methodsRegisterClaim.watch("trackingNo");

  const defaultAddressValues = useRecipientDefaultAddress();

  const [claimType, setClaimType] =
    useState<OrderEstimateRefundFeeRequestClaimTypeEnum>(RETURN);
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [summaryRequestData, setSummaryRequestData] =
    useState<OrderEstimateRefundFeeRequest>({
      claimType,
      reason: "",
      fault: CUSTOMER,
      items: [],
    });
  const [recipientInfo, setRecipientInfo] = useState<{
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  }>({
    pickupRecipient: defaultAddressValues,
    shipmentRecipient: defaultAddressValues,
  });
  const [isValid, setIsValid] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [openModalType, setOpenModalType] = useState<
    "force_refund" | "tracking_info" | null
  >(null);
  const pickupInformationRef = useRef<PickupInformationRef>(null);
  const reasonList =
    claimType === "EXCHANGE"
      ? claimReasonList.registerClaim.exchange
      : claimReasonList.registerClaim.return;
  const fault = reasonList.find((reason) => reason.value === claimReason)
    ?.isCustomerFault
    ? CUSTOMER
    : OPERATION;

  const [isPostClaimProcessing, setIsPostClaimProcessing] = useState(false);

  // 📍 api 호출 함수
  const { mutate, isPending } = usePostClaims({
    onSuccess: () => {
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orderDetail(orderId),
        });
        handleClose();
        setOpen(null);
        setOpenModalType(null);
      }, 1000);
    },
  });

  // 📍 api 호출 함수
  const handlePostRegisterClaim = () => {
    // 중복 실행 방지: isPending 또는 isPostClaimProcessing이 true면 return
    if (isPending || isPostClaimProcessing) return;

    // 처리 시작 플래그 설정
    setIsPostClaimProcessing(true);

    // 메인 폼 컨텍스트에서 클레임 사유 가져오기
    const reason = claimReason.toLowerCase().includes("others")
      ? `${claimReason}: ${claimReasonOthers}`
      : claimReason;

    // PickupInformation에서 최신 폼 값을 직접 가져오기
    const currentRecipientInfo =
      pickupInformationRef.current?.getRecipientInfo() || recipientInfo;

    const requestData = transformClaimCreateRequest({
      claimType: claimType as unknown as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      recipientInfo: currentRecipientInfo,
      selectedRows,
      carrierCode,
      trackingNo,
    });

    // console.log("🚀 requestData", requestData);
    mutate(requestData as ClaimCreateRequest, {
      onError: () => {
        // 에러인 경우에만 플래그 해제
        setIsPostClaimProcessing(false);
      },
    });
  };

  // 타입 변경시 모든 값 초기화
  useEffect(() => {
    methodsRegisterClaim.reset();
    setSelectedRows([]);
  }, [claimType, methodsRegisterClaim]);

  // 모달이 열리거나 데이터가 변경될 때 rows 계산
  useEffect(() => {
    if (open) {
      const initialRows = transformRowsClaimOrder(data);
      setRows(initialRows);
    }
  }, [data, open]);

  // 반환 예상 비용 데이터 설정
  useEffect(() => {
    setSummaryRequestData((prev) => ({
      ...prev,
      claimType,
      reason: claimReason,
      fault,
      items: selectedRows.map((row) => ({
        orderItemId: row.orderItemId,
        quantity: row.cellQuantity,
      })),
    }));
  }, [claimReason, selectedRows, methodsRegisterClaim, fault, claimType]);

  // 유효성 검사
  useEffect(() => {
    // 1) trackingNo 에러가 발생하면 즉시 invalid 처리
    if (errors?.trackingNo || errors?.claimReasonOthers) {
      setIsValid(false);
      return;
    }

    // 2) 기존 조건 검증
    if (claimReason !== "" && selectedRows.length !== 0 && isValidAddress) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [
    claimReason,
    claimReasonOthers,
    selectedRows,
    isValidAddress,
    errors?.trackingNo,
    errors?.claimReasonOthers,
  ]);

  const handleClose = () => {
    methodsRegisterClaim.reset();
    setClaimType(RETURN);
    setSelectedRows([]);
    setRecipientInfo({
      pickupRecipient: defaultAddressValues,
      shipmentRecipient: defaultAddressValues,
    });
    setIsValid(false);
  };

  // 📍 bump 모달 열기
  const handleOpenModalBump = () => {
    if (claimType === "RETURN_FORCE_REFUND") {
      setOpenModalType("force_refund");
    } else if (carrierCode && trackingNo) {
      setOpenModalType("tracking_info");
    } else {
      handlePostRegisterClaim();
    }
  };

  return (
    <FormProvider {...methodsRegisterClaim}>
      <Button
        color="primary"
        size="small"
        onClick={() => setOpen("REGISTER_CLAIM")}
      >
        Register Claim
      </Button>
      <ModalOrder
        open={open}
        setOpen={(open: boolean) => setOpen(open ? "REGISTER_CLAIM" : null)}
        dialogTitle="Register Claim"
        dialogConfirmLabel="Confirm"
        handlePost={handleOpenModalBump}
        handleClose={handleClose}
        buttonDisable={!isValid || isPending || isPostClaimProcessing}
        content={
          <div className="flex flex-col gap-[12px]">
            {/* claim type */}
            <div>
              <h2 className="mt-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
                Claim type
              </h2>

              <FormControl fullWidth>
                <RadioGroup
                  value={claimType}
                  onChange={(e) =>
                    setClaimType(
                      e.target
                        .value as OrderEstimateRefundFeeRequestClaimTypeEnum,
                    )
                  }
                  name="radio-buttons-group"
                  className="flex !flex-row gap-[16px]"
                >
                  {CLAIM_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-[8px]"
                    >
                      <FormControlLabel
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        className="!mr-0"
                      />
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            {/* claim information */}
            <ClaimInformation reasonList={reasonList} />

            {/* claim data grid */}
            <DataGridClaim
              title="Choose product for Claim"
              rows={rows}
              setRows={setRows}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />

            {/* pickup information */}
            {claimType !== RETURN_FORCE_REFUND && (
              <PickupInformation
                ref={pickupInformationRef}
                claimType={claimType}
                recipientInfo={recipientInfo}
                setRecipientInfo={setRecipientInfo}
                setIsValidAddress={setIsValidAddress}
              />
            )}

            {/* summary data */}
            {claimType !== EXCHANGE && (
              <Summary summaryRequestData={summaryRequestData} />
            )}

            {/* Tracking Information */}
            {/* phase2에서 진행할 예정 */}
            {/* {claimType !== RETURN_FORCE_REFUND && <TrackingInformation />} */}

            {/* bump modal */}
            {openModalType && (
              <ModalBump
                open={!!openModalType}
                setOpen={(isOpen) =>
                  setOpenModalType(isOpen ? openModalType : null)
                }
                handlePost={handlePostRegisterClaim}
                handleClose={() => setOpenModalType(null)}
                text={MODAL_CONFIGS[openModalType].text}
                dialogCloseLabel={MODAL_CONFIGS[openModalType].dialogCloseLabel}
                dialogConfirmLabel={
                  MODAL_CONFIGS[openModalType].dialogConfirmLabel
                }
                closeButtonClassNames={
                  MODAL_CONFIGS[openModalType].closeButtonClassNames
                }
                postButtonClassNames={
                  MODAL_CONFIGS[openModalType].postButtonClassNames
                }
                buttonDisable={isPending || isPostClaimProcessing}
              />
            )}
          </div>
        }
      />
    </FormProvider>
  );
}
