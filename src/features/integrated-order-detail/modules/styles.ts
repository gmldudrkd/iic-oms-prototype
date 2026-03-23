// ------------------------------------------------------------
// Product Inspection Result 컬럼 스타일
export const DATA_GRID_STYLES_PRODUCT_INSPECTION = {
  "&": {
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
  },
  "& .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader":
    {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      color: "#000000DE",
    },
  "& .MuiDataGrid-cell": {
    backgroundColor: "#ffffff",
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
