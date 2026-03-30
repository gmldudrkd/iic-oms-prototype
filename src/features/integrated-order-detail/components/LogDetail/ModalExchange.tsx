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

interface ExchangeStatusRow {
  status: string;
  description: string;
  boxText?: string;
  exchangeCancel: StatusField;
  refundable: StatusField;
}

interface ShipmentStatusRow {
  status: string;
  description: string;
  boxText?: string;
  shipmentCancel: StatusField;
  claimableType: StatusField;
}

export default function ModalExchange() {
  const exchangeStatusData: ExchangeStatusRow[] = [
    {
      status: "Pending",
      description: "Exchange scheduled for pickup",
      exchangeCancel: { available: true },
      refundable: { available: false },
    },
    {
      status: "Pickup Requested",
      description: "Exchange pickup instruction sent",
      exchangeCancel: { available: true },
      refundable: { available: false },
    },
    {
      status: "Pickup Ongoing",
      description: "Exchange pickup in progress",
      exchangeCancel: { available: true },
      refundable: { available: false },
    },
    {
      status: "Received",
      description: "Exchange received (pending grading)",
      exchangeCancel: { available: false, className: "!text-error" },
      refundable: { available: false },
    },
    {
      status: "Inspected",
      description: "Exchange grading completed.",
      exchangeCancel: { available: false, className: "!text-error" },
      refundable: { available: false },
    },
    {
      status: "Shipment Requested",
      description: "Resend shipment requested",
      exchangeCancel: { available: false, className: "!text-error" },
      refundable: { available: false },
    },
    {
      status: "Exchanged",
      description: "Resend shipment completed",
      exchangeCancel: { available: false },
      refundable: { available: false },
    },
    {
      status: "Canceled",
      description: "Exchange canceled",
      exchangeCancel: { available: false },
      refundable: { available: false },
    },
  ];

  const shipmentStatusData: ShipmentStatusRow[] = [
    {
      status: "Picking Requested",
      description: "Shipment instruction sent to WMS.",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
    {
      status: "Picking Rejected",
      description: "Picking failed due to insufficient stock",
      boxText: "Request Shipment",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
    {
      status: "Picked",
      description: "Picking assigned and completed",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
    {
      status: "Packed",
      description: "Packing assigned and completed",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
    {
      status: "Shipped",
      description: "Shipped out",
      shipmentCancel: { available: false },
      claimableType: { available: false },
    },
    {
      status: "Delivered",
      description: "Delivery completed",
      shipmentCancel: { available: false },
      claimableType: { available: false },
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
          <span className={cn("text-text-disabled", field.className)}>
            {field.text}
          </span>
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
              <TableCell>Status</TableCell>
              <TableCell>Status Description</TableCell>
              <TableCell>Exchange Cancel</TableCell>
              <TableCell>Refundable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exchangeStatusData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Chip
                    label={row.status}
                    color="success"
                    className="font-medium"
                  />
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{renderStatusIcon(row.exchangeCancel)}</TableCell>
                <TableCell>{renderStatusIcon(row.refundable)}</TableCell>
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
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Chip
                    label={row.status}
                    color="default"
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
