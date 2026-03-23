import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function TrackingInformation() {
  const { control, trigger } = useFormContext();
  const carrierList = ["CJ", "DHL", "FEDEX", "UPS"];

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        Tracking Information (Optional)
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

        <p className="px-[16px] py-[15px] text-[14px] text-gray-500">
          Please note that if tracking information is entered,{" "}
          <span className="font-bold text-red-500">
            pickup through the WMS will not proceed.
          </span>
        </p>
      </div>
    </div>
  );
}
