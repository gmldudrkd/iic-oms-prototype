/**
 * Prototype Mode - Mock Data
 * 디자인 프로토타입 확인용 mock 데이터
 */

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

// --- Order List Mock ---
const mockOrderList = {
  data: [
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      orderId: "ORD-20250201-001",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: yesterday,
      ordererEmail: "john.doe@example.com",
      ordererName: "John Doe",
      ordererPhone: "+1-555-0101",
      originOrderNo: "NF-2025020101",
      purchaseNo: "PUR-001",
      recipientName: "John Doe",
      recipientPhone: "+1-555-0101",
      shipments: [
        {
          shipmentId: "SHP-001",
          shipmentNo: "SHIP-20250201-001",
          status: { name: "SHIPPED", description: "Shipped" },
          trackingNo: "1Z999AA10123456784",
        },
      ],
      status: { name: "COMPLETED", description: "Completed" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "ATIISSU_OFFICIAL",
        description: "Atiissu Official",
      },
      corporation: "US",
      orderId: "ORD-20250201-002",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: yesterday,
      ordererEmail: "jane.smith@example.com",
      ordererName: "Jane Smith",
      ordererPhone: "+1-555-0102",
      originOrderNo: "AT-2025020102",
      recipientName: "Jane Smith",
      recipientPhone: "+1-555-0102",
      shipments: [
        {
          shipmentId: "SHP-002",
          shipmentNo: "SHIP-20250201-002",
          status: {
            name: "PICKING_REQUESTED",
            description: "Picking Requested",
          },
        },
      ],
      status: { name: "SHIPMENT_REQUESTED", description: "Shipment Requested" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_US",
        description: "GM Official US",
      },
      corporation: "US",
      orderId: "ORD-20250201-003",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: twoDaysAgo,
      ordererEmail: "alex.kim@example.com",
      ordererName: "Alex Kim",
      ordererPhone: "+1-555-0103",
      originOrderNo: "GM-2025020103",
      recipientName: "Alex Kim",
      recipientPhone: "+1-555-0103",
      shipments: [
        {
          shipmentId: "SHP-003",
          shipmentNo: "SHIP-20250201-003",
          status: { name: "PICKUP_REQUESTED", description: "Pickup Requested" },
        },
      ],
      status: { name: "PENDING", description: "Pending" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      orderId: "ORD-20250201-004",
      orderType: { name: "NORMAL", description: "Normal" },
      tags: "Pre-order",
      receiveMethod: "Store Pickup",
      orderedAt: twoDaysAgo,
      ordererEmail: "sarah.lee@example.com",
      ordererName: "Sarah Lee",
      ordererPhone: "+1-555-0104",
      originOrderNo: "NF-2025020104",
      recipientName: "Sarah Lee",
      recipientPhone: "+1-555-0104",
      shipments: [
        {
          shipmentId: "SHP-004",
          shipmentNo: "SHIP-20250201-004",
          status: { name: "COMPLETED", description: "Completed" },
          trackingNo: "1Z999AA10123456785",
        },
      ],
      status: { name: "COMPLETED", description: "Completed" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_CA",
        description: "GM Official CA",
      },
      corporation: "CA",
      orderId: "ORD-20250201-005",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: threeDaysAgo,
      ordererEmail: "mike.park@example.com",
      ordererName: "Mike Park",
      ordererPhone: "+1-555-0105",
      originOrderNo: "GM-2025020105",
      recipientName: "Mike Park",
      recipientPhone: "+1-555-0105",
      shipments: [
        {
          shipmentId: "SHP-005",
          shipmentNo: "SHIP-20250201-005",
          status: { name: "PACKED", description: "Packed" },
        },
      ],
      status: { name: "COLLECTED", description: "Collected" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "ATIISSU_OFFICIAL",
        description: "Atiissu Official",
      },
      corporation: "US",
      orderId: "ORD-20250201-006",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: threeDaysAgo,
      ordererEmail: "emily.chen@example.com",
      ordererName: "Emily Chen",
      ordererPhone: "+1-555-0106",
      originOrderNo: "AT-2025020106",
      recipientName: "Emily Chen",
      recipientPhone: "+1-555-0106",
      shipments: [
        {
          shipmentId: "SHP-006",
          shipmentNo: "SHIP-20250201-006",
          status: { name: "PREPARED", description: "Prepared" },
        },
      ],
      status: { name: "PENDING", description: "Pending" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      orderId: "ORD-20250201-007",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Store Pickup",
      orderedAt: now,
      ordererEmail: "david.wang@example.com",
      ordererName: "David Wang",
      ordererPhone: "+1-555-0107",
      originOrderNo: "NF-2025020107",
      recipientName: "David Wang",
      recipientPhone: "+1-555-0107",
      shipments: [
        {
          shipmentId: "SHP-007",
          shipmentNo: "SHIP-20250201-007",
          status: { name: "PICKED", description: "Picked" },
        },
      ],
      status: { name: "SHIPMENT_REQUESTED", description: "Shipment Requested" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_US",
        description: "GM Official US",
      },
      corporation: "US",
      orderId: "ORD-20250201-008",
      orderType: { name: "NORMAL", description: "Normal" },
      receiveMethod: "Delivery",
      orderedAt: now,
      ordererEmail: "lisa.jung@example.com",
      ordererName: "Lisa Jung",
      ordererPhone: "+1-555-0108",
      originOrderNo: "GM-2025020108",
      recipientName: "Lisa Jung",
      recipientPhone: "+1-555-0108",
      shipments: [
        {
          shipmentId: "SHP-008",
          shipmentNo: "SHIP-20250201-008",
          status: { name: "SHIPPED", description: "Shipped" },
          trackingNo: "1Z999AA10123456786",
        },
      ],
      status: { name: "COMPLETED", description: "Completed" },
    },
  ],
  isFirst: true,
  isLast: true,
  pageNumber: 0,
  pageSize: 25,
  totalCount: 8,
  totalPages: 1,
};

// --- Return List Mock (PageResponseReturnResponse) ---
const mockReturnList = {
  data: [
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      claimId: "CLM-RTN-001",
      orderId: "ORD-20250201-001",
      returnId: "RTN-001",
      returnNo: "RTN-NO-20250201-001",
      originOrderNo: "NF-2025020101",
      purchaseNo: "PUR-001",
      createdAt: yesterday,
      ordererEmail: "john.doe@example.com",
      ordererName: "John Doe",
      ordererPhone: "+1-555-0101",
      recipientName: "John Doe",
      recipientPhone: "+1-555-0101",
      reason: "Size does not fit",
      pickupTrackingNo: "1Z999AA10123456790",
      status: { name: "PENDING", description: "Pending" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "ATIISSU_OFFICIAL",
        description: "Atiissu Official",
      },
      corporation: "US",
      claimId: "CLM-RTN-002",
      orderId: "ORD-20250201-002",
      returnId: "RTN-002",
      returnNo: "RTN-NO-20250201-002",
      originOrderNo: "AT-2025020102",
      createdAt: twoDaysAgo,
      ordererEmail: "jane.smith@example.com",
      ordererName: "Jane Smith",
      ordererPhone: "+1-555-0102",
      recipientName: "Jane Smith",
      recipientPhone: "+1-555-0102",
      reason: "Product defect",
      pickupTrackingNo: "1Z999AA10123456791",
      status: { name: "PICKUP_REQUESTED", description: "Pickup Requested" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_US",
        description: "GM Official US",
      },
      corporation: "US",
      claimId: "CLM-RTN-003",
      orderId: "ORD-20250201-004",
      returnId: "RTN-003",
      returnNo: "RTN-NO-20250201-003",
      originOrderNo: "NF-2025020104",
      createdAt: twoDaysAgo,
      ordererEmail: "sarah.lee@example.com",
      ordererName: "Sarah Lee",
      ordererPhone: "+1-555-0104",
      recipientName: "Sarah Lee",
      recipientPhone: "+1-555-0104",
      reason: "Changed my mind",
      status: { name: "PICKUP_ONGOING", description: "Pickup Ongoing" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_CA",
        description: "GM Official CA",
      },
      corporation: "CA",
      claimId: "CLM-RTN-004",
      orderId: "ORD-20250201-008",
      returnId: "RTN-004",
      returnNo: "RTN-NO-20250201-004",
      originOrderNo: "GM-2025020108",
      createdAt: threeDaysAgo,
      ordererEmail: "lisa.jung@example.com",
      ordererName: "Lisa Jung",
      ordererPhone: "+1-555-0108",
      recipientName: "Lisa Jung",
      recipientPhone: "+1-555-0108",
      reason: "Received wrong item",
      pickupTrackingNo: "1Z999AA10123456792",
      status: { name: "RECEIVED", description: "Received" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_CA",
        description: "GM Official CA",
      },
      corporation: "CA",
      claimId: "CLM-RTN-005",
      orderId: "ORD-20250201-005",
      returnId: "RTN-005",
      returnNo: "RTN-NO-20250201-005",
      originOrderNo: "GM-2025020105",
      createdAt: threeDaysAgo,
      ordererEmail: "mike.park@example.com",
      ordererName: "Mike Park",
      ordererPhone: "+1-555-0105",
      recipientName: "Mike Park",
      recipientPhone: "+1-555-0105",
      reason: "Color mismatch",
      pickupTrackingNo: "1Z999AA10123456793",
      status: { name: "REFUNDED", description: "Refunded" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "ATIISSU_OFFICIAL",
        description: "Atiissu Official",
      },
      corporation: "US",
      claimId: "CLM-RTN-006",
      orderId: "ORD-20250201-006",
      returnId: "RTN-006",
      returnNo: "RTN-NO-20250201-006",
      originOrderNo: "AT-2025020106",
      createdAt: threeDaysAgo,
      ordererEmail: "emily.chen@example.com",
      ordererName: "Emily Chen",
      ordererPhone: "+1-555-0106",
      recipientName: "Emily Chen",
      recipientPhone: "+1-555-0106",
      reason: "Customer cancelled",
      status: { name: "CANCELED", description: "Canceled" },
    },
  ],
  isFirst: true,
  isLast: true,
  pageNumber: 0,
  pageSize: 25,
  totalCount: 6,
  totalPages: 1,
};

// --- Exchange List Mock (PageResponseExchangeResponse) ---
const mockExchangeList = {
  data: [
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      claimId: "CLM-EXC-001",
      orderId: "ORD-20250201-001",
      exchangeId: "EXC-001",
      exchangeNo: "EXC-NO-20250201-001",
      exchangeShipmentNos: [],
      originOrderNo: "NF-2025020101",
      purchaseNo: "PUR-001",
      createdAt: yesterday,
      ordererEmail: "john.doe@example.com",
      ordererName: "John Doe",
      ordererPhone: "+1-555-0101",
      recipientName: "John Doe",
      recipientPhone: "+1-555-0101",
      pickupTrackingNo: "794644790132",
      status: { name: "PENDING", description: "Pending" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_US",
        description: "GM Official US",
      },
      corporation: "US",
      claimId: "CLM-EXC-002",
      orderId: "ORD-20250201-003",
      exchangeId: "EXC-002",
      exchangeNo: "EXC-NO-20250201-002",
      exchangeShipmentNos: ["ESHIP-001"],
      originOrderNo: "GM-2025020103",
      createdAt: twoDaysAgo,
      ordererEmail: "alex.kim@example.com",
      ordererName: "Alex Kim",
      ordererPhone: "+1-555-0103",
      recipientName: "Alex Kim",
      recipientPhone: "+1-555-0103",
      pickupTrackingNo: "794644790133",
      status: { name: "PICKUP_REQUESTED", description: "Pickup Requested" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "ATIISSU_OFFICIAL",
        description: "Atiissu Official",
      },
      corporation: "US",
      claimId: "CLM-EXC-003",
      orderId: "ORD-20250201-007",
      exchangeId: "EXC-003",
      exchangeNo: "EXC-NO-20250201-003",
      exchangeShipmentNos: [],
      originOrderNo: "NF-2025020107",
      createdAt: twoDaysAgo,
      ordererEmail: "david.wang@example.com",
      ordererName: "David Wang",
      ordererPhone: "+1-555-0107",
      recipientName: "David Wang",
      recipientPhone: "+1-555-0107",
      status: { name: "RECEIVED", description: "Received" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "Nuflaat Official",
      },
      corporation: "US",
      claimId: "CLM-EXC-004",
      orderId: "ORD-20250201-004",
      exchangeId: "EXC-004",
      exchangeNo: "EXC-NO-20250201-004",
      exchangeShipmentNos: ["ESHIP-002"],
      originOrderNo: "NF-2025020104",
      createdAt: threeDaysAgo,
      ordererEmail: "sarah.lee@example.com",
      ordererName: "Sarah Lee",
      ordererPhone: "+1-555-0104",
      recipientName: "Sarah Lee",
      recipientPhone: "+1-555-0104",
      pickupTrackingNo: "794644790134",
      status: { name: "SHIPMENT_REQUESTED", description: "Shipment Requested" },
    },
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      channelType: {
        name: "GENTLE_MONSTER_OFFICIAL_CA",
        description: "GM Official CA",
      },
      corporation: "CA",
      claimId: "CLM-EXC-005",
      orderId: "ORD-20250201-005",
      exchangeId: "EXC-005",
      exchangeNo: "EXC-NO-20250201-005",
      exchangeShipmentNos: ["ESHIP-003"],
      originOrderNo: "GM-2025020105",
      createdAt: threeDaysAgo,
      ordererEmail: "mike.park@example.com",
      ordererName: "Mike Park",
      ordererPhone: "+1-555-0105",
      recipientName: "Mike Park",
      recipientPhone: "+1-555-0105",
      pickupTrackingNo: "794644790135",
      status: { name: "EXCHANGED", description: "Exchanged" },
    },
  ],
  isFirst: true,
  isLast: true,
  pageNumber: 0,
  pageSize: 25,
  totalCount: 5,
  totalPages: 1,
};

// --- Dashboard Summary Mock ---
const mockDashboardSummary = {
  orderSummaries: {
    awaitingCounts: [
      { count: 3, status: { name: "PENDING", description: "Pending" } },
      { count: 2, status: { name: "COLLECTED", description: "Collected" } },
    ],
    awaitingTotalCount: 5,
    inProgressCounts: [
      {
        count: 4,
        status: {
          name: "SHIPMENT_REQUESTED",
          description: "Shipment Requested",
        },
      },
      {
        count: 1,
        status: { name: "PARTLY_CONFIRMED", description: "Partly Confirmed" },
      },
    ],
    inProgressTotalCount: 5,
    finalizedCounts: [
      { count: 12, status: { name: "COMPLETED", description: "Completed" } },
      { count: 2, status: { name: "CANCELED", description: "Canceled" } },
    ],
    finalizedTotalCount: 14,
  },
  shipmentSummaries: {
    awaitingCounts: [
      {
        count: 3,
        status: { name: "PICKING_REQUESTED", description: "Picking Requested" },
      },
    ],
    awaitingTotalCount: 3,
    inProgressCounts: [
      { count: 2, status: { name: "PICKED", description: "Picked" } },
      { count: 1, status: { name: "PACKED", description: "Packed" } },
      { count: 5, status: { name: "SHIPPED", description: "Shipped" } },
    ],
    inProgressTotalCount: 8,
    finalizedCounts: [
      { count: 10, status: { name: "DELIVERED", description: "Delivered" } },
    ],
    finalizedTotalCount: 10,
  },
  returnSummaries: {
    awaitingCounts: [
      { count: 1, status: { name: "REQUESTED", description: "Requested" } },
    ],
    awaitingTotalCount: 1,
    inProgressCounts: [
      { count: 1, status: { name: "IN_PROGRESS", description: "In Progress" } },
    ],
    inProgressTotalCount: 1,
    finalizedCounts: [
      { count: 3, status: { name: "COMPLETED", description: "Completed" } },
    ],
    finalizedTotalCount: 3,
  },
  exchangeSummaries: {
    awaitingCounts: [
      { count: 1, status: { name: "REQUESTED", description: "Requested" } },
    ],
    awaitingTotalCount: 1,
    inProgressCounts: [],
    inProgressTotalCount: 0,
    finalizedCounts: [
      { count: 2, status: { name: "COMPLETED", description: "Completed" } },
    ],
    finalizedTotalCount: 2,
  },
  storePickupSummaries: {
    inProgressCounts: [
      { count: 3, status: { name: "READY", description: "Ready" } },
      { count: 1, status: { name: "NOTIFIED", description: "Notified" } },
    ],
    inProgressTotalCount: 4,
    finalizedCounts: [
      { count: 5, status: { name: "PICKED_UP", description: "Picked Up" } },
    ],
    finalizedTotalCount: 5,
  },
  reshipmentSummaries: {
    inProgressCounts: [
      {
        count: 2,
        status: {
          name: "SHIPMENT_REQUESTED",
          description: "Shipment Requested",
        },
      },
      { count: 1, status: { name: "SHIPPED", description: "Shipped" } },
    ],
    inProgressTotalCount: 3,
    finalizedCounts: [
      { count: 4, status: { name: "DELIVERED", description: "Delivered" } },
    ],
    finalizedTotalCount: 4,
  },
};

// --- Channel List Mock ---
const mockChannelList = [
  {
    brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
    channelId: 1,
    channelName: "Gentle Monster Official US",
    channelType: "OWN",
    corporation: "US",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
    sapChannelCode: "E-1001",
    sapChannelName: "GM US Official",
    updatedAt: yesterday,
  },
  {
    brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
    channelId: 2,
    channelName: "Gentle Monster Official CA",
    channelType: "OWN",
    corporation: "CA",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
    sapChannelCode: "E-1002",
    sapChannelName: "GM CA Official",
    updatedAt: yesterday,
  },
  {
    brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
    channelId: 3,
    channelName: "Nuflaat Official",
    channelType: "OWN",
    corporation: "US",
    createdAt: "2024-02-01T00:00:00Z",
    isActive: true,
    sapChannelCode: "E-1003",
    sapChannelName: "Nuflaat Official",
    updatedAt: twoDaysAgo,
  },
  {
    brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
    channelId: 4,
    channelName: "Atiissu Official",
    channelType: "OWN",
    corporation: "US",
    createdAt: "2024-03-01T00:00:00Z",
    isActive: true,
    sapChannelCode: "E-1004",
    sapChannelName: "Atiissu Official",
    updatedAt: threeDaysAgo,
  },
  {
    brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
    channelId: 5,
    channelName: "Atiissu Test",
    channelType: "EXTERNAL",
    corporation: "US",
    createdAt: "2024-04-01T00:00:00Z",
    isActive: false,
    sapChannelCode: "E-1005",
    sapChannelName: "Atiissu Test",
    updatedAt: threeDaysAgo,
  },
];

// --- Stock Dashboard Mock ---
const mockStockDashboard = {
  data: [
    {
      productType: { name: "SINGLE", description: "Single" },
      products: [
        {
          channelStocks: [
            {
              availableQuantity: 45,
              channel: {
                name: "NUFLAAT_OFFICIAL",
                description: "Nuflaat Official",
              },
              channelSendStatus: "ON",
              distributedQuantity: 50,
              preorderQuantity: 0,
              rate: 50,
              shippedQuantity: 5,
              usedQuantity: 5,
            },
            {
              availableQuantity: 30,
              channel: {
                name: "GENTLE_MONSTER_OFFICIAL_US",
                description: "GM Official US",
              },
              channelSendStatus: "ON",
              distributedQuantity: 35,
              preorderQuantity: 0,
              rate: 30,
              shippedQuantity: 5,
              usedQuantity: 5,
            },
          ],
          onlineMovementQuantity: 0,
          onlineQuantity: 100,
          productCode: "SAP-GM-001",
          productName: "Jennie - Kuku 01",
          safetyQuantity: 5,
          sku: "GM-KUK-001-BLK",
          undistributedQuantity: 15,
          unitQuantity: 1,
          upcCode: "8809123456001",
        },
      ],
      sku: "GM-KUK-001-BLK",
      skuName: "Jennie - Kuku 01 Black",
    },
    {
      productType: { name: "SINGLE", description: "Single" },
      products: [
        {
          channelStocks: [
            {
              availableQuantity: 20,
              channel: {
                name: "NUFLAAT_OFFICIAL",
                description: "Nuflaat Official",
              },
              channelSendStatus: "ON",
              distributedQuantity: 25,
              preorderQuantity: 0,
              rate: 50,
              shippedQuantity: 5,
              usedQuantity: 5,
            },
          ],
          onlineMovementQuantity: 0,
          onlineQuantity: 60,
          productCode: "SAP-GM-002",
          productName: "Jennie - Kuku 02",
          safetyQuantity: 3,
          sku: "GM-KUK-002-WHT",
          undistributedQuantity: 10,
          unitQuantity: 1,
          upcCode: "8809123456002",
        },
      ],
      sku: "GM-KUK-002-WHT",
      skuName: "Jennie - Kuku 02 White",
    },
    {
      productType: { name: "SINGLE", description: "Single" },
      products: [
        {
          channelStocks: [
            {
              availableQuantity: 80,
              channel: {
                name: "ATIISSU_OFFICIAL",
                description: "Atiissu Official",
              },
              channelSendStatus: "ON",
              distributedQuantity: 90,
              preorderQuantity: 10,
              rate: 60,
              shippedQuantity: 10,
              usedQuantity: 10,
            },
          ],
          onlineMovementQuantity: 5,
          onlineQuantity: 150,
          productCode: "SAP-AT-001",
          productName: "Lip Mousse - Rose",
          safetyQuantity: 10,
          sku: "AT-LPM-001-RSE",
          undistributedQuantity: 50,
          unitQuantity: 1,
          upcCode: "8809123456003",
        },
      ],
      sku: "AT-LPM-001-RSE",
      skuName: "Lip Mousse Rose",
    },
    {
      productType: { name: "BUNDLE", description: "Bundle" },
      products: [
        {
          channelStocks: [
            {
              availableQuantity: 10,
              channel: {
                name: "NUFLAAT_OFFICIAL",
                description: "Nuflaat Official",
              },
              channelSendStatus: "ON",
              distributedQuantity: 15,
              preorderQuantity: 0,
              rate: 100,
              shippedQuantity: 5,
              usedQuantity: 5,
            },
          ],
          onlineMovementQuantity: 0,
          onlineQuantity: 20,
          productCode: "SAP-NF-BDL-001",
          productName: "Nuflaat Starter Set",
          safetyQuantity: 2,
          sku: "NF-BDL-001",
          undistributedQuantity: 5,
          unitQuantity: 3,
          upcCode: "8809123456004",
        },
      ],
      sku: "NF-BDL-001",
      skuName: "Nuflaat Starter Bundle Set",
    },
  ],
  isFirst: true,
  isLast: true,
  pageNumber: 0,
  pageSize: 25,
  totalCount: 4,
  totalPages: 1,
};

// --- Distribution Setting Mock ---
const mockDistributionSetting = [
  {
    channelType: { name: "NUFLAAT_OFFICIAL", description: "Nuflaat Official" },
    distributionPriority: 1,
    distributionRate: 50,
    id: 1,
  },
  {
    channelType: {
      name: "GENTLE_MONSTER_OFFICIAL_US",
      description: "GM Official US",
    },
    distributionPriority: 2,
    distributionRate: 30,
    id: 2,
  },
  {
    channelType: { name: "ATIISSU_OFFICIAL", description: "Atiissu Official" },
    distributionPriority: 3,
    distributionRate: 20,
    id: 3,
  },
];

// --- User Permissions Mock ---
const mockUserPermissions = {
  brands: [
    {
      brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
      corporations: [
        {
          name: "US",
          channels: [
            {
              name: "GENTLE_MONSTER_OFFICIAL_US",
              description: "GM Official US",
            },
            { name: "NUFLAAT_OFFICIAL", description: "Nuflaat Official" },
            { name: "ATIISSU_OFFICIAL", description: "Atiissu Official" },
            { name: "ATIISSU_TEST", description: "Atiissu Test" },
          ],
        },
        {
          name: "CA",
          channels: [
            {
              name: "GENTLE_MONSTER_OFFICIAL_CA",
              description: "GM Official CA",
            },
          ],
        },
      ],
    },
  ],
};

// --- Product List Mock (PIM) ---
const mockProductList = {
  pagination: {
    hasNext: false,
    hasPrevious: false,
    pageNo: 1,
    pageSize: 25,
    totalCount: 6,
    totalPages: 1,
  },
  products: [
    {
      skuCode: "GM-KUK-001-BLK",
      sapCode: "SAP-GM-001",
      modelCode: "MDL-KUK-001",
      upcCode: "8809123456001",
      sapName: "Jennie - Kuku 01",
      productType: "SINGLE",
      productInfoStatus: "ACTIVE",
      quantity: 100,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: yesterday,
    },
    {
      skuCode: "GM-KUK-002-WHT",
      sapCode: "SAP-GM-002",
      modelCode: "MDL-KUK-002",
      upcCode: "8809123456002",
      sapName: "Jennie - Kuku 02",
      productType: "SINGLE",
      productInfoStatus: "ACTIVE",
      quantity: 60,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: twoDaysAgo,
    },
    {
      skuCode: "AT-LPM-001-RSE",
      sapCode: "SAP-AT-001",
      modelCode: "MDL-LPM-001",
      upcCode: "8809123456003",
      sapName: "Lip Mousse - Rose",
      productType: "SINGLE",
      productInfoStatus: "ACTIVE",
      quantity: 150,
      createdAt: "2024-07-01T00:00:00Z",
      updatedAt: yesterday,
    },
    {
      skuCode: "AT-LPM-002-CRL",
      sapCode: "SAP-AT-002",
      modelCode: "MDL-LPM-002",
      upcCode: "8809123456005",
      sapName: "Lip Mousse - Coral",
      productType: "SINGLE",
      productInfoStatus: "ACTIVE",
      quantity: 80,
      createdAt: "2024-07-15T00:00:00Z",
      updatedAt: twoDaysAgo,
    },
    {
      skuCode: "NF-BDL-001",
      sapCode: "SAP-NF-BDL-001",
      modelCode: "MDL-NF-BDL",
      upcCode: "8809123456004",
      sapName: "Nuflaat Starter Set",
      productType: "BUNDLE",
      productInfoStatus: "ACTIVE",
      quantity: 20,
      createdAt: "2024-08-01T00:00:00Z",
      updatedAt: threeDaysAgo,
    },
    {
      skuCode: "GM-SUN-001-TRT",
      sapCode: "SAP-GM-003",
      modelCode: "MDL-SUN-001",
      upcCode: "8809123456006",
      sapName: "Sunglasses - Tortoise",
      productType: "SINGLE",
      productInfoStatus: "INACTIVE",
      quantity: 0,
      createdAt: "2024-05-01T00:00:00Z",
      updatedAt: threeDaysAgo,
    },
  ],
};

// --- Stock History Mock ---
const mockStockHistory = {
  productName: "Jennie - Kuku 01",
  sku: "GM-KUK-001-BLK",
  histories: Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    return {
      channelStocks: [
        {
          availableQuantity: 40 + i * 2,
          channelType: {
            name: "NUFLAAT_OFFICIAL",
            description: "Nuflaat Official",
          },
          distributedQuantity: 50 + i,
          preorderQuantity: 0,
          shippedQuantity: 10 - i,
          sku: "GM-KUK-001-BLK",
          updatedAt: date.toISOString(),
          usedQuantity: 10 - i,
        },
      ],
      onlineStock: {
        brand: "GENTLE_MONSTER",
        corporation: "US",
        movementQuantity: i * 2,
        quantity: 100 + i * 3,
        safetyQuantity: 5,
        sku: "GM-KUK-001-BLK",
        updatedAt: date.toISOString(),
      },
      timestamp: date.toISOString(),
      totalDistributedQuantity: 50 + i,
      undistributedQuantity: 50 + i * 2,
    };
  }),
};

// --- Order Detail Mock (OrderDetailResponse) ---
const mockOrderDetail = {
  brand: { name: "GENTLE_MONSTER", description: "Gentle Monster" },
  channelType: { name: "NUFLAAT_OFFICIAL", description: "Nuflaat Official" },
  corporation: "US",
  orderId: "ORD-20250201-001",
  orderType: { name: "NORMAL", description: "Normal" },
  orderedAt: yesterday,
  updatedAt: now,
  originOrderNo: "NF-2025020101",
  purchaseNo: "PUR-001",
  shippingFee: 0,
  changeReason: "",
  status: { name: "COMPLETED", description: "Completed" },
  orderer: {
    fullName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-0101",
    phoneCountryNo: "+1",
  },
  recipient: {
    fullName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    phone: "555-0101",
    phoneCountryNo: "+1",
    deliveryMessage: "Leave at front door",
    address: {
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      countryType: "US",
    },
  },
  items: [
    {
      orderItemId: "OI-001",
      originItemId: "ORIG-001",
      sku: "GM-KUK-001-BLK",
      productCode: "SAP-GM-001",
      productName: "Jennie - Kuku 01",
      upcCode: "8809123456001",
      thumbnailUrl: "",
      sequence: 1,
      orderedQuantity: 1,
      shipmentQuantity: 1,
      shippedQuantity: 1,
      canceledQuantity: 0,
      returnedQuantity: 0,
      reshippedQuantity: 0,
      allocateQuantity: 1,
      price: 320,
      subTotal: 320,
      components: [],
      products: [
        {
          sku: "GM-KUK-001-BLK",
          productCode: "SAP-GM-001",
          productName: "Jennie - Kuku 01 Black",
          category: "Eyewear",
          price: 320,
          quantity: 1,
        },
      ],
    },
    {
      orderItemId: "OI-002",
      originItemId: "ORIG-002",
      sku: "AT-LPM-001-RSE",
      productCode: "SAP-AT-001",
      productName: "Lip Mousse - Rose",
      upcCode: "8809123456003",
      thumbnailUrl: "",
      sequence: 2,
      orderedQuantity: 2,
      shipmentQuantity: 2,
      shippedQuantity: 2,
      canceledQuantity: 0,
      returnedQuantity: 0,
      reshippedQuantity: 0,
      allocateQuantity: 2,
      price: 45,
      subTotal: 90,
      components: [],
      products: [
        {
          sku: "AT-LPM-001-RSE",
          productCode: "SAP-AT-001",
          productName: "Lip Mousse - Rose",
          category: "Beauty",
          price: 45,
          quantity: 2,
        },
      ],
    },
  ],
  payments: [
    {
      currency: "USD",
      method: "CREDIT_CARD",
      paidAmount: 410,
      paidAt: yesterday,
      shippingFee: 0,
      taxAmount: 0,
      dutyAmount: 0,
      transactionNo: "TXN-20250201-001",
    },
  ],
  shipments: [
    {
      id: "SHP-001",
      shipmentNo: "SHIP-20250201-001",
      wmsNo: "WMS-001",
      status: { name: "SHIPPED", description: "Shipped" },
      event: "SHIP",
      shippedAt: now,
      updatedAt: now,
      trackingUrl: "",
      cancelReason: "",
      recipient: {
        fullName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        phone: "555-0101",
        phoneCountryNo: "+1",
        address: {
          line1: "123 Main Street",
          line2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          countryType: "US",
        },
      },
      delivery: {
        carrierCode: "UPS",
        trackingNo: "1Z999AA10123456784",
        deliveryType: "STANDARD",
      },
      deliveries: [
        {
          trackingNo: "1Z999AA10123456784",
          trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
        },
      ],
      items: [
        {
          shipmentItemId: "SI-001",
          orderItemId: "OI-001",
          originItemId: "ORIG-001",
          sku: "GM-KUK-001-BLK",
          productCode: "SAP-GM-001",
          productName: "Jennie - Kuku 01",
          thumbnailUrl: "",
          sequence: 1,
          shipmentQuantity: 1,
          shippedQuantity: 1,
          canceledQuantity: 0,
          components: [],
          products: [
            {
              sku: "GM-KUK-001-BLK",
              productCode: "SAP-GM-001",
              productName: "Jennie - Kuku 01 Black",
              category: "Eyewear",
              price: 320,
              quantity: 1,
            },
          ],
        },
        {
          shipmentItemId: "SI-002",
          orderItemId: "OI-002",
          originItemId: "ORIG-002",
          sku: "AT-LPM-001-RSE",
          productCode: "SAP-AT-001",
          productName: "Lip Mousse - Rose",
          thumbnailUrl: "",
          sequence: 2,
          shipmentQuantity: 2,
          shippedQuantity: 2,
          canceledQuantity: 0,
          components: [],
          products: [
            {
              sku: "AT-LPM-001-RSE",
              productCode: "SAP-AT-001",
              productName: "Lip Mousse - Rose",
              category: "Beauty",
              price: 45,
              quantity: 2,
            },
          ],
        },
      ],
    },
  ],
  refundPayments: [],
};

// --- Return Detail Mock (ReturnDetailResponse[]) ---
const mockReturnDetail = [
  {
    returnId: "RTN-001",
    returnNo: "RTN-NO-20250201-001",
    claimId: "CLM-RTN-001",
    orderId: "ORD-20250201-001",
    originOrderNo: "NF-2025020101",
    status: { name: "PENDING", description: "Pending" },
    claimFault: "CUSTOMER",
    claimReason: "Size does not fit",
    returnMethod: "DELIVERY",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "john.doe@example.com",
    createdAt: yesterday,
    updatedAt: now,
    recipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    delivery: {
      carrierCode: "UPS",
      trackingNo: "1Z999AA10123456790",
      deliveryType: "RETURN",
    },
    trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456790",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-RTN-001",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 1,
          },
        ],
      },
    ],
  },
  {
    returnId: "RTN-002",
    returnNo: "RTN-NO-20250201-002",
    claimId: "CLM-RTN-002",
    orderId: "ORD-20250201-002",
    originOrderNo: "AT-2025020102",
    status: { name: "PICKUP_REQUESTED", description: "Pickup Requested" },
    claimFault: "OPERATION",
    claimReason: "Product defect",
    returnMethod: "IN_STORE",
    claimRequesterType: "CS_OPERATOR",
    claimCreatedBy: "jane.smith@example.com",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    recipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    delivery: {
      carrierCode: "FEDEX",
      trackingNo: "794644790140",
      deliveryType: "RETURN",
    },
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644790140",
    items: [
      {
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        sku: "AT-LPM-001-RSE",
        quantity: 2,
        thumbnailUrl: "",
        upcCode: "8809123456003",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-RTN-002",
        orderItemId: "OI-002",
        sku: "AT-LPM-001-RSE",
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        thumbnailUrl: "",
        quantity: 2,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "AT-LPM-001-RSE",
            productCode: "SAP-AT-001",
            productName: "Lip Mousse - Rose",
            category: "Beauty",
            price: 45,
            quantity: 2,
          },
        ],
      },
    ],
  },
  {
    returnId: "RTN-003",
    returnNo: "RTN-NO-20250201-003",
    claimId: "CLM-RTN-003",
    orderId: "ORD-20250201-004",
    originOrderNo: "NF-2025020104",
    status: { name: "PICKUP_ONGOING", description: "Pickup Ongoing" },
    claimFault: "CUSTOMER",
    claimReason: "Changed my mind",
    returnMethod: "DELIVERY",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "sarah.lee@example.com",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    recipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    delivery: {
      carrierCode: "FEDEX",
      trackingNo: "794644790145",
      deliveryType: "RETURN",
    },
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644790145",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 3,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: {},
      },
      {
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        sku: "AT-LPM-001-RSE",
        quantity: 2,
        thumbnailUrl: "",
        upcCode: "8809123456003",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-RTN-003-A",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 3,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 3,
          },
        ],
      },
      {
        id: "CI-RTN-003-B",
        orderItemId: "OI-002",
        sku: "AT-LPM-001-RSE",
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        thumbnailUrl: "",
        quantity: 2,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "AT-LPM-001-RSE",
            productCode: "SAP-AT-001",
            productName: "Lip Mousse - Rose",
            category: "Beauty",
            price: 45,
            quantity: 2,
          },
        ],
      },
    ],
  },
  {
    returnId: "RTN-004",
    returnNo: "RTN-NO-20250201-004",
    claimId: "CLM-RTN-004",
    orderId: "ORD-20250201-008",
    originOrderNo: "GM-2025020108",
    status: { name: "RECEIVED", description: "Received" },
    claimFault: "OPERATION",
    claimReason: "Received wrong item",
    returnMethod: "IN_STORE",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "lisa.jung@example.com",
    createdAt: threeDaysAgo,
    updatedAt: yesterday,
    recipient: {
      fullName: "Lisa Jung",
      firstName: "Lisa",
      lastName: "Jung",
      phone: "555-0108",
      phoneCountryNo: "+1",
      address: {
        line1: "456 Oak Avenue",
        line2: "",
        city: "Toronto",
        state: "ON",
        postalCode: "M5V 2H1",
        countryType: "CA",
      },
    },
    delivery: {
      carrierCode: "CANADA_POST",
      trackingNo: "1Z999AA10123456792",
      deliveryType: "RETURN",
    },
    trackingUrl:
      "https://www.canadapost-postescanada.ca/track-reperer/en#/details/1Z999AA10123456792",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-RTN-004",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 1,
          },
        ],
      },
    ],
  },
];

// --- Exchange Detail Mock (ExchangeDetailResponse[]) ---
const mockExchangeDetail = [
  {
    exchangeId: "EXC-001",
    exchangeNo: "EXC-NO-20250201-001",
    claimId: "CLM-EXC-001",
    orderId: "ORD-20250201-001",
    originOrderNo: "NF-2025020101",
    wmsNo: "WMS-EXC-001",
    status: { name: "PENDING", description: "Pending" },
    claimFault: "CUSTOMER",
    claimReason: "Wrong color received",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "john.doe@example.com",
    createdAt: yesterday,
    updatedAt: now,
    pickupRecipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    shipmentRecipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    pickupDelivery: {
      carrierCode: "UPS",
      trackingNo: "1Z999AA10123456795",
      deliveryType: "RETURN",
    },
    pickupTrackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456795",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-EXC-001",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 1,
          },
        ],
      },
    ],
    shipments: [
      {
        shipmentId: "ESHIP-001",
        shipmentNo: "ESHIP-NO-20250201-001",
        wmsNo: "WMS-ESHIP-001",
        status: { name: "SHIPPED", description: "Shipped" },
        shippedAt: now,
        delivery: {
          carrierCode: "UPS",
          trackingNo: "1Z999AA10123456796",
          deliveryType: "STANDARD",
        },
        deliveries: [
          {
            trackingNo: "1Z999AA10123456796",
            trackingUrl:
              "https://www.ups.com/track?tracknum=1Z999AA10123456796",
          },
        ],
      },
    ],
  },
  {
    exchangeId: "EXC-002",
    exchangeNo: "EXC-NO-20250201-002",
    claimId: "CLM-EXC-002",
    orderId: "ORD-20250201-003",
    originOrderNo: "GM-2025020103",
    wmsNo: "WMS-EXC-002",
    status: { name: "PICKUP_REQUESTED", description: "Pickup Requested" },
    claimFault: "OPERATION",
    claimReason: "Product defect - lens scratched",
    claimRequesterType: "OMS_ADMIN",
    claimCreatedBy: "admin@systemiic.com",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    pickupRecipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    shipmentRecipient: {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      phone: "555-0101",
      phoneCountryNo: "+1",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        countryType: "US",
      },
    },
    pickupDelivery: {
      carrierCode: "FEDEX",
      trackingNo: "794644790150",
      deliveryType: "RETURN",
    },
    pickupTrackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644790150",
    items: [
      {
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        sku: "AT-LPM-001-RSE",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456003",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-EXC-002",
        orderItemId: "OI-002",
        sku: "AT-LPM-001-RSE",
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "AT-LPM-001-RSE",
            productCode: "SAP-AT-001",
            productName: "Lip Mousse - Rose",
            category: "Beauty",
            price: 45,
            quantity: 1,
          },
        ],
      },
    ],
    shipments: [],
  },
  {
    exchangeId: "EXC-003",
    exchangeNo: "EXC-NO-20250201-003",
    claimId: "CLM-EXC-003",
    orderId: "ORD-20250201-007",
    originOrderNo: "NF-2025020107",
    wmsNo: "WMS-EXC-003",
    status: { name: "RECEIVED", description: "Received" },
    claimFault: "CUSTOMER",
    claimReason: "Wrong size ordered",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "david.wang@example.com",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    pickupRecipient: {
      fullName: "David Wang",
      firstName: "David",
      lastName: "Wang",
      phone: "555-0107",
      phoneCountryNo: "+1",
      address: {
        line1: "789 Pine Road",
        line2: "",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        countryType: "US",
      },
    },
    shipmentRecipient: {
      fullName: "David Wang",
      firstName: "David",
      lastName: "Wang",
      phone: "555-0107",
      phoneCountryNo: "+1",
      address: {
        line1: "789 Pine Road",
        line2: "",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        countryType: "US",
      },
    },
    pickupDelivery: {
      carrierCode: "UPS",
      trackingNo: "1Z999AA10123456800",
      deliveryType: "RETURN",
    },
    pickupTrackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456800",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-EXC-003",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 1,
          },
        ],
      },
    ],
    shipments: [],
  },
  {
    exchangeId: "EXC-004",
    exchangeNo: "EXC-NO-20250201-004",
    claimId: "CLM-EXC-004",
    orderId: "ORD-20250201-004",
    originOrderNo: "NF-2025020104",
    wmsNo: "WMS-EXC-004",
    status: { name: "SHIPMENT_REQUESTED", description: "Shipment Requested" },
    claimFault: "OPERATION",
    claimReason: "Color mismatch",
    claimRequesterType: "CS_OPERATOR",
    claimCreatedBy: "cs.operator@systemiic.com",
    createdAt: threeDaysAgo,
    updatedAt: yesterday,
    pickupRecipient: {
      fullName: "Sarah Lee",
      firstName: "Sarah",
      lastName: "Lee",
      phone: "555-0104",
      phoneCountryNo: "+1",
      address: {
        line1: "321 Elm Street",
        line2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        postalCode: "94102",
        countryType: "US",
      },
    },
    shipmentRecipient: {
      fullName: "Sarah Lee",
      firstName: "Sarah",
      lastName: "Lee",
      phone: "555-0104",
      phoneCountryNo: "+1",
      address: {
        line1: "321 Elm Street",
        line2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        postalCode: "94102",
        countryType: "US",
      },
    },
    pickupDelivery: {
      carrierCode: "FEDEX",
      trackingNo: "794644790160",
      deliveryType: "RETURN",
    },
    pickupTrackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644790160",
    items: [
      {
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        sku: "AT-LPM-001-RSE",
        quantity: 2,
        thumbnailUrl: "",
        upcCode: "8809123456003",
        gradeSummaries: {},
      },
    ],
    claimItems: [
      {
        id: "CI-EXC-004",
        orderItemId: "OI-002",
        sku: "AT-LPM-001-RSE",
        productCode: "SAP-AT-001",
        productName: "Lip Mousse - Rose",
        thumbnailUrl: "",
        quantity: 2,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "AT-LPM-001-RSE",
            productCode: "SAP-AT-001",
            productName: "Lip Mousse - Rose",
            category: "Beauty",
            price: 45,
            quantity: 2,
          },
        ],
      },
    ],
    shipments: [
      {
        id: "ESHIP-002",
        shipmentNo: "ESHIP-NO-002",
        wmsNo: "WMS-ESHIP-002",
        status: { name: "PICKING_REQUESTED", description: "Picking Requested" },
        event: "EXCHANGE_SHIP",
        shippedAt: "",
        updatedAt: yesterday,
        trackingUrl: "",
        cancelReason: "",
        recipient: {
          fullName: "Sarah Lee",
          firstName: "Sarah",
          lastName: "Lee",
          phone: "555-0104",
          phoneCountryNo: "+1",
          address: {
            line1: "321 Elm Street",
            line2: "Suite 100",
            city: "San Francisco",
            state: "CA",
            postalCode: "94102",
            countryType: "US",
          },
        },
        delivery: {
          carrierCode: "FEDEX",
          trackingNo: "",
          deliveryType: "STANDARD",
        },
        deliveries: [],
        items: [
          {
            shipmentItemId: "ESI-004",
            orderItemId: "OI-002",
            originItemId: "ORIG-002",
            sku: "AT-LPM-001-RSE",
            productCode: "SAP-AT-001",
            productName: "Lip Mousse - Rose",
            thumbnailUrl: "",
            sequence: 1,
            shipmentQuantity: 2,
            shippedQuantity: 0,
            canceledQuantity: 0,
            components: [],
            products: [
              {
                sku: "AT-LPM-001-RSE",
                productCode: "SAP-AT-001",
                productName: "Lip Mousse - Rose",
                category: "Beauty",
                price: 45,
                quantity: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    exchangeId: "EXC-005",
    exchangeNo: "EXC-NO-20250201-005",
    claimId: "CLM-EXC-005",
    orderId: "ORD-20250201-005",
    originOrderNo: "GM-2025020105",
    wmsNo: "WMS-EXC-005",
    status: { name: "EXCHANGED", description: "Exchanged" },
    claimFault: "CUSTOMER",
    claimReason: "Frame does not fit",
    claimRequesterType: "CUSTOMER",
    claimCreatedBy: "mike.park@example.com",
    createdAt: threeDaysAgo,
    updatedAt: now,
    pickupRecipient: {
      fullName: "Mike Park",
      firstName: "Mike",
      lastName: "Park",
      phone: "555-0105",
      phoneCountryNo: "+1",
      address: {
        line1: "100 Queen Street",
        line2: "",
        city: "Toronto",
        state: "ON",
        postalCode: "M5V 3L9",
        countryType: "CA",
      },
    },
    shipmentRecipient: {
      fullName: "Mike Park",
      firstName: "Mike",
      lastName: "Park",
      phone: "555-0105",
      phoneCountryNo: "+1",
      address: {
        line1: "100 Queen Street",
        line2: "",
        city: "Toronto",
        state: "ON",
        postalCode: "M5V 3L9",
        countryType: "CA",
      },
    },
    pickupDelivery: {
      carrierCode: "CANADA_POST",
      trackingNo: "794644790170",
      deliveryType: "RETURN",
    },
    pickupTrackingUrl:
      "https://www.canadapost-postescanada.ca/track-reperer/en#/details/794644790170",
    items: [
      {
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        sku: "GM-KUK-001-BLK",
        quantity: 1,
        thumbnailUrl: "",
        upcCode: "8809123456001",
        gradeSummaries: { A: 1 },
      },
    ],
    claimItems: [
      {
        id: "CI-EXC-005",
        orderItemId: "OI-001",
        sku: "GM-KUK-001-BLK",
        productCode: "SAP-GM-001",
        productName: "Jennie - Kuku 01",
        thumbnailUrl: "",
        quantity: 1,
        cancelQuantity: 0,
        components: [],
        products: [
          {
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01 Black",
            category: "Eyewear",
            price: 320,
            quantity: 1,
          },
        ],
      },
    ],
    shipments: [
      {
        id: "ESHIP-003",
        shipmentNo: "ESHIP-NO-003",
        wmsNo: "WMS-ESHIP-003",
        status: { name: "DELIVERED", description: "Delivered" },
        event: "EXCHANGE_SHIP",
        shippedAt: yesterday,
        updatedAt: now,
        trackingUrl:
          "https://www.canadapost-postescanada.ca/track-reperer/en#/details/1Z999AA10123456810",
        cancelReason: "",
        recipient: {
          fullName: "Mike Park",
          firstName: "Mike",
          lastName: "Park",
          phone: "555-0105",
          phoneCountryNo: "+1",
          address: {
            line1: "100 Queen Street",
            line2: "",
            city: "Toronto",
            state: "ON",
            postalCode: "M5V 3L9",
            countryType: "CA",
          },
        },
        delivery: {
          carrierCode: "CANADA_POST",
          trackingNo: "1Z999AA10123456810",
          deliveryType: "STANDARD",
        },
        deliveries: [
          {
            trackingNo: "1Z999AA10123456810",
            trackingUrl:
              "https://www.canadapost-postescanada.ca/track-reperer/en#/details/1Z999AA10123456810",
          },
        ],
        items: [
          {
            shipmentItemId: "ESI-005",
            orderItemId: "OI-001",
            originItemId: "ORIG-001",
            sku: "GM-KUK-001-BLK",
            productCode: "SAP-GM-001",
            productName: "Jennie - Kuku 01",
            thumbnailUrl: "",
            sequence: 1,
            shipmentQuantity: 1,
            shippedQuantity: 1,
            canceledQuantity: 0,
            components: [],
            products: [
              {
                sku: "GM-KUK-001-BLK",
                productCode: "SAP-GM-001",
                productName: "Jennie - Kuku 01 Black",
                category: "Eyewear",
                price: 320,
                quantity: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

// --- Order History Mock (OrderHistoryResponse) ---
const mockOrderHistory = {
  orderHistories: [
    {
      orderId: "ORD-20250201-001",
      originOrderNo: "NF-2025020101",
      sequence: 1,
      status: { name: "PENDING", description: "Pending" },
      updatedAt: threeDaysAgo,
      sapResults: [],
    },
    {
      orderId: "ORD-20250201-001",
      originOrderNo: "NF-2025020101",
      sequence: 2,
      status: { name: "COLLECTED", description: "Collected" },
      shipmentId: "SHP-001",
      shipmentNo: "SHIP-20250201-001",
      shipmentStatus: {
        name: "PICKING_REQUESTED",
        description: "Picking Requested",
      },
      updatedAt: twoDaysAgo,
      sapResults: [],
    },
    {
      orderId: "ORD-20250201-001",
      originOrderNo: "NF-2025020101",
      sequence: 3,
      status: { name: "COMPLETED", description: "Completed" },
      shipmentId: "SHP-001",
      shipmentNo: "SHIP-20250201-001",
      shipmentStatus: { name: "SHIPPED", description: "Shipped" },
      updatedAt: yesterday,
      sapResults: [{ result: "SUCCESS", resultAt: yesterday }],
    },
  ],
  returnHistories: [],
  exchangeHistories: [],
};

// --- Default success response ---
const successResponse = { result: true };

/**
 * URL 패턴과 HTTP 메서드에 기반하여 mock 데이터를 반환합니다.
 */
export function getMockResponse(url: string, method: string = "GET"): unknown {
  const path = url.split("?")[0];

  // POST mutations (상태 변경 API) - 성공 반환
  if (method !== "GET") {
    if (path.includes("/products") && method === "POST") {
      return mockProductList;
    }
    if (path.includes("/estimate-refund-fee")) {
      return {
        estimateRefundPayment: {
          totalAmount: 0,
          subtotal: 0,
          shippingFee: 0,
          taxAmount: 0,
          dutyAmount: 0,
        },
        netPayment: {
          totalAmount: 0,
          subtotal: 0,
          shippingFee: 0,
          taxAmount: 0,
          dutyAmount: 0,
        },
        orderPayment: {
          totalAmount: 410,
          subtotal: 410,
          shippingFee: 0,
          taxAmount: 0,
          dutyAmount: 0,
        },
        refundPayment: {
          totalAmount: 0,
          subtotal: 0,
          shippingFee: 0,
          taxAmount: 0,
          dutyAmount: 0,
        },
      };
    }
    return successResponse;
  }

  // Dashboard / Summary
  if (path.includes("/dashboard") || path.includes("/summary")) {
    return mockDashboardSummary;
  }

  // Order history: /orders/{id}/histories
  if (path.includes("/histories")) {
    return mockOrderHistory;
  }

  // Return detail: /returns/orders/{orderId} or /returns/{returnId}
  if (path.match(/\/returns\/orders\/[^/]+$/)) {
    const orderId = path.split("/").pop()?.toUpperCase();
    const filtered = mockReturnDetail.filter(
      (r: { orderId?: string }) => r.orderId?.toUpperCase() === orderId,
    );
    return filtered.length > 0 ? filtered : mockReturnDetail;
  }
  if (path.match(/\/returns\/[^/]+$/)) {
    const returnId = path.split("/").pop();
    const filtered = mockReturnDetail.filter(
      (r: { returnId: string }) => r.returnId === returnId,
    );
    return filtered.length > 0 ? filtered : mockReturnDetail;
  }

  // Exchange detail: /exchanges/orders/{orderId} or /exchanges/{exchangeId}
  if (path.match(/\/exchanges\/orders\/[^/]+$/)) {
    const orderId = path.split("/").pop()?.toUpperCase();
    const filtered = mockExchangeDetail.filter(
      (e: { orderId?: string }) => e.orderId?.toUpperCase() === orderId,
    );
    return filtered.length > 0 ? filtered : mockExchangeDetail;
  }
  if (path.match(/\/exchanges\/[^/]+$/)) {
    const exchangeId = path.split("/").pop()?.toUpperCase();
    const found = mockExchangeDetail.find(
      (e: { exchangeId: string }) => e.exchangeId?.toUpperCase() === exchangeId,
    );
    return found ? [found] : mockExchangeDetail;
  }

  // Order detail: /orders/{orderId} (단일 주문 상세)
  if (path.match(/\/orders\/[^/]+$/)) {
    const orderId = path.split("/").pop();
    const listRow = (mockOrderList.content ?? mockOrderList.data)?.find(
      (r: { orderId: string }) =>
        r.orderId.toLowerCase() === orderId?.toLowerCase(),
    );
    if (listRow) {
      const lr = listRow as Record<string, unknown>;
      return {
        ...mockOrderDetail,
        orderId: listRow.orderId,
        originOrderNo: listRow.originOrderNo,
        purchaseNo: lr.purchaseNo ?? mockOrderDetail.purchaseNo,
        status: listRow.status,
        orderType: listRow.orderType,
        brand: listRow.brand,
        channelType: listRow.channelType,
        corporation: listRow.corporation,
        orderedAt: listRow.orderedAt,
        receiveMethod: lr.receiveMethod ?? "Delivery",
        tags: lr.tags ?? "",
        orderer: {
          ...mockOrderDetail.orderer,
          fullName: listRow.ordererName,
          email: listRow.ordererEmail,
          phone: listRow.ordererPhone.replace(/^\+\d+-/, ""),
        },
        recipient: {
          ...mockOrderDetail.recipient,
          fullName: listRow.recipientName,
          phone: listRow.recipientPhone.replace(/^\+\d+-/, ""),
        },
      };
    }
    return mockOrderDetail;
  }

  // Order list
  if (path.includes("/orders")) {
    return mockOrderList;
  }

  // Return list
  if (path.includes("/returns")) {
    return mockReturnList;
  }

  // Exchange list
  if (path.includes("/exchanges")) {
    return mockExchangeList;
  }

  // Channel detail / list
  if (path.includes("/channels") || path.includes("/channel")) {
    if (path.match(/\/channels\/\d+$/) || path.match(/\/channel\/\d+$/)) {
      return mockChannelList[0];
    }
    return mockChannelList;
  }

  // Stock
  if (path.includes("/stock") || path.includes("/stocks")) {
    if (path.includes("/history")) return mockStockHistory;
    if (path.includes("/distribution") || path.includes("/setting"))
      return mockDistributionSetting;
    return mockStockDashboard;
  }

  // Products (PIM)
  if (path.includes("/products") || path.includes("/product")) {
    if (path.match(/\/products\/[^/]+$/) || path.match(/\/product\/[^/]+$/)) {
      return mockProductList.products[0];
    }
    return mockProductList;
  }

  // User / Auth permissions
  if (
    path.includes("/users") ||
    path.includes("/user") ||
    path.includes("/permissions") ||
    path.includes("/auth")
  ) {
    return mockUserPermissions;
  }

  // Fallback
  return successResponse;
}

/**
 * 프로토타입 모드용 기본 사용자 권한 데이터
 */
export const MOCK_USER_PERMISSIONS = mockUserPermissions.brands;
