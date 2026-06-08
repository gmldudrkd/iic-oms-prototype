import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ChipProps,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CollapsibleSection from "@/features/integrated-order-detail/components/CollapsibleSection";
import { useGetLogHistoryDetail } from "@/features/integrated-order-detail/hooks/useGetLogHistoryDetail";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";
import { transformLogHistoryDetail } from "@/features/integrated-order-detail/models/transforms";

import { OrderHistoryResponse } from "@/shared/generated/oms/types/Order";
import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

type LogViewMode = "timeline" | "by-type";

export default function InfoLogHistory() {
  const { orderId } = useParams();
  const { timezone } = useTimezoneStore();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data, isLoading } = useGetLogHistoryDetail(orderId as string);
  const { data: orderData } = useGetOrderDetail(orderId as string);

  const {
    orderHistories,
    returnHistories,
    exchangeHistories,
    timelineHistories,
  } = transformLogHistoryDetail(data as OrderHistoryResponse, timezone);

  useEffect(() => {
    if (orderData && orderData.originOrderNo) {
      setOrderInfo({
        orderNo: orderData.originOrderNo,
        isGifted: orderData.orderType.name === "GIFT",
      });
    }
  }, [orderData, setOrderInfo]);

  const [viewMode, setViewMode] = useState<LogViewMode>("timeline");
  const [isExpandedOrder, setIsExpandedOrder] = useState<boolean>(true);
  const [isExpandedReturn, setIsExpandedReturn] = useState<boolean>(true);
  const [isExpandedExchange, setIsExpandedExchange] = useState<boolean>(true);

  const chipColor = (groupStatus: string): ChipProps["color"] => {
    if (groupStatus === "shipping") return "shipment";
    if (groupStatus === "order") return "primary";
    if (groupStatus === "return") return "warning";
    if (groupStatus === "exchange") return "success";
    return "default";
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Timeline | By Type 탭 */}
      <div className="flex flex-row gap-[8px] border-b border-outlined px-[24px]">
        <ViewModeButton
          label="Timeline"
          mode="timeline"
          activeMode={viewMode}
          setMode={setViewMode}
        />
        <ViewModeButton
          label="By Type"
          mode="by-type"
          activeMode={viewMode}
          setMode={setViewMode}
        />
      </div>

      {viewMode === "timeline" ? (
        <Box className="relative mx-[24px] rounded-[8px] border border-outlined bg-white">
          <div className="p-[16px] text-[20px] font-bold">Timeline log</div>
          <TableContainer className="border-t border-outlined">
            <Table sx={{ minWidth: 650 }} aria-label="timeline history table">
              <TableHead className="bg-order-opacity">
                <TableRow>
                  <TableCell width="20%">#</TableCell>
                  <TableCell width="18%">TimeStamp (KST)</TableCell>
                  <TableCell width="100px">Type</TableCell>
                  <TableCell width="18%">Updated Status</TableCell>
                  <TableCell width="30%">Event</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timelineHistories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      className="!text-text-disabled"
                    >
                      Not Registered
                    </TableCell>
                  </TableRow>
                ) : (
                  timelineHistories.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.no}</TableCell>
                      <TableCell>{row.timeStamp}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>
                        {row.updatedStatus.status && (
                          <Chip
                            label={row.updatedStatus.status}
                            color={chipColor(row.updatedStatus.groupStatus)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {row.event && row.event !== "-" ? (
                          <Chip label={row.event} color="secondary" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <>
          <CollapsibleSection
            title="Order"
            isExpanded={isExpandedOrder}
            toggleExpanded={() => setIsExpandedOrder(!isExpandedOrder)}
            rightButtonText="Order Status Guide"
          >
            <LogTable
              rows={orderHistories}
              chipColor={chipColor}
              ariaLabel="order history table"
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Return"
            isExpanded={isExpandedReturn}
            toggleExpanded={() => setIsExpandedReturn(!isExpandedReturn)}
            rightButtonText="Return Status Guide"
          >
            <LogTable
              rows={returnHistories}
              chipColor={chipColor}
              ariaLabel="return history table"
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Exchange"
            isExpanded={isExpandedExchange}
            toggleExpanded={() => setIsExpandedExchange(!isExpandedExchange)}
            rightButtonText="Exchange Status Guide"
          >
            <LogTable
              rows={exchangeHistories}
              chipColor={chipColor}
              ariaLabel="exchange history table"
            />
          </CollapsibleSection>
        </>
      )}
    </div>
  );

  if (isLoading || !data) return null;
}

interface LogRow {
  no: string;
  timeStamp: string;
  event: string;
  updatedStatus: { status: string; groupStatus: string };
}

const LogTable = ({
  rows,
  chipColor,
  ariaLabel,
}: {
  rows: LogRow[];
  chipColor: (groupStatus: string) => ChipProps["color"];
  ariaLabel: string;
}) => {
  return (
    <TableContainer className="border-t border-outlined">
      <Table sx={{ minWidth: 650 }} aria-label={ariaLabel}>
        <TableHead className="bg-order-opacity">
          <TableRow>
            <TableCell width="25%">#</TableCell>
            <TableCell width="20%">TimeStamp (KST)</TableCell>
            <TableCell width="20%">Updated Status</TableCell>
            <TableCell width="35%">Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
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
            rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.no}</TableCell>
                <TableCell>{row.timeStamp}</TableCell>
                <TableCell>
                  {row.updatedStatus.status && (
                    <Chip
                      label={row.updatedStatus.status}
                      color={chipColor(row.updatedStatus.groupStatus)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.event && row.event !== "-" ? (
                    <Chip label={row.event} color="secondary" />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ViewModeButton = ({
  label,
  mode,
  activeMode,
  setMode,
}: {
  label: string;
  mode: LogViewMode;
  activeMode: LogViewMode;
  setMode: (mode: LogViewMode) => void;
}) => {
  return (
    <button
      className={`border-b-[2px] border-solid ${
        activeMode === mode
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary"
      } px-[16px] py-[9px] text-[15px] font-medium`}
      onClick={() => setMode(mode)}
    >
      {label}
    </button>
  );
};
