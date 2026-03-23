import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Box,
  ThemeProvider,
  TextField,
  FormControl,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { DataGridPro, GridColDef, GridRowModel } from "@mui/x-data-grid-pro";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

import PreOrderSettingSaveAlerts, {
  AlertType,
} from "@/features/stock/overview/components/pre-order-setting/PreOrderSettingSaveAlerts";
import usePatchPreOrderSetting from "@/features/stock/overview/hooks/pre-order-setting/usePatchPreOrderSetting";
import { PreOrderSetting } from "@/features/stock/overview/models/types";

import Title from "@/shared/components/text/Title";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { MUIDataGridTheme } from "@/shared/styles/theme";

const MIN_PRE_ORDER_QUANTITY = 1;

interface PreOrderSettingDialogProps {
  rows: GridRowModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
  preOrderSetting?: PreOrderSetting;
}

export default function PreOrderSettingDialog({
  rows,
  open,
  setOpen,
  preOrderSetting,
}: PreOrderSettingDialogProps) {
  const [preOrderQuantity, setPreOrderQuantity] = useState<number>(
    MIN_PRE_ORDER_QUANTITY,
  );
  const [preOrderQuantityError, setPreOrderQuantityError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const defaultQuantity =
      rows.length > 1
        ? MIN_PRE_ORDER_QUANTITY
        : (rows[0]?.preOrder ?? MIN_PRE_ORDER_QUANTITY);
    setPreOrderQuantity(defaultQuantity);
    setPreOrderQuantityError(null);
  }, [rows]);

  const [preOrderExpiredAt, setPreOrderExpiredAt] = useState<
    Dayjs | null | undefined
  >(undefined);
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);

  // preOrderSetting이 전달되면 초기화
  useEffect(() => {
    if (preOrderSetting && open) {
      setPreOrderExpiredAt(preOrderSetting.preOrderExpiredAt);
    }
  }, [preOrderSetting, open]);

  const { UpdatedAt } = useCurrentTime({
    isFetching: false,
    isSuccess: open,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const columns: GridColDef[] = [
    { field: "singleSku", headerName: "SKU Code", flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 2,
    },
  ];

  const { mutate: patchPreOrderSetting } = usePatchPreOrderSetting();

  const validatePreOrderQuantity = (value: number): string | null => {
    if (isNaN(value) || value < MIN_PRE_ORDER_QUANTITY) {
      return `Pre-order quantity must be at least ${MIN_PRE_ORDER_QUANTITY}`;
    }
    return null;
  };

  const handleClose = () => {
    setOpen(false);
    setPreOrderQuantity(MIN_PRE_ORDER_QUANTITY);
    setPreOrderQuantityError(null);
    setPreOrderExpiredAt(undefined);
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    handleClose();
  };

  const handleSave = () => {
    const quantityError = validatePreOrderQuantity(preOrderQuantity);
    if (quantityError) {
      setPreOrderQuantityError(quantityError);
      return;
    }

    if (preOrderQuantity < MIN_PRE_ORDER_QUANTITY) {
      setActiveAlert("preOrderQuantityNotSet");
      return;
    }

    if (
      preOrderExpiredAt === undefined ||
      (preOrderExpiredAt && preOrderExpiredAt.isBefore(dayjs().startOf("day")))
    ) {
      setActiveAlert("expiredAtNotSet");
      return;
    }

    setActiveAlert("confirmTransfer");
  };

  const handleConfirm = () => {
    patchPreOrderSetting({
      targets: rows.flatMap((row) => ({
        sku: row.sku,
        channelType: row.channelEnum,
      })),
      preorderQuantity: preOrderQuantity,
      preorderExpiredAt:
        preOrderExpiredAt === null
          ? null
          : (preOrderExpiredAt?.toISOString() ?? undefined),
    });

    setActiveAlert(null);
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle bgcolor="primary.main">
          <div className="flex items-center justify-between">
            <Typography fontSize="20px" fontWeight="bold" color="white">
              Pre-order Setting
            </Typography>

            <UpdatedAt sx={{ fontSize: "13px", color: "white" }} />
          </div>
        </DialogTitle>
        <DialogContent sx={{ padding: "20px 24px", marginTop: "20px" }}>
          <Box border="1px solid #E0E0E0" borderRadius="5px">
            <Title text="Selected Products" variant="bordered" />

            <ThemeProvider theme={MUIDataGridTheme}>
              <DataGridPro
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                hideFooter
                rowHeight={36}
                columnHeaderHeight={36}
                sx={{
                  height: "180px",
                }}
              />
            </ThemeProvider>

            <Box display="flex" borderTop="1px solid #E0E0E0">
              <Box
                p="16px"
                bgcolor="rgba(33, 150, 243, 0.08)"
                borderRight="1px solid #E0E0E0"
                width="180px"
              >
                <Typography fontSize="16px" fontWeight="bold">
                  Pre-order Channel
                </Typography>
              </Box>
              <Box p="10px" display="flex" alignItems="center">
                {rows.length > 0 && (
                  <Typography>{rows[0].channelName}</Typography>
                )}
              </Box>
            </Box>
            <Box display="flex" borderTop="1px solid #E0E0E0">
              <Box
                p="16px"
                bgcolor="rgba(33, 150, 243, 0.08)"
                borderRight="1px solid #E0E0E0"
                width="180px"
              >
                <Typography fontSize="16px" fontWeight="bold">
                  Pre-order Stock
                </Typography>
              </Box>
              <Box p="10px">
                <TextField
                  sx={{ width: "120px" }}
                  size="small"
                  value={preOrderQuantity === 0 ? "" : preOrderQuantity}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "") {
                      setPreOrderQuantity(0);
                      setPreOrderQuantityError(
                        `Pre-order quantity must be at least ${MIN_PRE_ORDER_QUANTITY}`,
                      );
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        setPreOrderQuantity(numValue);
                        const error = validatePreOrderQuantity(numValue);
                        setPreOrderQuantityError(error);
                      }
                    }
                  }}
                  type="number"
                  error={!!preOrderQuantityError}
                />
              </Box>
            </Box>
            <Box display="flex" borderTop="1px solid #E0E0E0">
              <Box
                p="16px"
                bgcolor="rgba(33, 150, 243, 0.08)"
                borderRight="1px solid #E0E0E0"
                width="180px"
              >
                <Tooltip title="Set the period to keep it OFF. When the period ends, the stock will sync and the pre-order will be closed automatically.">
                  <Typography
                    fontSize="16px"
                    fontWeight="bold"
                    sx={{
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    }}
                  >
                    Expired At
                  </Typography>
                </Tooltip>
              </Box>
              <Box p="10px">
                <Box display="flex" alignItems="center" gap="10px">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={preOrderExpiredAt}
                      onChange={(newValue) =>
                        setPreOrderExpiredAt(newValue?.endOf("day") ?? null)
                      }
                      minDate={dayjs()}
                      format="YYYY-MM-DD"
                      sx={{ width: "200px" }}
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      disabled={preOrderExpiredAt === null}
                    />
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={preOrderExpiredAt === null}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreOrderExpiredAt(null);
                              } else {
                                setPreOrderExpiredAt(undefined);
                              }
                            }}
                          />
                        }
                        label="Indefinite"
                      />
                    </FormControl>
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Typography fontSize="12px" color={red[500]} fontWeight="bold">
              ⚠ Clicking &apos;Save&apos; will instantly send the entered
              ‘Pre-order Stock’ to the channel.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ "&": { padding: "0 24px 24px 24px" } }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <PreOrderSettingSaveAlerts
        activeAlert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
