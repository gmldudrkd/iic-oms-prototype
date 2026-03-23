import { FormControlLabel } from "@mui/material";
import { Checkbox } from "@mui/material";
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import AddressForm from "@/features/integrated-order-detail/components/AddressForm";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

import { ClaimCreateRequestTypeEnum } from "@/shared/generated/oms/types/Claim";

const { EXCHANGE } = ClaimCreateRequestTypeEnum;

interface Props {
  claimType: string;
  recipientInfo: {
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  };
  setRecipientInfo: React.Dispatch<
    React.SetStateAction<{
      pickupRecipient: TAddressForm;
      shipmentRecipient: TAddressForm;
    }>
  >;
  setIsValidAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PickupInformationRef {
  getRecipientInfo: () => {
    pickupRecipient: TAddressForm;
    shipmentRecipient: TAddressForm;
  };
}

const PickupInformation = forwardRef<PickupInformationRef, Props>(
  ({ claimType, recipientInfo, setRecipientInfo, setIsValidAddress }, ref) => {
    const isExchange = claimType === EXCHANGE;
    const { pickupRecipient, shipmentRecipient } = recipientInfo;
    const shipmentMethods = useForm({ defaultValues: shipmentRecipient });
    const pickupMethods = useForm({ defaultValues: pickupRecipient });

    const [useSameAddress, setUseSameAddress] = useState(true);

    // claimType 변경 시 useForm 초기화
    useEffect(() => {
      pickupMethods.reset(pickupRecipient);
      shipmentMethods.reset(shipmentRecipient);
    }, [claimType]); // eslint-disable-line react-hooks/exhaustive-deps

    // Pickup information의 값 감시 (동기화용)
    const watchedPickupValues = useWatch({
      control: pickupMethods.control,
    }) as TAddressForm;

    // 이전 상태 저장을 위한 ref
    const prevPickupValidRef = useRef<boolean | undefined>(undefined);
    const prevShipmentValidRef = useRef<boolean | undefined>(undefined);
    const prevShipmentValuesRef = useRef<string>("");
    const prevUseSameAddressRef = useRef<boolean>(useSameAddress);

    // 초기 validation 트리거
    useEffect(() => {
      pickupMethods.trigger().catch(console.error);
      shipmentMethods.trigger().catch(console.error);
    }, [pickupMethods, shipmentMethods]);

    // 부모 컴포넌트에서 폼 값을 가져올 수 있도록 ref 노출
    useImperativeHandle(ref, () => ({
      getRecipientInfo: () => ({
        pickupRecipient: pickupMethods.getValues() as TAddressForm,
        shipmentRecipient: shipmentMethods.getValues() as TAddressForm,
      }),
    }));

    // 동기화 및 유효성 검사 통합 처리
    useEffect(() => {
      // 1. 동기화 처리: useSameAddress가 true일 때 Pickup information 값을 Delivery information에 동기화
      if (isExchange && useSameAddress) {
        const shipmentValuesString = JSON.stringify(watchedPickupValues);
        const useSameAddressChanged =
          prevUseSameAddressRef.current !== useSameAddress;

        // useSameAddress가 변경되었거나 값이 변경된 경우 동기화
        if (
          useSameAddressChanged ||
          shipmentValuesString !== prevShipmentValuesRef.current
        ) {
          prevShipmentValuesRef.current = shipmentValuesString;
          prevUseSameAddressRef.current = useSameAddress;
          shipmentMethods.reset(watchedPickupValues);
        }
      } else {
        prevUseSameAddressRef.current = useSameAddress;
      }

      // 2. 유효성 검사 및 상태 업데이트: pickupRecipient
      const { isValid: pickupIsValid } = pickupMethods.formState;
      if (prevPickupValidRef.current !== pickupIsValid) {
        prevPickupValidRef.current = pickupIsValid;
        if (pickupIsValid) {
          const pickupValues = pickupMethods.getValues() as TAddressForm;
          setRecipientInfo((prev) => ({
            ...prev,
            pickupRecipient: pickupValues,
          }));
          setIsValidAddress(true);
        } else {
          setIsValidAddress(false);
        }
      }

      // 3. 유효성 검사 및 상태 업데이트: shipmentRecipient
      const { isValid: shipmentIsValid } = shipmentMethods.formState;
      if (prevShipmentValidRef.current !== shipmentIsValid) {
        prevShipmentValidRef.current = shipmentIsValid;
        if (shipmentIsValid) {
          const shipmentValues = shipmentMethods.getValues() as TAddressForm;
          setRecipientInfo((prev) => ({
            ...prev,
            shipmentRecipient: shipmentValues,
          }));
          setIsValidAddress(true);
        } else {
          setIsValidAddress(false);
        }
      }
    }, [
      watchedPickupValues,
      useSameAddress,
      isExchange,
      pickupMethods.formState.isValid,
      shipmentMethods.formState.isValid,
      pickupMethods,
      shipmentMethods,
      setRecipientInfo,
      setIsValidAddress,
    ]);

    return (
      <div>
        <FormProvider {...pickupMethods}>
          <AddressForm title="Pickup information" />
        </FormProvider>

        {isExchange && (
          <FormProvider {...shipmentMethods}>
            <AddressForm
              title="Delivery information"
              disabled={useSameAddress}
              syncButton={
                // 동기화 체크박스 버튼
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useSameAddress}
                      onChange={() => setUseSameAddress(!useSameAddress)}
                    />
                  }
                  label="Use same pickup information"
                  className="my-2 !mr-0"
                />
              }
            />
          </FormProvider>
        )}
      </div>
    );
  },
);

PickupInformation.displayName = "PickupInformation";

export default PickupInformation;
