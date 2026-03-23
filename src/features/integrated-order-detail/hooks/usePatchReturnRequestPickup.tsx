import { patchReturnRequestPickup } from "@/features/integrated-order-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchReturnRequestPickup({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: patchReturnRequestPickup,
    onSuccess,
  });
}
