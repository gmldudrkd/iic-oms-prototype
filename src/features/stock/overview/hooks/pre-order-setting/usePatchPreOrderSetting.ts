import { useQueryClient } from "@tanstack/react-query";

import { patchPreOrderSetting } from "@/features/stock/overview/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePatchPreOrderSetting() {
  const { openSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();

  return useCustomMutation({
    mutationFn: patchPreOrderSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.channelStockOverviewWithoutParams(),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.onlineStockOverviewWithoutParams(),
      });

      openSnackbar({
        alertTitle: "Update Successful",
        message: "Your changes have been successfully applied.",
        severity: "success",
      });
    },
  });
}
