import { patchShipmentCancel } from "@/features/integrated-order-detail/models/apis";

import { ShipmentCancelRequest } from "@/shared/generated/oms/types/Shipment";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePatchShipmentCancel({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useCustomMutation({
    mutationFn: ({
      shipmentId,
      data,
    }: {
      shipmentId: string;
      data: ShipmentCancelRequest;
    }) => patchShipmentCancel(shipmentId, data),
    onSuccess,
  });
}
