import { postProductList } from "@/features/product-list/models/apis";

import {
  OmsProductSearchRequestDTO,
  OmsProductSearchResponseDTO,
} from "@/shared/generated/pim/types/Product";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePostProductList({
  onSuccess,
}: {
  onSuccess?: (response: OmsProductSearchResponseDTO) => void;
} = {}) {
  return useCustomMutation<
    OmsProductSearchRequestDTO,
    OmsProductSearchResponseDTO
  >({
    mutationFn: (params: OmsProductSearchRequestDTO) => postProductList(params),
    onSuccess,
  });
}
