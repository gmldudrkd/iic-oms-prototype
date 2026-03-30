import { patchExchangeRequestShipment } from "@/features/integrated-order-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePatchExchangeRequestShipment({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { openSnackbar } = useSnackbarStore();
  return useCustomMutation({
    mutationFn: patchExchangeRequestShipment,
    onSuccess,
    onError: (error) => {
      openSnackbar({
        alertTitle: "Request Shipment Failed",
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
      });
    },
  });
}
