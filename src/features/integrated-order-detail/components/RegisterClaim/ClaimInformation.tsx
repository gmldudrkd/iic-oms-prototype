import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  reasonList: {
    label: string;
    value: string;
    isCustomerFault: boolean;
  }[];
  // 선택 필드 이름
  reasonFieldName?: string;
  // 기타 이유 입력 필드 이름
  othersFieldName?: string;
  // 주문 취소 여부
  isCancelOrder?: boolean;
  // 고정값이 주입되면 select를 비활성화하고 해당 값을 표시
  lockedValue?: string;
}

export default function ClaimInformation({
  reasonList,
  reasonFieldName = "claimReason",
  othersFieldName = "claimReasonOthers",
  isCancelOrder = false,
  lockedValue,
}: Props) {
  const {
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useFormContext();

  // 현재 선택된 클레임 이유 값 감시
  const selectedReason = watch(reasonFieldName);
  const currentReason = reasonList.find(
    (reason) => reason.value === selectedReason,
  );

  // "others"가 선택되었는지 확인
  const isOthersSelected = selectedReason.toLowerCase().includes("others");

  // reasonList에 "others"가 있는지 확인
  const hasOthersOption = reasonList.some((reason) =>
    reason.value.toLowerCase().includes("others"),
  );

  useEffect(() => {
    if (othersFieldName) {
      setValue(othersFieldName, "");
    }
  }, [isOthersSelected, setValue, othersFieldName, selectedReason]);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Claim Information<span className="text-red-500">*</span>
      </h2>
      <div className="w-full">
        <div className="flex flex-col gap-[12px]">
          <FormControl fullWidth error={!!errors[reasonFieldName]}>
            <InputLabel id="claim-reason-label" shrink>
              Claim reason
            </InputLabel>

            <Controller
              control={control}
              name={reasonFieldName}
              render={({ field }) => (
                <Select
                  {...field}
                  value={lockedValue ?? (field.value || "")}
                  displayEmpty
                  size="small"
                  label="Claim reason"
                  disabled={!!lockedValue}
                  renderValue={(value) => {
                    return value ? (
                      value
                    ) : (
                      <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>
                        Select claim reason
                      </span>
                    );
                  }}
                  onChange={async (e) => {
                    field.onChange(e.target.value);
                    await trigger(othersFieldName);
                  }}
                >
                  {reasonList.map((reason) => (
                    <MenuItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            {errors[reasonFieldName] && (
              <FormHelperText>
                {errors[reasonFieldName]?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>

          {/* "others"가 선택된 경우에만 추가 입력 필드 표시 */}
          {hasOthersOption && isOthersSelected && (
            <FormControl fullWidth>
              <Controller
                control={control}
                name={othersFieldName}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter claim reason"
                    size="small"
                    fullWidth
                    error={!!errors[othersFieldName]}
                    // helperText={errors[othersFieldName]?.message?.toString()}
                    onChange={async (e) => {
                      field.onChange(e.target.value);
                      await trigger(othersFieldName);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
        </div>

        {!isCancelOrder && currentReason && (
          <p className="p-[16px] text-[14px] font-medium leading-normal text-text-disabled">
            Selected reason considered{" "}
            <span className="font-bold text-error">
              {currentReason.isCustomerFault
                ? "Customer’s fault"
                : "Seller’s fault"}
            </span>
            ; may affect shipping and other charges.
          </p>
        )}
      </div>
    </div>
  );
}
