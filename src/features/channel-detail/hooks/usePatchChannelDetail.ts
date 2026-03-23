import { useQueryClient } from "@tanstack/react-query";

import { patchChannelDetail } from "@/features/channel-detail/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { queryKeys } from "@/shared/queryKeys";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export const usePatchChannelDetail = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: patchChannelDetail,
    onSuccess: async () => {
      // 채널 활성화/비활성화 시 권한 데이터 새로고침
      await queryClient.invalidateQueries({
        queryKey: queryKeys.userPermissions(),
      });
      onSuccess();
    },
    onError: (error) => {
      openSnackbar({
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
        alertTitle: "Save failed",
      });
    },
  });
};
