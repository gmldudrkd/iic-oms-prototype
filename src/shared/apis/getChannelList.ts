import { FetchWithToken } from "@/shared/apis/fetchExtended";
import { BrandCorporation } from "@/shared/generated/oms/types/Channel";
import { createQueryParams } from "@/shared/utils/querystring";

/**
 * 활성 채널 조회
 * GET
 * /v1/api/channels/active
 */
export const getActiveChannelList = async ({
  brand,
  corporation,
}: BrandCorporation) => {
  const queryString = createQueryParams({
    brand,
    corporation,
  });
  const url = "/channels/active";
  return await FetchWithToken(`${url}?${queryString}`, "GET");
};
