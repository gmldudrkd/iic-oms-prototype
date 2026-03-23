import { postSignup } from "@/features/sign-up/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export const usePostRequestAccount = () => {
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      openSnackbar({
        alertTitle: "Account request submitted successfully",
        message: "Please note that It will be processed in a working day",
        severity: "success",
      });
    },
    onError: (error) => {
      openSnackbar({
        alertTitle: "Account request failed",
        message:
          error.errorDetail && error.errorDetail.length > 0
            ? error.errorDetail.map((detail) => detail.reason).join(", ")
            : error.errorMessage,
        severity: "error",
      });
    },
  });
};
