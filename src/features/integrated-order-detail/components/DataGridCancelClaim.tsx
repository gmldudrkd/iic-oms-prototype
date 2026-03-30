import {
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  DataGridPro,
  GridRowSelectionModel,
  GridRenderCellParams,
  GridRowModel,
  GridRowId,
  GridColDef,
} from "@mui/x-data-grid-pro";
import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { LIST_COLUMNS_CANCEL } from "@/features/integrated-order-detail/modules/columns";
import {
  DATA_GRID_STYLES,
  DATA_GRID_STYLES_CLAIM,
} from "@/features/integrated-order-list/modules/styles";

interface Props {
  claimType: "CANCEL_ORDER" | "CANCEL_SHIPMENT";
  rows: GridRowModel[];
  setRows: Dispatch<SetStateAction<GridRowModel[]>>;
  selectedRows: GridRowModel[];
  setSelectedRows: Dispatch<SetStateAction<GridRowModel[]>>;
  isAllCancel?: boolean;
}

const config = {
  CANCEL_ORDER: { title: "Choose product for cancel" },
  CANCEL_SHIPMENT: { title: "Cancelation product" },
};

export default function DataGridCancelClaim({
  claimType,
  rows,
  setRows,
  selectedRows,
  setSelectedRows,
  isAllCancel = false,
}: Props) {
  const [cancelQty, setCancelQty] = useState<{ [key: GridRowId]: number }>({});

  // select cell 렌더링
  const renderSelectCell = useCallback(
    (params: GridRenderCellParams) => {
      // 처음 저장한 최대 취소 가능 수량 (옵션 생성 기준)
      const optionsMaxQuantity = Number(
        params.row.initialAvailableQuantity ?? 0,
      );
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
        <FormControl fullWidth sx={{ justifyContent: "center" }}>
          <Select
            // 비활성이거나 최대 수량이 0이면 비활성화
            disabled={!params.row.isActive || optionsMaxQuantity === 0}
            value={displayValue}
            onChange={handleChangeSelect}
            size="small"
            sx={{
              "& .MuiSelect-select": {
                backgroundColor: !params.row.isActive
                  ? "rgba(0, 0, 0, 0.1)"
                  : "",
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
    },
    [cancelQty, setRows, setSelectedRows, selectedRows],
  );

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

  useEffect(() => {
    if (isAllCancel) {
      setSelectedRows(rows);
    }
  }, [isAllCancel, rows, setSelectedRows]);

  const columns = useMemo(() => {
    // LIST_COLUMNS_CANCEL에서 cancelPrice 필드의 인덱스 찾기
    const cancelPriceIndex = LIST_COLUMNS_CANCEL.findIndex(
      (col: GridColDef) => col.field === "cancelPrice",
    );

    // cancelPrice가 있으면 그 앞에 cellQuantity 삽입, 없으면 맨 뒤에 추가
    return [
      ...LIST_COLUMNS_CANCEL.slice(0, cancelPriceIndex),
      {
        field: "cellQuantity",
        headerName: "Qty",
        flex: 1,
        minWidth: 100,
        renderCell: renderSelectCell,
      },
      ...LIST_COLUMNS_CANCEL.slice(cancelPriceIndex),
    ];
  }, [renderSelectCell]);

  return (
    <div>
      <h2 className="px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
        {config[claimType].title}
      </h2>
      <DataGridPro
        columns={columns}
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
          ...DATA_GRID_STYLES_CLAIM,
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
