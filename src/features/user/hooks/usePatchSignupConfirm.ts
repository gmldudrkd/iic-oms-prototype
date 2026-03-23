import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchSignupConfirm } from "@/features/user/models/apis";

import {
  ErrorResponse,
  UserCreateConfirmRequest,
  UserCreateConfirmRequestConfirmEnum,
} from "@/shared/generated/auth/types/Auth";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export const usePatchSignupConfirm = () => {
  const { openSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreateConfirmRequest) => patchSignupConfirm(data),
    onSuccess: async (_, variables) => {
      const isApprove =
        variables.confirm === UserCreateConfirmRequestConfirmEnum.APPROVE;
      openSnackbar({
        alertTitle: isApprove ? "Approval Successful" : "Rejection Successful",
        message: "",
        severity: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: ErrorResponse, variables) => {
      const isApprove =
        variables.confirm === UserCreateConfirmRequestConfirmEnum.APPROVE;
      openSnackbar({
        alertTitle: isApprove ? "Approval Failed" : "Rejection Failed",
        message: error.errorMessage || "error",
        severity: "error",
      });
    },
  });
};
