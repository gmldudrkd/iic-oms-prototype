import { postBulkUploadAssetFiles } from "@/features/product-list/models/apis";

import { useBrandId } from "@/shared/hooks/useBrandId";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
// 📍 이미지 Bulk Upload API
export default function usePostBulkUploadAssetFiles() {
  const brandId = useBrandId();
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: ({
      files,
      workerId,
    }: {
      files: FileList;
      workerId: string;
    }) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      return postBulkUploadAssetFiles(formData, brandId, workerId);
    },
    onSuccess: () => {
      openSnackbar({
        alertTitle: "Upload In Progress",
        message:
          "You will a get Slack notification once the upload is completed.",
        severity: "success",
      });
    },
  });
}
