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

interface ReturnStatusRow {
  status: string;
  description: string;
  boxText?: string;
  returnCancel: StatusField;
  refundable: StatusField;
}

export default function ModalReturn() {
  const returnStatusData: ReturnStatusRow[] = [
    {
      status: "Pending",
      description: "Return scheduled for pickup",
      boxText: "Pickup Request",
      returnCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Pickup Requested",
      description: "Return pickup instruction sent",
      returnCancel: {
        available: false,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Pickup Ongoing",
      description: "Return pickup in progress",
      returnCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Received",
      description: "Return received and grading completed.",
      returnCancel: {
        available: false,
        className: "!text-error",
      },
      refundable: {
        text: "Auto Refund on Grading",
      },
    },
    {
      status: "Refunded",
      description: "Return completed and refund processed.",
      returnCancel: {
        available: false,
      },
      refundable: {
        text: "Already Refunded",
      },
    },
    {
      status: "Canceled",
      description: "Return canceled",
      returnCancel: {
        available: false,
      },
      refundable: {
        available: false,
      },
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
              <TableCell>Return Cancel</TableCell>
              <TableCell>Refundable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnStatusData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Chip
                    label={row.status}
                    color="warning"
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
                <TableCell>{renderStatusIcon(row.returnCancel)}</TableCell>
                <TableCell>{renderStatusIcon(row.refundable)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
