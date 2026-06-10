import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ThemeProvider,
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

import SendAvailableQtySaveAlerts, {
  AlertType,
} from "@/features/stock/overview/components/send-available-qty/SendAvailableQtySaveAlerts";
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

interface SendAvailableQtyDialogProps {
  rows: GridRowModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SendAvailableQtyDialog({
  rows,
  open,
  setOpen,
}: SendAvailableQtyDialogProps) {
  const { watch } = useFormContext<StockDashboardRequestForm>();
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);

  const { UpdatedAt } = useCurrentTime({
    isFetching: false,
    isSuccess: open,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const { mutate: patchTransferStock } = usePatchTransferStock();

  const columns: GridColDef[] = [
    { field: "sku", headerName: "SKU Code", flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1.4,
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
    setActiveAlert("confirmSend");
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
      // 선택한 SKU의 Available Qty를 채널로 전송 (수량 입력 없음)
      transferQuantity: 0,
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
              Send Available Qty
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
                  Send To
                </Typography>
              </Box>
              <Box p="10px" display="flex" alignItems="center" flexGrow={1}>
                {rows.length > 0 && (
                  <Typography>{rows[0].channelName}</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Typography fontSize="12px" color={red[500]} fontWeight="bold">
              ⚠️ Clicking &apos;Save&apos; sends the selected SKUs&apos;
              Available Qty to the channel.
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

      <SendAvailableQtySaveAlerts
        activeAlert={activeAlert}
        onClose={handleAlertClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
