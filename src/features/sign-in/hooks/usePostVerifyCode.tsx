import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { MENU } from "@/features/navigation/modules/constants";
import { postVerifyMfaCode } from "@/features/sign-in/models/api";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { getLocalTime } from "@/shared/utils/formatDate";

interface UsePostVerifyCodeProps {
  email: string;
}

export default function usePostVerifyCode({ email }: UsePostVerifyCodeProps) {
  const router = useRouter();
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: postVerifyMfaCode,
    onSuccess: async (response) => {
      const result = await signIn("email-credentials", {
        userId: email,
        lastLoginAt: response.lastLoginAt,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        accessTokenExpires: response.accessTokenExpire,
        refreshTokenExpires: response.refreshTokenExpire,
        redirect: false, // 자동 리다이렉트 비활성화
      });

      if (result?.ok) {
        openSnackbar({
          alertTitle: "Login successful",
          message: (() => {
            return (
              <Box>
                <Typography>Last login at:</Typography>
                <Typography>{getLocalTime(response.lastLoginAt)}</Typography>
              </Box>
            );
          })(),
          severity: "success",
        });

        // 수동으로 리다이렉트 수행
        router.push(`/${MENU[0].segment}/${MENU[0].children?.[0]?.segment}`);
      } else {
        openSnackbar({
          alertTitle: "Login failed",
          message: "Authentication failed",
          severity: "error",
        });
      }
    },
    onError: (error) => {
      openSnackbar({
        alertTitle: "Verification failed",
        message: error.errorMessage,
        severity: "error",
      });
    },
  });
}
