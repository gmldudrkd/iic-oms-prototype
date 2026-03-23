// ------------------------------------------------------------
// Product Rate Edit 컬럼 스타일
export const DATA_GRID_STYLES = {
  "&": {
    borderRadius: 0,
    border: "none",
    maxHeight: "200px",
  },
  "& .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader":
    {
      backgroundColor: "rgba(33, 150, 243, 0.08)",
      color: "#000000DE",
      height: "40px! important",
    },
  "& .MuiDataGrid-cell": {
    outline: "none!important",
    height: "40px",
    display: "flex",
    alignItems: "center",
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
