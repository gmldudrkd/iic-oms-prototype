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
  MenuItem,
  Select,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import StatusGuideTabs from "@/features/integrated-order-detail/components/LogDetail/StatusGuideTabs";
import { useGetLogHistoryDetail } from "@/features/integrated-order-detail/hooks/useGetLogHistoryDetail";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";
import { transformLogHistoryDetail } from "@/features/integrated-order-detail/models/transforms";

import ContentDialog from "@/shared/components/dialog/ContentDialog";
import { OrderHistoryResponse } from "@/shared/generated/oms/types/Order";
import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

type TypeFilter = "ALL" | "Order" | "Return" | "Exchange";

export default function InfoLogHistory() {
  const { orderId } = useParams();
  const { timezone } = useTimezoneStore();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data } = useGetLogHistoryDetail(orderId as string);
  const { data: orderData } = useGetOrderDetail(orderId as string);

  const { timelineHistories } = transformLogHistoryDetail(
    data as OrderHistoryResponse,
    timezone,
  );

  useEffect(() => {
    if (orderData && orderData.originOrderNo) {
      setOrderInfo({
        orderNo: orderData.originOrderNo,
        isGifted: orderData.orderType.name === "GIFT",
      });
    }
  }, [orderData, setOrderInfo]);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [guideOpen, setGuideOpen] = useState(false);

  const chipColor = (groupStatus: string): ChipProps["color"] => {
    if (groupStatus === "shipping") return "shipment";
    if (groupStatus === "order") return "primary";
    if (groupStatus === "return") return "warning";
    if (groupStatus === "exchange") return "success";
    return "default";
  };

  const filteredRows =
    typeFilter === "ALL"
      ? timelineHistories
      : timelineHistories.filter((row) => row.type === typeFilter);

  return (
    <div className="flex flex-col gap-[24px]">
      <Box className="relative mx-[24px] rounded-[8px] border border-outlined bg-white">
        {/* 헤더: 타이틀 + Status Guide */}
        <div className="flex items-center justify-between p-[16px]">
          <span className="text-[20px] font-bold">Timeline log</span>
          <button
            className="px-[8px] py-[6px] text-[14px] font-medium text-primary"
            onClick={() => setGuideOpen(true)}
          >
            Status Guide
          </button>
        </div>

        <TableContainer className="border-t border-outlined">
          <Table sx={{ minWidth: 650 }} aria-label="timeline history table">
            <TableHead className="bg-order-opacity">
              <TableRow>
                <TableCell width="20%">#</TableCell>
                <TableCell width="18%">TimeStamp (KST)</TableCell>
                <TableCell width="160px">
                  {/* Type 필터 셀렉트 */}
                  <Select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(e.target.value as TypeFilter)
                    }
                    variant="standard"
                    disableUnderline
                    sx={{ fontSize: 14, fontWeight: 600 }}
                  >
                    <MenuItem value="ALL">Type (All)</MenuItem>
                    <MenuItem value="Order">Order</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                    <MenuItem value="Exchange">Exchange</MenuItem>
                  </Select>
                </TableCell>
                <TableCell width="18%">Updated Status</TableCell>
                <TableCell width="30%">Event</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
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
                filteredRows.map((row, index) => (
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

      {/* Status Guide 모달 (Order/Return/Exchange 탭) */}
      <ContentDialog
        open={guideOpen}
        setOpen={setGuideOpen}
        dialogTitle="Status Guide"
        dialogContent={<StatusGuideTabs />}
        dialogConfirmLabel="Close"
        handlePost={() => setGuideOpen(false)}
        maxWidth="xl"
      />
    </div>
  );
}
