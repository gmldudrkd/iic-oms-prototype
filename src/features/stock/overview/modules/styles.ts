export const DATAGRID_ZERO_PADDING_FIELDS = [
  "channelStocks",
  "distributionRatio",
  "distributed",
  "preOrder",
  "used",
  "shipped",
  "available",
  "stockStatus",
  "status",
  "offPeriod",
  "preOrderExpiredAt",
  "channelCheckbox",
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

export const CHANNEL_STOCK_ROW_HEIGHT = 36;
