import { GridRowModel } from "@mui/x-data-grid-pro";
import { useCallback } from "react";

import { getRefundFee } from "@/features/integrated-order-list/models/apis/postOrderEstimateRefundFee";
import { OrderFinancialSummaryData } from "@/features/integrated-order-list/models/types";

import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";

interface UseRefundFeeCalculatorProps {
  type: "CANCEL" | "RETURN";
  selectedRows: GridRowModel[];
  setDynamicSummary: (summary: OrderFinancialSummaryData) => void;
  isModalOpen?: boolean;
  orderFinancialSummary: OrderFinancialSummaryData;
}

export const useRefundFeeCalculator = ({
  type,
  selectedRows,
  setDynamicSummary,
  orderFinancialSummary,
}: UseRefundFeeCalculatorProps) => {
  const { orderInfo } = useOrderNoStore((state) => state);

  const calculateRefundFee = useCallback(
    async ({ fault, reason }: { fault: string | null; reason: string }) => {
      if (!fault || selectedRows.length === 0) {
        setDynamicSummary(orderFinancialSummary);
        return;
      }

      const requestData = {
        claimType: type,
        reason,
        fault: fault.toUpperCase(),
        items: selectedRows.map((row) => ({
          originItemId: row.originItemId,
          quantity: row.cellQuantity,
        })),
      };

      const response = await getRefundFee(orderInfo.orderNo, requestData);

      console.log("response", response);

      setDynamicSummary({
        ...orderFinancialSummary,
        order: {
          ...orderFinancialSummary.order,
          subTotal: response.subTotal + response.salesTax + response.salesDuty,
          shippingFee: response.shippingFee,
        },
        refundOrder: {
          ...orderFinancialSummary.refundOrder,
          refundSubtotal:
            response.refundSubtotal +
            response.refundedTax +
            response.refundedDuty,
          refundedShipping: response.claimShippingFee,
          refundOrderTotal: response.refundOrderTotal,
        },
        netOrder: {
          ...orderFinancialSummary.netOrder,
          netSubtotal:
            response.netSubtotal + response.netTax + response.netDuty,
          netShipping: response.netShipping,
          netOrderTotal: response.netOrderTotal,
        },
      });
    },
    [
      selectedRows,
      type,
      orderInfo.orderNo,
      setDynamicSummary,
      orderFinancialSummary,
    ],
  );

  return { calculateRefundFee };
};
