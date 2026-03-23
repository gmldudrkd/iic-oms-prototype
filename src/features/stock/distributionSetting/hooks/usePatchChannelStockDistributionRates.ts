import { patchChannelStockDistributionRates } from "@/features/stock/distributionSetting/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { ApiError } from "@/shared/types";

export default function usePatchChannelStockDistributionRates({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) {
  return useCustomMutation({
    mutationFn: patchChannelStockDistributionRates,
    onSuccess,
    onError,
  });
}
