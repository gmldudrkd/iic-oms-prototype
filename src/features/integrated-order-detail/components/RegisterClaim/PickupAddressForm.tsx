import { useEffect, forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";

import AddressForm from "@/features/integrated-order-detail/components/AddressForm";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

export interface PickupAddressFormRef {
  getValues: () => TAddressForm;
  isValid: () => boolean;
}

interface Props {
  defaultValue: TAddressForm;
  onValidChange: (isValid: boolean, values: TAddressForm) => void;
}

const PickupAddressForm = forwardRef<PickupAddressFormRef, Props>(
  ({ defaultValue, onValidChange }, ref) => {
    const methods = useForm<TAddressForm>({
      defaultValues: defaultValue,
      mode: "onChange",
      reValidateMode: "onChange",
    });

    const {
      watch,
      formState: { isValid },
    } = methods;
    const watchedValues = watch();
    const valuesKey = JSON.stringify(watchedValues);

    useImperativeHandle(ref, () => ({
      getValues: () => methods.getValues(),
      isValid: () => methods.formState.isValid,
    }));

    useEffect(() => {
      const subscription = methods.watch(() => {});
      return () => subscription.unsubscribe();
    }, [methods]);

    useEffect(() => {
      onValidChange(isValid, methods.getValues());
    }, [isValid, valuesKey, onValidChange, methods]);

    return (
      <FormProvider {...methods}>
        <AddressForm title="Pickup information" />
      </FormProvider>
    );
  },
);
PickupAddressForm.displayName = "PickupAddressForm";

export default PickupAddressForm;
