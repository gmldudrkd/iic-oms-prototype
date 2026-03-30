import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import { CLAIM_OPTIONS } from "@/features/integrated-order-detail/modules/constants";

import { OrderEstimateRefundFeeRequestClaimTypeEnum } from "@/shared/generated/oms/types/Order";

interface Props {
  claimType: OrderEstimateRefundFeeRequestClaimTypeEnum;
  setClaimType: (claimType: OrderEstimateRefundFeeRequestClaimTypeEnum) => void;
  disabledValues?: OrderEstimateRefundFeeRequestClaimTypeEnum[];
}

export default function ClaimType({
  claimType,
  setClaimType,
  disabledValues = [],
}: Props) {
  return (
    <div>
      <h2 className="mt-[16px] px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Claim type
      </h2>

      <FormControl fullWidth>
        <RadioGroup
          value={claimType}
          onChange={(e) =>
            setClaimType(
              e.target.value as OrderEstimateRefundFeeRequestClaimTypeEnum,
            )
          }
          name="radio-buttons-group"
          className="flex !flex-row justify-between gap-[16px]"
        >
          {CLAIM_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex min-w-[200px] items-center gap-[8px]"
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
                className="!mx-0"
                disabled={disabledValues.includes(
                  option.value as OrderEstimateRefundFeeRequestClaimTypeEnum,
                )}
              />
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
