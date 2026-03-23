import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { postEstimateRefundFee } from "@/features/integrated-order-detail/models/apis";

import { OrderEstimateRefundFeeRequest } from "@/shared/generated/oms/types/Order";

export default function usePostEstimateRefundFee({
  data,
}: {
  data: OrderEstimateRefundFeeRequest;
}) {
  const { orderId } = useParams<{ orderId: string }>();
  return useQuery({
    queryKey: ["estimate-refund-fee", orderId, data],
    queryFn: () =>
      postEstimateRefundFee({
        orderId,
        data,
      }),
    enabled: !!data.items.length && !!data.reason,
  });
}
