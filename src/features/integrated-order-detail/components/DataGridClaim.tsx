import {
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridRowSelectionModel,
  GridRenderCellParams,
  GridRowModel,
  GridRowId,
} from "@mui/x-data-grid-pro";
import { useState, Dispatch, SetStateAction, useEffect } from "react";

import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import { OrderDetailOrderItemResponse } from "@/shared/generated/oms/types/Order";
import { convertToPrice } from "@/shared/utils/stringUtils";

interface Props {
  title: string;
  rows: GridRowModel[];
  setRows: Dispatch<SetStateAction<GridRowModel[]>>;
  selectedRows: GridRowModel[];
  setSelectedRows: Dispatch<SetStateAction<GridRowModel[]>>;
  isAllCancel?: boolean;
}

export default function DataGridClaim({
  title,
  rows,
  setRows,
  selectedRows,
  setSelectedRows,
  isAllCancel = false,
}: Props) {
  const [cancelQty, setCancelQty] = useState<{ [key: GridRowId]: number }>({});

  // select cell 렌더링
  const renderSelectCell = (params: GridRenderCellParams) => {
    // 처음 저장한 최대 취소 가능 수량 (옵션 생성 기준)
    const optionsMaxQuantity = Number(params.row.initialAvailableQuantity ?? 0);
    // Select에 표시될 현재 값 (state 또는 row 데이터)

    const displayValue = cancelQty[params.id] ?? params.row.cellQuantity;

    let menuItems: {
      key: number | string;
      value: number | string;
      label: string;
    }[];
    if (params.row.isActive) {
      // 활성 행: 1부터 최대 수량까지 옵션 생성
      menuItems = Array.from({ length: optionsMaxQuantity }, (_, i) => {
        const value = i + 1; // 1부터 시작
        return { key: value, value: value, label: value.toString() };
      });
    } else {
      // 비활성 행: 현재 값만 옵션으로 포함 (에러 방지용)
      const currentVal = Number(displayValue || 0);
      menuItems = [
        { key: currentVal, value: currentVal, label: currentVal.toString() },
      ];
    }

    const handleChangeSelect = (event: SelectChangeEvent<number>) => {
      // Select 값 변경 시 상태 업데이트 (row 및 선택된 row)
      const { id } = params;
      const newQuantity = Number(event.target.value);

      setCancelQty((prev) => ({ ...prev, [id]: newQuantity }));

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, cellQuantity: newQuantity } : row,
        ),
      );

      const isSelected = selectedRows.some(
        (selectedRow) => selectedRow.id === id,
      );
      if (isSelected) {
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.map((row) =>
            row.id === id ? { ...row, cellQuantity: newQuantity } : row,
          ),
        );
      }
    };

    return (
      <FormControl
        fullWidth
        sx={{
          padding: "4px 0",
          justifyContent: "center",
          height: "100%",
          "& .MuiSelect-select": { padding: "10px 16px" },
        }}
      >
        <Select
          // 비활성이거나 최대 수량이 0이면 비활성화
          disabled={!params.row.isActive || optionsMaxQuantity === 0}
          value={displayValue}
          onChange={handleChangeSelect}
          sx={{
            "& .MuiSelect-select": {
              backgroundColor: !params.row.isActive ? "rgba(0, 0, 0, 0.1)" : "",
            },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // 행 선택 시 선택된 행의 취소 수량 업데이트
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    const currentSelectedRows = newSelection
      .map((id) => rows.find((row) => row.id === id))
      .filter((row): row is GridRowModel => !!row)
      .map((row) => ({
        ...row,
        cellQuantity: cancelQty[row.id] ?? row.cellQuantity,
      }));
    setSelectedRows(currentSelectedRows);
  };

  const LIST_COLUMNS_CANCEL: GridColDef[] = [
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
      field: "cellQuantity",
      headerName: "Cancel Qty",
      flex: 1,
      minWidth: 100,
      cellClassName: "custom-cell-center",
      renderCell: isAllCancel
        ? (params) => <div>{params.row.cellQuantity}</div>
        : renderSelectCell,
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

  const LIST_COLUMNS_REGISTER: GridColDef[] = [
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
      field: "cellQuantity",
      headerName: "Qty",
      flex: 1,
      minWidth: 100,
      renderCell: renderSelectCell,
    },
  ];

  useEffect(() => {
    if (isAllCancel) {
      setSelectedRows(rows);
    }
  }, [isAllCancel, rows, setSelectedRows]);

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        {title}
      </h2>
      <DataGridPro
        columns={
          title === "Choose product for Claim"
            ? LIST_COLUMNS_REGISTER
            : LIST_COLUMNS_CANCEL
        }
        rows={rows}
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableColumnSorting
        hideFooter
        getRowHeight={() => "auto"}
        sx={{
          ...DATA_GRID_STYLES,
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: isAllCancel ? "#fff" : "#0000000a",
          },
          "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: isAllCancel ? "#fff" : "#0000000a",
          },
          "& .inactive-row:hover": { backgroundColor: "transparent" },
          "& .inactive-row .MuiCheckbox-root": {
            opacity: 0.5,
            pointerEvents: "none",
          },
          "& .MuiDataGrid-cell": {
            alignItems: "center",
            paddingTop: "8px",
            paddingBottom: "8px",
          },
          "& .custom-cell-claim": {
            padding: "0",
          },
          "& .custom-cell-center": {
            display: "flex",
            alignItems: "center",
          },
        }}
        rowSelectionModel={selectedRows.map((row) => row.id)}
        isRowSelectable={(params) => params.row.isActive ?? true}
        checkboxSelection={!isAllCancel}
        getRowClassName={(params) =>
          !params.row.isActive ? "inactive-row" : ""
        }
        onRowSelectionModelChange={handleSelectionChange}
      />
    </div>
  );
}
