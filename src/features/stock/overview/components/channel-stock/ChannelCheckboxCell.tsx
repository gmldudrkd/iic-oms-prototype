import { Box, Checkbox } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { memo } from "react";

import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import { ChannelSelection } from "@/features/stock/overview/models/types";

interface ChannelCheckboxCellProps {
  params: GridRenderCellParams;
  selectedChannelMap: Map<string, ChannelSelection>;
  onCheckboxChange: (
    rowId: string,
    sku: string,
    channelName: string,
    checked: boolean,
    channelData: ChannelStockData,
    singleSku: string,
  ) => void;
}

function ChannelCheckboxCell({
  params,
  selectedChannelMap,
  onCheckboxChange,
}: ChannelCheckboxCellProps) {
  const channelStocks = params.row.channelStocks || [];

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      {channelStocks.map((cs: ChannelStockData, index: number) => {
        const key = `${params.row.id}-${cs.channel}`;
        const isChecked = selectedChannelMap.has(key);
        const isTotal = cs.channel === "Total";

        return (
          <Box
            key={index}
            sx={{
              borderTop: index !== 0 ? "1px solid #E0E0E0" : "none",
              backgroundColor: isTotal ? "#e7e7e7" : "transparent",
              padding: "4px 8px",
              flex: "0 0 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isTotal && (
              <Checkbox
                size="small"
                checked={isChecked}
                onChange={(e) =>
                  onCheckboxChange(
                    params.row.id,
                    params.row.sku,
                    cs.channel,
                    e.target.checked,
                    cs,
                    params.row.singleSku,
                  )
                }
                onClick={(e) => e.stopPropagation()}
                sx={{ padding: 0 }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default memo(ChannelCheckboxCell);
