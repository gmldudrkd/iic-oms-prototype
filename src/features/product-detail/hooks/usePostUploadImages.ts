import { postUploadImages } from "@/features/product-detail/models/apis";

import { S3UploadResponseDTO } from "@/shared/generated/pim/types/Upload";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import { ApiError } from "@/shared/types";

export default function usePostUploadImages({
  onSuccess,
  onError,
}: {
  onSuccess: (data: S3UploadResponseDTO[]) => void;
  onError: (error: ApiError) => void;
}) {
  return useCustomMutation({
    mutationFn: postUploadImages,
    onSuccess,
    onError,
  });
}
