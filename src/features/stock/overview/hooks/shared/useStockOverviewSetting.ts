import { isEqual } from "lodash";
import { useCallback, useMemo, useState } from "react";

import useStockOverviewFilterForm from "@/features/stock/overview/hooks/shared/useStockOverviewFilterForm";
import useStockPagination from "@/features/stock/overview/hooks/shared/useStockPagination";
import { transformStockDashboardData } from "@/features/stock/overview/models/transforms";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import { PageResponseStockDashboardResponse } from "@/shared/generated/oms/types/Stock";
import useCurrentTime from "@/shared/hooks/useCurrentTime";

interface UseStockOverviewSettingParams {
  useGetData: (params: StockDashboardRequestForm | null) => {
    isLoading: boolean;
    data: PageResponseStockDashboardResponse | null | undefined;
    isFetching: boolean;
    isSuccess: boolean;
    refetch: () => void;
  };
}

export default function useStockOverviewSetting({
  useGetData,
}: UseStockOverviewSettingParams) {
  // 검색 파라미터 state 관리 (Search 버튼 클릭 시에만 업데이트)
  const [searchParams, setSearchParams] =
    useState<StockDashboardRequestForm | null>(null);

  const { defaultValues, channelList, form } = useStockOverviewFilterForm();

  const { control } = form;

  const { isLoading, data, isFetching, isSuccess, refetch } =
    useGetData(searchParams);

  const { paginationModel, handleChangePaginationModel } = useStockPagination({
    searchParams,
    setSearchParams,
    form,
  });

  const { UpdatedAt } = useCurrentTime({
    isFetching,
    isSuccess,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  // 데이터를 평탄화하여 행으로 변환
  const rows = useMemo(() => {
    return data?.data && data.data.length > 0
      ? transformStockDashboardData(data.data)
      : [];
  }, [data]);

  // Search 버튼 클릭 핸들러
  const handleSearch = useCallback(() => {
    const {
      watch,
      formState: { errors },
    } = form;
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (isEqual(watch(), searchParams)) {
      return refetch();
    }

    setSearchParams(watch());
  }, [form, searchParams, refetch]);

  // Reset 버튼 클릭 핸들러
  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    setSearchParams(defaultValues);
  }, [form, defaultValues]);

  return {
    // Form 관련
    form,
    control,
    channelList,
    handleSearch,
    handleReset,

    // Data 관련
    searchParams,
    data,
    isLoading,
    rows,

    // Table 관련
    paginationModel,
    handleChangePaginationModel,
    UpdatedAt,
  };
}
