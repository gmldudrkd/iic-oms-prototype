import {
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";

import usePostExportExcel from "@/features/export-order/hooks/usePostExportExcel";
import { PeriodPickerField } from "@/features/integrated-order-list/components/PeriodPickerField";

import ContentDialog from "@/shared/components/dialog/ContentDialog";
import PasswordInput from "@/shared/components/form-elements/PasswordInput";
import {
  OrderExportRequest,
  OrderExportRequestExportTypeEnum,
} from "@/shared/generated/oms/types/OrderExport";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";
import { downloadBlobFile } from "@/shared/utils/downloadUtils";

export default function ExportOrder() {
  const { timezone } = useTimezoneStore();
  const [open, setOpen] = useState(false);
  const { selectedPermission } = useUserPermissionStore();

  const channelTypes = useMemo(() => {
    return selectedPermission.flatMap((permission) =>
      permission.corporations.flatMap((corporation) =>
        corporation.channels.map((channel) => channel.name),
      ),
    );
  }, [selectedPermission]);

  const typeList = Object.values(OrderExportRequestExportTypeEnum).map(
    (item) => ({
      value: item,
      label: item.replace(/_/g, " ").toLowerCase(),
    }),
  );

  const defaultValues = {
    exportType: typeList[0].value,
    period: [
      dayjs().tz(timezone).startOf("day"),
      dayjs().tz(timezone).endOf("day"),
    ],
    purposeMessage: "",
    password: "",
  };

  const methods = useForm({ defaultValues });
  const [period, password, purposeMessage] = methods.watch([
    "period",
    "password",
    "purposeMessage",
  ]);

  useEffect(() => {
    methods.setValue("period", [
      dayjs().tz(timezone).startOf("day"),
      dayjs().tz(timezone).endOf("day"),
    ]);
  }, [timezone, methods]);

  useEffect(() => {
    methods.reset();
  }, [selectedPermission, methods]);

  const { mutate } = usePostExportExcel({
    onSuccess: async (response: Response) => {
      await response.blob().then((blob) => {
        const date = dayjs().format("YYYYMMDD");
        const defaultFileName = `IIC_OMS_Order List_${date}.xlsx`;
        downloadBlobFile(blob, response, defaultFileName);
        methods.reset();
        setOpen(false);
      });
    },
  });

  // Export Data 버튼 disabled 조건
  const isPeriodValid =
    Array.isArray(period) &&
    period.length === 2 &&
    !!period[0] &&
    !!period[1] &&
    dayjs(period[0]).isValid() &&
    dayjs(period[1]).isValid();

  // Excel download 버튼 disabled 조건
  const isExportButtonDisabled =
    password.length < 4 ||
    password.length > 10 ||
    purposeMessage.trim().length === 0;

  const onSubmit = () => {
    const requestData = {
      exportType: methods.getValues("exportType"),
      from: methods.getValues("period")[0].toISOString(),
      to: methods.getValues("period")[1].toISOString(),
      password: methods.getValues("password"),
      purposeMessage: methods.getValues("purposeMessage"),
      zoneId: timezone,
      channelTypes,
    };
    // console.log(requestData);
    mutate(requestData as OrderExportRequest);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-[24px]">
        <div>
          <div className="border-b border-outlined bg-white px-[24px]">
            <form
              className="flex items-start justify-between gap-[16px] py-[24px]"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-wrap gap-[16px]">
                <div className="flex w-[260px] flex-shrink-0 items-center gap-[8px]">
                  <FormControl fullWidth>
                    <InputLabel shrink>Type</InputLabel>

                    <Controller
                      control={methods.control}
                      name="exportType"
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Type"
                          slotProps={{
                            input: {
                              sx: { ".MuiListItemText-root": { margin: "0" } },
                            },
                          }}
                        >
                          {typeList.map((item, index) => (
                            <MenuItem
                              key={`${item.value}-${index}`}
                              value={item.value}
                            >
                              <ListItemText
                                primary={item.label}
                                className="first-letter:uppercase"
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </div>

                <div className="flex w-[600px] flex-shrink-0 items-center gap-[8px]">
                  <FormControl fullWidth>
                    <PeriodPickerField name="period" />
                  </FormControl>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-end justify-end gap-[8px]">
                <Button variant="outlined" onClick={() => methods.reset()}>
                  Reset
                </Button>

                <Button
                  aria-describedby="export"
                  variant="contained"
                  onClick={() => setOpen(true)}
                  disabled={!isPeriodValid}
                >
                  Export Data
                </Button>

                <ContentDialog
                  dialogTitle={"Export Encryption"}
                  dialogContent={
                    <div className="flex flex-col gap-[20px] py-[20px]">
                      <PasswordInput
                        name="password"
                        control={methods.control}
                        shrink
                        label="Set Password"
                        placeholder="Enter 4 to 10 characters"
                        maxLength={10}
                      />

                      <Controller
                        control={methods.control}
                        name="purposeMessage"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="outlined-basic"
                            label="Purpose of Export"
                            variant="outlined"
                            placeholder="Enter purpose"
                            slotProps={{
                              inputLabel: { shrink: true },
                              htmlInput: { maxLength: 50 },
                            }}
                          />
                        )}
                      />
                    </div>
                  }
                  dialogConfirmLabel={"Excel download"}
                  open={open}
                  setOpen={setOpen}
                  handlePost={onSubmit}
                  dialogCloseLabel="Cancel"
                  dialogTitleClassNames="bg-primary text-white"
                  buttonDisable={isExportButtonDisabled}
                  maxWidth="sm"
                  handleClose={() => {
                    setOpen(false);
                    methods.setValue("password", "");
                    methods.setValue("purposeMessage", "");
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
