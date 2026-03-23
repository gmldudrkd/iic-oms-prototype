import { useSession } from "next-auth/react";

import { putProductListExcelImport } from "@/features/product-list/models/apis";

import { ExcelImportResponseDTO } from "@/shared/generated/pim/types/Product";
import { useBrandId } from "@/shared/hooks/useBrandId";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function usePutProductListExcelImport() {
  const brandId = useBrandId();
  const workerId = useSession().data?.user.id ?? "";
  const { openSnackbar } = useSnackbarStore();

  return useCustomMutation<FormData, ExcelImportResponseDTO>({
    mutationFn: (requestData: FormData) =>
      putProductListExcelImport(requestData, brandId, workerId),
    onSuccess: (data: ExcelImportResponseDTO) => {
      if (data.errorMessage) {
        openSnackbar({
          message: data.errorMessage,
          severity: "error",
        });
      } else {
        openSnackbar({
          message: "Excel import completed",
          severity: "success",
        });
      }
    },
  });
}
