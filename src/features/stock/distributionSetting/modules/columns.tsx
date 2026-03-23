import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";

import { renderCellMultiLine } from "@/shared/utils/renderCell";

export const COLUMNS_CHANNEL = [
  {
    field: "channelType",
    headerName: "Channel Name",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      return params.value.description;
    },
  },
  {
    field: "distributionRate",
    headerName: "Distribution Rate",
    flex: 1,
  },
  {
    field: "distributionPriority",
    headerName: "Priority",
    flex: 1,
  },
];

export const GROUPING_PRODUCT = [
  {
    groupId: "Product",
    headerName: "Product",
    children: [{ field: "skuCode" }, { field: "sapCode" }, { field: "name" }],
  },
];

export const COLUMNS_PRODUCT: GridColDef[] = [
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    cellClassName: "font-bold",
  },
  {
    field: "sapCode",
    headerName: "SAP code",
    flex: 1,
    cellClassName: "font-bold",
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "rateType",
    headerName: "Rate Type",
    flex: 1,
  },
  {
    field: "channelName",
    headerName: "Channel Name",
    flex: 1,
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
  },
  {
    field: "distributionRate",
    headerName: "Distribution Rate",
    flex: 1,
    cellClassName: "!p-0",
    renderCell: (params: GridRenderCellParams) =>
      renderCellMultiLine(params, { subfix: "%" }),
  },
];

export const COLUMNS_PRODUCT_EDIT: GridColDef[] = [
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 0.5,
  },
  {
    field: "name",
    headerName: "Product Name",
    flex: 1,
  },
];
