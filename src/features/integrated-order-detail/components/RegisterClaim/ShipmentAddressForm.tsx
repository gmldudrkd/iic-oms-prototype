import { Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import AddressForm from "@/features/integrated-order-detail/components/AddressForm";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

export interface ShipmentAddressFormRef {
  getValues: () => TAddressForm;
  isValid: () => boolean;
}

interface Props {
  defaultValue: TAddressForm;
  onValidChange: (isValid: boolean, values: TAddressForm) => void;
  pickupValues: TAddressForm;
  showPickup: boolean;
}

const ShipmentAddressForm = forwardRef<ShipmentAddressFormRef, Props>(
  ({ defaultValue, onValidChange, pickupValues, showPickup }, ref) => {
    const methods = useForm<TAddressForm>({
      defaultValues: defaultValue,
      mode: "onChange",
      reValidateMode: "onChange",
    });

    const [useSameAddress, setUseSameAddress] = useState(true);

    const {
      formState: { isValid },
    } = methods;

    useImperativeHandle(ref, () => ({
      getValues: () => methods.getValues(),
      isValid: () => methods.formState.isValid,
    }));

    // pickup 값 동기화
    useEffect(() => {
      if (showPickup && useSameAddress) {
        methods.reset(pickupValues);
      } else if (!showPickup && useSameAddress) {
        methods.reset(defaultValue);
      }
    }, [pickupValues, useSameAddress, showPickup, methods, defaultValue]);

    useEffect(() => {
      const subscription = methods.watch(() => {});
      return () => subscription.unsubscribe();
    }, [methods]);

    useEffect(() => {
      onValidChange(isValid, methods.getValues());
    }, [isValid, methods, onValidChange]);

    return (
      <FormProvider {...methods}>
        <AddressForm
          title="Delivery information"
          disabled={useSameAddress}
          syncButton={
            <FormControlLabel
              control={
                <Checkbox
                  checked={useSameAddress}
                  onChange={() => setUseSameAddress((prev) => !prev)}
                />
              }
              label="Use same pickup information"
              className="!mr-0"
            />
          }
        />
      </FormProvider>
    );
  },
);

ShipmentAddressForm.displayName = "ShipmentAddressForm";

export default ShipmentAddressForm;
