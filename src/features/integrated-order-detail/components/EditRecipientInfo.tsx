import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import AddressForm from "@/features/integrated-order-detail/components/AddressForm";
import usePatchOrderRecipient from "@/features/integrated-order-detail/hooks/usePatchOrderRecipient";
import usePatchReturnRecipient from "@/features/integrated-order-detail/hooks/usePatchReturnRecipient";
import useRecipientDefaultAddress from "@/features/integrated-order-detail/hooks/useRecipientDefaultAddress";

import ModalOrder from "@/shared/components/ModalOrder";
import { AddressCountryTypeEnum } from "@/shared/generated/oms/types/common";
import { OrderRecipientUpdateRequest } from "@/shared/generated/oms/types/Order";
import {
  ReturnDetailResponse,
  ReturnRecipientUpdateRequest,
} from "@/shared/generated/oms/types/Return";
import { queryKeys } from "@/shared/queryKeys";

interface Props {
  returnData?: ReturnDetailResponse;
  returnId?: string;
  disabled?: boolean;
}

export default function EditRecipientInfo({
  returnData,
  returnId,
  disabled = false,
}: Props = {}) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const defaultValues = useRecipientDefaultAddress(returnData);
  const methods = useForm({ defaultValues, mode: "all" });

  const isReturnCase = returnData !== undefined;

  const { mutate: mutateOrder } = usePatchOrderRecipient({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.orderDetail(orderId),
      });
      setIsOpenModal(false);
    },
  });

  const { mutate: mutateReturn } = usePatchReturnRecipient({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.returnDetail(orderId),
      });
      setIsOpenModal(false);
    },
  });

  const [isOpenModal, setIsOpenModal] = useState(false);

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

    const requestData = {
      recipient: {
        fullName: recipientLastName + recipientFirstName,
        firstName: recipientFirstName,
        lastName: recipientLastName,
        phone: recipientPhone,
        phoneCountryNo: phoneCountryNo ?? "",
        address: {
          countryType: countryRegion as AddressCountryTypeEnum,
          postalCode: postcode,
          state: isReturnCase ? stateProvince : (stateProvince ?? ""),
          city: isReturnCase ? city : (city ?? ""),
          line1: `${stateProvince} ${city} ${address1}`,
          line2: isReturnCase ? address2 : (address2 ?? ""),
        },
      },
    };

    if (isReturnCase) {
      mutateReturn({
        returnId: returnId!,
        data: requestData as ReturnRecipientUpdateRequest,
      });
    } else {
      mutateOrder({
        orderId,
        data: requestData as OrderRecipientUpdateRequest,
      });
    }
  }, [methods, mutateOrder, mutateReturn, orderId, isReturnCase, returnId]);

  return (
    <>
      <Button
        color="primary"
        size="small"
        className="!ml-auto"
        onClick={() => setIsOpenModal(true)}
        disabled={disabled}
      >
        Edit Recipient Info
      </Button>
      <ModalOrder
        open={isOpenModal}
        setOpen={setIsOpenModal}
        dialogTitle="Edit Recipient Info"
        dialogConfirmLabel="Save"
        handlePost={handleSubmit}
        handleClose={() => {
          setIsOpenModal(false);
          methods.reset(defaultValues);
        }}
        buttonDisable={!methods.formState.isValid}
        content={
          <div className="mb-[12px] mt-[32px]">
            <FormProvider {...methods}>
              <AddressForm />
            </FormProvider>
          </div>
        }
      />
    </>
  );
}
