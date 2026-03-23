import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, ThemeProvider } from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CreateBundle from "@/features/product-list/components/CreateBundle";
import ProductAlertDialog from "@/features/product-list/components/ProductAlertDialog";
import ProductInfoBulkUpdate from "@/features/product-list/components/ProductInfoBulkUpdate";
import SearchForm from "@/features/product-list/components/SearchForm";
import usePostBulkUploadAssetFiles from "@/features/product-list/hooks/usePostBulkUploadAssetFiles";
import usePostProductList from "@/features/product-list/hooks/usePostProductList";
import usePostProductListExportExcel from "@/features/product-list/hooks/usePostProductListExportExcel";
import {
  PAGINATION_MODEL_DEFAULT,
  COMMON_TABLE_PAGE_SIZE_OPTIONS,
} from "@/features/product-list/models/constants";
import { PRODUCT_LIST_COLUMNS } from "@/features/product-list/modules/columns";
import { transformProductList } from "@/features/product-list/modules/transform";

import TotalResult from "@/shared/components/text/TotalResult";
import { BRAND_ID_LIST } from "@/shared/constants";
import {
  OmsProductSearchRequestDTO,
  OmsProductSearchRequestDtoDirectionEnum,
  OmsProductSearchRequestDtoProductInfoStatusEnum,
  OmsProductSearchRequestDtoProductTypeEnum,
} from "@/shared/generated/pim/types/Product";
import { useBrandId } from "@/shared/hooks/useBrandId";
import { usePIMPagination } from "@/shared/hooks/usePIMPagination";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { validateImageSize } from "@/shared/utils/imageUtils";

export default function ProductList() {
  const { timezone } = useTimezoneStore();
  const { data: session } = useSession();
  const workerId = session?.user.id ?? "";
  const apiRef = useGridApiRef();
  const brandId = useBrandId();

  // useForm 초기값
  const defaultValues = {
    skuCode: "",
    sapCode: "",
    modelCode: "",
    upcCode: "",
    sapName: "",
    productInfoStatus: ["All"],
    productType: ["SINGLE"],
  };

  // 파라미터 초기값
  const defaultParams = useMemo(
    () => ({
      brandId: "",
      worker: workerId,
      productInfoStatus: OmsProductSearchRequestDtoProductInfoStatusEnum.ALL,
      productType: OmsProductSearchRequestDtoProductTypeEnum.SINGLE,
      detail: false,
      direction: OmsProductSearchRequestDtoDirectionEnum.NEXT,
      pageNo: PAGINATION_MODEL_DEFAULT.page,
      pageSize: PAGINATION_MODEL_DEFAULT.pageSize,
    }),
    [workerId],
  );

  // useForm 초기화
  const methods = useForm({ defaultValues });

  const [params, setParams] =
    useState<OmsProductSearchRequestDTO>(defaultParams);
  const [selectedRows, setSelectedRows] = useState<GridRowModel[]>([]);
  const [openErrorDialog, setOpenErrorDialog] =
    useState<React.ReactNode | null>(null);

  // 📍 상품 목록 조회 API
  const { mutate, data, isPending } = usePostProductList();
  const { rows, pagination } = transformProductList(data, timezone);
  const rowLength = rows.length;

  // 📍 상품 검색 결과를 Excel로 내보내고 Slack으로 전송 API
  const { mutate: mutateExportExcel } = usePostProductListExportExcel();

  // 📍 이미지 Bulk Upload API
  const { mutate: bulkUploadAssetFiles } = usePostBulkUploadAssetFiles();

  // mutate 함수 래핑
  const handleMutate = useCallback(
    (params: OmsProductSearchRequestDTO) => {
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

  // 행 선택 변경 핸들러
  const onRowSelectionModelChange = useCallback(
    (newRowSelectionModel: GridRowSelectionModel) => {
      const currentSelectedRows = newRowSelectionModel.map((id) => {
        const row = apiRef.current.getRow(id);

        // single 상품만 선택 가능하기 때문에 데이터 처리 필요
        return {
          id: row.sapCode[0],
          sapCode: row.sapCode[0],
          sapName: row.sapName[0],
          quantity: row.quantity[0],
          selected: true,
        };
      });

      setSelectedRows(currentSelectedRows);
    },
    [apiRef],
  );

  const handleOpenFileExplorer = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg";
    input.multiple = true;

    input.onchange = async (event) => {
      const { files } = event.target as HTMLInputElement;
      if (!files) return;

      try {
        // ATIISSU면 3600, 아니면 1920으로 검증
        const requiredSize = brandId === BRAND_ID_LIST.ATIISSU ? 3600 : 1920;
        await validateImageSize(Array.from(files), requiredSize);

        if (!workerId) throw new Error("no worker id");
        bulkUploadAssetFiles({ files, workerId });
      } catch (err) {
        setOpenErrorDialog((err as Error).message);
        console.error(err);
      }
    };

    input.click();
  }, [bulkUploadAssetFiles, workerId, setOpenErrorDialog, brandId]);

  return (
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
          <div className="mb-[8px] flex justify-between">
            <div className="flex items-center gap-4">
              <TotalResult
                totalResult={data?.pagination.totalCount ?? 0}
                classNames="!mb-0"
              />
            </div>

            <div className="flex items-center gap-[8px]">
              <CreateBundle
                selectedRows={selectedRows}
                params={params}
                refetch={handleMutate}
              />

              <Button
                variant="outlined"
                color="primary"
                onClick={() => mutateExportExcel(params)}
                startIcon={<FileDownloadIcon />}
              >
                Export
              </Button>

              {/* Product Info Bulk Update Button */}
              <ProductInfoBulkUpdate />

              {/* Product Image Bulk Update Button */}
              <Button
                variant="outlined"
                color="warning"
                onClick={handleOpenFileExplorer}
                startIcon={<UploadFileIcon />}
              >
                Product Image Bulk Update
              </Button>
            </div>
          </div>

          <div className="h-[calc(100vh-210px)] min-h-[400px]">
            <ThemeProvider theme={MUIDataGridTheme}>
              <DataGridPro
                apiRef={apiRef}
                columns={PRODUCT_LIST_COLUMNS as GridColDef[]}
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
                checkboxSelection
                onRowSelectionModelChange={onRowSelectionModelChange}
                isRowSelectable={(params) =>
                  params.row.productType === "Single"
                }
                rowHeight={24}
                getRowHeight={() => "auto"}
                sx={{
                  "& .MuiDataGrid-overlay": {
                    paddingTop: rowLength > 0 ? "80px" : "0px",
                    alignItems: rowLength > 0 ? "flex-start" : "center",
                  },
                }}
              />
            </ThemeProvider>
          </div>
        </div>
      </div>

      {/* 에러 알럿 */}
      <ProductAlertDialog
        openErrorDialog={openErrorDialog}
        setOpenErrorDialog={setOpenErrorDialog}
      />
    </FormProvider>
  );
}
