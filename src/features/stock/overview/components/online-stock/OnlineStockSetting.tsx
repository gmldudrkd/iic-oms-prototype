import { memo } from "react";
import { FormProvider } from "react-hook-form";

import OnlineStockDataGrid from "@/features/stock/overview/components/online-stock/OnlineStockDataGrid";
import OnlineStockSearchFilter from "@/features/stock/overview/components/online-stock/OnlineStockSearchFilter";
import useGetOnlineStockOverview from "@/features/stock/overview/hooks/online-stock/useGetOnlineStockOverview";
import useStockOverviewSetting from "@/features/stock/overview/hooks/shared/useStockOverviewSetting";

function OnlineStockSetting() {
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
    useGetData: useGetOnlineStockOverview,
  });

  return (
    <FormProvider {...form}>
      <OnlineStockSearchFilter
        control={control}
        channelList={channelList}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {searchParams && (
        <OnlineStockDataGrid
          totalCount={data?.totalCount ?? 0}
          rows={rows}
          isLoading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handleChangePaginationModel}
          UpdatedAt={UpdatedAt}
        />
      )}
    </FormProvider>
  );
}

export default memo(OnlineStockSetting);
