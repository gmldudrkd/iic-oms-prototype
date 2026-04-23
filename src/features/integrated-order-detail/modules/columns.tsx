import { Chip, Tooltip } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid-pro";

import { OrderItemComponent } from "@/shared/generated/oms/types/common";
import { OrderDetailOrderItemResponse } from "@/shared/generated/oms/types/Order";
import {
  renderCellImage,
  renderCellSpanningNullCheck,
} from "@/shared/utils/renderCell";
import { convertToPrice } from "@/shared/utils/stringUtils";

/**
 * ------------------------------------------------------------
 * Order
 * ------------------------------------------------------------
 */

export const LIST_COLUMNS_PRODUCT_GROUPING = [
  {
    groupId: "orderQty",
    headerName: "Order Qty",
    children: [
      { field: "orderedQuantity" },
      { field: "canceledQuantity" },
      { field: "shipmentQuantity" },
    ],
  },
  {
    groupId: "claimQty",
    headerName: "Claim Qty",
    children: [{ field: "returnedQuantity" }, { field: "reshippedQuantity" }],
  },
];

// Ordered Product Info columns
export const LIST_COLUMNS_PRODUCT: GridColDef[] = [
  { field: "no", headerName: "No.", width: 50 },
  {
    field: "image",
    headerName: "Image",
    width: 70,
    renderCell: (params: GridRenderCellParams) =>
      renderCellImage({ value: params.value as string }),
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "skuCode"),
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 2,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "productName"),
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "sapCode"),
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "sapName"),
  },
  {
    field: "orderedQuantity",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <Tooltip title="The quantity ordered by the customer">
          <span className="underline decoration-dotted">Ordered</span>
        </Tooltip>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const orderedQuantity = params.row.orderedQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{orderedQuantity || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "shipmentQuantity",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <Tooltip title="The total quantity requested or shipped for outbound processing">
          <span className="underline decoration-dotted">Shipment</span>
        </Tooltip>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const shipmentQuantity = params.row.shipmentQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{shipmentQuantity || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "canceledQuantity",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <Tooltip title="The quantity canceled by customer or operator">
          <span className="underline decoration-dotted">Canceled</span>
        </Tooltip>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const canceledQuantity = params.row.canceledQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{canceledQuantity || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "returnedQuantity",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <Tooltip title="The quantity returned by the customer or operator (incl., return for exchanging)">
          <span className="underline decoration-dotted">Returned</span>
        </Tooltip>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const returnedQuantity = params.row.returnedQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{returnedQuantity || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "reshippedQuantity",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <Tooltip
          title={`The quantity reshipped after a return (incl., reshipments for exchanging)`}
        >
          <span className="underline decoration-dotted">Reshipped</span>
        </Tooltip>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const reshippedQuantity = params.row.reshippedQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{reshippedQuantity || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    minWidth: 120,
    align: "right",
    renderCell: (params: GridRenderCellParams) => {
      const price = params.row.price
        ? Number(params.row.price.split("^")[0])
        : null;
      return price ? convertToPrice(price, params.row.currency) : "-";
    },
  },
  {
    field: "subTotal",
    headerName: "Subtotal",
    flex: 1,
    minWidth: 120,
    align: "right",
    renderCell: (params: GridRenderCellParams) => {
      const subTotal = Number(params.row.subTotal.split("^")[0]);
      return convertToPrice(subTotal, params.row.currency);
    },
  },
] as const;

// Payment Info columns
export const LIST_COLUMNS_PAYMENT: GridColDef[] = [
  { field: "no", headerName: "No.", width: 50 },
  { field: "occurredAt", headerName: "Occurred At", minWidth: 150, flex: 1 },
  {
    field: "type",
    headerName: "Type",
    minWidth: 150,
    flex: 0.5,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div
          className={`font-bold ${params.value === "Payment" ? "text-[#33691E]" : "text-[#BF360C]"}`}
        >
          {params.row.type}
        </div>
      );
    },
  },
  { field: "method", headerName: "Method", minWidth: 150, flex: 0.5 },
  { field: "tid", headerName: "TID", minWidth: 150, flex: 2 },
  {
    field: "note",
    headerName: "Note",
    minWidth: 150,
    flex: 2,
    renderCell: (params: GridRenderCellParams) => {
      return params.value === null ? "-" : params.value;
    },
  },
  {
    field: "net",
    headerName: "Net",
    minWidth: 120,
    flex: 1,
    align: "right",
    headerAlign: "right",
    renderHeader: () => (
      <Tooltip title="(Amount-Tax)">
        <span className="underline decoration-dotted">Net</span>
      </Tooltip>
    ),
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div
          className={`${params.row.type === "Payment" ? "text-[#33691E]" : "text-[#BF360C]"}`}
        >
          {convertToPrice(Number(params.row.net), params.row.currency)}
        </div>
      );
    },
  },
  {
    field: "tax",
    headerName: "Tax",
    minWidth: 120,
    flex: 1,
    align: "right",
    headerAlign: "right",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div
          className={`${params.row.type === "Payment" ? "text-[#33691E]" : "text-[#BF360C]"}`}
        >
          {convertToPrice(Number(params.row.tax), params.row.currency)}
        </div>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    minWidth: 150,
    flex: 1,
    align: "right",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div
          className={`${params.row.type === "Payment" ? "text-[#33691E]" : "text-[#BF360C]"}`}
        >
          {convertToPrice(Number(params.row.amount), params.row.currency)}
        </div>
      );
    },
  },
];

// Shipment Info columns
export const LIST_COLUMNS_SHIPMENT: GridColDef[] = [
  { field: "no", headerName: "No.", width: 25 },
  {
    field: "image",
    headerName: "Image",
    width: 70,
    renderCell: (params: GridRenderCellParams) =>
      renderCellImage({ value: params.value as string }),
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "skuCode"),
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 2,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "productName"),
  },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "sapCode"),
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) =>
      renderCellSpanningNullCheck(params, "sapName"),
  },
  {
    field: "shipmentQuantity",
    renderHeader: () => {
      return (
        <div>
          Qty
          <br />
          <span className="text-[10px]">Requested</span>
        </div>
      );
    },
    flex: 1,
    minWidth: 50,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.row.shipmentQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "canceledQuantity",
    renderHeader: () => {
      return (
        <div>
          <br />
          <span className="text-[10px]">Canceled</span>
        </div>
      );
    },
    flex: 1,
    minWidth: 50,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.row.canceledQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "shippedQuantity",
    renderHeader: () => {
      return (
        <div>
          <br />
          <span className="text-[10px]">Shipped</span>
        </div>
      );
    },
    flex: 1,
    minWidth: 50,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.row.shippedQuantity.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
];

// Request Partial Shipment columns
export const LIST_COLUMNS_REQUEST_PARTIAL_SHIPMENT: GridColDef[] = [
  {
    field: "no",
    headerName: "No.",
    width: 25,
    cellClassName: "custom-cell-center",
  },
  {
    field: "sku",
    headerName: "SKU Code",
    minWidth: 120,
    cellClassName: "custom-cell-claim custom-cell-center",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div className="flex h-full w-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map(
            (component: OrderDetailOrderItemResponse) => (
              <div
                key={component.productCode}
                className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
              >
                {component.sku}
              </div>
            ),
          )}
        </div>
      );
    },
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1,
    minWidth: 120,
    cellClassName: "custom-cell-claim",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <div className="flex h-full w-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map(
            (component: OrderDetailOrderItemResponse) => (
              <div
                key={component.productCode}
                className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
              >
                {component.productName}
              </div>
            ),
          )}
        </div>
      );
    },
  },
  {
    field: "orderedQuantity",
    minWidth: 120,
    cellClassName: "custom-cell-center",
    renderHeader: () => {
      return (
        <div>
          Qty
          <br />
          <Tooltip title="The quantity ordered by the customer">
            <span className="text-[10px] underline decoration-dotted">
              Ordered
            </span>
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "shippable",
    minWidth: 120,
    cellClassName: "custom-cell-center",
    renderHeader: () => {
      return (
        <div>
          <br />
          <Tooltip title="The quantity needed to be shipped and available to ship">
            <span className="text-[10px] underline decoration-dotted">
              Shippable
            </span>
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "toShip",
    minWidth: 150,
    cellClassName: "custom-cell-center",
    renderHeader: () => {
      return (
        <div>
          <br />
          <Tooltip title="The quantity to be shipped by submit this request">
            <span className="text-[10px] underline decoration-dotted">
              To Ship
            </span>
          </Tooltip>
        </div>
      );
    },
  },
];

/**
 * ------------------------------------------------------------
 * Return
 * ------------------------------------------------------------
 */
// Return Detail columns
export const LIST_COLUMNS_RETURN_DETAIL = [
  { field: "no", headerName: "No", width: 50 },
  {
    field: "image",
    headerName: "Image",
    width: 70,
    renderCell: renderCellImage,
  },
  { field: "skuCode", headerName: "SKU Code", flex: 1, minWidth: 50 },
  { field: "productName", headerName: "Product Name", flex: 1, minWidth: 100 },
  {
    field: "sapCode",
    headerName: "SAP Code",
    flex: 1,
    minWidth: 75,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value.split("^")[0];
      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "sapName",
    headerName: "SAP Name",
    flex: 1,
    minWidth: 100,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value.split("^")[0];
      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
  {
    field: "quantity",
    headerName: "Qty",
    flex: 1,
    minWidth: 100,
    renderHeader: () => {
      return (
        <div>
          <span className="font-medium">Qty</span>
          <br />
          <span className="text-[10px]">Requested Qty</span>
        </div>
      );
    },
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value.split("^")[0];

      return (
        <div key={params.row.id}>
          <span>{value || "-"}</span>
        </div>
      );
    },
  },
  // 불필요한 컬럼으로 삭제
  // {
  //   field: "cancelQuantity",
  //   headerName: "Canceled Qty",
  //   flex: 1,
  //   minWidth: 100,
  //   renderHeader: () => {
  //     return (
  //       <div>
  //         <br />
  //         <span className="text-[10px]">Canceled Qty</span>
  //       </div>
  //     );
  //   },
  //   renderCell: (params: GridRenderCellParams) => {
  //     const value = params.value.split("^")[0];

  //     return (
  //       <div key={params.row.id}>
  //         <span>{value || "-"}</span>
  //       </div>
  //     );
  //   },
  // },
];

// Product Inspection Result columns
export const LIST_COLUMNS_PRODUCT_INSPECTION_RESULT = [
  { field: "productCode", headerName: "SAP Code", flex: 1, minWidth: 50 },
  { field: "productName", headerName: "SAP Name", flex: 1.5, minWidth: 100 },
  { field: "quantity", headerName: "Inspection Qty", flex: 1, minWidth: 75 },
  {
    field: "returnGradeA",
    headerName: "Grade A",
    minWidth: 50,
    renderCell: (row: GridRenderCellParams) => {
      return <div>{row.row.gradeSummaries.A || "-"}</div>;
    },
  },
  {
    field: "returnGradeB",
    headerName: "Grade B",
    minWidth: 50,
    renderCell: (row: GridRenderCellParams) => {
      return <div>{row.row.gradeSummaries.B || "-"}</div>;
    },
  },
  {
    field: "returnGradeC",
    headerName: "Grade C",
    minWidth: 50,
    renderCell: (row: GridRenderCellParams) => {
      return <div>{row.row.gradeSummaries.C || "-"}</div>;
    },
  },
];

// Return Cancel Partial columns
export const LIST_COLUMNS_RETURN_CANCEL_PARTIAL = [
  { field: "sapCode", headerName: "SAP Code", flex: 0.5, minWidth: 50 },
  {
    field: "image",
    headerName: "Image",
    flex: 0.5,
    minWidth: 50,
    renderCell: renderCellImage,
  },
  { field: "productName", headerName: "Product Name", flex: 1, minWidth: 100 },
  {
    field: "cancelAvailableQty",
    headerName: "Cancel Available Qty",
    flex: 1,
    minWidth: 100,
  },
];

export const LIST_COLUMNS_CANCEL: GridColDef[] = [
  {
    field: "no",
    headerName: "No",
    flex: 0.25,
    minWidth: 25,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => (
      <div className="ml-4 flex h-full items-center">{params.row.no}</div>
    ),
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => {
      return (
        <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map(
            (component: OrderDetailOrderItemResponse) => (
              <div
                key={component.productCode}
                className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
              >
                {component.sku || "-"}
              </div>
            ),
          )}
        </div>
      );
    },
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => {
      return (
        <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map(
            (component: OrderDetailOrderItemResponse) => (
              <div
                key={component.productCode}
                className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
              >
                {component.productName || "-"}
              </div>
            ),
          )}
        </div>
      );
    },
  },
  {
    field: "cancelPrice",
    headerName: "Cancel Price",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-center",
    valueGetter: (value: unknown, row: GridRowModel) => {
      const quantity = Number(row.cellQuantity ?? 0);
      const unitPrice = Number(row.cancelPrice ?? 0);
      return quantity * unitPrice;
    },
    renderCell: (params) => convertToPrice(params.value, params.row.currency),
    align: "right",
  },
];

export const _LIST_COLUMNS_REGISTER: GridColDef[] = [
  {
    field: "no",
    headerName: "No",
    flex: 0.25,
    minWidth: 25,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => (
      <div className="flex h-full items-center">{params.row.no}</div>
    ),
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => {
      return (
        <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map((component: OrderItemComponent) => (
            <div
              key={component.productCode}
              className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
            >
              {component.sku || "-"}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => {
      return (
        <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            />
          )}
          {/* option product */}
          {params.row.components?.map((component: OrderItemComponent) => (
            <div
              key={component.productCode}
              className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
            >
              <Chip label={component.category} />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) => {
      return (
        <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
          {/* bundle product */}
          {params.row.products.length > 0 && (
            <div
              key={params.value}
              className={`order-t border-gray-30 flex h-full min-h-[40px] items-center px-2 py-4`}
            >
              {params.value || "-"}
            </div>
          )}
          {/* option product */}
          {params.row.components?.map((component: OrderItemComponent) => (
            <div
              key={component.productCode}
              className={`flex h-full min-h-[40px] items-center border-t border-gray-300 px-2 py-4`}
            >
              {component.productName || "-"}
            </div>
          ))}
        </div>
      );
    },
  },
];
