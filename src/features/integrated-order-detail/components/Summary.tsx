import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import usePostEstimateRefundFee from "@/features/integrated-order-detail/hooks/usePostEstimateRefundFee";
import { transformSummaryDefaultData } from "@/features/integrated-order-detail/models/transforms";

import { ApiError } from "@/shared/apis/types";
import {
  OrderDetailResponse,
  OrderEstimateRefundFeeRequest,
  OrderEstimateRefundFeeResponse,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import {
  convertToPrice,
  getCurrencyFromPayments,
} from "@/shared/utils/stringUtils";

interface Props {
  summaryRequestData: OrderEstimateRefundFeeRequest;
}

export default function Summary({ summaryRequestData }: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const { openSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();
  const dataOrderDetail = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );
  const currency = getCurrencyFromPayments(dataOrderDetail?.payments);
  const summaryDefaultData = useMemo(
    () => transformSummaryDefaultData(dataOrderDetail),
    [dataOrderDetail],
  );
  const {
    data: estimateRefundFeeData,
    isLoading,
    isError,
    error,
  } = usePostEstimateRefundFee({
    data: summaryRequestData,
  });

  const [summaryData, setSummaryData] =
    useState<OrderEstimateRefundFeeResponse>(summaryDefaultData);

  const rows = [
    { label: "Order", values: summaryData.orderPayment },
    { label: "Previously Refunded", values: summaryData.refundPayment },
    { label: "Refund This Time", values: summaryData.estimateRefundPayment },
    { label: "Net", values: summaryData.netPayment },
  ];

  useEffect(() => {
    if (estimateRefundFeeData && summaryRequestData.items.length > 0) {
      setSummaryData(estimateRefundFeeData);
    } else if (summaryRequestData.items.length === 0) {
      setSummaryData(summaryDefaultData);
    }
  }, [
    estimateRefundFeeData,
    summaryRequestData.items.length,
    summaryDefaultData,
  ]);

  const renderValue = (value: number) =>
    isLoading ? (
      <Skeleton variant="text" width="100%" height={20} />
    ) : (
      convertToPrice(Math.floor(value), currency)
    );

  useEffect(() => {
    if (isError) {
      const apiError = error as ApiError;
      openSnackbar({
        message: apiError.errorMessage || "오류가 발생했습니다.",
        severity: "error",
      });
    }
  }, [isError, openSnackbar, error]);

  return (
    <div>
      <div className="flex items-center justify-between px-[16px] text-text-secondary">
        <h2 className="text-[14px] font-medium leading-[48px]">Summary</h2>
        <span className="text-[12px]">
          ⚠ Values below may be estimated and can vary depending on the sales
          channel.
        </span>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #E0E0E0",
          borderBottom: "none",
          borderRadius: "5px",
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            {/* 그룹 헤더 */}
            <TableRow
              sx={{
                backgroundColor: "#E3F2FD",
                "& .MuiTableCell-head": { padding: "5px" },
              }}
            >
              <TableCell rowSpan={2} />
              <TableCell
                rowSpan={2}
                align="center"
                sx={{ width: "15%", padding: 0 }}
              >
                Product Subtotal
              </TableCell>
              <TableCell rowSpan={2} align="center" sx={{ width: "15%" }}>
                Shipping
              </TableCell>
              <TableCell rowSpan={2} align="center" sx={{ width: "15%" }}>
                Total
              </TableCell>
              <TableCell
                align="center"
                colSpan={2}
                sx={{
                  width: "30%",
                  borderBottom: "none",
                  color: "#616161",
                }}
              >
                Included Tax Breakdown
              </TableCell>
            </TableRow>
            {/* 개별 컬럼 헤더 */}
            <TableRow
              sx={{
                backgroundColor: "#E3F2FD",
                "& .MuiTableCell-head": { padding: "5px", color: "#616161" },
              }}
            >
              <TableCell align="center" sx={{ width: "15%" }}>
                Tax
              </TableCell>
              <TableCell align="center" sx={{ width: "15%" }}>
                Duty
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{
                  "& td, & th": {
                    fontWeight: row.label === "Net" ? "bold" : "normal",
                    color:
                      row.label === "Previously Refunded"
                        ? "#FB8C00"
                        : row.label === "Refund This Time"
                          ? "#E53935"
                          : row.label === "Net"
                            ? "#1E88E5"
                            : "black",
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    backgroundColor: "#E3F2FD",
                    fontWeight: "bold !important",
                  }}
                >
                  {row.label}
                </TableCell>

                <TableCell>{renderValue(row.values.subtotal)}</TableCell>
                <TableCell>{renderValue(row.values.shippingFee)}</TableCell>
                <TableCell sx={{ fontWeight: "bold !important" }}>
                  {renderValue(row.values.totalAmount)}
                </TableCell>
                <TableCell className="bg-[#f5f5f5]">
                  <span className="flex justify-end text-[#757575]">
                    ({renderValue(row.values.taxAmount)})
                  </span>
                </TableCell>
                <TableCell className="bg-[#f5f5f5]">
                  <span className="flex justify-end text-[#757575]">
                    ({renderValue(row.values.dutyAmount)})
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
