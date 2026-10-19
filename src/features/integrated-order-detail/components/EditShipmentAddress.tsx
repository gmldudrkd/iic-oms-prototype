import { Alert, Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import AddressForm from "@/features/integrated-order-detail/components/AddressForm";

import ModalOrder from "@/shared/components/ModalOrder";
import { AddressCountryTypeEnum } from "@/shared/generated/oms/types/common";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { formatLine1 } from "@/shared/utils/stringUtils";

interface Props {
  shipment: OrderDetailShipmentResponse;
}

/**
 * Shipment Info > Delivery Address 수정
 * - 노출: Shipment 상태 Picking Requested + KR 법인 (전 브랜드)
 * - 저장 시 수정된 주소 정보를 WMS(Maersk)로 전송
 */
export default function EditShipmentAddress({ shipment }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbarStore();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const defaultValues = useMemo(() => {
    const { recipient } = shipment;
    return {
      recipientFirstName: recipient.firstName ?? "",
      recipientLastName: recipient.lastName ?? "",
      phoneCountryNo: recipient.phoneCountryNo ?? "",
      recipientPhone: recipient.phone ?? "",
      address1: formatLine1(
        recipient.address.line1,
        recipient.address.state ?? "",
        recipient.address.city ?? "",
      ),
      address2: recipient.address.line2 ?? "",
      city: recipient.address.city ?? "",
      stateProvince: recipient.address.state ?? "",
      postcode: recipient.address.postalCode ?? "",
      countryRegion: recipient.address.countryType ?? "",
    };
  }, [shipment]);

  const methods = useForm({ defaultValues, mode: "all" });

  const handleOpen = () => {
    methods.reset(defaultValues);
    setIsOpenModal(true);
  };

  const handleSubmit = useCallback(() => {
    const {
      recipientFirstName,
      recipientLastName,
      recipientPhone,
      phoneCountryNo,
      address1,
      address2,
      city,
      stateProvince,
      postcode,
      countryRegion,
    } = methods.getValues();

    // Prototype: Shipment 수령인 주소를 캐시에 반영 (실제는 OMS → WMS(Maersk) 주소 변경 전송)
    queryClient.setQueryData<OrderDetailResponse>(
      queryKeys.orderDetail(orderId),
      (prev) =>
        prev && {
          ...prev,
          shipments: prev.shipments.map((s) =>
            s.shipmentNo !== shipment.shipmentNo
              ? s
              : {
                  ...s,
                  recipient: {
                    ...s.recipient,
                    fullName: recipientLastName + recipientFirstName,
                    firstName: recipientFirstName,
                    lastName: recipientLastName,
                    phone: recipientPhone,
                    phoneCountryNo: phoneCountryNo ?? "",
                    address: {
                      ...s.recipient.address,
                      countryType: countryRegion as AddressCountryTypeEnum,
                      postalCode: postcode,
                      state: stateProvince ?? "",
                      city: city ?? "",
                      line1: `${stateProvince} ${city} ${address1}`,
                      line2: address2 ?? "",
                    },
                  },
                },
          ),
        },
    );

    setIsOpenModal(false);
    openSnackbar({
      message: "Delivery address has been updated and sent to WMS (Maersk).",
      severity: "success",
    });
  }, [methods, queryClient, orderId, shipment.shipmentNo, openSnackbar]);

  return (
    <>
      <Button
        color="primary"
        size="small"
        className="!ml-auto"
        onClick={handleOpen}
      >
        Edit Address
      </Button>
      <ModalOrder
        open={isOpenModal}
        setOpen={setIsOpenModal}
        dialogTitle="Edit Address"
        dialogConfirmLabel="Save"
        handlePost={handleSubmit}
        handleClose={() => {
          setIsOpenModal(false);
          methods.reset(defaultValues);
        }}
        buttonDisable={!methods.formState.isValid}
        content={
          <div className="mb-[12px] mt-[24px] flex flex-col gap-[24px]">
            <Alert severity="info">
              The updated address will be sent to WMS (Maersk).
            </Alert>
            <FormProvider {...methods}>
              <AddressForm />
            </FormProvider>
          </div>
        }
      />
    </>
  );
}
