import { GridRowModel } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import { AlertType } from "@/features/stock/overview/components/stock-transfer/StockTransferAlerts";

import {
  ChannelStockResponseChannelSendStatusEnum,
  StockDashboardRequestProductTypeEnum,
} from "@/shared/generated/oms/types/Stock";

interface UseStockTransferValidationProps {
  selectedChannelRows: GridRowModel[];
}

export default function useStockTransferValidation({
  selectedChannelRows,
}: UseStockTransferValidationProps) {
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

  const validateStockTransfer = (): AlertType => {
    if (selectedChannelRows.length === 0) {
      return "noItemsSelected";
    }

    // 제품 타입 단일 선택 검증
    if (!isProductTypeSingle) {
      return "singleOnly";
    }

    // 채널 단일 선택 검증
    if (!isChannelSingle) {
      return "multiChannelSelected";
    }

    // 모든 채널의 연동 상태가 ON인지 검증
    if (!isEveryChannelSendStatusOn) {
      return "channelSendStatusOff";
    }

    return null;
  };

  return {
    isChannelSingle,
    isEveryChannelSendStatusOn,
    validateStockTransfer,
  };
}
