// ------------------------------------------------------------
// Shipment info 컬럼 스타일
export const DATA_GRID_STYLES = {
  "&": {
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
  },
  "& .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader":
    {
      backgroundColor: "rgba(33, 150, 243, 0.08)",
      color: "#000000DE",
    },
  "& .MuiDataGrid-cell": {
    outline: "none!important",
  },
  "& .MuiDataGrid-columnHeaders:hover .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  ".MuiDataGrid-columnSeparator svg": { display: "none" },
  "& .custom-cell-claim": {
    padding: "0",
  },
  "& .custom-cell-center": {
    display: "flex",
    alignItems: "center",
  },
};
