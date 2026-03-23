import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { postLogout } from "@/features/sign-in/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePostLogout() {
  const { openSnackbar } = useSnackbarStore();
  const router = useRouter();

  return useCustomMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      // SPA 라우팅
      router.push("/sign-in");

      // Snackbar 표시
      openSnackbar({
        message: "Logout Successful",
        severity: "success",
      });

      // NextAuth 세션 삭제
      await signOut({ redirect: false });
    },
    onError: (error) => {
      openSnackbar({
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
      });
    },
  });
}
