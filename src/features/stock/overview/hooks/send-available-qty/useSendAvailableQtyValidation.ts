import { GridRowModel } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import { AlertType } from "@/features/stock/overview/components/send-available-qty/SendAvailableQtyAlerts";

import {
  ChannelStockResponseChannelSendStatusEnum,
  StockDashboardRequestProductTypeEnum,
} from "@/shared/generated/oms/types/Stock";

// 외부 채널 API 부하 우려로 한 번에 전송 가능한 SKU 최대 개수
export const MAX_SEND_SKU_COUNT = 100;

interface UseSendAvailableQtyValidationProps {
  selectedChannelRows: GridRowModel[];
}

export default function useSendAvailableQtyValidation({
  selectedChannelRows,
}: UseSendAvailableQtyValidationProps) {
  // 모든 선택 항목이 Single 제품 타입인지 (번들 전송 불가)
  const isProductTypeSingle = useMemo(
    () =>
      selectedChannelRows.every(
        (row) =>
          row.productType === StockDashboardRequestProductTypeEnum.SINGLE,
      ),
    [selectedChannelRows],
  );

  // 단일 채널 선택 여부
  const isChannelSingle = useMemo(() => {
    const checkedChannelNames = new Set(
      selectedChannelRows.map((row) => row.channelName),
    );
    return checkedChannelNames.size === 1;
  }, [selectedChannelRows]);

  // 선택된 모든 채널의 Channel Send Status가 ON인지
  const isEveryChannelSendStatusOn = useMemo(
    () =>
      selectedChannelRows.every(
        (row) => row.status === ChannelStockResponseChannelSendStatusEnum.ON,
      ),
    [selectedChannelRows],
  );

  // 선택된 고유 SKU 개수
  const selectedSkuCount = useMemo(
    () => new Set(selectedChannelRows.map((row) => row.sku)).size,
    [selectedChannelRows],
  );

  const validateSendAvailableQty = (): AlertType => {
    // 제품 선택 필수 (전체 재고 전송 불가)
    if (selectedChannelRows.length === 0) {
      return "noItemsSelected";
    }

    // 번들 전송 불가 (Single 제품만 가능)
    if (!isProductTypeSingle) {
      return "singleOnly";
    }

    // 한 번에 하나의 채널에만 전송 가능
    if (!isChannelSingle) {
      return "multiChannelSelected";
    }

    // Channel Send Status가 ON인 항목만 전송 가능
    if (!isEveryChannelSendStatusOn) {
      return "channelSendStatusOff";
    }

    // 최대 100개 SKU까지 전송 가능
    if (selectedSkuCount > MAX_SEND_SKU_COUNT) {
      return "maxSkuExceeded";
    }

    return null;
  };

  return {
    isProductTypeSingle,
    isChannelSingle,
    isEveryChannelSendStatusOn,
    selectedSkuCount,
    validateSendAvailableQty,
  };
}
