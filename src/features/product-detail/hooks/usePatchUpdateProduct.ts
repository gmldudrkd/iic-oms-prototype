import { patchUpdateProduct } from "@/features/product-detail/models/apis";

import { OmsProductResponseDTO } from "@/shared/generated/pim/types/Product";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { ApiError } from "@/shared/types";

export default function usePatchUpdateProduct({
  onSuccess,
  onError,
}: {
  onSuccess: (data: OmsProductResponseDTO) => void;
  onError: (error: ApiError) => void;
}) {
  return useCustomMutation({
    mutationFn: patchUpdateProduct,
    onSuccess,
    onError,
  });
}
