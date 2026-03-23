import { patchReturnRecipient } from "@/features/integrated-order-detail/models/apis";

import { ReturnRecipientUpdateRequest } from "@/shared/generated/oms/types/Return";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchReturnRecipient({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: ({
      returnId,
      data,
    }: {
      returnId: string;
      data: ReturnRecipientUpdateRequest;
    }) => patchReturnRecipient(returnId, data),
    onSuccess,
  });
}
