import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import usePostStockExport from "@/features/stock/overview/hooks/stock-export/usePostStockExport";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import {
  StockExportRequestBrandEnum,
  StockExportRequestCorporationEnum,
  StockExportRequestExportTypeEnum,
} from "@/shared/generated/oms/types/StockExport";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

dayjs.extend(minMax);

const MAXIMUM_MONTHS_DIFF = 3;

interface StockExportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function StockExportDialog({
  open,
  setOpen,
}: StockExportDialogProps) {
  const { timezone } = useTimezoneStore();
  const { watch } = useFormContext<StockDashboardRequestForm>();
  const brand = watch("brand");
  const corporation = watch("corporation");

  const [exportType, setExportType] =
    useState<StockExportRequestExportTypeEnum>(
      StockExportRequestExportTypeEnum.OVERVIEW,
    );
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const { mutate: postStockExport } = usePostStockExport();

  const isDateRangeValid = () => {
    if (!fromDate || !toDate) return false;
    const monthsDiff = toDate.diff(fromDate, "month", true);
    return monthsDiff >= 0 && monthsDiff <= 3;
  };

  const handleClose = () => {
    setOpen(false);
    setExportType(StockExportRequestExportTypeEnum.OVERVIEW);
    setFromDate(dayjs());
    setToDate(dayjs());
  };

  const handlePostStockExport = () => {
    if (
      exportType === StockExportRequestExportTypeEnum.ONLINE_STOCK &&
      !isDateRangeValid()
    ) {
      return;
    }

    postStockExport(
      {
        exportType: exportType,
        brand: brand as unknown as StockExportRequestBrandEnum,
        corporation:
          corporation as unknown as StockExportRequestCorporationEnum,
        from:
          exportType === StockExportRequestExportTypeEnum.ONLINE_STOCK
            ? fromDate?.startOf("day").tz(timezone, true).toISOString() ||
              dayjs().startOf("day").tz(timezone, true).toISOString()
            : dayjs().startOf("day").tz(timezone, true).toISOString(),
        to:
          exportType === StockExportRequestExportTypeEnum.ONLINE_STOCK
            ? toDate?.endOf("day").tz(timezone, true).toISOString() ||
              dayjs().endOf("day").tz(timezone, true).toISOString()
            : dayjs().endOf("day").tz(timezone, true).toISOString(),
        zoneId: timezone,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle bgcolor="primary.main">
        <Typography fontSize="20px" fontWeight="bold" color="white">
          Stock Export
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          padding="8px 16px"
          border="1px solid #E0E0E0"
          borderRadius="5px"
          mt="20px"
        >
          <RadioGroup
            value={exportType}
            onChange={(e) =>
              setExportType(e.target.value as StockExportRequestExportTypeEnum)
            }
            sx={{
              flexDirection: "row",
            }}
          >
            <FormControlLabel
              value={StockExportRequestExportTypeEnum.OVERVIEW}
              control={<Radio />}
              label="Export All Data"
            />
            <FormControlLabel
              value={StockExportRequestExportTypeEnum.ONLINE_STOCK}
              control={<Radio />}
              label="Export ERP Stock"
            />
          </RadioGroup>

          {exportType === StockExportRequestExportTypeEnum.ONLINE_STOCK && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  mt: "18px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Start Date"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    // timezone={timezone}
                    minDate={
                      toDate
                        ? toDate.subtract(MAXIMUM_MONTHS_DIFF, "month")
                        : undefined
                    }
                    maxDate={toDate ?? dayjs().startOf("day")}
                    format="YYYY.MM.DD"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="End Date"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    maxDate={
                      fromDate
                        ? dayjs.min(
                            dayjs().endOf("day"),
                            fromDate.add(MAXIMUM_MONTHS_DIFF, "month"),
                          )
                        : undefined
                    }
                    format="YYYY.MM.DD"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !isDateRangeValid(),
                      },
                    }}
                  />
                </Box>
              </Box>
            </LocalizationProvider>
          )}
        </Box>

        <Box mt="20px">
          <Typography fontSize="12px" color={red[500]} fontWeight="bold">
            The entire search result will be downloaded.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handlePostStockExport}
          variant="contained"
          color="primary"
          disabled={
            exportType === StockExportRequestExportTypeEnum.ONLINE_STOCK &&
            !isDateRangeValid()
          }
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}
