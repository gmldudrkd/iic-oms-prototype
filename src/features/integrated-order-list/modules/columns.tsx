import { GridRenderCellParams } from "@mui/x-data-grid-pro";

import {
  renderCellForStatus,
  renderCellForShippingStatus,
} from "@/features/integrated-order-list/modules/renderCell";

import {
  renderCellRouting,
  renderCellMultiLine,
} from "@/shared/utils/renderCell";

// order list columns
export const COLUMNS_ORDER_LIST = [
  {
    field: "brand",
    headerName: "Brand",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "corp",
    headerName: "Corp",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "channel",
    headerName: "Channel",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(
        params,
        `/order/order-list/detail/${params.row.orderId.toLowerCase()}`,
      ),
  },
  {
    field: "receiveMethod",
    headerName: "Receive Method",
    flex: 1,
    minWidth: 200,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({
        value: params.value,
        color: params.value === "Delivery" ? "shipment" : "storePickup",
      }),
  },
  {
    field: "orderType",
    headerName: "Type",
    flex: 1,
    minWidth: 120,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "default" }),
  },
  {
    field: "tags",
    headerName: "Tags",
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => {
      if (params.value) {
        return renderCellForStatus({ value: params.value, color: "default" });
      } else {
        return null;
      }
    },
  },
  {
    field: "orderDate",
    headerName: "Order Date",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "ordererName",
    headerName: "Orderer Name",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "ordererEmail",
    headerName: "Orderer Email",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "ordererPhone",
    headerName: "Orderer Phone",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 220,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "order" }),
  },
  {
    field: "recipientName",
    headerName: "Recipient Name",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "recipientPhone",
    headerName: "Recipient Phone",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "shipmentNo",
    headerName: "Shipment No",
    flex: 1,
    minWidth: 200,
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
  },
  {
    field: "shipmentStatus",
    headerName: "Shipment Status",
    flex: 1,
    minWidth: 180,
    cellClassName: "!p-0",
    renderCell: renderCellForShippingStatus,
  },
  {
    field: "trackingNo",
    headerName: "Tracking No",
    flex: 1,
    minWidth: 160,
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
  },
];

// return list columns
export const COLUMNS_RETURN_LIST = [
  {
    field: "brand",
    headerName: "Brand",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "corp",
    headerName: "Corp",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "channel",
    headerName: "Channel",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(
        params,
        `/order/return-list/detail/${params.row.orderId.toLowerCase()}`,
      ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "ordererName",
    headerName: "Orderer Name",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "ordererEmail",
    headerName: "Orderer Email",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "ordererPhone",
    headerName: "Orderer Phone",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 220,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "return" }),
  },
  {
    field: "recipientName",
    headerName: "Recipient Name",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "recipientPhone",
    headerName: "Recipient Phone",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "returnNo",
    headerName: "Return No",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "trackingNo",
    headerName: "Tracking No",
    flex: 1,
    minWidth: 150,
  },
];

// exchange list columns
export const COLUMNS_EXCHANGE_LIST = [
  {
    field: "brand",
    headerName: "Brand",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "corp",
    headerName: "Corp",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "channel",
    headerName: "Channel",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(
        params,
        `/order/exchange-list/detail/${params.row.orderId.toLowerCase()}`,
      ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "ordererName",
    headerName: "Orderer Name",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "ordererEmail",
    headerName: "Orderer Email",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "ordererPhone",
    headerName: "Orderer Phone",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 220,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "exchange" }),
  },
  {
    field: "recipientName",
    headerName: "Recipient Name",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "recipientPhone",
    headerName: "Recipient Phone",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "exchangeNo",
    headerName: "Exchange No",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "trackingNo",
    headerName: "Tracking No",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "resendNo",
    headerName: "Resend No",
    flex: 1,
    minWidth: 160,
    cellClassName: "!p-0",
    renderCell: renderCellMultiLine,
  },
];

// reshipment list columns
export const COLUMNS_RESHIPMENT_LIST = [
  {
    field: "brand",
    headerName: "Brand",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "corp",
    headerName: "Corp",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "channel",
    headerName: "Channel",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) =>
      renderCellRouting(
        params,
        `/order/reshipment-list/detail/${params.row.orderId.toLowerCase()}`,
      ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "ordererName",
    headerName: "Orderer Name",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "ordererEmail",
    headerName: "Orderer Email",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "ordererPhone",
    headerName: "Orderer Phone",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 220,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "shipment" }),
  },
  {
    field: "recipientName",
    headerName: "Recipient Name",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "recipientPhone",
    headerName: "Recipient Phone",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "reshipmentNo",
    headerName: "Reshipment No",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "trackingNo",
    headerName: "Tracking No",
    flex: 1,
    minWidth: 150,
  },
];

// Bulk Cancel Order Modal 칼럼
export const COLUMNS_CANCEL_ORDER = [
  { field: "orderNo", headerName: "Order No", flex: 1 },
  {
    field: "status",
    headerName: "Current Status",
    flex: 1,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "order" }),
  },
];

// Bulk Cancel Return Modal 칼럼
export const COLUMNS_CANCEL_RETURN = [
  { field: "orderNo", headerName: "Order No", flex: 1 },
  {
    field: "status",
    headerName: "Current Status",
    flex: 1,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "return" }),
  },
];

// Bulk Cancel Exchange Modal 칼럼
export const COLUMNS_CANCEL_EXCHANGE = [
  { field: "orderNo", headerName: "Order No", flex: 1 },
  {
    field: "status",
    headerName: "Current Status",
    flex: 1,
    renderCell: (params: { value: string }) =>
      renderCellForStatus({ value: params.value, color: "exchange" }),
  },
];
