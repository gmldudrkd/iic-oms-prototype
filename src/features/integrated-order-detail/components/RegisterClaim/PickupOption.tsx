import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import { PICKUP_OPTIONS } from "@/features/integrated-order-detail/modules/constants";

interface Props {
  pickupOption: boolean;
  setPickupOption: (pickupOption: boolean) => void;
}

export default function PickupOption({ pickupOption, setPickupOption }: Props) {
  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Pickup Option
      </h2>

      <FormControl fullWidth>
        <RadioGroup
          value={pickupOption ? "true" : "false"}
          onChange={(e) => setPickupOption(e.target.value === "true")}
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
    </div>
  );
}
