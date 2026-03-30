import { Chip, MenuItem, Select, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import clsx from "clsx";

// ─── 서브 아이템 타입 ───
interface SubItem {
  type: "Package" | "Gift";
  sku: string;
  productName: string;
  productCode: string;
  category: string;
  quantity: number;
  price: number;
}

// ─── 공통 셀 스타일 ───
const BASE_CLASS =
  "flex h-full min-h-[40px] items-center px-2 py-4 font-medium";
const MAIN_ROW_CLASS = `${BASE_CLASS} text-black`;
const SUB_ROW_CLASS = `${BASE_CLASS} border-t border-[#e0e0e0] bg-[#f5f5f5]`;

const INDENT_FIELDS = new Set(["skuCode", "productName"]);
const DISABLED_FIELDS = new Set(["skuCode", "productName", "quantity"]);

// ─── 상품 셀 공통 래퍼 (번들/싱글 모두 처리) ───
const renderProductCell = (
  params: GridRenderCellParams,
  subContent: (sub: SubItem, index: number) => React.ReactNode,
  mainContent?: React.ReactNode,
) => {
  const { field } = params;
  const { isBundle, products, components } = params.row;
  const main = mainContent ?? (params.value || "");

  // products와 components가 배열이 아니면 빈 배열로 기본값 설정
  const safeProducts = Array.isArray(products) ? products : [];
  const safeComponents = Array.isArray(components) ? components : [];

  return (
    <div className="flex h-full flex-col justify-center overflow-visible whitespace-normal break-words">
      {isBundle && <div className={MAIN_ROW_CLASS}>{main}</div>}

      {!isBundle &&
        safeProducts.map((sub: SubItem, i: number) => (
          <div
            key={sub.sku}
            className={clsx(MAIN_ROW_CLASS, {
              "pl-6": INDENT_FIELDS.has(field),
              "text-gray-600": DISABLED_FIELDS.has(field),
            })}
          >
            {field === "category" && i === 0 ? "" : subContent(sub, i)}
          </div>
        ))}

      {safeComponents.map((sub: SubItem, i: number) => (
        <div
          key={sub.sku}
          className={clsx(SUB_ROW_CLASS, {
            "pl-6": INDENT_FIELDS.has(field),
            "text-gray-600": DISABLED_FIELDS.has(field),
          })}
        >
          {subContent(sub, i)}
        </div>
      ))}
    </div>
  );
};

// ─── 비활성 수량 Select ───
const DisabledQtySelect = ({ quantity }: { quantity?: number }) => (
  <Select value={quantity} disabled fullWidth size="small">
    <MenuItem value={quantity}>{quantity}</MenuItem>
  </Select>
);

// ─── 컬럼 정의 ───
export const LIST_COLUMNS_REGISTER = (
  renderSelectCell: (params: GridRenderCellParams) => React.ReactNode,
): GridColDef[] => [
  {
    field: "no",
    headerName: "No",
    flex: 0.25,
    minWidth: 50,
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
    renderCell: (params) => renderProductCell(params, (sub) => sub.sku || "-"),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(
        params,
        (sub) =>
          sub.category ? (
            <Chip label={sub.category} className="!text-gray-600" />
          ) : (
            ""
          ),
        null,
      ),
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1.5,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(params, (sub) => sub.productName || "-"),
  },
  {
    field: "orderQty",
    headerName: "Ordered Qty",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(params, (sub) => sub.quantity || "-"),
  },
  {
    field: "cellQuantity",
    headerName: "Qty",
    minWidth: 120,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(
        params,
        (sub) => <DisabledQtySelect quantity={sub.quantity} />,
        renderSelectCell(params),
      ),
  },
];

export const LIST_COLUMNS_REGISTER_RESHIPMENT: GridColDef[] = [
  {
    field: "no",
    headerName: "No",
    flex: 0.25,
    minWidth: 50,
    cellClassName: "",
  },
  {
    field: "skuCode",
    headerName: "SKU Code",
    flex: 1,
    minWidth: 100,
    cellClassName: "",
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    cellClassName: "",
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1.5,
    minWidth: 100,
    cellClassName: "",
  },
  {
    field: "orderQty",
    headerName: "Ordered Qty",
    flex: 1,
    minWidth: 100,
    cellClassName: "",
  },
  {
    field: "claimableQty",
    // headerName: "To Use Qty",
    headerName: "Qty",
    minWidth: 120,
    cellClassName: "",
  },
];

export const LIST_COLUMNS_REGISTER_RESHIPMENT_LOST: GridColDef[] = [
  {
    field: "no",
    headerName: "No",
    flex: 0.25,
    minWidth: 50,
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
    renderCell: (params) => renderProductCell(params, (sub) => sub.sku || "-"),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(
        params,
        (sub) =>
          sub.category ? (
            <Chip label={sub.category} className="!text-gray-600" />
          ) : (
            ""
          ),
        null,
      ),
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1.5,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(params, (sub) => sub.productName || "-"),
  },
  {
    field: "refundQty",
    headerName: "Refund Qty",
    flex: 1,
    minWidth: 100,
    cellClassName: "custom-cell-claim",
    renderCell: (params) =>
      renderProductCell(params, (sub) => sub.quantity || "-"),
  },
];
