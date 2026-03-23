import { ThemeProvider } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import SearchForm from "@/features/channel-product-list/components/SearchForm";
import usePostProductChannelList from "@/features/channel-product-list/hooks/usePostProductChannelList";
import { transformProductChannelList } from "@/features/channel-product-list/models/transform";
import { CHANNEL_PRODUCT_LIST_COLUMNS } from "@/features/channel-product-list/modules/columns";
import {
  COMMON_TABLE_PAGE_SIZE_OPTIONS,
  PAGINATION_MODEL_DEFAULT,
} from "@/features/product-list/models/constants";

import TotalResult from "@/shared/components/text/TotalResult";
import {
  OmsChannelProductSearchRequestDTO,
  OmsChannelProductSearchRequestDtoChannelActiveEnum,
  OmsChannelProductSearchRequestDtoDirectionEnum,
  OmsChannelProductSearchRequestDtoProductInfoStatusEnum,
  OmsChannelProductSearchRequestDtoProductTypeEnum,
} from "@/shared/generated/pim/types/Product";
import { useBrandId } from "@/shared/hooks/useBrandId";
import { usePIMPagination } from "@/shared/hooks/usePIMPagination";
import { MUIDataGridTheme } from "@/shared/styles/theme";

export default function ChannelProductList() {
  const brandId = useBrandId();

  // 필터 초기값
  const defaultValues = {
    skuCode: "",
    sapCode: "",
    modelCode: "",
    upcCode: "",
    sapName: "",
    channel: ["All"],
    channelAvailability: ["All"],
    productInfoStatus: ["All"],
    productType: ["SINGLE"],
  };

  const defaultParams = useMemo(
    () => ({
      brandId: "",
      channelName: OmsChannelProductSearchRequestDtoChannelActiveEnum.ALL,
      channelActive: OmsChannelProductSearchRequestDtoChannelActiveEnum.ALL,
      productInfoStatus:
        OmsChannelProductSearchRequestDtoProductInfoStatusEnum.ALL,
      productType: OmsChannelProductSearchRequestDtoProductTypeEnum.SINGLE,
      direction: OmsChannelProductSearchRequestDtoDirectionEnum.NEXT,
      pageNo: PAGINATION_MODEL_DEFAULT.page,
      pageSize: PAGINATION_MODEL_DEFAULT.pageSize,
    }),
    [],
  );

  // 파라미터 초기값
  const [params, setParams] =
    useState<OmsChannelProductSearchRequestDTO>(defaultParams);

  // useForm 초기화
  const methods = useForm({ defaultValues });

  // 📍 상품 목록 조회 API
  const { mutate, data, isPending } = usePostProductChannelList();
  const { rows, pagination } = transformProductChannelList(data);
  const rowLength = rows.length;

  // mutate 함수 래핑
  const handleMutate = useCallback(
    (params: OmsChannelProductSearchRequestDTO) => {
      mutate(params);
    },
    [mutate],
  );

  // params 변경 시 API 호출
  useEffect(() => {
    if (params.brandId) {
      mutate(params);
    }
  }, [params, mutate]);

  // 권한 변경 시 파라미터 초기화
  useEffect(() => {
    if (brandId) {
      setParams({ ...defaultParams, brandId });
      methods.reset();
    }
  }, [brandId, defaultParams, methods]);

  // 페이지네이션 변경 핸들러
  const { handlePaginationChange } = usePIMPagination({
    params,
    setParams,
    data,
  });

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-[24px]">
          <div className="border-b border-outlined bg-white px-[24px] py-[24px]">
            <SearchForm
              params={params}
              setParams={setParams}
              mutate={handleMutate}
            />
          </div>

          <div className="border-[1px] border-solid border-[#E0E0E0] bg-white p-[24px]">
            <TotalResult totalResult={pagination.totalCount} />
            <div className="h-[calc(100vh-210px)] min-h-[400px]">
              <DataGridPro
                columns={CHANNEL_PRODUCT_LIST_COLUMNS as GridColDef[]}
                rows={rows}
                rowCount={pagination.totalCount}
                pagination
                // pagination을 외부에서 설정하도록 변경
                paginationModel={{
                  page: pagination.pageNo,
                  pageSize: pagination.pageSize,
                }}
                // pagination 변경 핸들러
                onPaginationModelChange={handlePaginationChange}
                paginationMode="server"
                pageSizeOptions={COMMON_TABLE_PAGE_SIZE_OPTIONS}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSorting
                loading={isPending}
                hideFooterSelectedRowCount
                rowHeight={24}
                getRowHeight={() => "auto"}
                sx={{
                  "& .MuiDataGrid-overlay": {
                    paddingTop: rowLength > 0 ? "80px" : "0px",
                    alignItems: rowLength > 0 ? "flex-start" : "center",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </ThemeProvider>
  );
}
