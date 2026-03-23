import dayjs from "dayjs";

import { postStockExport } from "@/features/stock/overview/models/apis";

import { StockExportRequest } from "@/shared/generated/oms/types/StockExport";
import useCustomMutation from "@/shared/hooks/useCustomMutation";
import useFileDownload from "@/shared/hooks/useFileDownload";

export default function usePostStockExport() {
  const { downloadFile } = useFileDownload();

  return useCustomMutation<StockExportRequest, Response>({
    mutationFn: postStockExport,
    onSuccess: async (response: Response) => {
      const now = dayjs();
      const dateString = now.format("YYYYMMDD_HHmm");

      // Response를 Blob으로 변환하여 다운로드
      const blob = await response.blob();
      downloadFile(blob, `IIC_OMS_Stock_List_${dateString}.xlsx`);
    },
  });
}
