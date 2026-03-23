import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { Button, FormControl, IconButton, Tooltip } from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid-pro";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import SearchInputBulk from "@/features/product-list/components/SearchInputBulk";
import SearchSingleInput from "@/features/product-list/components/SearchSingleInput";
import SearchTypeRadioGroup from "@/features/product-list/components/SearchTypeRadioGroup";
import usePostProductList from "@/features/product-list/hooks/usePostProductList";
import { MODAL_CREATE_BUNDLE_COLUMNS } from "@/features/product-list/modules/columns";
import { FormValues } from "@/features/product-list/modules/types";
import { Option } from "@/features/product-list/modules/types";

import ContentDialog from "@/shared/components/dialog/ContentDialog";
import { DetailGridSingle } from "@/shared/components/table/tableStyle";
import {
  OmsProductResponseDTO,
  OmsProductSearchRequestDtoProductInfoStatusEnum,
  OmsProductSearchRequestDtoProductTypeEnum,
  OmsProductSearchResponseDTO,
} from "@/shared/generated/pim/types/Product";
import { OmsProductSearchRequestDtoDirectionEnum } from "@/shared/generated/pim/types/Product";
import { useBrandId } from "@/shared/hooks/useBrandId";
import { normalizeToArray } from "@/shared/utils/querystring";

import IconInfoFilled from "@/assets/icons/IconInfoFilled";

interface ModalItemBundlerProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  selectedRows?: GridRowModel[];
  dialogTitle?: string;
  handleCreate?: (selectedProducts: GridRowModel[]) => void;
  handleButtonDisabled?: (selectedProducts: GridRowModel[]) => boolean;
  isPendingCreate: boolean;
}

export default function ModalItemBundler({
  openModal,
  setOpenModal,
  selectedRows,
  dialogTitle,
  handleCreate,
  handleButtonDisabled,
  isPendingCreate,
}: ModalItemBundlerProps) {
  const { data: session } = useSession();
  const workerId = session?.user.id ?? "";
  const brandId = useBrandId();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProducts, setSelectedProducts] = useState<GridRowModel[]>([]);
  const [productOptions, setProductOptions] = useState<Option[]>([]);

  const defaultValues = {
    searchType: "Single",
    searchSingle: "",
    searchSAP: "SAP Name",
    searchBulk: "",
  };
  const methods = useForm<FormValues>({ defaultValues });
  const { control, setValue, watch, reset } = methods;

  const isSAPName = watch("searchSAP") === "SAP Name";
  const placeholder = isSAPName ? "Enter SAP Name" : "Enter SAP Code";

  // searchType 값 감지
  const selectedSearchType = useWatch({ control, name: "searchType" });
  const isSingle = selectedSearchType === "Single";

  // 선택된 single 상품 row 변환
  const convertSelectedRows = useCallback((rows: GridRowModel[]) => {
    return rows.map((row) => ({
      id: row.sapCode,
      sapCode: row.sapCode,
      sapName: row.sapName,
      skuCode: row.skuCode,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      selected: true,
    }));
  }, []);

  // 검색 타입 변경 시 초기화
  const resetSearchType = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAnchorEl(null);
      setValue("searchSingle", "");
      setValue("searchBulk", "");
      setProductOptions([]);

      if (e.target.value === "Single") {
        setValue("searchSAP", "SAP Name");
      } else {
        // bulk 타입일 경우 SAP Code 선택
        setValue("searchSAP", "SAP Code");
      }
    },
    [setValue],
  );

  // 모달 초기화
  const resetModal = useCallback(() => {
    setSelectedProducts(selectedRows ? convertSelectedRows(selectedRows) : []);
    reset();
    setProductOptions([]);
  }, [selectedRows, reset, convertSelectedRows]);

  useEffect(() => {
    resetModal();
  }, [resetModal]);

  const mapProductRow = (
    row: OmsProductResponseDTO,
    isSingleSearch: boolean,
    index: number,
  ) => ({
    id: row.sapCode || index.toString(),
    sapCode: row.sapCode || "",
    sapName: row.sapName || "",
    skuCode: row.sku || "",
    quantity: isSingleSearch ? row.qty : 1,
    selected: !isSingleSearch, // single 검색 상품은 기본 선택 X
    unitPrice: row.priceMasters?.[0]?.price || 0,
  });

  const onSuccess = (data: OmsProductSearchResponseDTO) => {
    if (isSingle) {
      // single 검색 → productOptions에 추가 이후 체크박스를 통해 selectedProducts에 추가
      const newProductOptions = data.products.map((row, index) =>
        mapProductRow(row, true, index),
      );
      setProductOptions(newProductOptions);
    } else {
      // bulk 검색 → selectedProducts에 중복 없이 추가
      const addedProducts = data.products
        .filter(
          (row) => !selectedProducts.some((p) => p.sapCode === row.sapCode),
        )
        .map((row, index) => mapProductRow(row, false, index));
      setSelectedProducts((prev) => [...prev, ...addedProducts]);
      setValue("searchBulk", "");
    }
  };

  // 📍 상품 검색
  const { mutate, isPending } = usePostProductList({ onSuccess });

  // 수량 변경
  const handleCountChange = (sapCode: string, isIncrease: boolean) => {
    const newSelectedProducts = selectedProducts.map((product) => {
      return product.sapCode === sapCode
        ? {
            ...product,
            quantity: isIncrease ? product.quantity + 1 : product.quantity - 1,
          }
        : product;
    });
    setSelectedProducts(newSelectedProducts);
  };

  // 상품 삭제
  const handleDelete = (sapCode: string) => {
    setSelectedProducts((prev) =>
      prev.filter((item) => item.sapCode !== sapCode),
    );
  };

  // 모달 닫기
  const handleClose = () => {
    resetModal();
    setOpenModal(false);
  };

  // 생성
  const handlePost = () => {
    handleCreate?.(selectedProducts);
    // handleClose();
  };

  // create 버튼 활성화 조건
  const handleCreateButtonDisabled = () => {
    return handleButtonDisabled?.(selectedProducts) ?? false;
  };

  const COLUMNS = MODAL_CREATE_BUNDLE_COLUMNS.map((column) => {
    if (column.field === "quantity") {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;

          return (
            <div className="ml-[-9px]">
              <IconButton
                onClick={() => handleCountChange(row.sapCode, false)}
                disabled={row.quantity === 1}
              >
                <IndeterminateCheckBoxIcon />
              </IconButton>
              {/* 선택된 상품의 수량 */}
              <span className="inline-block min-w-[20px] select-none text-center">
                {row.quantity}
              </span>
              <IconButton onClick={() => handleCountChange(row.sapCode, true)}>
                <AddBoxIcon />
              </IconButton>
            </div>
          );
        },
      };
    }

    if (column.field === "delete") {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Button
              variant="text"
              color="error"
              onClick={() => handleDelete(params.row.sapCode)}
              sx={{ marginLeft: "-9px" }}
            >
              Delete
            </Button>
          );
        },
      };
    }

    return column;
  });

  return (
    <ContentDialog
      open={openModal}
      setOpen={setOpenModal}
      dialogTitle={dialogTitle ?? "Create Bundle"}
      dialogCloseLabel="Cancel"
      dialogConfirmLabel={isPendingCreate ? "Creating..." : "Create"}
      maxWidth="md"
      handleClose={handleClose}
      handlePost={handlePost}
      buttonDisable={handleCreateButtonDisabled() || isPendingCreate}
      dialogContent={
        <FormProvider {...methods}>
          <div>
            <h2 className="text-md pt-[16px] leading-[32px]">Search</h2>
            <div className="border-border-primary rounded-[5px] border border-solid bg-white">
              <DetailGridSingle>
                <div>
                  <h3>Search Type</h3>
                  <FormControl>
                    <Controller
                      control={control}
                      name="searchType"
                      render={({ field }) => (
                        <SearchTypeRadioGroup
                          field={field}
                          onTypeChange={(e) =>
                            resetSearchType(e as ChangeEvent<HTMLInputElement>)
                          }
                        />
                      )}
                    />
                  </FormControl>
                </div>

                <div>
                  <h3>
                    Search
                    <Tooltip
                      title="Products already added or with an invalid SAP code are automatically excluded from selected product."
                      placement="right"
                      arrow
                    >
                      <IconButton>
                        <IconInfoFilled />
                      </IconButton>
                    </Tooltip>
                  </h3>
                  {/* single 검색 */}
                  {selectedSearchType === "Single" && (
                    <SearchSingleInput
                      setAnchorEl={setAnchorEl}
                      selectedProducts={selectedProducts}
                      setSelectedProducts={setSelectedProducts}
                      productOptions={productOptions}
                      anchorEl={anchorEl}
                      placeholder={placeholder}
                      mutate={(searchValue: string) =>
                        mutate({
                          brandId,
                          worker: workerId,
                          productInfoStatus:
                            OmsProductSearchRequestDtoProductInfoStatusEnum.ALL,
                          productType:
                            OmsProductSearchRequestDtoProductTypeEnum.SINGLE,
                          pageNo: 0,
                          pageSize: 1000,
                          detail: true,
                          direction:
                            OmsProductSearchRequestDtoDirectionEnum.NEXT,
                          ...(isSAPName
                            ? { sapName: searchValue.trim() }
                            : { sapCodes: normalizeToArray(searchValue) }),
                        })
                      }
                      isPending={isPending}
                    />
                  )}

                  {/* bulk 검색 */}
                  {selectedSearchType === "Bulk" && (
                    <SearchInputBulk
                      mutate={(searchValue: string) =>
                        mutate({
                          brandId,
                          worker: workerId,
                          productInfoStatus:
                            OmsProductSearchRequestDtoProductInfoStatusEnum.ALL,
                          productType:
                            OmsProductSearchRequestDtoProductTypeEnum.SINGLE,
                          pageNo: 0,
                          pageSize: 1000,
                          detail: true,
                          direction:
                            OmsProductSearchRequestDtoDirectionEnum.NEXT,
                          sapCodes: normalizeToArray(searchValue),
                        })
                      }
                      isPending={isPending}
                    />
                  )}
                </div>
              </DetailGridSingle>
            </div>

            <h2 className="text-md pt-[16px] leading-[32px]">
              Selected Products
            </h2>
            <div className="h-[400px]">
              <DataGridPro
                rows={selectedProducts}
                columns={COLUMNS as GridColDef[]}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "5px",
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                  },
                }}
                rowSelection={false}
              />
            </div>
          </div>
        </FormProvider>
      }
    />
  );
}
