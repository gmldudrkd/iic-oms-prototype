import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CollapsibleSection from "@/features/integrated-order-detail/components/CollapsibleSection";
import SapIfCell from "@/features/integrated-order-detail/components/SapIfCell";
import { useGetLogHistoryDetail } from "@/features/integrated-order-detail/hooks/useGetLogHistoryDetail";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";
import { transformLogHistoryDetail } from "@/features/integrated-order-detail/models/transforms";

import { OrderHistoryResponse } from "@/shared/generated/oms/types/Order";
import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

export default function InfoLogHistory() {
  const { orderId } = useParams();
  const { timezone } = useTimezoneStore();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data, isLoading } = useGetLogHistoryDetail(orderId as string);
  const { data: orderData } = useGetOrderDetail(orderId as string);

  const { orderHistories, returnHistories, exchangeHistories } =
    transformLogHistoryDetail(data as OrderHistoryResponse, timezone);

  useEffect(() => {
    if (orderData && orderData.originOrderNo) {
      setOrderInfo({
        orderNo: orderData.originOrderNo,
        isGifted: orderData.orderType.name === "GIFT",
      });
    }
  }, [orderData, setOrderInfo]);

  const [isExpandedOrder, setIsExpandedOrder] = useState<boolean>(true);
  const [isExpandedReturn, setIsExpandedReturn] = useState<boolean>(true);
  const [isExpandedExchange, setIsExpandedExchange] = useState<boolean>(true);

  const chipColor = (groupStatus: string) => {
    if (groupStatus === "shipping") return "default";
    if (groupStatus === "order") return "primary";
    if (groupStatus === "return") return "warning";
    if (groupStatus === "exchange") return "success";
    return "default";
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <CollapsibleSection
        title="Order"
        isExpanded={isExpandedOrder}
        toggleExpanded={() => setIsExpandedOrder(!isExpandedOrder)}
        rightButtonText="Order Status Guide"
      >
        <TableContainer className="border-t border-outlined">
          <Table sx={{ minWidth: 650 }} aria-label="order history table">
            <TableHead className="bg-order-opacity">
              <TableRow>
                <TableCell width="60px" align="center">
                  SEQ
                </TableCell>
                <TableCell width="33%">TimeStamp (KST)</TableCell>
                <TableCell width="33%">SAP I/F</TableCell>
                <TableCell width="33%">Updated Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="!text-text-disabled"
                  >
                    Not Registered
                  </TableCell>
                </TableRow>
              ) : (
                orderHistories.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.seq}</TableCell>
                    <TableCell>{row.timeStamp}</TableCell>
                    <SapIfCell sapIf={row.sapIf} />
                    <TableCell>
                      <Chip
                        label={row.updatedStatus.status}
                        color={chipColor(row.updatedStatus.groupStatus)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CollapsibleSection>

      <CollapsibleSection
        title="Return"
        isExpanded={isExpandedReturn}
        toggleExpanded={() => setIsExpandedReturn(!isExpandedReturn)}
        rightButtonText="Return Status Guide"
      >
        <TableContainer className="border-t border-outlined">
          <Table sx={{ minWidth: 650 }} aria-label="order history table">
            <TableHead className="bg-order-opacity">
              <TableRow>
                <TableCell width="60px" align="center">
                  SEQ
                </TableCell>
                <TableCell width="33%">TimeStamp (KST)</TableCell>
                <TableCell width="33%">SAP I/F</TableCell>
                <TableCell width="33%">Updated Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnHistories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="!text-text-disabled"
                  >
                    Not Registered
                  </TableCell>
                </TableRow>
              ) : (
                returnHistories.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.seq}</TableCell>
                    <TableCell>{row.timeStamp}</TableCell>
                    <SapIfCell sapIf={row.sapIf} />
                    <TableCell>
                      <Chip
                        label={row.updatedStatus.status}
                        color={chipColor(row.updatedStatus.groupStatus)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CollapsibleSection>

      <CollapsibleSection
        title="Exchange"
        isExpanded={isExpandedExchange}
        toggleExpanded={() => setIsExpandedExchange(!isExpandedExchange)}
        rightButtonText="Exchange Status Guide"
      >
        <TableContainer className="border-t border-outlined">
          <Table sx={{ minWidth: 650 }} aria-label="order history table">
            <TableHead className="bg-order-opacity">
              <TableRow>
                <TableCell width="60px" align="center">
                  SEQ
                </TableCell>
                <TableCell width="33%">TimeStamp (KST)</TableCell>
                <TableCell width="33%">SAP I/F</TableCell>
                <TableCell width="33%">Updated Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exchangeHistories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="!text-text-disabled"
                  >
                    Not Registered
                  </TableCell>
                </TableRow>
              ) : (
                exchangeHistories.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.seq}</TableCell>
                    <TableCell>{row.timeStamp}</TableCell>
                    <SapIfCell sapIf={row.sapIf} />
                    <TableCell>
                      <Chip
                        label={row.updatedStatus.status}
                        color={chipColor(row.updatedStatus.groupStatus)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CollapsibleSection>
    </div>
  );
  if (isLoading || !data) return null;
}
