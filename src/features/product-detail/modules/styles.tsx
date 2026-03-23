export const PRODUCT_DETAIL_DATA_GRID_STYLES = {
  "&": {
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    margin: "16px",
  },
  "& .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader":
    {
      backgroundColor: "rgba(33, 150, 243, 0.08)",
      color: "#000000DE",
    },
  "& .MuiDataGrid-cell": { outline: "none!important" },
  "& .MuiDataGrid-columnHeaders:hover .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  ".MuiDataGrid-columnSeparator svg": { display: "none" },
  "& .inactive-row .MuiDataGrid-cell": { opacity: 0.5 },
  "& .inactive-row:hover": { backgroundColor: "transparent" },
  "& .inactive-row .MuiCheckbox-root": { opacity: 0.5, pointerEvents: "none" },
  "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
};
