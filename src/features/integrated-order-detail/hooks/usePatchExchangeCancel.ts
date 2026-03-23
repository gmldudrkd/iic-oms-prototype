import { patchExchangeCancel } from "@/features/integrated-order-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchExchangeCancel({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: patchExchangeCancel,
    onSuccess,
  });
}
