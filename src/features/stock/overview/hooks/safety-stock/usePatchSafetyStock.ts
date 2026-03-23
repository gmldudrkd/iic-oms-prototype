import { useQueryClient } from "@tanstack/react-query";

import { patchSafetyStock } from "@/features/stock/overview/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

export default function usePatchSafetyStock() {
  const { openSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();

  return useCustomMutation({
    mutationFn: patchSafetyStock,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.onlineStockOverviewWithoutParams(),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channelStockOverviewWithoutParams(),
      });

      openSnackbar({
        alertTitle: "Update Successful",
        message: "Your changes have been successfully applied.",
        severity: "success",
      });
    },
    onError: (error: ApiError) => {
      if (error.errorDetail?.[0])
        return openSnackbar({
          alertTitle: error.errorMessage,
          message: error.errorDetail?.[0]?.reason || "Error occurred",
          severity: "error",
        });

      openSnackbar({
        alertTitle: error.errorCode,
        message: error.errorMessage || "Error occurred",
        severity: "error",
      });
    },
  });
}
