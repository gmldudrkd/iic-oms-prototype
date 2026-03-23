import { GridRenderCellParams } from "@mui/x-data-grid-pro";

import {
  renderCellProductType,
  renderCellStatus,
} from "@/features/product-list/modules/renderCell";

import {
  renderCellMultiLine,
  renderCellRouting,
} from "@/shared/utils/renderCell";

// 테이블 페이지 사이즈 옵션
export const COMMON_TABLE_PAGE_SIZE_OPTIONS = [100, 300, 500];
// 테이블 페이지 모델 기본값
export const PAGINATION_MODEL_DEFAULT = {
  page: 0,
  pageSize: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
};

export const CHANNEL_PRODUCT_LIST_COLUMNS = [
  {
    field: "productType",
    headerName: "Product Type",
    renderCell: renderCellProductType,
    width: 120,
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(
        params,
        `/product/product-list/detail/${params.row.skuCode}`,
      ),
    width: 120,
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    width: 120,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    width: 120,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    minWidth: 200,
    flex: 1,
  },
  {
    field: "modelCode",
    headerName: "Model Code",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    width: 120,
  },
  {
    field: "upcCode",
    headerName: "UPC Code",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    width: 120,
  },
  {
    field: "channel",
    headerName: "Channel",
    width: 120,
  },
  {
    field: "channelAvailability",
    headerName: "Channel Availability",
    width: 180,
  },
  {
    field: "productInfoStatus",
    headerName: "Product Info Status",
    renderCell: renderCellStatus,
    minWidth: 200,
  },
];
