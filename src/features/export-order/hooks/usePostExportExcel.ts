import { postExportExcel } from "@/features/export-order/models/apis";

import { OrderExportRequest } from "@/shared/generated/oms/types/OrderExport";
import useCustomMutation from "@/shared/hooks/useCustomMutation";

export default function usePostExportExcel({
  onSuccess,
}: {
  onSuccess: (response: Response) => void;
}) {
  return useCustomMutation({
    mutationFn: async (data: OrderExportRequest) => {
      const response = await postExportExcel(data);
      return response as Response;
    },
    onSuccess,
  });
}
