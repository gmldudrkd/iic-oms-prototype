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

import usePatchSafetyStock from "@/features/stock/overview/hooks/safety-stock/usePatchSafetyStock";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import {
  OnlineStockSafetyQuantityUpdateRequest,
  OnlineStockSafetyQuantityUpdateRequestBrandEnum,
  OnlineStockSafetyQuantityUpdateRequestCorporationEnum,
} from "@/shared/generated/oms/types/Stock";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { MUIDataGridTheme } from "@/shared/styles/theme";

const MIN_SAFETY_STOCK = 0;

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
  const [safetyStock, setSafetyStock] = useState<number | string>(
    MIN_SAFETY_STOCK,
  );

  const { UpdatedAt } = useCurrentTime({
    isFetching: false,
    isSuccess: open,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const { mutate: patchSafetyStock } = usePatchSafetyStock();

  const handleClose = () => {
    setOpen(false);
    setSafetyStock(MIN_SAFETY_STOCK);
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    handleClose();
  };

  const handleSave = () => {
    if (safetyStock === "" || Number(safetyStock) < MIN_SAFETY_STOCK) {
      return;
    }

    const patchData: OnlineStockSafetyQuantityUpdateRequest = {
      brand: watch(
        "brand",
      ) as unknown as OnlineStockSafetyQuantityUpdateRequestBrandEnum,
      corporation: watch(
        "corporation",
      ) as unknown as OnlineStockSafetyQuantityUpdateRequestCorporationEnum,
      skus: rows.map((row) => row.sku),
      safetyQuantity: Number(safetyStock),
    };

    patchSafetyStock(patchData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const columns: GridColDef[] = [
    { field: "sku", headerName: "SKU Code", flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",

      flex: 2,
    },
    {
      field: "undistributed",
      headerName: "Undistributed Qty",
      flex: 1,

      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        if (value < 0) {
          return <Box color="error.main">{value}</Box>;
        }
        return value;
      },
    },
  ];

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle bgcolor="primary.main">
        <div className="flex items-center justify-between">
          <Typography fontSize="20px" fontWeight="bold" color="white">
            Change Safety Stock
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
              width="200px"
            >
              <Typography fontSize="16px" fontWeight="bold">
                Safety Qty
              </Typography>
            </Box>
            <Box p="10px">
              <TextField
                sx={{ width: "150px" }}
                size="small"
                value={safetyStock}
                onChange={(e) => {
                  const { value } = e.target;

                  // 빈 문자열 허용
                  if (value === "") {
                    setSafetyStock("");
                    return;
                  }

                  // 숫자만 허용
                  if (/^\d+$/.test(value)) {
                    setSafetyStock(value);
                  }
                }}
                error={safetyStock === ""}
                type="number"
              />
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt="20px">
          <Typography fontSize="12px" color={red[500]} fontWeight="bold">
            ⚠ It is immediately applied to the ‘Undistributed’ quantity and
            becomes available for use.
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
  );
}
