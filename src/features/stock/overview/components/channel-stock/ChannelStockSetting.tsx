import { memo } from "react";
import { FormProvider } from "react-hook-form";

import ChannelStockDataGrid from "@/features/stock/overview/components/channel-stock/ChannelStockDataGrid";
import ChannelStockSearchFilter from "@/features/stock/overview/components/channel-stock/ChannelStockSearchFilter";
import useGetChannelStockOverview from "@/features/stock/overview/hooks/channel-stock/useGetChannelStockOverview";
import useStockOverviewSetting from "@/features/stock/overview/hooks/shared/useStockOverviewSetting";

function ChannelStockSetting() {
  const {
    form,
    control,
    channelList,
    handleSearch,
    handleReset,
    searchParams,
    data,
    isLoading,
    rows,
    paginationModel,
    handleChangePaginationModel,
    UpdatedAt,
  } = useStockOverviewSetting({
    useGetData: useGetChannelStockOverview,
  });

  return (
    <FormProvider {...form}>
      <ChannelStockSearchFilter
        control={control}
        channelList={channelList}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {searchParams && (
        <ChannelStockDataGrid
          totalCount={data?.totalCount ?? 0}
          rows={rows}
          isLoading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handleChangePaginationModel}
          UpdatedAt={UpdatedAt}
          searchParams={searchParams}
        />
      )}
    </FormProvider>
  );
}

export default memo(ChannelStockSetting);
