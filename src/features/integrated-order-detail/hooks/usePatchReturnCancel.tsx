import { patchReturnCancel } from "@/features/integrated-order-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchReturnCancel({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: patchReturnCancel,
    onSuccess,
  });
}
