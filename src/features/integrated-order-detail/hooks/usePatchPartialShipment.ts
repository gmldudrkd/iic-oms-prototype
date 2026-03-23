import { patchPartialShipment } from "@/features/integrated-order-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchPartialShipment({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: patchPartialShipment,
    onSuccess,
  });
}
