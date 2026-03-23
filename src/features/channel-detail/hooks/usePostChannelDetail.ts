import { postChannelDetail } from "@/features/channel-detail/models/apis";

import { ChannelCreateRequest } from "@/shared/generated/oms/types/Channel";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { ApiError } from "@/shared/types";

export const usePostChannelDetail = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) => {
  return useCustomMutation({
    mutationFn: (data: ChannelCreateRequest) => postChannelDetail(data),
    onSuccess,
    onError,
  });
};
