import { FetchWithTokenPIM } from "@/shared/apis/fetchExtended";
import {
  OmsChannelProductSearchRequestDTO,
  OmsProductSearchResponseDTO,
} from "@/shared/generated/pim/types/Product";

/**
 * 채널별 제품 목록 조회
 * POST
 * /v1/oms/channels/products
 */

export const postProductChannelList = async (
  requestData: OmsChannelProductSearchRequestDTO,
) => {
  const url = "/v1/oms/channels/products";
  const rawResponse = await FetchWithTokenPIM(url, "POST", requestData);
  return rawResponse as OmsProductSearchResponseDTO;
};
