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

import { cn } from "@/shared/utils/cn";

// 주문 상태 데이터 타입 정의
interface StatusField {
  available?: boolean;
  text?: string | React.ReactNode;
  note?: string;
  className?: string;
}

interface ReshipmentStatusRow {
  status: string;
  description: string;
  boxText?: string | string[];
  shipmentCancel: StatusField;
  claimableType: StatusField;
}

export default function ModalReshipment() {
  const reshipmentStatusData: ReshipmentStatusRow[] = [
    {
      status: "Picking Requested",
      description: "Shipment instruction sent to WMS.",
      boxText: ["Cancel Shipment"],
      shipmentCancel: { available: true, note: "(WMS Confirm needed)" },
      claimableType: { text: "Shipment Cancel" },
    },
    {
      status: "Picking Rejected",
      description: "Picking failed due to insufficient stock",
      boxText: ["Re-Ship", "Cancel Order"],
      shipmentCancel: { available: true },
      claimableType: { text: "Shipment Cancel" },
    },
    {
      status: "Picked",
      description: "Picking assigned and completed",
      shipmentCancel: { available: true },
      claimableType: { available: false },
    },
    {
      status: "Packed",
      description: "Packing assigned and completed",
      shipmentCancel: { available: true },
      claimableType: { available: false },
    },
    {
      status: "Shipped",
      description: "Shipped out",
      shipmentCancel: { available: false },
      claimableType: { text: "Order Return, Order Exchange" },
    },
    {
      status: "Delivered",
      description: "Delivery completed",
      shipmentCancel: { available: false },
      claimableType: { text: "Order Return, Order Exchange" },
    },
    {
      status: "Canceled",
      description: "Shipment canceled",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
  ];

  // 가용성에 따라 체크마크/X 표시를 렌더링하는 함수
  const renderStatusIcon = (field: StatusField) => {
    return (
      <div>
        {!field.available && field.text ? (
          <span className={field.className}>{field.text}</span>
        ) : (
          <>
            <span>
              {field.available ? (
                <span className={field.className}>✔️</span>
              ) : (
                <span className={cn("text-text-disabled", field.className)}>
                  X
                </span>
              )}
            </span>
            {field.note && (
              <span
                className={cn(
                  "ml-1 text-[12px] text-text-disabled",
                  field.className,
                )}
              >
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
              <TableCell>Shipment Status</TableCell>
              <TableCell>Status Description</TableCell>
              <TableCell>Shipment Cancel</TableCell>
              <TableCell>Claimable Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reshipmentStatusData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Chip label={row.status} className="font-medium" />
                </TableCell>
                <TableCell>
                  {row.description}
                  {Array.isArray(row.boxText) && (
                    <div key={index} className="mt-2">
                      <span className="inline-flex items-center gap-[5px]">
                        {row.boxText.map((text, index) => (
                          <>
                            <span
                              key={index}
                              className="inline-block rounded border border-gray-400 px-2 py-1 text-[13px]"
                            >
                              {text}
                            </span>
                            {index < (row.boxText?.length ?? 0) - 1 && (
                              <span>,</span>
                            )}
                          </>
                        ))}
                      </span>
                      &nbsp;Available
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
