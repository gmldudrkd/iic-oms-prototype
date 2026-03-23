import { postProductChannelList } from "@/features/channel-product-list/models/apis";

import {
  OmsChannelProductSearchRequestDTO,
  OmsProductSearchResponseDTO,
} from "@/shared/generated/pim/types/Product";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePostProductChannelList({
  onSuccess,
}: {
  onSuccess?: (response: OmsProductSearchResponseDTO) => void;
} = {}) {
  return useCustomMutation<
    OmsChannelProductSearchRequestDTO,
    OmsProductSearchResponseDTO
  >({
    mutationFn: (params) => postProductChannelList(params),
    onSuccess,
  });
}
