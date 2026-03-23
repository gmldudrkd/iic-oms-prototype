import { postCreateBundle } from "@/features/product-list/models/apis";

import {
  CreateBundleRequestDTO,
  BundleResponseDTO,
} from "@/shared/generated/pim/types/Bundle";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

// 📍 번들 생성 API
export default function usePostCreateBundle({
  onSuccess,
}: {
  onSuccess: (data: BundleResponseDTO) => void;
}) {
  return useCustomMutation<CreateBundleRequestDTO, BundleResponseDTO>({
    mutationFn: postCreateBundle,
    onSuccess,
  });
}
