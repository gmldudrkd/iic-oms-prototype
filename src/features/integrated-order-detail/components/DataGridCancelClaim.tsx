import {
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import {
  DataGridPro,
  GridRowSelectionModel,
  GridRenderCellParams,
  GridRowModel,
  GridRowId,
  GridColDef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellCheckboxRenderer,
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

  // Cancel Order: Category = GWP 제품은 선택 불가 (연관 제품 취소 시 백엔드에서 자동 취소)
  const isGwpLocked = useCallback(
    (row: GridRowModel) => claimType === "CANCEL_ORDER" && Boolean(row.isGwp),
    [claimType],
  );

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
            disabled={
              !params.row.isActive ||
              optionsMaxQuantity === 0 ||
              isGwpLocked(params.row)
            }
            value={displayValue}
            onChange={handleChangeSelect}
            size="small"
            sx={{
              "& .MuiSelect-select": {
                backgroundColor:
                  !params.row.isActive || isGwpLocked(params.row)
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
    [cancelQty, setRows, setSelectedRows, selectedRows, isGwpLocked],
  );

  // 행 선택 시 선택된 행의 취소 수량 업데이트
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    const currentSelectedRows = newSelection
      .map((id) => rows.find((row) => row.id === id))
      .filter((row): row is GridRowModel => !!row && !isGwpLocked(row))
      .map((row) => ({
        ...row,
        cellQuantity: cancelQty[row.id] ?? row.cellQuantity,
      }));
    setSelectedRows(currentSelectedRows);
  };

  useEffect(() => {
    if (isAllCancel) {
      setSelectedRows(rows.filter((row) => !isGwpLocked(row)));
    }
  }, [isAllCancel, rows, setSelectedRows, isGwpLocked]);

  const columns = useMemo(() => {
    // LIST_COLUMNS_CANCEL에서 cancelPrice 필드의 인덱스 찾기
    // Cancel Order: No 다음에 Category 컬럼 노출 (GWP 식별용)
    const categoryColumn: GridColDef = {
      field: "category",
      headerName: "Category",
      flex: 0.6,
      minWidth: 90,
      cellClassName: "custom-cell-claim",
      renderCell: (params) => (
        <div className="flex h-full items-center">{params.value || "-"}</div>
      ),
    };
    const baseColumns =
      claimType === "CANCEL_ORDER"
        ? [
            LIST_COLUMNS_CANCEL[0],
            categoryColumn,
            ...LIST_COLUMNS_CANCEL.slice(1),
          ]
        : LIST_COLUMNS_CANCEL;
    const priceIndex = baseColumns.findIndex(
      (col: GridColDef) => col.field === "cancelPrice",
    );

    // Cancel Order: GWP 행 체크박스에 마우스 올리면 자동 취소 안내 툴팁 노출
    const checkboxColumn: GridColDef = {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      renderCell: (params) =>
        isGwpLocked(params.row) ? (
          <Tooltip
            title="GWP items are automatically canceled along with their related products."
            placement="top"
            arrow
          >
            <span>
              <GridCellCheckboxRenderer {...params} />
            </span>
          </Tooltip>
        ) : (
          <GridCellCheckboxRenderer {...params} />
        ),
    };

    // cancelPrice가 있으면 그 앞에 cellQuantity 삽입, 없으면 맨 뒤에 추가
    return [
      ...(claimType === "CANCEL_ORDER" ? [checkboxColumn] : []),
      ...baseColumns.slice(0, priceIndex),
      {
        field: "cellQuantity",
        headerName: "Qty",
        flex: 1,
        minWidth: 100,
        renderCell: renderSelectCell,
      },
      ...baseColumns.slice(priceIndex),
    ];
  }, [renderSelectCell, claimType, isGwpLocked]);

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
          // 선택 불가 행(취소 완료 · GWP) 회색 배경
          "& .inactive-row, & .inactive-row:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        rowSelectionModel={selectedRows.map((row) => row.id)}
        isRowSelectable={(params) =>
          (params.row.isActive ?? true) && !isGwpLocked(params.row)
        }
        checkboxSelection={!isAllCancel}
        getRowClassName={(params) =>
          !params.row.isActive || isGwpLocked(params.row) ? "inactive-row" : ""
        }
        onRowSelectionModelChange={handleSelectionChange}
      />
    </div>
  );
}
