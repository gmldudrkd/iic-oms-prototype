import { useRouter } from "next/navigation";

import { patchChangePassword } from "@/features/change-password/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePatchChangePassword() {
  const { openSnackbar } = useSnackbarStore();
  const router = useRouter();

  return useCustomMutation({
    mutationFn: patchChangePassword,
    onSuccess: () => {
      openSnackbar({
        message: "Password changed successfully",
        severity: "success",
      });
      router.push("/sign-in");
    },
    onError: (error) => {
      openSnackbar({
        alertTitle: "Password change failed",
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
      });
    },
  });
}
