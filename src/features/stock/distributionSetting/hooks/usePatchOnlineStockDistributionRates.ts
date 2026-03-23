import { useQueryClient } from "@tanstack/react-query";

import { patchOnlineStockDistributionRates } from "@/features/stock/distributionSetting/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

export default function usePatchOnlineStockDistributionRates(
  setIsEdit: (isEdit: boolean) => void,
) {
  const { brand, corporation } = useSingleBrandAndCorp();
  const { openSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();

  return useCustomMutation({
    mutationFn: patchOnlineStockDistributionRates,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.onlineStockSettings(brand, corporation),
      });
      setIsEdit(false);
    },
    onError: (error: ApiError) => {
      const detail = error.errorDetail;
      const message = error.errorMessage;

      openSnackbar({
        message: detail?.[0]?.reason || message || "Error occurred",
        severity: "error",
        alertTitle: "오류",
      });
    },
  });
}
