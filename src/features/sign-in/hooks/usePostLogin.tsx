"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import {
  postLogin,
  getMfaStatus,
  postMfaSetup,
} from "@/features/sign-in/models/api";

import {
  UserLoginRequest,
  LoginFirstFactorResponse,
} from "@/shared/generated/auth/types/Auth";
import { MfaSetupRequestMfaTypeEnum } from "@/shared/generated/auth/types/MFA";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useMfaStore from "@/shared/stores/useMfaStore";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePostLogin() {
  const router = useRouter();
  const { openSnackbar } = useSnackbarStore();
  const { setQrCodeUri, setEmail } = useMfaStore();

  return useCustomMutation<UserLoginRequest, LoginFirstFactorResponse>({
    mutationFn: (data: UserLoginRequest) => {
      setEmail(data.email);
      return postLogin(data);
    },
    onSuccess: async (data) => {
      const mfaStatusResponse = await getMfaStatus(data.mfaToken);
      window.sessionStorage.setItem("mfaToken", data.mfaToken);

      if (mfaStatusResponse.enabled) {
        // MFA가 이미 활성화된 경우
        setQrCodeUri(null);
        router.push("/sign-in/verify");
        return;
      }

      const mfaSetupResponse = await postMfaSetup({
        token: data.mfaToken,
        data: {
          mfaType: MfaSetupRequestMfaTypeEnum.TOTP,
        },
      });

      if (mfaSetupResponse.qrCodeUri) {
        setQrCodeUri(mfaSetupResponse.qrCodeUri);
        router.push("/sign-in/verify");
        return;
      }
    },
    onError: (error) => {
      openSnackbar({
        alertTitle: "Login failed",
        message: (() => {
          return (
            <Box>
              <Typography>{error.errorMessage}</Typography>
              <Typography>if exceeded, contact IT dept. </Typography>
            </Box>
          );
        })(),
        severity: "error",
      });
    },
  });
}
