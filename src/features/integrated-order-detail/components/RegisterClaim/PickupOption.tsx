import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";

import { PICKUP_OPTIONS } from "@/features/integrated-order-detail/modules/constants";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

interface Props {
  pickupOption: boolean;
  setPickupOption: (pickupOption: boolean) => void;
  /** INT 채널 등 픽업 요청이 불가한 경우 "Request Pickup" 선택 차단 */
  disablePickupRequest?: boolean;
}

export default function PickupOption({
  pickupOption,
  setPickupOption,
  disablePickupRequest = false,
}: Props) {
  const [showBlockedAlert, setShowBlockedAlert] = useState(false);

  const handleChange = (value: string) => {
    const requestPickup = value === "true";

    // INT 채널은 픽업 요청 불가 → 경고 노출 후 선택 차단
    if (requestPickup && disablePickupRequest) {
      setShowBlockedAlert(true);
      return;
    }

    setPickupOption(requestPickup);
  };

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Pickup Option
      </h2>

      <FormControl fullWidth>
        <RadioGroup
          value={pickupOption ? "true" : "false"}
          onChange={(e) => handleChange(e.target.value)}
          name="radio-buttons-group"
          className="flex !flex-row !flex-nowrap gap-[16px]"
        >
          {PICKUP_OPTIONS.map((option) => (
            <div key={option.label} className="flex w-1/2">
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
                className="!mx-0"
              />
            </div>
          ))}
        </RadioGroup>
      </FormControl>

      {showBlockedAlert && (
        <AlertDialog
          isButton={false}
          open={true}
          setOpen={() => setShowBlockedAlert(false)}
          maxWidth="xs"
          dialogContent="Pickup requests are not available for the INT channel."
          dialogConfirmLabel="OK"
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
          handlePost={() => setShowBlockedAlert(false)}
        />
      )}
    </div>
  );
}
