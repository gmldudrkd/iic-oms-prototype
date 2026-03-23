import { postActivateMfa } from "@/features/sign-in/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function useActivateMfa() {
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: postActivateMfa,
    onError: (error) => {
      openSnackbar({
        alertTitle: "Verification failed",
        message: error.errorMessage,
        severity: "error",
      });
    },
  });
}
