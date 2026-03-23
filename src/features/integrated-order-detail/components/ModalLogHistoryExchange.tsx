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

interface ExchangeStatusRow {
  status: string;
  description: string;
  boxText?: string;
  exchangeCancel: StatusField;
  refundable: StatusField;
}

export default function ModalExchange() {
  const exchangeStatusData: ExchangeStatusRow[] = [
    {
      status: "Pending",
      description: "Exchange scheduled for pickup",
      exchangeCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Pickup Requested",
      description: "Exchange pickup instruction sent",
      exchangeCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Pickup Ongoing",
      description: "Exchange pickup in progress",
      exchangeCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Received",
      description: "Exchange received and grading completed.",
      exchangeCancel: {
        available: true,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Exchanged",
      description: "Resend shipment completed",
      exchangeCancel: {
        available: false,
      },
      refundable: {
        available: false,
      },
    },
    {
      status: "Canceled",
      description: "Exchange canceled",
      exchangeCancel: {
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
    </Box>
  );
}
