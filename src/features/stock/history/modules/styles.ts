export const DATAGRID_ZERO_PADDING_FIELDS = [
  "channelStocks",
  "distributed",
  "preOrder",
  "used",
  "shipped",
  "available",
] as const;

export const getDataGridStyles = () => {
  const cellSelectors = DATAGRID_ZERO_PADDING_FIELDS.map(
    (field) => `& .MuiDataGrid-cell[data-field='${field}']`,
  ).join(", ");

  return {
    [cellSelectors]: {
      padding: 0,
    },
  };
};
