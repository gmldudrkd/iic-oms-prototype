import { ThemeProvider } from "@mui/material";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState, useEffect } from "react";

import { useChannelDefaultRateColumns } from "@/features/stock/distributionSetting/hooks/useChannelDefaultRateColumns";
import useGetOnlineStockSettings from "@/features/stock/distributionSetting/hooks/useGetOnlineStockSettings";
import usePatchOnlineStockDistributionRates from "@/features/stock/distributionSetting/hooks/usePatchOnlineStockDistributionRates";
import { transformOnlineStockSettings } from "@/features/stock/distributionSetting/models/transform";

import Title from "@/shared/components/text/Title";
import {
  OnlineStockSettingDistributionUpdateRequest,
  OnlineStockSettingResponse,
} from "@/shared/generated/oms/types/Stock";
import { MUIDataGridTheme } from "@/shared/styles/theme";

export default function ChannelDefaultRate() {
  const [rows, setRows] = useState<OnlineStockSettingResponse[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  // 📍 온라인 재고 설정 목록 조회 API
  const { data } = useGetOnlineStockSettings();
  // 📍 온라인 재고 채널 분배 비율 설정 API 호출
  const { mutate } = usePatchOnlineStockDistributionRates(setIsEdit);
  const transformedData = useMemo(
    () => transformOnlineStockSettings(data),
    [data],
  );

  useEffect(() => {
    if (transformedData) {
      setRows(transformedData);
    }
  }, [transformedData]);

  const columns = useChannelDefaultRateColumns({ rows, setRows, isEdit });

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleBackToList = () => {
    setIsEdit(false);
    setRows(transformedData);
  };

  const handleSave = () => {
    const requestData = {
      requests: rows.map((row) => ({
        channelType: row.channelType.name,
        distributionRate: row.distributionRate,
        distributionPriority: row.distributionPriority,
      })),
    };

    mutate(requestData as OnlineStockSettingDistributionUpdateRequest);
  };

  return (
    <>
      <Title text="Channel Default Rate" variant="bordered">
        <div className="flex flex-row gap-[8px]">
          {!isEdit && (
            <Button variant="outlined" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
          {isEdit && (
            <>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ color: "primary.main" }}
                disableElevation
                onClick={handleBackToList}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="inherit"
                sx={{ color: "white", backgroundColor: "#1E88E5" }}
                disableElevation
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </Title>
      <ThemeProvider theme={MUIDataGridTheme}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableColumnResize
          disableDensitySelector
          hideFooter
          //   sx={DATA_GRID_STYLES}
        />
      </ThemeProvider>
    </>
  );
}
