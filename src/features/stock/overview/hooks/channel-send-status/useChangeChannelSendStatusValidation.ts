import { useCallback } from "react";

import { AlertType } from "@/features/stock/overview/components/channel-send-status/ChangeChannelSendStatusAlerts";
import {
  ChannelSelection,
  OffPeriod,
  StockDashboardRequestForm,
} from "@/features/stock/overview/models/types";

import { StockDashboardRequestProductTypeEnum } from "@/shared/generated/oms/types/Stock";

export default function useChangeChannelSendStatusValidation() {
  const validateChangeChannelSendSaveStatus = useCallback(
    (offPeriod: OffPeriod) => {
      const { startDate, endDate } = offPeriod;
      if (!startDate || endDate === undefined) {
        return "noPeriodSelected";
      }
      if (endDate && endDate.isBefore(startDate)) {
        return "endDateBeforeStartDate";
      }
      return null;
    },
    [],
  );

  const validateChangeChannelSendStatus = ({
    selectedChannelMap,
    searchParams,
  }: {
    selectedChannelMap: Map<string, ChannelSelection>;
    searchParams: StockDashboardRequestForm;
  }): AlertType => {
    const { productTypes } = searchParams;

    const isProductTypeSingle =
      productTypes.length === 1 &&
      productTypes[0] === StockDashboardRequestProductTypeEnum.SINGLE;

    if (selectedChannelMap.size === 0) {
      return "noItemsSelected";
    }

    if (!isProductTypeSingle) {
      return "singleOnly";
    }

    return null;
  };

  return {
    validateChangeChannelSendSaveStatus,
    validateChangeChannelSendStatus,
  };
}
