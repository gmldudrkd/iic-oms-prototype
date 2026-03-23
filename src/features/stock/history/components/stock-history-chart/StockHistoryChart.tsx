import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

import ProductInfoTable from "@/features/stock/history/components/shared/ProductInfoTable";
import ChartLegend from "@/features/stock/history/components/stock-history-chart/ChartLegend";
import FilterSection from "@/features/stock/history/components/stock-history-chart/FilterSection";
import useChartData from "@/features/stock/history/hooks/stock-history-chart/useChartData";
import useChartFilters from "@/features/stock/history/hooks/stock-history-chart/useChartFilters";
import { ONLINE_QTY_COLORS } from "@/features/stock/history/modules/constants";
import { generateRandomChannelColor } from "@/features/stock/history/modules/utils";

import { StockHistoryResponse } from "@/shared/generated/oms/types/Stock";
import useCurrentTime from "@/shared/hooks/useCurrentTime";

interface StockHistoryChartProps {
  historyData: StockHistoryResponse[];
  productName?: string;
  sku: string;
  isSuccess: boolean;
  isFetching: boolean;
}

export default function StockHistoryChart({
  historyData,
  sku,
  productName,
  isSuccess,
  isFetching,
}: StockHistoryChartProps) {
  const { UpdatedAt } = useCurrentTime({
    isFetching,
    isSuccess,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const {
    onlineQtyFilters,
    channelFilters,
    availableChannels,
    allOnlineQtySelected,
    someOnlineQtySelected,
    allChannelsSelected,
    someChannelsSelected,
    handleToggleAllOnlineQty,
    handleToggleAllChannels,
    handleOnlineQtyFilterChange,
    handleChannelFilterChange,
  } = useChartFilters(historyData);

  const { xAxisData, series } = useChartData({
    historyData,
    onlineQtyFilters,
    channelFilters,
    availableChannels,
  });

  if (!historyData || historyData.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">No data available</Typography>
      </Box>
    );
  }

  // Online Qty 필터 데이터 준비
  const onlineQtyFilterItems = Object.entries(onlineQtyFilters).map(
    ([key, checked]) => ({
      key,
      label: key,
      color: ONLINE_QTY_COLORS[key as keyof typeof ONLINE_QTY_COLORS],
      checked,
      onToggle: () =>
        handleOnlineQtyFilterChange(key as keyof typeof onlineQtyFilters),
    }),
  );

  // Channel 필터 데이터 준비
  const channelFilterItems = availableChannels.map((channel) => ({
    key: channel,
    label: channel,
    color: generateRandomChannelColor(availableChannels).get(channel) ?? "",
    checked: channelFilters[channel] ?? true,
    onToggle: () => handleChannelFilterChange(channel),
  }));

  return (
    <Box>
      {/* 헤더 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize="16px" fontWeight="bold">
          Product
        </Typography>
        <UpdatedAt />
      </Box>

      {/* 제품 정보 테이블 */}
      <ProductInfoTable sku={sku} productName={productName} />

      <Typography
        fontSize="16px"
        fontWeight="bold"
        sx={{
          marginTop: "25px",
          marginBottom: "20px",
        }}
      >
        Line Chart
      </Typography>

      {/* Online Qty 필터 */}
      <FilterSection
        title="Online Qty :"
        allSelected={allOnlineQtySelected}
        someSelected={someOnlineQtySelected}
        onToggleAll={handleToggleAllOnlineQty}
        filters={onlineQtyFilterItems}
      />

      {/* Channel 필터 */}
      <FilterSection
        title="Channel :"
        allSelected={allChannelsSelected}
        someSelected={someChannelsSelected}
        onToggleAll={handleToggleAllChannels}
        filters={channelFilterItems}
      />

      {/* 차트 범례 */}
      <ChartLegend />

      {/* 차트 */}
      <Box height={500}>
        <LineChart
          xAxis={[
            {
              data: xAxisData,
              scaleType: "time",
              valueFormatter: (date: Date) =>
                dayjs(date).format("YYYY-MM-DD hh:mm:ss A"),
            },
          ]}
          series={series.map((s) => ({
            id: s.id,
            label: s.label,
            data: s.data.map((val) => val ?? 0),
            color: s.color,
            showMark: true,
            curve: "linear",
          }))}
          height={500}
          margin={{ top: 10, right: 20, bottom: 80, left: 60 }}
          sx={{
            "& .MuiChartsLegend-root": {
              display: "none",
            },
            // Available 라인을 점선으로 표시
            ...series.reduce(
              (acc, s) => {
                if (s.strokeDasharray) {
                  acc[`& .MuiLineElement-series-${s.id}`] = {
                    strokeDasharray: s.strokeDasharray,
                  };
                }
                return acc;
              },
              {} as Record<string, { strokeDasharray: string }>,
            ),
          }}
        />
      </Box>
    </Box>
  );
}
