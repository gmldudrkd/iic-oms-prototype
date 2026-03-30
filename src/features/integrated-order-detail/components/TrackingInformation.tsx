import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function TrackingInformation() {
  const { control, trigger, reset } = useFormContext();
  const carrierList = ["CJ", "DHL", "FEDEX", "UPS"];

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Tracking Information <span className="text-red-500">*</span>
      </h2>
      <div>
        <div className="flex flex-col gap-[12px]">
          <FormControl fullWidth>
            <Controller
              control={control}
              name="carrierCode"
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={carrierList}
                  value={field.value ?? null}
                  onInputChange={async (_, newInput) => {
                    field.onChange(newInput);
                    await trigger("trackingNo");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Enter Carrier"
                      label="Carrier"
                      size="small"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              control={control}
              name="trackingNo"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Enter Tracking No"
                  label="Tracking No"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={async (e) => {
                    field.onChange(e.target.value);
                    await trigger("trackingNo");
                  }}
                />
              )}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
}
