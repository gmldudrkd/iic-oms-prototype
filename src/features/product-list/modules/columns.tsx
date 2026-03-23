import { GridRenderCellParams } from "@mui/x-data-grid-pro";

import {
  renderCellProductType,
  renderCellStatus,
} from "@/features/product-list/modules/renderCell";

import {
  renderCellMultiLine,
  renderCellRouting,
} from "@/shared/utils/renderCell";

export const PRODUCT_LIST_COLUMNS = [
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
    width: 140,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
    minWidth: 150,
    flex: 1,
  },
  {
    field: "productInfoStatus",
    headerName: "Product Info Status",
    renderCell: renderCellStatus,
    minWidth: 160,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 252,
  },
  {
    field: "lastUpdatedAt",
    headerName: "Last Updated At",
    minWidth: 252,
  },
];

export const MODAL_CREATE_BUNDLE_COLUMNS = [
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    minWidth: 200,
  },
  {
    field: "delete",
    headerName: "Delete",
  },
];
