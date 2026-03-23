import { postProductListExportExcel } from "@/features/product-list/models/apis";

import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

// 📍 상품 검색 결과를 Excel로 내보내고 Slack으로 전송 API
export default function usePostProductListExportExcel() {
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation({
    mutationFn: postProductListExportExcel,
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
