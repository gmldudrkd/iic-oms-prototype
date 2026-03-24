export const MENU = [
  {
    segment: "order",
    title: "Order",
    children: [
      { segment: "order-dashboard", title: "Overview" },
      {
        segment: "order-list",
        title: "Order List",
        pattern: "order-list{/detail/:orderId}*",
      },
      {
        segment: "return-list",
        title: "Return List",
        pattern: "return-list{/detail/:returnId}*",
      },
      {
        segment: "exchange-list",
        title: "Exchange List",
        pattern: "exchange-list{/detail/:exchangeId}*",
      },
      {
        segment: "export",
        title: "Export",
      },
    ],
  },
  {
    segment: "stock",
    title: "Stock",
    children: [
      { segment: "overview", title: "Overview" },
      { segment: "distribution-setting", title: "Distribution Setting" },
      { segment: "history", title: "History" },
    ],
  },
  {
    segment: "product",
    title: "Product",
    children: [
      {
        segment: "product-list",
        title: "Product List",
        pattern: "product-list{/detail/:skuCode}*",
      },
      { segment: "channel-product-list", title: "Channel Product List" },
    ],
  },
  {
    segment: "channel",
    title: "Channel",
    children: [
      {
        segment: "channel-list",
        title: "Channel List",
        pattern: "channel-list{/:channelId}*",
      },
    ],
  },
  {
    segment: "user",
    title: "User",
    children: [
      {
        segment: "user-list",
        title: "User List",
        pattern: "user-list{/:email}*",
      },
    ],
  },
  {
    segment: "promotion",
    title: "Promotion",
    children: [
      {
        segment: "promotion-list",
        title: "List",
        pattern: "promotion-list{/detail/:promotionId}*{/edit/:promotionId}*{/add}*",
      },
    ],
  },
];
