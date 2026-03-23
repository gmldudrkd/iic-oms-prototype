import { FetchWithToken } from "@/shared/apis/fetchExtended";
import { ChannelResponse } from "@/shared/generated/oms/types/Channel";

/**
 * 채널 목록 조회
 */
export const getChannelListWithFetch = async () => {
  const rawResponse = await FetchWithToken(`/channels`, "GET");
  return rawResponse as ChannelResponse[];
};
