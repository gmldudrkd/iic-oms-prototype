import { Button } from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { FormProvider } from "react-hook-form";

import ClaimInformation from "@/features/integrated-order-detail/components/RegisterClaim/ClaimInformation";
import ClaimType from "@/features/integrated-order-detail/components/RegisterClaim/ClaimType";
import DataGridClaim from "@/features/integrated-order-detail/components/RegisterClaim/DataGridClaim";
import {
  transformRowsClaimOrder,
  transformRowsClaimOrderSeparated,
} from "@/features/integrated-order-detail/components/RegisterClaim/models/transforms";
import PickupAddressForm, {
  PickupAddressFormRef,
} from "@/features/integrated-order-detail/components/RegisterClaim/PickupAddressForm";
import PickupOption from "@/features/integrated-order-detail/components/RegisterClaim/PickupOption";
import ShipmentAddressForm, {
  ShipmentAddressFormRef,
} from "@/features/integrated-order-detail/components/RegisterClaim/ShipmentAddressForm";
import Summary from "@/features/integrated-order-detail/components/Summary";
import TrackingInformation from "@/features/integrated-order-detail/components/TrackingInformation";
import useRecipientDefaultAddress from "@/features/integrated-order-detail/hooks/useRecipientDefaultAddress";
import useRegisterClaimForm from "@/features/integrated-order-detail/hooks/useRegisterClaimForm";
import useSubmitClaim from "@/features/integrated-order-detail/hooks/useSubmitClaim";
import { MODAL_CONFIGS } from "@/features/integrated-order-detail/modules/constants";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

import ModalBump from "@/shared/components/modal/ModalBump";
import ModalOrder from "@/shared/components/ModalOrder";
import {
  OrderDetailResponse,
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeRequestClaimTypeEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";

const { EXCHANGE, RESHIPMENT } = OrderEstimateRefundFeeRequestClaimTypeEnum;
type ClaimViewMode = "grouped" | "separated";

// 베지키링 자재 식별 (SAP Code 16000271 / SKU S16000271)
const KEYCHAIN_MATERIAL_CODE = "16000271";
const KEYCHAIN_SKU = "S16000271";
const isKeychainMaterial = (productCode?: string, sku?: string) =>
  productCode === KEYCHAIN_MATERIAL_CODE || sku === KEYCHAIN_SKU;

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

  const defaultAddressValues = useRecipientDefaultAddress();

  // 폼 & 클레임 타입 로직
  const {
    methods,
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
    resetForm,
    showPickupOption,
    showTrackingInfo,
    showPickupAddressForm,
    showShipmentAddressForm,
  } = useRegisterClaimForm({
    brandName: data?.brand.name,
  });

  // rows & summary
  // Reshipment은 번들을 싱글 단위로 분리(separated)해 노출 (그룹/분리 탭 없이 고정)
  const [viewMode, setViewMode] = useState<ClaimViewMode>("separated");
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [summaryRequestData, setSummaryRequestData] =
    useState<OrderEstimateRefundFeeRequest>({
      claimType,
      reason: "",
      fault,
      items: [],
    });

  // address forms (값은 제출 시 ref/recipientInfo로 수집)
  const pickupRef = useRef<PickupAddressFormRef>(null);
  const shipmentRef = useRef<ShipmentAddressFormRef>(null);
  const [recipientInfo, setRecipientInfo] = useState<{
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  }>({
    pickupRecipient: defaultAddressValues,
    shipmentRecipient: defaultAddressValues,
  });

  const handlePickupValidChange = useCallback(
    (_isValid: boolean, values: TAddressForm) => {
      setRecipientInfo((prev) => ({ ...prev, pickupRecipient: values }));
    },
    [],
  );

  const handleShipmentValidChange = useCallback(
    (_isValid: boolean, values: TAddressForm) => {
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
  }, [resetForm, defaultAddressValues]);

  // 주문에 베지키링(16000271)이 포함되어 있는지
  const orderHasKeychain = (data?.items ?? []).some(
    (item) =>
      isKeychainMaterial(item.productCode, item.sku) ||
      (item.products ?? []).some((p) =>
        isKeychainMaterial(p.productCode, p.sku),
      ) ||
      (item.components ?? []).some((c) =>
        isKeychainMaterial(c.productCode, c.sku),
      ),
  );
  // 클레임에 키링이 1개 이상 포함되었는지 (1개라도 선택되면 경고 미노출)
  const keychainIncludedInClaim = selectedRows.some((row) =>
    isKeychainMaterial(row.sapCode as string, row.skuCode as string),
  );
  // 주문에 키링이 있으나 클레임에 미포함 시 경고
  const needsKeychainWarning = orderHasKeychain && !keychainIncludedInClaim;

  // 제출 로직
  const {
    isPending,
    isPostClaimProcessing,
    openModalType,
    setOpenModalType,
    handleOpenModalBump,
    handleBumpConfirm,
  } = useSubmitClaim({
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
    needsKeychainWarning,
    onCloseModal: () => {
      handleClose();
      setOpen(null);
    },
  });

  // rows 데이터 갱신 (모달 열릴 때, claimType 변경될 때, data 변경될 때)
  // 타입 변경 시 selectedRows도 함께 초기화하여 에러 방지
  useEffect(() => {
    if (!open || !data) return;

    // selectedRows를 먼저 초기화하여 이전 rows 구조 참조 에러 방지
    setSelectedRows([]);

    // 그 다음 rows 업데이트
    // Reshipment/Exchange는 SKU Code 단위로 분리(separated)해 노출
    if (claimType === RESHIPMENT || claimType === EXCHANGE) {
      if (viewMode === "grouped") {
        const initialRows = transformRowsClaimOrder(data);
        setRows(initialRows);
      } else {
        const initialRows = transformRowsClaimOrderSeparated(data);
        setRows(initialRows);
      }
    } else {
      const initialRows = transformRowsClaimOrder(data);
      setRows(initialRows);
    }
  }, [open, data, claimType, viewMode]);

  // summary 데이터 갱신
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
  }, [claimReason, selectedRows, fault, claimType]);

  // 제품이 하나라도 선택되면 Confirm 활성화
  const isConfirmDisabled =
    selectedRows.length === 0 || isPending || isPostClaimProcessing;

  return (
    <FormProvider {...methods}>
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
        buttonDisable={isConfirmDisabled}
        content={
          <div className="flex flex-col gap-[12px]">
            <ClaimType claimType={claimType} setClaimType={setClaimType} />
            {showPickupOption && (
              <PickupOption
                pickupOption={pickupOption}
                setPickupOption={setPickupOption}
              />
            )}
            {showTrackingInfo && <TrackingInformation />}
            <ClaimInformation
              key={`claim-information-${claimType}-${pickupOption}`}
              reasonList={reasonList}
            />

            <DataGridClaim
              claimType={claimType}
              viewMode={viewMode}
              setViewMode={setViewMode}
              rows={rows}
              setRows={setRows}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              showViewModeTabs={false}
            />

            {showPickupAddressForm && (
              <PickupAddressForm
                key={`pickup-${claimType}-${pickupOption}`}
                ref={pickupRef}
                defaultValue={defaultAddressValues}
                onValidChange={handlePickupValidChange}
              />
            )}
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

            {claimType !== EXCHANGE && claimType !== RESHIPMENT && (
              <Summary summaryRequestData={summaryRequestData} />
            )}

            {openModalType && (
              <ModalBump
                open={!!openModalType}
                setOpen={(isOpen) =>
                  setOpenModalType(isOpen ? openModalType : null)
                }
                handlePost={handleBumpConfirm}
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
