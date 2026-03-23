/**
 * 주문 타입별 엑셀 다운로드
 * POST
 * /v1/api/orders/export
 */

import { FetchWithToken } from "@/shared/apis/fetchExtended";
import { OrderExportRequest } from "@/shared/generated/oms/types/OrderExport";

export const postExportExcel = async (data: OrderExportRequest) => {
  const rawResponse = await FetchWithToken("/orders/export", "POST", data, {
    responseType: "blob",
  });
  return rawResponse;
};
