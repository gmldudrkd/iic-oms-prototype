import { postVerifyChangePasswordEmail } from "@/features/change-password/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePostVerifyChangePasswordEmail() {
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: postVerifyChangePasswordEmail,
    onSuccess: () => {
      openSnackbar({
        alertTitle: "Password change link sent successfully",
        message: "Please check your mail box",
        severity: "success",
      });
    },
    onError: (error) => {
      openSnackbar({
        alertTitle: "Sending password change link failed",
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
      });
    },
  });
}
