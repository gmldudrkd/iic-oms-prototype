import { GridRenderCellParams } from "@mui/x-data-grid-pro";

import { renderCellRouting } from "@/shared/utils/renderCell";
import { convertToPrice } from "@/shared/utils/stringUtils";

export const PRODUCT_MASTER_COLUMNS = [
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      const isBundle = params.api.getRowsCount() > 1;
      return isBundle
        ? renderCellRouting(
            params,
            `/product/product-list/detail/${params.value}`,
          )
        : params.value;
    },
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    flex: 1,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <div
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.4,
          padding: "10px 0",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
  },
  {
    field: "modelCode",
    headerName: "Model Code",
    flex: 1,
  },
  {
    field: "modelName",
    headerName: "Model Name",
    flex: 1,
  },
  {
    field: "detail",
    headerName: "Detail",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <button
          onClick={() => {
            window.open(
              `/product/product-list/detail/product-master/${params.row.skuCode}`,
              "_blank",
              "width=1080,height=1062,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
            );
          }}
          className="text-primary !no-underline"
        >
          Detail
        </button>
      );
    },
  },
];

export const PRICE_MASTER_COLUMNS = [
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      const isBundle = params.api.getRowsCount() > 1;
      return isBundle
        ? renderCellRouting(
            params,
            `/product/product-list/detail/${params.value}`,
          )
        : params.value;
    },
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    flex: 1,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <div
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.4,
          padding: "10px 0",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    flex: 1,
    align: "right",
    renderCell: (params: GridRenderCellParams) =>
      convertToPrice(params.value, params.row.currency),
  },
  {
    field: "startDatetime",
    headerName: "Start Datetime",
    flex: 1,
  },
  {
    field: "endDatetime",
    headerName: "End Datetime",
    flex: 1,
  },
];

export const PAID_PACKAGING_OPTIONS_COLUMNS = [
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(params, `/product/product-list/detail/${params.value}`),
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1.7,
    renderCell: (params: GridRenderCellParams) => (
      <div
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.4,
          padding: "10px 0",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "quantity",
    headerName: "Quantity",
    flex: 0.7,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    flex: 1,
    align: "right",
    renderCell: (params: GridRenderCellParams) => convertToPrice(params.value),
  },
  {
    field: "totalPrice",
    headerName: "Total Price",
    flex: 1,
    align: "right",
    renderCell: (params: GridRenderCellParams) => convertToPrice(params.value),
  },
  {
    field: "delete",
    headerName: "Delete",
    flex: 1,
  },
];

export const SALES_COLUMNS = [
  {
    field: "channelNo",
    headerName: "Channel No",
    flex: 1,
  },
  {
    field: "channelName",
    headerName: "Channel Name",
    flex: 1,
  },
  {
    field: "channelType",
    headerName: "Channel Type",
    flex: 1,
  },
  {
    field: "channelSapCode",
    headerName: "Channel SAP Code",
    flex: 1,
  },
  {
    field: "channelSapName",
    headerName: "Channel SAP Name",
    flex: 1,
  },
];
