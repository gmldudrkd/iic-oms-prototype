import { GridRowModel } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import { AlertType } from "@/features/stock/overview/components/pre-order-setting/PreOrderSettingAlerts";

import {
  ChannelStockResponseChannelSendStatusEnum,
  StockDashboardRequestProductTypeEnum,
} from "@/shared/generated/oms/types/Stock";

interface UsePreOrderSettingValidationProps {
  selectedChannelRows: GridRowModel[];
}

export default function usePreOrderSettingValidation({
  selectedChannelRows,
}: UsePreOrderSettingValidationProps) {
  const isProductTypeSingle = useMemo(
    () =>
      selectedChannelRows.every(
        (row) =>
          row.productType === StockDashboardRequestProductTypeEnum.SINGLE,
      ),
    [selectedChannelRows],
  );

  const isChannelSingle = useMemo(() => {
    const checkedChannelNames = new Set(
      selectedChannelRows.map((row) => row.channelName),
    );

    return checkedChannelNames.size === 1;
  }, [selectedChannelRows]);

  const isEveryChannelSendStatusOn = useMemo(
    () =>
      selectedChannelRows.every(
        (row) => row.status === ChannelStockResponseChannelSendStatusEnum.ON,
      ),
    [selectedChannelRows],
  );

  const validatePreOrderSetting = (): AlertType => {
    if (selectedChannelRows.length === 0) {
      return "noItemsSelected";
    }

    if (!isProductTypeSingle) {
      return "singleOnly";
    }

    if (!isChannelSingle) {
      return "multiChannelSelected";
    }

    if (!isEveryChannelSendStatusOn) {
      return "channelSendStatusOff";
    }

    return null;
  };

  return {
    isChannelSingle,
    isEveryChannelSendStatusOn,
    validatePreOrderSetting,
  };
}
