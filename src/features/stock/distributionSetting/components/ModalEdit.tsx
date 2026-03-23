import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import SelectRenderer from "@/features/channel-detail/components/SelectRenderer";
import usePatchChannelStockDistributionRates from "@/features/stock/distributionSetting/hooks/usePatchChannelStockDistributionRates";
import { transformChannelStockSetting } from "@/features/stock/distributionSetting/models/transform";
import { COLUMNS_PRODUCT_EDIT } from "@/features/stock/distributionSetting/modules/columns";
import { RATE_TYPE } from "@/features/stock/distributionSetting/modules/constants";
import { DistributionSettingSchema } from "@/features/stock/distributionSetting/modules/schema";
import { collectErrorMessages } from "@/features/stock/distributionSetting/modules/utils";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import ContentDialog from "@/shared/components/dialog/ContentDialog";
import { DetailGridSingle } from "@/shared/components/table/tableStyle";
import Title from "@/shared/components/text/Title";
import {
  ChannelStockSettingDistributionUpdateRequest,
  ChannelStockSettingResponse,
} from "@/shared/generated/oms/types/Stock";
import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { ApiError } from "@/shared/types";
import { cleanEmptyParams } from "@/shared/utils/cleanParams";

interface Props {
  data: ChannelStockSettingResponse[];
  refetch: () => void;
}

export default function ProductRatioEdit({ data, refetch }: Props) {
  const { brand, corporation } = useSingleBrandAndCorp();
  const { openSnackbar } = useSnackbarStore();

  const ratesMap = useMemo(() => {
    return data[0]?.channelDistributeRates?.map((rate) => ({
      channelType: rate.channelType.name,
      description: rate.channelType.description,
      distributionRate: 0,
    }));
  }, [data]);

  const defaultValues = useMemo(() => {
    return {
      rateType: "channelDefaultRate",
      distributionRates: ratesMap,
    };
  }, [ratesMap]);

  const rows = useMemo(() => transformChannelStockSetting(data), [data]);

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(DistributionSettingSchema),
  });

  const useDefaultRate = methods.watch("rateType") === "channelDefaultRate";
  const distributionRates = methods.watch("distributionRates");

  // 📍 온라인 재고 제품별 채널 분배 비율 설정 API
  const { mutate } = usePatchChannelStockDistributionRates({
    onSuccess: () => {
      openSnackbar({
        alertTitle: "Update Successful",
        message: "Your changes have been successfully applied.",
        severity: "success",
      });
      setOpen(false);
      methods.reset(defaultValues);
      refetch();
    },
    onError: (error: ApiError) => {
      openSnackbar({
        alertTitle: "Change channel Distribution Failed",
        message: error.errorMessage ?? "Please try again.",
        severity: "error",
      });
    },
  });

  const [open, setOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (useDefaultRate) {
      methods.setValue("distributionRates", ratesMap);
    }
  }, [useDefaultRate, ratesMap, methods]);

  const handleEdit = () => {
    if (rows.length === 0) {
      setOpenErrorDialog(
        <>
          No editable products found. <br />
          Please search again and choose one.
        </>,
      );
      return;
    }
    setOpen(true);
  };

  // 에러 메시지 수집 헬퍼 함수

  const handlePost = methods.handleSubmit(
    (data) => {
      const requestData = {
        brand,
        corporation,
        distributionRates: useDefaultRate ? undefined : data.distributionRates,
        skus: rows.map((row) => row.skuCode),
        useDefaultRate: useDefaultRate,
      };

      const cleanedRequestData = cleanEmptyParams(requestData);
      mutate(
        cleanedRequestData as ChannelStockSettingDistributionUpdateRequest,
      );
    },
    (errors) => {
      // Validation 에러가 있을 경우 에러 다이얼로그 표시
      const errorMessages = collectErrorMessages(errors);

      setOpenErrorDialog(errorMessages);
    },
  );

  const handleClose = () => {
    setOpen(false);
    methods.reset(defaultValues);
  };

  return (
    <FormProvider {...methods}>
      <Button color="primary" size="small" onClick={handleEdit}>
        Edit
      </Button>
      <ContentDialog
        dialogTitle="Edit Product Ratio"
        dialogContent={
          <>
            <div className="mt-[16px] rounded-[5px] border">
              <Box p="16px" bgcolor="rgba(33, 150, 243, 0.08)">
                <Typography fontSize="16px" fontWeight="bold">
                  Selected Products
                </Typography>
              </Box>
              <ThemeProvider theme={MUIDataGridTheme}>
                <DataGridPro
                  rows={rows}
                  columns={COLUMNS_PRODUCT_EDIT}
                  disableColumnMenu
                  disableRowSelectionOnClick
                  disableColumnFilter
                  disableColumnSelector
                  disableColumnSorting
                  hideFooter
                  rowHeight={36}
                  columnHeaderHeight={36}
                  sx={{
                    height: "180px",
                  }}
                />
              </ThemeProvider>

              <DetailGridSingle className="& h3{width: 220px;} border-t">
                <div>
                  <h3 style={{ width: "180px" }}>Rate Type</h3>
                  <FormControl>
                    <SelectRenderer
                      control={methods.control}
                      name="rateType"
                      selectList={RATE_TYPE}
                    />
                  </FormControl>
                </div>
              </DetailGridSingle>
              {!useDefaultRate && (
                <DetailGridSingle className="& h3{width: 220px;} border-t">
                  <div>
                    <h3 style={{ width: "180px" }}>Rate</h3>

                    <FormControl sx={{ gap: 1 }}>
                      {distributionRates &&
                      Array.isArray(distributionRates) &&
                      distributionRates.length > 0
                        ? distributionRates.map((rate, index) => (
                            <div
                              key={rate.channelType}
                              className="flex items-center"
                            >
                              <span className="w-[200px]">
                                {rate.description}
                              </span>
                              <Controller
                                name={`distributionRates.${index}.distributionRate`}
                                control={methods.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    size="small"
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      field.onChange(isNaN(value) ? "" : value);
                                    }}
                                    slotProps={{
                                      input: {
                                        inputProps: { min: 0 },
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            %
                                          </InputAdornment>
                                        ),
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>
                          ))
                        : null}
                    </FormControl>
                  </div>
                </DetailGridSingle>
              )}
            </div>
            <p className="mt-[16px] text-right text-[12px] font-bold leading-[48px] text-red-500">
              ⚠ Saving will overwrite the existing information.
            </p>
          </>
        }
        dialogConfirmLabel="Save"
        open={open}
        setOpen={setOpen}
        handlePost={() => handlePost()}
        dialogCloseLabel="Cancel"
        dialogTitleClassNames="bg-primary text-white"
        buttonDisable={false}
        handleClose={handleClose}
      />

      {/* 에러 알럿 */}
      <AlertDialog
        open={openErrorDialog !== null}
        setOpen={() => setOpenErrorDialog(null)}
        dialogTitle=""
        dialogTitleClassNames="!bg-white !text-default"
        isButton={false}
        maxWidth="xs"
        buttonLabel="OK"
        postButtonClassNames="!font-bold"
        dialogContent={
          <span className="whitespace-pre-line">{openErrorDialog}</span>
        }
        dialogCloseLabel="OK"
        preventClose={false}
      />
    </FormProvider>
  );
}
