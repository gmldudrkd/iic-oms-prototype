import { useParams } from "next/navigation";

import { postClaims } from "@/features/integrated-order-detail/models/apis";

import { ClaimCreateRequest } from "@/shared/generated/oms/types/Claim";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePostClaims({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { orderId } = useParams<{ orderId: string }>();
  return useCustomMutation({
    mutationFn: (data: ClaimCreateRequest) => postClaims(orderId, data),
    onSuccess,
  });
}
