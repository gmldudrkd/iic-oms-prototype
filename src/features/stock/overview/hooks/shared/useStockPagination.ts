import { GridPaginationModel } from "@mui/x-data-grid-pro";
import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";

interface UseStockPaginationProps {
  searchParams: StockDashboardRequestForm | null;
  setSearchParams: (params: StockDashboardRequestForm | null) => void;
  form?: UseFormReturn<StockDashboardRequestForm>;
}

export default function useStockPagination({
  searchParams,
  setSearchParams,
  form,
}: UseStockPaginationProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
  });

  const handleChangePaginationModel = useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);

      // form의 page와 size도 동기화
      if (form) {
        form.setValue("page", model.page);
        form.setValue("size", model.pageSize);
      }

      if (searchParams) {
        // 페이지 또는 사이즈가 실제로 변경된 경우에만 업데이트
        if (
          searchParams.page !== model.page ||
          searchParams.size !== model.pageSize
        ) {
          setSearchParams({
            ...searchParams,
            page: model.page,
            size: model.pageSize,
          });
        }
      }
    },
    [searchParams, setSearchParams, form],
  );

  return {
    paginationModel,
    handleChangePaginationModel,
  };
}
