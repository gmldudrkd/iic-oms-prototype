import { patchOrderRecipient } from "@/features/integrated-order-detail/models/apis";

import { OrderRecipientUpdateRequest } from "@/shared/generated/oms/types/Order";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchOrderRecipient({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: OrderRecipientUpdateRequest;
    }) => patchOrderRecipient({ orderId, data }),
    onSuccess,
  });
}
