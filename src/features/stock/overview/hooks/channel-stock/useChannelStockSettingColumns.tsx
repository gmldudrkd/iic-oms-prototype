import { Checkbox } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import ChannelCheckboxCell from "@/features/stock/overview/components/channel-stock/ChannelCheckboxCell";
import useStockSettingColumns from "@/features/stock/overview/hooks/shared/useStockSettingColumns";
import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import type { ChannelSelection } from "@/features/stock/overview/models/types";

interface UseChannelStockSettingColumnsProps {
  selectedChannelMap?: Map<string, ChannelSelection>;
  onChannelCheckboxChange?: (
    rowId: string,
    sku: string,
    channelName: string,
    checked: boolean,
    channelData: ChannelStockData,
    singleSku: string,
  ) => void;
  onHeaderCheckboxChange?: (checked: boolean) => void;
  headerCheckboxState?: {
    checked: boolean;
    indeterminate: boolean;
  };
  onOffPeriodScheduledClick?: ({
    rowId,
    sku,
    channelName,
    channelData,
  }: ChannelSelection) => void;
  onPreOrderExpiredAtClick?: ({
    rowId,
    sku,
    channelName,
    channelData,
  }: ChannelSelection) => void;
}

export default function useChannelStockSettingColumns(
  props?: UseChannelStockSettingColumnsProps,
) {
  const {
    selectedChannelMap,
    onChannelCheckboxChange,
    onHeaderCheckboxChange,
    headerCheckboxState,
    onOffPeriodScheduledClick,
    onPreOrderExpiredAtClick,
  } = props || {};

  const { columns: baseColumns, columnGroupingModel } = useStockSettingColumns({
    variant: "channel",
    onOffPeriodScheduledClick,
    onPreOrderExpiredAtClick,
  });

  // columns에 채널 체크박스 핸들러 주입
  const columns = useMemo(() => {
    if (!onChannelCheckboxChange) {
      return baseColumns;
    }

    return baseColumns.map((col) => {
      if (col.field === "channelCheckbox" && onChannelCheckboxChange) {
        return {
          ...col,
          renderHeader: () => (
            <Checkbox
              checked={headerCheckboxState?.checked ?? false}
              indeterminate={headerCheckboxState?.indeterminate ?? false}
              onChange={(e) => onHeaderCheckboxChange?.(e.target.checked)}
              size="small"
              sx={{ padding: 0 }}
            />
          ),
          renderCell: (params: GridRenderCellParams) => (
            <ChannelCheckboxCell
              params={params}
              selectedChannelMap={selectedChannelMap!}
              onCheckboxChange={onChannelCheckboxChange}
            />
          ),
        };
      }
      return col;
    });
  }, [
    baseColumns,
    selectedChannelMap,
    onChannelCheckboxChange,
    onHeaderCheckboxChange,
    headerCheckboxState,
  ]);

  return { columns, columnGroupingModel };
}
