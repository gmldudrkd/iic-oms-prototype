import { useState, useCallback } from "react";

import { OffPeriod } from "@/features/stock/overview/models/types";

import { StockDashboardRequestChannelSendStatusEnum } from "@/shared/generated/oms/types/Stock";

export function useChangeChannelSendStatusDialog() {
  const [open, setOpen] = useState(false);
  const [offPeriod, setOffPeriod] = useState<OffPeriod>({
    channelSendStatus: StockDashboardRequestChannelSendStatusEnum.ON,
    startDate: null,
    endDate: undefined,
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setOffPeriod({
      channelSendStatus: StockDashboardRequestChannelSendStatusEnum.ON,
      startDate: null,
      endDate: null,
    });
  }, []);

  const handleOpenWithOffPeriod = useCallback((period: OffPeriod) => {
    setOffPeriod(period);
    setOpen(true);
  }, []);

  return {
    open,
    offPeriod,
    setOffPeriod,
    handleOpen,
    handleClose,
    handleOpenWithOffPeriod,
  };
}
