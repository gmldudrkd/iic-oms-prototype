import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Tabs,
  Tab,
  Button,
  DialogActions,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ChannelStockHistoryDataGrid from "@/features/stock/history/components/channel-stock-history/ChannelStockHistoryDataGrid";
import ChannelStockHistoryFilter from "@/features/stock/history/components/channel-stock-history/ChannelStockHistoryFilter";
import OnlineStockHistoryDataGrid from "@/features/stock/history/components/online-stock-history/OnlineStockHistoryDataGrid";
import OnlineStockHistoryFilter from "@/features/stock/history/components/online-stock-history/OnlineStockHistoryFilter";
import ProductInfoTable from "@/features/stock/history/components/shared/ProductInfoTable";
import useGetChannelStockHistory from "@/features/stock/history/hooks/channel-stock-history/useGetChannelStockHistory";
import useGetOnlineStockHistory from "@/features/stock/history/hooks/online-stock-history/useGetOnlineStockHistory";
import {
  StockHistoryDetailParamsForm,
  StockHistoryTabType,
} from "@/features/stock/history/models/types";
import {
  CHANNEL_STOCK_HISTORY_TAB_VALUE,
  ONLINE_STOCK_HISTORY_TAB_VALUE,
} from "@/features/stock/history/modules/constants";

import { queryKeys } from "@/shared/queryKeys";

interface StockHistoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function StockHistoryDetailDialog({
  open,
  onClose,
}: StockHistoryDetailDialogProps) {
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState<StockHistoryTabType>(
    ONLINE_STOCK_HISTORY_TAB_VALUE,
  );

  const { watch, reset } = useFormContext<StockHistoryDetailParamsForm>();

  const { data: onlineStockHistory } = useGetOnlineStockHistory({
    params: watch("onlineStockHistory"),
    sku: watch("sku"),
    isDialogOpen: open,
  });

  const { data: channelStockHistory } = useGetChannelStockHistory({
    params: watch("channelStockHistory"),
    sku: watch("sku"),
    isDialogOpen: open,
  });

  const { sku, productName } = watch();

  const handleClose = () => {
    const currentOnlineParams = watch("onlineStockHistory");
    const currentChannelParams = watch("channelStockHistory");
    const currentSku = watch("sku");

    // data 초기화
    queryClient.setQueryData(
      queryKeys.onlineStockHistory({
        params: currentOnlineParams,
        sku: currentSku,
      }),
      [],
    );
    queryClient.setQueryData(
      queryKeys.channelStockHistory({
        params: currentChannelParams,
        sku: currentSku,
      }),
      [],
    );

    // 상태 초기화
    onClose();
    reset();
    setCurrentTab(ONLINE_STOCK_HISTORY_TAB_VALUE);
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    handleClose();
  };

  const isOnlineStockHistory = currentTab === ONLINE_STOCK_HISTORY_TAB_VALUE;
  const isChannelStockHistory = currentTab === CHANNEL_STOCK_HISTORY_TAB_VALUE;

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="lg" fullWidth>
      <DialogTitle bgcolor="primary.main">
        <Typography fontSize="20px" fontWeight="bold" color="white">
          Stock History Detail
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px 24px", marginTop: "10px" }}>
        <ProductInfoTable sku={sku} productName={productName} />
        <div className="mt-[24px] flex items-center justify-between">
          <Tabs
            value={currentTab}
            onChange={(event, newValue) =>
              setCurrentTab(newValue as StockHistoryTabType)
            }
          >
            <Tab value={ONLINE_STOCK_HISTORY_TAB_VALUE} label="Online" />
            <Tab value={CHANNEL_STOCK_HISTORY_TAB_VALUE} label="Channel" />
          </Tabs>

          {isOnlineStockHistory && <OnlineStockHistoryFilter />}
          {isChannelStockHistory && <ChannelStockHistoryFilter />}
        </div>

        {isOnlineStockHistory && (
          <OnlineStockHistoryDataGrid
            onlineStockHistory={onlineStockHistory || []}
          />
        )}
        {isChannelStockHistory && (
          <ChannelStockHistoryDataGrid
            channelStockHistory={channelStockHistory || []}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ "&": { padding: "0 24px 24px 24px" } }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
