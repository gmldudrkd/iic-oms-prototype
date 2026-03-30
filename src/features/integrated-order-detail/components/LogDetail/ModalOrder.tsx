import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

// 주문 상태 데이터 타입 정의
interface StatusField {
  available?: boolean;
  text?: string | React.ReactNode;
  note?: string;
}

interface OrderStatusRow {
  status: string;
  chipColor:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "default";
  description: string;
  boxText?: string;
  editRecipient: StatusField;
  entireCancel: StatusField;
  itemCancel: StatusField;
  qtyCancel: StatusField;
  claimableType: StatusField;
}

export default function ModalOrder() {
  // 주문 상태 데이터
  const orderStatusData: OrderStatusRow[] = [
    {
      status: "Pending",
      chipColor: "primary",
      description: "Stock not assigned",
      editRecipient: {
        available: true,
      },
      entireCancel: {
        available: true,
      },
      itemCancel: {
        available: true,
      },
      qtyCancel: {
        available: true,
      },
      claimableType: {
        text: "Order Cancel",
        available: true,
      },
    },
    {
      status: "Collected",
      chipColor: "primary",
      description: "Stock not assigned",
      editRecipient: {
        available: true,
      },
      entireCancel: {
        available: true,
      },
      itemCancel: {
        available: true,
      },
      qtyCancel: {
        available: true,
      },
      claimableType: {
        text: "Order Cancel",
        available: true,
      },
    },
    {
      status: "Partly Confirmed",
      chipColor: "primary",
      description: "Partially allocated stock",
      boxText: "Request Partial Shipment",
      editRecipient: {
        available: true,
      },
      entireCancel: {
        available: true,
      },
      itemCancel: {
        available: true,
      },
      qtyCancel: {
        available: true,
      },
      claimableType: {
        text: "Order Cancel",
        available: true,
      },
    },
    {
      status: "Partial Shipment Requested",
      chipColor: "primary",
      description: "Partially requested for shipment",
      editRecipient: {
        available: false,
      },
      entireCancel: {
        available: false,
      },
      itemCancel: {
        available: true,
        note: "(Only unshipped)",
      },
      qtyCancel: {
        available: true,
        note: "(Only unshipped)",
      },
      claimableType: {
        text: (
          <span className="flex flex-col">
            <span>Order Cancel</span>
            <span className="text-[12px] text-text-disabled">
              (Only unshipped)
            </span>
          </span>
        ),
        available: true,
      },
    },
    {
      status: "Shipment Requested",
      chipColor: "primary",
      description: "Fully shipped out",
      editRecipient: {
        available: false,
      },
      entireCancel: {
        available: false,
      },
      itemCancel: {
        available: false,
      },
      qtyCancel: {
        available: false,
      },
      claimableType: {
        text: (
          <span className="flex flex-col">
            <span>Order Return,</span>
            <span>Order Exchange</span>
            <span className="text-[12px] text-text-disabled">
              (Only shipped)
            </span>
          </span>
        ),
        available: true,
      },
    },
    {
      status: "Completed",
      chipColor: "primary",
      description: "All non-canceled shipments delivered",
      editRecipient: {
        available: false,
      },
      entireCancel: {
        available: false,
      },
      itemCancel: {
        available: false,
      },
      qtyCancel: {
        available: false,
      },
      claimableType: {
        text: (
          <span className="flex flex-col">
            <span>Order Return,</span>
            <span>Order Exchange</span>
          </span>
        ),
        available: true,
      },
    },
    {
      status: "Canceled",
      chipColor: "primary",
      description: "Order canceled",
      editRecipient: {
        available: false,
      },
      entireCancel: {
        available: false,
      },
      itemCancel: {
        available: false,
      },
      qtyCancel: {
        available: false,
      },
      claimableType: {
        text: <span className="text-text-disabled">Auto Refunded</span>,
        available: true,
      },
    },
  ];

  // 배송 상태 데이터
  const shipmentStatusData = [
    {
      status: "Picking Requested",
      description: "Shipment instruction sent to WMS.",
      shipmentCancel: {
        available: true,
        note: "(WMS Confirm needed)",
      },
      claimableType: {
        text: "Shipment Cancel",
      },
    },
    {
      status: "Picking Rejected",
      description: "Picking failed due to insufficient stock",
      buttonText: "Initiate Re-shipment",
      shipmentCancel: {
        available: true,
      },
      claimableType: {
        text: "Shipment Cancel",
      },
    },
    {
      status: "Picked",
      description: "Picking assigned and completed",
      shipmentCancel: {
        available: true,
      },
      claimableType: {
        available: false,
      },
    },
    {
      status: "Packed",
      description: "Packing assigned and completed",
      shipmentCancel: {
        available: true,
      },
      claimableType: {
        available: false,
      },
    },
    {
      status: "Shipped",
      description: "Shipped out",
      shipmentCancel: {
        available: false,
      },
      claimableType: {
        text: "Order Return, Order Exchange",
      },
    },
    {
      status: "Delivered",
      description: "Delivery completed",
      shipmentCancel: {
        available: false,
      },
      claimableType: {
        text: "Order Return, Order Exchange",
      },
    },
    {
      status: "Canceled",
      description: "Shipment canceled",
      shipmentCancel: {
        available: false,
      },
      claimableType: {
        available: false,
      },
    },
  ];

  // 가용성에 따라 체크마크/X 표시를 렌더링하는 함수
  const renderStatusIcon = (field: StatusField) => {
    return (
      <div>
        {!field.available && field.text ? (
          <span>{field.text}</span>
        ) : (
          <>
            <span>
              {field.available ? (
                <span>✔️</span>
              ) : (
                <span className="text-text-disabled">X</span>
              )}
            </span>
            {field.note && (
              <span className="ml-1 text-[12px] text-text-disabled">
                {field.note}
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Box className="mt-[24px] flex flex-col gap-[48px]">
      <TableContainer className="rounded-[6px] border border-outlined">
        <Table>
          <TableHead className="bg-order-opacity">
            <TableRow>
              <TableCell>Order Status</TableCell>
              <TableCell>Status Description</TableCell>
              <TableCell>Edit Recipient Info</TableCell>
              <TableCell>
                Order Cancel
                <br />
                <span className="text-[12px] text-gray-500">Entire Cancel</span>
              </TableCell>
              <TableCell>
                <br />
                <span className="text-[12px] text-gray-500">Item Cancel</span>
              </TableCell>
              <TableCell>
                <br />
                <span className="text-[12px] text-gray-500">Qty Cancel</span>
              </TableCell>
              <TableCell>Claimable Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderStatusData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.chipColor}
                    className="font-medium"
                  />
                </TableCell>
                <TableCell>
                  {row.description}
                  {row.boxText && (
                    <div className="mt-2">
                      <span className="inline-block rounded border border-gray-400 px-2 py-1 text-[13px]">
                        {row.boxText}
                      </span>
                      &nbsp;Available
                    </div>
                  )}
                </TableCell>
                <TableCell>{renderStatusIcon(row.editRecipient)}</TableCell>
                <TableCell>{renderStatusIcon(row.entireCancel)}</TableCell>
                <TableCell>{renderStatusIcon(row.itemCancel)}</TableCell>
                <TableCell>{renderStatusIcon(row.qtyCancel)}</TableCell>
                <TableCell>
                  {row.claimableType.available ? (
                    <div>
                      <span>{row.claimableType.text}</span>
                      {row.claimableType.note && (
                        <div className="text-[12px] text-text-disabled">
                          {row.claimableType.note}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-text-disabled">X</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className="rounded-[6px] border border-outlined">
        <Table>
          <TableHead className="bg-order-opacity">
            <TableRow>
              <TableCell>Shipment Status</TableCell>
              <TableCell>Status Description</TableCell>
              <TableCell>Shipment Cancel</TableCell>
              <TableCell>Claimable Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipmentStatusData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Chip label={row.status} color="default" />
                </TableCell>
                <TableCell>
                  {row.description}
                  {row.buttonText && (
                    <div className="mt-2">
                      <span className="inline-block rounded border border-gray-400 px-2 py-1 text-[13px]">
                        {row.buttonText}
                      </span>{" "}
                      Available
                    </div>
                  )}
                </TableCell>
                <TableCell>{renderStatusIcon(row.shipmentCancel)}</TableCell>
                <TableCell>{renderStatusIcon(row.claimableType)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
