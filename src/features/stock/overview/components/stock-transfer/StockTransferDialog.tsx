import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ThemeProvider,
  TextField,
  Tooltip,
} from "@mui/material";
import { red } from "@mui/material/colors";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid-pro";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import StockTransferSaveAlerts, {
  AlertType,
} from "@/features/stock/overview/components/stock-transfer/StockTransferSaveAlerts";
import usePatchTransferStock from "@/features/stock/overview/hooks/stock-transfer/usePatchTransferStock";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import {
  ChannelStockTransferRequest,
  ChannelStockTransferRequestBrandEnum,
  ChannelStockTransferRequestChannelTypeEnum,
  ChannelStockTransferRequestCorporationEnum,
} from "@/shared/generated/oms/types/Stock";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { MUIDataGridTheme } from "@/shared/styles/theme";

const MIN_TRANSFER_QUANTITY = 1;

interface ChangeSafetyStockDialogProps {
  rows: GridRowModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ChangeSafetyStockDialog({
  rows,
  open,
  setOpen,
}: ChangeSafetyStockDialogProps) {
  const { watch } = useFormContext<StockDashboardRequestForm>();
  const [transferQuantity, setTransferQuantity] = useState<number>(
    MIN_TRANSFER_QUANTITY,
  );
  const [transferQuantityError, setTransferQuantityError] = useState<
    string | null
  >(null);
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);

  const { UpdatedAt } = useCurrentTime({
    isFetching: false,
    isSuccess: open,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const { mutate: patchTransferStock } = usePatchTransferStock();

  const validateTransferQuantity = (value: number): string | null => {
    if (isNaN(value) || value < MIN_TRANSFER_QUANTITY) {
      return `Transfer quantity must be at least ${MIN_TRANSFER_QUANTITY}`;
    }
    return null;
  };

  const columns: GridColDef[] = [
    { field: "sku", headerName: "SKU Code", flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",

      flex: 1.4,
    },
    {
      field: "undistributed",
      headerName: "Undistributed Qty",
      flex: 1.2,

      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
    },
    {
      field: "available",
      headerName: "Available Qty",
      flex: 1.2,

      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setTransferQuantity(MIN_TRANSFER_QUANTITY);
    setTransferQuantityError(null);
    setActiveAlert(null);
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    handleClose();
  };

  const handleSave = () => {
    const quantityError = validateTransferQuantity(transferQuantity);
    if (quantityError) {
      setTransferQuantityError(quantityError);
      return;
    }

    if (transferQuantity < MIN_TRANSFER_QUANTITY) {
      return;
    }

    const minimumTransferQuantity = Math.min(
      ...rows.map((row) => row.undistributed),
    );

    if (transferQuantity > minimumTransferQuantity) {
      return setActiveAlert("transferQtyExceedsUndistributed");
    }

    setActiveAlert("confirmTransfer");
  };

  const handleConfirm = () => {
    const patchData: ChannelStockTransferRequest = {
      brand: watch("brand") as unknown as ChannelStockTransferRequestBrandEnum,
      corporation: watch(
        "corporation",
      ) as unknown as ChannelStockTransferRequestCorporationEnum,
      channelType: rows[0]
        .channelEnum as ChannelStockTransferRequestChannelTypeEnum,
      skus: rows.map((row) => row.sku),
      transferQuantity: transferQuantity,
    };

    patchTransferStock(patchData);

    setActiveAlert(null);
    handleClose();
  };

  const handleAlertClose = () => {
    setActiveAlert(null);
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle bgcolor="primary.main">
          <div className="flex items-center justify-between">
            <Typography fontSize="20px" fontWeight="bold" color="white">
              Stock Transfer
            </Typography>

            <UpdatedAt sx={{ fontSize: "13px", color: "white" }} />
          </div>
        </DialogTitle>
        <DialogContent sx={{ padding: "20px 24px", marginTop: "20px" }}>
          <Box border="1px solid #E0E0E0" borderRadius="5px">
            <Box p="16px" bgcolor="rgba(33, 150, 243, 0.08)">
              <Typography fontSize="16px" fontWeight="bold">
                Selected Products
              </Typography>
            </Box>

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
                  Transfer From
                </Typography>
              </Box>
              <Box p="10px" display="flex" alignItems="center" flexGrow={1}>
                <Typography>Undistributed Stock</Typography>
              </Box>
              <Box
                p="16px"
                bgcolor="rgba(33, 150, 243, 0.08)"
                borderRight="1px solid #E0E0E0"
                width="180px"
              >
                <Typography fontSize="16px" fontWeight="bold">
                  Transfer To
                </Typography>
              </Box>
              <Box p="10px" display="flex" alignItems="center" flexGrow={1}>
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
                <Box display="flex" alignItems="center" gap="4px">
                  <Tooltip
                    title="Enter the quantity to transfer from Undistributed Qty to each channel. The transferred amount will be added to the channel’s Available Qty. (Available Stock + Transfer Stock)"
                    arrow
                    placement="bottom"
                  >
                    <Typography
                      fontSize="16px"
                      fontWeight="bold"
                      sx={{
                        textDecoration: "underline",
                        textDecorationStyle: "dotted",
                      }}
                    >
                      Transfer Qty
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Box p="10px">
                <TextField
                  sx={{ width: "100px" }}
                  size="small"
                  value={transferQuantity === 0 ? "" : transferQuantity}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "") {
                      setTransferQuantity(0);
                      setTransferQuantityError(
                        `Transfer quantity must be at least ${MIN_TRANSFER_QUANTITY}`,
                      );
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        setTransferQuantity(numValue);
                        const error = validateTransferQuantity(numValue);
                        setTransferQuantityError(error);
                      }
                    }
                  }}
                  type="number"
                  error={!!transferQuantityError}
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Typography fontSize="12px" color={red[500]} fontWeight="bold">
              ⚠ Clicking &apos;Save&apos; will instantly move the stock from
              the Undistibution Qty to the channel.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <StockTransferSaveAlerts
        activeAlert={activeAlert}
        onClose={handleAlertClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
